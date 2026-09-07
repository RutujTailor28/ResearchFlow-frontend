import { OpenRouter } from '@openrouter/sdk';
import { aiLog, previewAiText } from './logger';

const DEFAULT_FREE_MODEL = 'openrouter/free';
/** Free models are often queued/slow; allow more time than paid routes. */
const DEFAULT_TIMEOUT_MS = 120_000;

/** Concrete free models to try if openrouter/free times out or stalls. */
const DEFAULT_FALLBACK_MODELS = [
  'meta-llama/llama-3.2-3b-instruct:free',
  'google/gemma-2-9b-it:free',
  'mistralai/mistral-7b-instruct:free',
];

export class AiConfigError extends Error {
  code = 'AI_CONFIG_ERROR' as const;

  constructor(message: string) {
    super(message);
    this.name = 'AiConfigError';
  }
}

export class AiProviderError extends Error {
  code = 'AI_PROVIDER_ERROR' as const;
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'AiProviderError';
    this.status = status;
  }
}

export class AiTimeoutError extends Error {
  code = 'AI_TIMEOUT' as const;

  constructor(message = 'The AI request timed out. Please try again.') {
    super(message);
    this.name = 'AiTimeoutError';
  }
}

export class AiParseError extends Error {
  code = 'AI_PARSE_ERROR' as const;

  constructor(message = 'The AI returned an invalid response.') {
    super(message);
    this.name = 'AiParseError';
  }
}

export interface ChatCompletionResult {
  content: string;
  requestedModel: string;
  model: string;
  durationMs: number;
  finishReason?: string | null;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    costUsd?: number;
  };
}

function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY?.trim();
  if (!key) {
    throw new AiConfigError(
      'OpenRouter is not configured. Add OPENROUTER_API_KEY to your server environment.'
    );
  }
  return key;
}

export function getOpenRouterModel(): string {
  return (
    process.env.OPENROUTER_MODEL?.trim() ||
    process.env.OPENROUTER_FREE_MODEL?.trim() ||
    DEFAULT_FREE_MODEL
  );
}

export function getFallbackModels(): string[] {
  const fromEnv = process.env.OPENROUTER_FALLBACK_MODELS?.split(',')
    .map((m) => m.trim())
    .filter(Boolean);
  return fromEnv?.length ? fromEnv : DEFAULT_FALLBACK_MODELS;
}

function getTimeoutMs(): number {
  return Number(process.env.OPENROUTER_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;
}

let client: OpenRouter | null = null;

export function getOpenRouterClient(): OpenRouter {
  if (!client) {
    client = new OpenRouter({
      apiKey: getApiKey(),
      httpReferer: process.env.OPENROUTER_HTTP_REFERER?.trim() || process.env.APP_URL?.trim(),
      appTitle: process.env.OPENROUTER_APP_TITLE?.trim() || 'ResearchFlow',
      timeoutMs: getTimeoutMs(),
    });
  }
  return client;
}

function extractTextContent(content: unknown): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part;
        if (part && typeof part === 'object' && 'text' in part) {
          return String((part as { text?: unknown }).text ?? '');
        }
        return '';
      })
      .join('');
  }
  return '';
}

function isTimeoutError(error: unknown): boolean {
  if (error instanceof AiTimeoutError) return true;
  const message = error instanceof Error ? error.message.toLowerCase() : '';
  return (
    message.includes('timeout') ||
    message.includes('timed out') ||
    message.includes('aborted')
  );
}

async function sendOnce(params: {
  model: string;
  system: string;
  user: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  operation: string;
}): Promise<ChatCompletionResult> {
  const openRouter = getOpenRouterClient();
  const timeoutMs = getTimeoutMs();
  const started = Date.now();

  aiLog('info', params.operation as 'chat', 'Calling OpenRouter', {
    requestedModel: params.model,
    jsonMode: Boolean(params.jsonMode),
    maxTokens: params.maxTokens ?? 4096,
    timeoutMs,
  });

  try {
    const result = await openRouter.chat.send(
      {
        chatRequest: {
          model: params.model,
          messages: [
            { role: 'system', content: params.system },
            { role: 'user', content: params.user },
          ],
          temperature: params.temperature ?? 0.4,
          maxTokens: params.maxTokens ?? 4096,
          stream: false,
          ...(params.jsonMode ? { responseFormat: { type: 'json_object' as const } } : {}),
        },
      },
      { timeoutMs }
    );

    if (!('choices' in result) || !Array.isArray(result.choices)) {
      throw new AiProviderError('Unexpected OpenRouter response format.');
    }

    const choice = result.choices[0];
    const content = extractTextContent(choice?.message?.content);
    const durationMs = Date.now() - started;
    const model =
      typeof result.model === 'string' && result.model ? result.model : params.model;

    if (!content.trim()) {
      aiLog('error', params.operation as 'chat', 'Empty AI response', {
        requestedModel: params.model,
        model,
        durationMs,
      });
      throw new AiParseError('The AI returned an empty response.');
    }

    const rawUsage = result.usage as
      | {
          promptTokens?: number;
          completionTokens?: number;
          totalTokens?: number;
          cost?: number | null;
        }
      | undefined;
    const usage = rawUsage
      ? {
          promptTokens: rawUsage.promptTokens,
          completionTokens: rawUsage.completionTokens,
          totalTokens: rawUsage.totalTokens,
          costUsd: typeof rawUsage.cost === 'number' ? rawUsage.cost : undefined,
        }
      : undefined;

    aiLog('success', params.operation as 'chat', 'AI response generated successfully', {
      requestedModel: params.model,
      model,
      durationMs,
      finishReason: choice?.finishReason ?? null,
      contentChars: content.length,
      preview: previewAiText(content),
      usage,
    });

    return {
      content,
      requestedModel: params.model,
      model,
      durationMs,
      finishReason: choice?.finishReason ?? null,
      usage,
    };
  } catch (error) {
    const durationMs = Date.now() - started;

    if (
      error instanceof AiConfigError ||
      error instanceof AiProviderError ||
      error instanceof AiParseError ||
      error instanceof AiTimeoutError
    ) {
      aiLog('error', params.operation as 'chat', error.message, {
        requestedModel: params.model,
        durationMs,
        code: error.code,
      });
      throw error;
    }

    const message = error instanceof Error ? error.message : 'Unknown OpenRouter error';
    const lower = message.toLowerCase();

    aiLog('error', params.operation as 'chat', 'OpenRouter request failed', {
      requestedModel: params.model,
      durationMs,
      reason: previewAiText(message, 240),
    });

    if (lower.includes('timeout') || lower.includes('timed out') || lower.includes('aborted')) {
      throw new AiTimeoutError();
    }

    if (lower.includes('429') || lower.includes('rate limit')) {
      throw new AiProviderError('The AI service is rate-limited. Please try again shortly.', 429);
    }

    if (lower.includes('401') || lower.includes('403') || lower.includes('unauthorized')) {
      throw new AiConfigError('OpenRouter authentication failed. Check your API key configuration.');
    }

    throw new AiProviderError('Unable to complete the AI request. Please try again.');
  }
}

/**
 * Send a non-streaming chat completion and return assistant text + model metadata.
 * On timeout, retries once with a concrete free fallback model.
 */
export async function generateChatCompletion(params: {
  system: string;
  user: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  operation?: 'chat' | 'plan' | 'improve-plan' | 'research' | 'write' | 'verify' | 'retry';
  model?: string;
}): Promise<ChatCompletionResult> {
  const primaryModel = params.model || getOpenRouterModel();
  const operation = params.operation ?? 'chat';

  try {
    return await sendOnce({
      model: primaryModel,
      system: params.system,
      user: params.user,
      temperature: params.temperature,
      maxTokens: params.maxTokens,
      jsonMode: params.jsonMode,
      operation,
    });
  } catch (error) {
    if (!isTimeoutError(error)) {
      throw error;
    }

    const fallback = getFallbackModels().find((m) => m !== primaryModel);
    if (!fallback) {
      throw error instanceof AiTimeoutError ? error : new AiTimeoutError();
    }

    aiLog('warn', 'retry', 'Primary model timed out — retrying with fallback free model', {
      primaryModel,
      fallbackModel: fallback,
      operation,
    });

    return sendOnce({
      model: fallback,
      system: params.system,
      user: params.user,
      temperature: params.temperature,
      maxTokens: params.maxTokens,
      jsonMode: params.jsonMode,
      operation: 'retry',
    });
  }
}

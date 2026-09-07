import { AiParseError, generateChatCompletion, getOpenRouterModel } from '@/lib/ai/openrouter';
import { extractJsonObject } from '@/lib/ai/helpers';
import { aiLog, previewAiText } from '@/lib/ai/logger';
import type { AiCallMeta } from '@/types/ai';

export interface StructuredJsonResult {
  data: unknown;
  meta: Omit<AiCallMeta, 'operation' | 'ok' | 'message'> & {
    usedFallback: boolean;
  };
}

/**
 * Request JSON from the model, with a non-jsonMode fallback for free models
 * that sometimes ignore or mishandle response_format.
 */
export async function generateStructuredJson(params: {
  system: string;
  user: string;
  temperature?: number;
  maxTokens?: number;
  operation?: AiCallMeta['operation'];
}): Promise<StructuredJsonResult> {
  const operation = params.operation ?? 'plan';
  const requestedModel = getOpenRouterModel();

  try {
    const completion = await generateChatCompletion({
      system: params.system,
      user: params.user,
      temperature: params.temperature ?? 0.35,
      maxTokens: params.maxTokens ?? 3500,
      jsonMode: true,
      operation,
    });

    const data = extractJsonObject(completion.content);
    aiLog('success', 'parse', 'Structured JSON parsed successfully', {
      operation,
      model: completion.model,
      preview: previewAiText(completion.content),
    });

    return {
      data,
      meta: {
        requestedModel: completion.requestedModel,
        model: completion.model,
        durationMs: completion.durationMs,
        usedFallback: false,
        preview: previewAiText(completion.content),
        promptTokens: completion.usage?.promptTokens,
        completionTokens: completion.usage?.completionTokens,
        totalTokens: completion.usage?.totalTokens,
        costUsd: completion.usage?.costUsd,
      },
    };
  } catch (firstError) {
    const message =
      firstError instanceof Error ? firstError.message.toLowerCase() : '';
    const shouldRetry =
      firstError instanceof AiParseError ||
      message.includes('empty') ||
      message.includes('json') ||
      message.includes('response_format') ||
      message.includes('invalid') ||
      message.includes('parse');

    if (!shouldRetry) {
      throw firstError;
    }

    aiLog('warn', 'retry', 'Retrying without JSON mode after parse/format issue', {
      operation,
      requestedModel,
      reason: firstError instanceof Error ? firstError.message : 'unknown',
    });

    const completion = await generateChatCompletion({
      system: `${params.system}\n\nIMPORTANT: Reply with raw JSON only. Do not use markdown fences.`,
      user: params.user,
      temperature: Math.min(params.temperature ?? 0.35, 0.25),
      maxTokens: params.maxTokens ?? 3500,
      jsonMode: false,
      operation: 'retry',
    });

    const data = extractJsonObject(completion.content);
    aiLog('success', 'parse', 'Structured JSON parsed after fallback retry', {
      operation,
      model: completion.model,
      preview: previewAiText(completion.content),
    });

    return {
      data,
      meta: {
        requestedModel: completion.requestedModel || requestedModel,
        model: completion.model,
        durationMs: completion.durationMs,
        usedFallback: true,
        preview: previewAiText(completion.content),
        promptTokens: completion.usage?.promptTokens,
        completionTokens: completion.usage?.completionTokens,
        totalTokens: completion.usage?.totalTokens,
        costUsd: completion.usage?.costUsd,
      },
    };
  }
}

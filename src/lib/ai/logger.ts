export type AiLogLevel = 'info' | 'success' | 'warn' | 'error';

export type AiOperation =
  | 'chat'
  | 'plan'
  | 'improve-plan'
  | 'research'
  | 'write'
  | 'verify'
  | 'parse'
  | 'retry';

function stamp(): string {
  return new Date().toISOString();
}

function safePreview(text: string, max = 180): string {
  const compact = text.replace(/\s+/g, ' ').trim();
  if (compact.length <= max) return compact;
  return `${compact.slice(0, max)}…`;
}

/**
 * Server-side AI logger. Visible in the Next.js terminal (`npm run dev`).
 * Never logs API keys or full prompts with secrets.
 */
export function aiLog(
  level: AiLogLevel,
  operation: AiOperation,
  message: string,
  details?: Record<string, unknown>
): void {
  const prefix = `[ResearchFlow AI][${operation}]`;
  const payload = details ? { ...details } : undefined;

  if (level === 'error') {
    console.error(stamp(), prefix, message, payload ?? '');
  } else if (level === 'warn') {
    console.warn(stamp(), prefix, message, payload ?? '');
  } else {
    console.info(stamp(), prefix, message, payload ?? '');
  }
}

export function previewAiText(text: string, max = 180): string {
  return safePreview(text, max);
}

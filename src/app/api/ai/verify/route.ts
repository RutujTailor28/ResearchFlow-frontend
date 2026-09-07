import { generateStructuredJson } from '@/lib/ai/structured';
import {
  errorResponse,
  fallbackVerificationResult,
  mapAiErrorToResponse,
  normalizeVerificationResult,
  buildRouteMeta,
} from '@/lib/ai/helpers';
import { aiLog } from '@/lib/ai/logger';
import { createVerifierPrompt } from '@/lib/ai/prompts';
import { getOpenRouterModel } from '@/lib/ai/openrouter';
import type { VerifySectionRequest } from '@/types/ai';

export async function POST(request: Request) {
  const started = Date.now();

  try {
    const body = (await request.json()) as Partial<VerifySectionRequest>;
    const topic = typeof body.topic === 'string' ? body.topic.trim() : '';
    const sectionTitle =
      typeof body.sectionTitle === 'string' ? body.sectionTitle.trim() : '';
    const content = typeof body.content === 'string' ? body.content.trim() : '';

    if (!topic) {
      return errorResponse('A research topic is required.', 400, 'VALIDATION_ERROR');
    }

    if (!sectionTitle) {
      return errorResponse('A section title is required.', 400, 'VALIDATION_ERROR');
    }

    if (!content) {
      return errorResponse('Section content is required for verification.', 400, 'VALIDATION_ERROR');
    }

    aiLog('info', 'verify', 'Verification requested', {
      topic: topic.slice(0, 80),
      sectionTitle: sectionTitle.slice(0, 80),
      contentChars: content.length,
    });

    const prompt = createVerifierPrompt({
      topic,
      sectionTitle,
      content,
      findings: Array.isArray(body.findings)
        ? body.findings.filter((f): f is string => typeof f === 'string')
        : undefined,
      sources: Array.isArray(body.sources) ? body.sources : undefined,
    });

    try {
      const { data, meta } = await generateStructuredJson({
        system: prompt.system,
        user: prompt.user,
        temperature: 0.1,
        maxTokens: 900,
        operation: 'verify',
      });
      const verification = normalizeVerificationResult(data);

      aiLog('success', 'verify', 'Verification completed', {
        model: meta.model,
        confidence: verification.confidence,
        verifiedClaims: verification.verifiedClaims.length,
        unverifiedClaims: verification.unverifiedClaims.length,
        durationMs: Date.now() - started,
      });

      return Response.json({
        verification,
        meta: buildRouteMeta({
          operation: 'verify',
          meta,
          durationMs: Date.now() - started,
          message: `Verified with ${meta.model} (${verification.confidence} confidence)`,
        }),
      });
    } catch (parseOrModelError) {
      // Free models often truncate/think instead of JSON. Soft-fail so research continues.
      const verification = fallbackVerificationResult(
        parseOrModelError instanceof Error
          ? `Verifier could not return structured JSON (${parseOrModelError.message}).`
          : 'Verifier could not return structured JSON.'
      );

      aiLog('warn', 'verify', 'Returning soft-fallback verification result', {
        durationMs: Date.now() - started,
        reason:
          parseOrModelError instanceof Error ? parseOrModelError.message : 'unknown',
      });

      return Response.json({
        verification,
        meta: buildRouteMeta({
          operation: 'verify',
          meta: {
            requestedModel: getOpenRouterModel(),
            model: getOpenRouterModel(),
            usedFallback: true,
          },
          durationMs: Date.now() - started,
          message: 'Verification used safe fallback (model response was incomplete)',
        }),
      });
    }
  } catch (error) {
    aiLog('error', 'verify', 'Verification failed', {
      durationMs: Date.now() - started,
      reason: error instanceof Error ? error.message : 'unknown',
    });
    if (error instanceof SyntaxError) {
      return errorResponse('Invalid request body.', 400, 'VALIDATION_ERROR');
    }
    return mapAiErrorToResponse(error);
  }
}

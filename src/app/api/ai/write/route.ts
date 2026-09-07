import { generateStructuredJson } from '@/lib/ai/structured';
import {
  errorResponse,
  mapAiErrorToResponse,
  normalizeWrittenSection,
  buildRouteMeta,
} from '@/lib/ai/helpers';
import { aiLog } from '@/lib/ai/logger';
import { createWriterPrompt } from '@/lib/ai/prompts';
import type { WriteSectionRequest } from '@/types/ai';

export async function POST(request: Request) {
  const started = Date.now();

  try {
    const body = (await request.json()) as Partial<WriteSectionRequest>;
    const topic = typeof body.topic === 'string' ? body.topic.trim() : '';
    const sectionTitle =
      typeof body.sectionTitle === 'string' ? body.sectionTitle.trim() : '';
    const subQuestions = Array.isArray(body.subQuestions)
      ? body.subQuestions.filter((q): q is string => typeof q === 'string')
      : [];

    if (!topic) {
      return errorResponse('A research topic is required.', 400, 'VALIDATION_ERROR');
    }

    if (!sectionTitle) {
      return errorResponse('A section title is required.', 400, 'VALIDATION_ERROR');
    }

    aiLog('info', 'write', 'Section write requested', {
      topic: topic.slice(0, 80),
      sectionTitle: sectionTitle.slice(0, 80),
    });

    const prompt = createWriterPrompt({
      topic,
      sectionTitle,
      subQuestions,
      findings: Array.isArray(body.findings)
        ? body.findings.filter((f): f is string => typeof f === 'string')
        : undefined,
      sources: Array.isArray(body.sources) ? body.sources : undefined,
      audience: body.audience,
      tone: body.tone,
      targetLength: body.targetLength,
    });

    const { data, meta } = await generateStructuredJson({
      system: prompt.system,
      user: prompt.user,
      temperature: 0.45,
      maxTokens: 1600,
      operation: 'write',
    });
    const section = normalizeWrittenSection(data, sectionTitle);

    aiLog('success', 'write', 'Section written successfully', {
      model: meta.model,
      sectionTitle: section.sectionTitle,
      contentChars: section.content.length,
      keyPoints: section.keyPoints.length,
      durationMs: Date.now() - started,
    });

    return Response.json({
      section,
      meta: buildRouteMeta({
        operation: 'write',
        meta,
        durationMs: Date.now() - started,
        message: `Section written with ${meta.model}`,
      }),
    });
  } catch (error) {
    aiLog('error', 'write', 'Section write failed', {
      durationMs: Date.now() - started,
      reason: error instanceof Error ? error.message : 'unknown',
    });
    if (error instanceof SyntaxError) {
      return errorResponse('Invalid request body.', 400, 'VALIDATION_ERROR');
    }
    return mapAiErrorToResponse(error);
  }
}

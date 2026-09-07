import { generateStructuredJson } from '@/lib/ai/structured';
import {
  buildRouteMeta,
  errorResponse,
  mapAiErrorToResponse,
  normalizeResearchBundle,
} from '@/lib/ai/helpers';
import { aiLog } from '@/lib/ai/logger';
import { createResearcherPrompt } from '@/lib/ai/prompts';
import type { ResearchRequest } from '@/types/ai';
import type { ResearchDepth } from '@/types';

const VALID_DEPTHS: ResearchDepth[] = ['quick', 'standard', 'deep'];

export async function POST(request: Request) {
  const started = Date.now();

  try {
    const body = (await request.json()) as Partial<ResearchRequest>;
    const topic = typeof body.topic === 'string' ? body.topic.trim() : '';
    const planSections = Array.isArray(body.planSections)
      ? body.planSections.filter(
          (s): s is { id: string; title: string; subQuestions: string[] } =>
            !!s &&
            typeof s === 'object' &&
            typeof s.title === 'string' &&
            Array.isArray(s.subQuestions)
        )
      : [];

    if (!topic) {
      return errorResponse('A research topic is required.', 400, 'VALIDATION_ERROR');
    }

    if (!body.depth || !VALID_DEPTHS.includes(body.depth)) {
      return errorResponse('A valid research depth is required.', 400, 'VALIDATION_ERROR');
    }

    if (planSections.length === 0) {
      return errorResponse('At least one plan section is required.', 400, 'VALIDATION_ERROR');
    }

    aiLog('info', 'research', 'Research phase requested', {
      topic: topic.slice(0, 120),
      depth: body.depth,
      sections: planSections.length,
    });

    const prompt = createResearcherPrompt({
      topic,
      depth: body.depth,
      planSections: planSections.map((s) => ({
        id: typeof s.id === 'string' ? s.id : s.title,
        title: s.title.trim(),
        subQuestions: s.subQuestions.filter((q): q is string => typeof q === 'string'),
      })),
      audience: body.audience,
      tone: body.tone,
      preferredSources: body.preferredSources,
    });

    const { data, meta } = await generateStructuredJson({
      system: prompt.system,
      user: prompt.user,
      temperature: 0.4,
      maxTokens: 3500,
      operation: 'research',
    });

    const research = normalizeResearchBundle(data, body.depth, topic);

    aiLog('success', 'research', 'Research bundle generated', {
      model: meta.model,
      sources: research.sources.length,
      findings: research.findings.length,
      events: research.events.length,
      durationMs: Date.now() - started,
      totalTokens: meta.totalTokens,
      costUsd: meta.costUsd,
    });

    return Response.json({
      research,
      meta: buildRouteMeta({
        operation: 'research',
        meta,
        durationMs: Date.now() - started,
        message: `Research completed with ${meta.model} (${research.sources.length} sources)`,
      }),
    });
  } catch (error) {
    aiLog('error', 'research', 'Research phase failed', {
      durationMs: Date.now() - started,
      reason: error instanceof Error ? error.message : 'unknown',
    });
    if (error instanceof SyntaxError) {
      return errorResponse('Invalid request body.', 400, 'VALIDATION_ERROR');
    }
    return mapAiErrorToResponse(error);
  }
}

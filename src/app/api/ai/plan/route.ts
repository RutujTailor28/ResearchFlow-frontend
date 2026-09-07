import { generateStructuredJson } from '@/lib/ai/structured';
import {
  errorResponse,
  mapAiErrorToResponse,
  normalizeResearchPlan,
  buildRouteMeta,
} from '@/lib/ai/helpers';
import { aiLog } from '@/lib/ai/logger';
import { createPlannerPrompt } from '@/lib/ai/prompts';
import type { GeneratePlanRequest } from '@/types/ai';
import type { ResearchDepth } from '@/types';

const VALID_DEPTHS: ResearchDepth[] = ['quick', 'standard', 'deep'];

export async function POST(request: Request) {
  const started = Date.now();

  try {
    const body = (await request.json()) as Partial<GeneratePlanRequest>;
    const topic = typeof body.topic === 'string' ? body.topic.trim() : '';

    if (!topic) {
      return errorResponse('A research topic is required.', 400, 'VALIDATION_ERROR');
    }

    if (!body.depth || !VALID_DEPTHS.includes(body.depth)) {
      return errorResponse('A valid research depth is required.', 400, 'VALIDATION_ERROR');
    }

    aiLog('info', 'plan', 'Plan generation requested', {
      topic: topic.slice(0, 120),
      depth: body.depth,
    });

    const prompt = createPlannerPrompt({
      topic,
      depth: body.depth,
      audience: body.audience,
      tone: body.tone,
      targetLength: body.targetLength,
      preferredSources: body.preferredSources,
    });

    const { data, meta } = await generateStructuredJson({
      system: prompt.system,
      user: prompt.user,
      temperature: 0.35,
      maxTokens: 3500,
      operation: 'plan',
    });
    const plan = normalizeResearchPlan(data, body.depth, topic);

    aiLog('success', 'plan', 'Plan validated and returned', {
      model: meta.model,
      sections: plan.sections.length,
      durationMs: Date.now() - started,
    });

    return Response.json({
      plan,
      meta: buildRouteMeta({
        operation: 'plan',
        meta,
        durationMs: Date.now() - started,
        message: `Plan generated with ${meta.model} (${plan.sections.length} sections)`,
      }),
    });
  } catch (error) {
    aiLog('error', 'plan', 'Plan generation failed', {
      durationMs: Date.now() - started,
      reason: error instanceof Error ? error.message : 'unknown',
    });
    if (error instanceof SyntaxError) {
      return errorResponse('Invalid request body.', 400, 'VALIDATION_ERROR');
    }
    return mapAiErrorToResponse(error);
  }
}

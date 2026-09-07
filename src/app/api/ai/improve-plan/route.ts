import { generateStructuredJson } from '@/lib/ai/structured';
import {
  errorResponse,
  isPlanImproveAction,
  mapAiErrorToResponse,
  normalizeResearchPlan,
  uiSectionsToPlan,
  buildRouteMeta,
} from '@/lib/ai/helpers';
import { aiLog } from '@/lib/ai/logger';
import { createPlanImprovementPrompt } from '@/lib/ai/prompts';
import type { ImprovePlanRequest, ResearchPlan } from '@/types/ai';
import type { PlanSectionItem, ResearchDepth } from '@/types';

const VALID_DEPTHS: ResearchDepth[] = ['quick', 'standard', 'deep'];

function coercePlan(input: ImprovePlanRequest['plan'], topic: string): ResearchPlan {
  if (
    input &&
    typeof input === 'object' &&
    Array.isArray((input as ResearchPlan).sections) &&
    typeof (input as ResearchPlan).title === 'string' &&
    typeof (input as ResearchPlan).summary === 'string'
  ) {
    return input as ResearchPlan;
  }

  const sections = Array.isArray((input as { sections?: PlanSectionItem[] })?.sections)
    ? (input as { sections: PlanSectionItem[] }).sections
    : [];

  return uiSectionsToPlan(sections, topic, (input as { summary?: string })?.summary);
}

export async function POST(request: Request) {
  const started = Date.now();

  try {
    const body = (await request.json()) as Partial<ImprovePlanRequest>;
    const topic = typeof body.topic === 'string' ? body.topic.trim() : '';

    if (!topic) {
      return errorResponse('A research topic is required.', 400, 'VALIDATION_ERROR');
    }

    if (!body.depth || !VALID_DEPTHS.includes(body.depth)) {
      return errorResponse('A valid research depth is required.', 400, 'VALIDATION_ERROR');
    }

    if (!isPlanImproveAction(body.action)) {
      return errorResponse('A valid improvement action is required.', 400, 'VALIDATION_ERROR');
    }

    if (!body.plan) {
      return errorResponse('An existing plan is required.', 400, 'VALIDATION_ERROR');
    }

    const currentPlan = coercePlan(body.plan, topic);
    if (!currentPlan.sections.length) {
      return errorResponse('The current plan has no sections to improve.', 400, 'VALIDATION_ERROR');
    }

    aiLog('info', 'improve-plan', 'Plan improvement requested', {
      topic: topic.slice(0, 120),
      action: body.action,
      sections: currentPlan.sections.length,
    });

    const prompt = createPlanImprovementPrompt({
      topic,
      depth: body.depth,
      action: body.action,
      plan: currentPlan,
      audience: body.audience,
      tone: body.tone,
      targetLength: body.targetLength,
      preferredSources: body.preferredSources,
    });

    const { data, meta } = await generateStructuredJson({
      system: prompt.system,
      user: prompt.user,
      temperature: 0.4,
      maxTokens: 3500,
      operation: 'improve-plan',
    });
    const plan = normalizeResearchPlan(data, body.depth, topic);

    aiLog('success', 'improve-plan', 'Improved plan validated and returned', {
      model: meta.model,
      sections: plan.sections.length,
      durationMs: Date.now() - started,
    });

    return Response.json({
      plan,
      meta: buildRouteMeta({
        operation: 'improve-plan',
        meta,
        durationMs: Date.now() - started,
        message: `Plan improved with ${meta.model}`,
      }),
    });
  } catch (error) {
    aiLog('error', 'improve-plan', 'Plan improvement failed', {
      durationMs: Date.now() - started,
      reason: error instanceof Error ? error.message : 'unknown',
    });
    if (error instanceof SyntaxError) {
      return errorResponse('Invalid request body.', 400, 'VALIDATION_ERROR');
    }
    return mapAiErrorToResponse(error);
  }
}

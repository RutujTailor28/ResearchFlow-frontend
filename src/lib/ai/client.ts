import type {
  ImprovePlanRequest,
  GeneratePlanRequest,
  ResearchPlan,
  ResearchBundle,
  ResearchRequest,
  VerificationResult,
  VerifySectionRequest,
  WriteSectionRequest,
  WrittenSection,
  PlanImproveAction,
  AiCallMeta,
} from '../../types/ai';

type ApiSuccess<T> = T & { meta?: AiCallMeta };

async function postJson<T>(url: string, body: unknown): Promise<ApiSuccess<T>> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data?.error === 'string'
        ? data.error
        : 'Unable to complete the AI request. Please try again.';
    // Use warn so Next.js overlay doesn't treat handled API failures as fatal UI crashes.
    console.warn('[ResearchFlow AI][client]', url, message);
    throw new Error(message);
  }

  if (data?.meta) {
    console.info('[ResearchFlow AI][client]', data.meta);
  }

  return data as ApiSuccess<T>;
}

export async function requestResearchPlan(
  payload: GeneratePlanRequest
): Promise<{ plan: ResearchPlan; meta?: AiCallMeta }> {
  return postJson<{ plan: ResearchPlan }>('/api/ai/plan', payload);
}

export async function requestImprovedPlan(
  payload: ImprovePlanRequest
): Promise<{ plan: ResearchPlan; meta?: AiCallMeta }> {
  return postJson<{ plan: ResearchPlan }>('/api/ai/improve-plan', payload);
}

export async function requestResearchBundle(
  payload: ResearchRequest
): Promise<{ research: ResearchBundle; meta?: AiCallMeta }> {
  return postJson<{ research: ResearchBundle }>('/api/ai/research', payload);
}

export async function requestWrittenSection(
  payload: WriteSectionRequest
): Promise<{ section: WrittenSection; meta?: AiCallMeta }> {
  return postJson<{ section: WrittenSection }>('/api/ai/write', payload);
}

export async function requestVerification(
  payload: VerifySectionRequest
): Promise<{ verification: VerificationResult; meta?: AiCallMeta }> {
  return postJson<{ verification: VerificationResult }>('/api/ai/verify', payload);
}

export const PLAN_IMPROVE_ACTIONS: Array<{
  id: PlanImproveAction;
  label: string;
}> = [
  { id: 'improve', label: 'Improve Plan' },
  { id: 'more-detailed', label: 'More Detailed' },
  { id: 'more-technical', label: 'More Technical' },
  { id: 'simplify', label: 'Simplify' },
  { id: 'add-questions', label: 'Add Questions' },
];

import type {
  PlanImproveAction,
  ResearchPlan,
  VerificationResult,
  WrittenSection,
} from '../../types/ai';
import type { PlanSectionItem, ReportSectionItem } from '../../types';

export function planToUiSections(plan: ResearchPlan): PlanSectionItem[] {
  return plan.sections.map((section, index) => ({
    id: section.id || `sec-${String(index + 1).padStart(2, '0')}`,
    orderNumber: String(index + 1).padStart(2, '0'),
    title: section.title,
    subQuestions: section.subQuestions,
  }));
}

export function uiSectionsToPlan(
  sections: PlanSectionItem[],
  topic: string,
  summary?: string
): ResearchPlan {
  return {
    title: topic,
    summary: summary || `Research plan for ${topic}`,
    sections: sections.map((section) => ({
      id: section.id,
      title: section.title,
      subQuestions: section.subQuestions,
    })),
  };
}

export function writtenSectionToReportItem(input: {
  id: string;
  orderNumber: string;
  written: WrittenSection;
  verification?: VerificationResult;
  supportingSourceIds?: number[];
}): ReportSectionItem {
  const paragraphs = input.written.content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const confidenceLabel =
    input.verification?.confidence === 'high'
      ? 'High'
      : input.verification?.confidence === 'low'
        ? 'Low'
        : 'Medium';

  const unverified = input.verification?.unverifiedClaims ?? [];
  const warnings = input.verification?.warnings ?? [];

  return {
    id: input.id,
    orderNumber: input.orderNumber,
    title: input.written.sectionTitle,
    paragraphs: paragraphs.length > 0 ? paragraphs : [input.written.content],
    confidence: confidenceLabel,
    verifiedClaims: input.verification?.verifiedClaims.length ?? 0,
    supportingSourceIds: input.supportingSourceIds ?? [],
    hasUnverifiedClaim: unverified.length > 0,
    unverifiedClaimText: unverified[0] || warnings[0],
  };
}

export function isPlanImproveAction(value: unknown): value is PlanImproveAction {
  return (
    value === 'improve' ||
    value === 'more-detailed' ||
    value === 'more-technical' ||
    value === 'simplify' ||
    value === 'add-questions'
  );
}

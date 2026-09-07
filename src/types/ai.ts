import type {
  Audience,
  PlanSectionItem,
  ResearchBrief,
  ResearchDepth,
  SourceItem,
  TargetLength,
  Tone,
} from './index';

export interface PlanSection {
  id: string;
  title: string;
  description?: string;
  subQuestions: string[];
}

export interface ResearchPlan {
  title: string;
  summary: string;
  sections: PlanSection[];
}

export type PlanImproveAction =
  | 'improve'
  | 'more-detailed'
  | 'more-technical'
  | 'simplify'
  | 'add-questions';

export interface GeneratePlanRequest {
  topic: string;
  depth: ResearchDepth;
  audience?: Audience;
  tone?: Tone;
  targetLength?: TargetLength;
  preferredSources?: string[];
}

export interface ImprovePlanRequest {
  topic: string;
  depth: ResearchDepth;
  action: PlanImproveAction;
  plan: ResearchPlan | { title?: string; summary?: string; sections: PlanSectionItem[] };
  audience?: Audience;
  tone?: Tone;
  targetLength?: TargetLength;
  preferredSources?: string[];
}

export interface WriteSectionRequest {
  topic: string;
  sectionTitle: string;
  sectionId?: string;
  orderNumber?: string;
  subQuestions: string[];
  findings?: string[];
  sources?: Array<Pick<SourceItem, 'id' | 'name' | 'title' | 'snippet' | 'category'>>;
  audience?: Audience;
  tone?: Tone;
  targetLength?: TargetLength;
}

export interface WrittenSection {
  sectionTitle: string;
  content: string;
  keyPoints: string[];
}

export interface VerifySectionRequest {
  topic: string;
  sectionTitle: string;
  content: string;
  findings?: string[];
  sources?: Array<Pick<SourceItem, 'id' | 'name' | 'title' | 'snippet' | 'category'>>;
}

export type VerificationConfidence = 'high' | 'medium' | 'low';

export interface VerificationResult {
  confidence: VerificationConfidence;
  verifiedClaims: string[];
  unverifiedClaims: string[];
  warnings: string[];
  suggestions: string[];
}

export interface AiApiErrorBody {
  error: string;
  code?: string;
}

export interface ResearchSourceDraft {
  domain: string;
  name: string;
  title: string;
  url: string;
  category: string;
  qualityScore: number;
  snippet: string;
  author?: string;
  publishedYear?: string;
}

export interface ResearchEventDraft {
  agentId: string;
  agentName: string;
  title: string;
  badgeType: 'search' | 'read' | 'finding' | 'plan' | 'write' | 'verify' | 'alert';
  toolName?: string;
  input?: string;
  output?: string;
  tokens?: number;
}

export interface ResearchAgentUpdate {
  agentId: string;
  currentAction: string;
  sourcesCount?: number;
  findingsCount?: number;
}

export interface ResearchBundle {
  sources: SourceItem[];
  findings: string[];
  events: ResearchEventDraft[];
  agentUpdates: ResearchAgentUpdate[];
}

export interface ResearchRequest {
  topic: string;
  depth: ResearchDepth;
  planSections: Array<{ id: string; title: string; subQuestions: string[] }>;
  audience?: Audience;
  tone?: Tone;
  preferredSources?: string[];
}

/** Metadata returned by AI API routes so the UI can show which model ran. */
export interface AiCallMeta {
  ok: boolean;
  operation: 'plan' | 'improve-plan' | 'write' | 'verify' | 'research';
  requestedModel: string;
  model: string;
  durationMs: number;
  usedFallback?: boolean;
  preview?: string;
  message?: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  costUsd?: number;
}

export interface AiActivityLogEntry {
  id: string;
  at: string;
  operation: AiCallMeta['operation'] | 'chat' | 'parse' | 'retry';
  status: 'started' | 'success' | 'error';
  requestedModel?: string;
  model?: string;
  durationMs?: number;
  message: string;
  preview?: string;
}

export type { ResearchBrief };

export type ResearchDepth = 'quick' | 'standard' | 'deep';
export type Audience = 'Executive' | 'Technical' | 'General';
export type Tone = 'Professional' | 'Analytical' | 'Simple' | 'Academic';
export type TargetLength = 'Short' | 'Medium' | 'Long';
export type SourceCategory = 
  | 'Academic Papers' 
  | 'Official Sources' 
  | 'Industry Reports' 
  | 'News Publications' 
  | 'Government Data';

export type AgentStatus = 'pending' | 'running' | 'completed' | 'failed' | 'warning' | 'retrying';
export type RunStatus = 'completed' | 'running' | 'failed' | 'cancelled';

export interface AgentInfo {
  id: string;
  name: string;
  roleTitle: string;
  roleCategory: 'planner' | 'researcher' | 'writer' | 'verifier';
  status: AgentStatus;
  currentAction: string;
  elapsedSec: number;
  tokens: number;
  cost: number;
  sourcesCount?: number;
  findingsCount?: number;
  retryAttempt?: number;
  maxRetries?: number;
  avatarColor: string;
}

export interface AgentTechnicalEvent {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  title: string;
  badgeType: 'search' | 'read' | 'finding' | 'plan' | 'write' | 'verify' | 'alert';
  toolName?: string;
  input?: string;
  output?: string;
  durationSec?: number;
  tokens?: number;
}

export interface SourceItem {
  id: number;
  domain: string;
  name: string;
  title: string;
  url: string;
  category: SourceCategory;
  qualityScore: number;
  status: 'verified' | 'analyzing' | 'indexed';
  snippet: string;
  author?: string;
  publishedYear?: string;
  accessedDate?: string;
  citationsCount?: number;
}

export interface PlanSectionItem {
  id: string;
  orderNumber: string;
  title: string;
  subQuestions: string[];
}

export interface ReportSectionItem {
  id: string;
  orderNumber: string;
  title: string;
  paragraphs: string[];
  confidence: 'High' | 'Medium' | 'Low';
  verifiedClaims: number;
  supportingSourceIds: number[];
  hasUnverifiedClaim?: boolean;
  unverifiedClaimText?: string;
  hasConflict?: boolean;
  conflictData?: {
    statement: string;
    sourceA: { name: string; value: string };
    sourceB: { name: string; value: string };
    implication: string;
  };
}

export interface ResearchBrief {
  topic: string;
  depth: ResearchDepth;
  audience: Audience;
  tone: Tone;
  targetLength: TargetLength;
  preferredSources: SourceCategory[];
}

export interface ResearchRun {
  id: string;
  topic: string;
  depth: ResearchDepth;
  audience: Audience;
  tone: Tone;
  targetLength: TargetLength;
  preferredSources: SourceCategory[];
  status: 'completed' | 'running' | 'failed' | 'cancelled';
  failureReason?: string;
  partialResults?: boolean;
  createdAt: string;
  durationFormatted: string;
  totalDurationSec: number;
  totalCost: number;
  totalTokens: number;
  sectionsCount: number;
  sourcesCount: number;
  plan: PlanSectionItem[];
  agents: AgentInfo[];
  events: AgentTechnicalEvent[];
  sources: SourceItem[];
  reportSections: ReportSectionItem[];
}

export type ActiveScreen = 
  | 'landing'
  | 'new'
  | 'plan'
  | 'live'
  | 'report'
  | 'history'
  | 'agents'
  | 'settings';

import type {
  ActiveScreen,
  AgentInfo,
  AgentTechnicalEvent,
  PlanSectionItem,
  ReportSectionItem,
  ResearchBrief,
  ResearchRun,
  SourceItem,
} from '../types';
import type { AiActivityLogEntry } from '../types/ai';

export const RESEARCH_STORAGE_KEY = 'researchflow.workspace.v1';

const APP_SCREENS = new Set<ActiveScreen>([
  'landing',
  'new',
  'plan',
  'live',
  'report',
  'history',
  'agents',
  'settings',
]);

/** Resolve a persisted/requested screen. Default entry is the marketing landing page. */
export function resolveAppScreen(screen: unknown): ActiveScreen {
  if (typeof screen === 'string' && APP_SCREENS.has(screen as ActiveScreen)) {
    return screen as ActiveScreen;
  }
  return 'landing';
}

/** @deprecated Use resolveAppScreen — kept for older call sites. */
export function resolveWorkspaceScreen(screen: unknown): ActiveScreen {
  return resolveAppScreen(screen);
}

export interface PersistedResearchState {
  version: 1;
  updatedAt: string;
  currentScreen: ActiveScreen;
  brief: ResearchBrief;
  activePlan: PlanSectionItem[];
  planMeta: { title: string; summary: string } | null;
  historyRuns: ResearchRun[];
  activeRun: ResearchRun | null;
  liveAgents: AgentInfo[];
  liveEvents: AgentTechnicalEvent[];
  liveSources: SourceItem[];
  liveReportSections: ReportSectionItem[];
  activeStreamingSectionIndex: number;
  currentCost: number;
  currentTokens: number;
  elapsedSeconds: number;
  simulationProgress: number;
  isRunCompleted: boolean;
  /** Mid-run is always restored as paused after reload. */
  wasSimulating: boolean;
  aiLogs: AiActivityLogEntry[];
  lastAiModel: string | null;
}

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadResearchState(): PersistedResearchState | null {
  if (!canUseStorage()) return null;

  try {
    const raw = window.localStorage.getItem(RESEARCH_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedResearchState;
    if (!parsed || parsed.version !== 1) return null;
    if (!parsed.brief || !Array.isArray(parsed.activePlan)) return null;

    parsed.currentScreen = resolveAppScreen(parsed.currentScreen);
    return parsed;
  } catch (error) {
    console.warn('[ResearchFlow] Failed to load local research state', error);
    return null;
  }
}

export function saveResearchState(state: Omit<PersistedResearchState, 'version' | 'updatedAt'>): void {
  if (!canUseStorage()) return;

  try {
    const payload: PersistedResearchState = {
      version: 1,
      updatedAt: new Date().toISOString(),
      ...state,
      currentScreen: resolveAppScreen(state.currentScreen),
      historyRuns: state.historyRuns.slice(0, 30),
      aiLogs: state.aiLogs.slice(0, 40),
      liveEvents: state.liveEvents.slice(0, 80),
    };

    window.localStorage.setItem(RESEARCH_STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn('[ResearchFlow] Failed to save local research state', error);
  }
}

export function clearResearchState(): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(RESEARCH_STORAGE_KEY);
  } catch {
    // ignore
  }
}

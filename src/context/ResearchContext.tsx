'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ActiveScreen,
  ResearchBrief,
  PlanSectionItem,
  ResearchRun,
  AgentInfo,
  AgentTechnicalEvent,
  SourceItem,
  ReportSectionItem,
} from '../types';
import type { AiActivityLogEntry, AiCallMeta, PlanImproveAction, ResearchPlan } from '../types/ai';
import { HEALTHCARE_DEFAULT_PLAN } from '../mocks/samplePlans';
import { INITIAL_AGENTS_TEMPLATE } from '../mocks/agents';
import { MOCK_LIVE_EVENTS } from '../mocks/agentEvents';
import { MOCK_SOURCES } from '../mocks/sources';
import { HEALTHCARE_REPORT_SECTIONS } from '../mocks/sampleReports';
import { MOCK_HISTORY_RUNS, COMPLETED_HEALTHCARE_RUN } from '../mocks/researchRuns';
import {
  requestImprovedPlan,
  requestResearchBundle,
  requestResearchPlan,
  requestVerification,
  requestWrittenSection,
} from '../lib/ai/client';
import { planToUiSections, uiSectionsToPlan, writtenSectionToReportItem } from '../lib/ai/mappers';
import { loadResearchState, saveResearchState, resolveAppScreen } from '../lib/storage';

interface ResearchContextType {
  currentScreen: ActiveScreen;
  setCurrentScreen: (screen: ActiveScreen) => void;
  brief: ResearchBrief;
  setBrief: React.Dispatch<React.SetStateAction<ResearchBrief>>;
  activePlan: PlanSectionItem[];
  setActivePlan: React.Dispatch<React.SetStateAction<PlanSectionItem[]>>;
  planMeta: { title: string; summary: string } | null;
  historyRuns: ResearchRun[];
  activeRun: ResearchRun | null;
  setActiveRun: (run: ResearchRun | null) => void;

  isSimulating: boolean;
  simulationProgress: number;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  elapsedSeconds: number;
  liveAgents: AgentInfo[];
  liveEvents: AgentTechnicalEvent[];
  liveSources: SourceItem[];
  liveReportSections: ReportSectionItem[];
  activeStreamingSectionIndex: number;
  currentCost: number;
  currentTokens: number;
  isRunCompleted: boolean;

  isGeneratingPlan: boolean;
  isImprovingPlan: boolean;
  isWritingReport: boolean;
  aiStatusMessage: string | null;
  aiError: string | null;
  aiLogs: AiActivityLogEntry[];
  lastAiModel: string | null;
  storageReady: boolean;
  clearAiError: () => void;
  clearAiLogs: () => void;

  generatePlan: () => Promise<void>;
  improvePlan: (action: PlanImproveAction) => Promise<void>;
  approveAndStartResearch: () => void;
  retryResearch: () => void;
  cancelResearch: () => void;
  fastForwardComplete: () => void;
  regenerateReportSection: (sectionId: string) => Promise<void>;
  viewReport: (run?: ResearchRun) => void;
  startReplay: (run: ResearchRun) => void;
  replayActive: boolean;
  setReplayActive: (active: boolean) => void;
  replayRunTarget: ResearchRun | null;
}

const ResearchContext = createContext<ResearchContextType | undefined>(undefined);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function compactSources(sources: SourceItem[]) {
  return sources.map((s) => ({
    id: s.id,
    name: s.name,
    title: s.title,
    snippet: s.snippet,
    category: s.category,
  }));
}

function createFreshLiveAgents(): AgentInfo[] {
  return INITIAL_AGENTS_TEMPLATE.map((a) => ({
    ...a,
    status: a.id === 'planner-01' ? ('completed' as const) : ('pending' as const),
    currentAction:
      a.id === 'planner-01'
        ? 'Research plan finalized'
        : a.roleCategory === 'researcher'
          ? 'Queued for research'
          : a.roleCategory === 'writer'
            ? 'Waiting for research findings'
            : 'Standby for draft sections',
    elapsedSec: a.id === 'planner-01' ? 8 : 0,
    tokens: 0,
    cost: 0,
    sourcesCount: 0,
    findingsCount: 0,
  }));
}

function nowClock(): string {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function usageFromMeta(meta?: AiCallMeta): { tokens: number; cost: number } {
  return {
    tokens: Math.max(0, Math.round(meta?.totalTokens ?? 0)),
    cost: typeof meta?.costUsd === 'number' && meta.costUsd >= 0 ? meta.costUsd : 0,
  };
}

export const ResearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreenState] = useState<ActiveScreen>('landing');

  const setCurrentScreen = useCallback((screen: ActiveScreen) => {
    setCurrentScreenState(resolveAppScreen(screen));
  }, []);

  const [brief, setBrief] = useState<ResearchBrief>({
    topic: 'How will artificial intelligence transform healthcare over the next five years?',
    depth: 'standard',
    audience: 'Technical',
    tone: 'Analytical',
    targetLength: 'Medium',
    preferredSources: ['Academic Papers', 'Official Sources', 'Industry Reports', 'Government Data'],
  });

  const [activePlan, setActivePlan] = useState<PlanSectionItem[]>(HEALTHCARE_DEFAULT_PLAN);
  const [planMeta, setPlanMeta] = useState<{ title: string; summary: string } | null>(null);
  const [historyRuns, setHistoryRuns] = useState<ResearchRun[]>(MOCK_HISTORY_RUNS);
  const [activeRun, setActiveRun] = useState<ResearchRun | null>(COMPLETED_HEALTHCARE_RUN);

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [liveAgents, setLiveAgents] = useState<AgentInfo[]>(INITIAL_AGENTS_TEMPLATE);
  const [liveEvents, setLiveEvents] = useState<AgentTechnicalEvent[]>([]);
  const [liveSources, setLiveSources] = useState<SourceItem[]>([]);
  const [liveReportSections, setLiveReportSections] = useState<ReportSectionItem[]>([]);
  const [activeStreamingSectionIndex, setActiveStreamingSectionIndex] = useState(0);
  const [currentCost, setCurrentCost] = useState(0.012);
  const [currentTokens, setCurrentTokens] = useState(1840);
  const [isRunCompleted, setIsRunCompleted] = useState(false);

  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isImprovingPlan, setIsImprovingPlan] = useState(false);
  const [isWritingReport, setIsWritingReport] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiLogs, setAiLogs] = useState<AiActivityLogEntry[]>([]);
  const [lastAiModel, setLastAiModel] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);

  const [replayActive, setReplayActive] = useState(false);
  const [replayRunTarget, setReplayRunTarget] = useState<ResearchRun | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelledRef = useRef(false);
  const briefRef = useRef(brief);
  const planRef = useRef(activePlan);
  const planMetaRef = useRef(planMeta);
  const speedRef = useRef(simulationSpeed);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore generated research data from localStorage after mount
  useEffect(() => {
    const saved = loadResearchState();
    if (saved) {
      // Always open marketing landing first; Get Started enters the workspace.
      // Research brief/plan/history still restore so work continues after entry.
      setCurrentScreen('landing');
      setBrief(saved.brief);
      setActivePlan(saved.activePlan?.length ? saved.activePlan : HEALTHCARE_DEFAULT_PLAN);
      setPlanMeta(saved.planMeta ?? null);
      setHistoryRuns(
        Array.isArray(saved.historyRuns) && saved.historyRuns.length > 0
          ? saved.historyRuns
          : MOCK_HISTORY_RUNS
      );
      setActiveRun(saved.activeRun ?? null);
      setLiveAgents(
        Array.isArray(saved.liveAgents) && saved.liveAgents.length > 0
          ? saved.liveAgents.map((a) =>
              a.status === 'running'
                ? { ...a, status: 'warning', currentAction: 'Paused after page reload' }
                : a
            )
          : INITIAL_AGENTS_TEMPLATE
      );
      setLiveEvents(Array.isArray(saved.liveEvents) ? saved.liveEvents : []);
      setLiveSources(Array.isArray(saved.liveSources) ? saved.liveSources : []);
      setLiveReportSections(
        Array.isArray(saved.liveReportSections) ? saved.liveReportSections : []
      );
      setActiveStreamingSectionIndex(saved.activeStreamingSectionIndex || 0);
      setCurrentCost(typeof saved.currentCost === 'number' ? saved.currentCost : 0.012);
      setCurrentTokens(typeof saved.currentTokens === 'number' ? saved.currentTokens : 1840);
      setElapsedSeconds(typeof saved.elapsedSeconds === 'number' ? saved.elapsedSeconds : 0);
      setSimulationProgress(
        typeof saved.simulationProgress === 'number' ? saved.simulationProgress : 0
      );
      setIsRunCompleted(Boolean(saved.isRunCompleted));
      setIsSimulating(false);
      setAiLogs(Array.isArray(saved.aiLogs) ? saved.aiLogs : []);
      setLastAiModel(saved.lastAiModel ?? null);

      if (saved.wasSimulating && !saved.isRunCompleted) {
        setAiStatusMessage('Session restored from local storage. Previous run was paused.');
      }
    }
    setStorageReady(true);
  }, []);

  // Persist workspace whenever important state changes
  useEffect(() => {
    if (!storageReady) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveResearchState({
        currentScreen: resolveAppScreen(currentScreen),
        brief,
        activePlan,
        planMeta,
        historyRuns,
        activeRun,
        liveAgents,
        liveEvents,
        liveSources,
        liveReportSections,
        activeStreamingSectionIndex,
        currentCost,
        currentTokens,
        elapsedSeconds,
        simulationProgress,
        isRunCompleted,
        wasSimulating: isSimulating,
        aiLogs,
        lastAiModel,
      });
    }, 250);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [
    storageReady,
    currentScreen,
    brief,
    activePlan,
    planMeta,
    historyRuns,
    activeRun,
    liveAgents,
    liveEvents,
    liveSources,
    liveReportSections,
    activeStreamingSectionIndex,
    currentCost,
    currentTokens,
    elapsedSeconds,
    simulationProgress,
    isRunCompleted,
    isSimulating,
    aiLogs,
    lastAiModel,
  ]);

  useEffect(() => {
    briefRef.current = brief;
  }, [brief]);

  useEffect(() => {
    planRef.current = activePlan;
  }, [activePlan]);

  useEffect(() => {
    planMetaRef.current = planMeta;
  }, [planMeta]);

  useEffect(() => {
    speedRef.current = simulationSpeed;
  }, [simulationSpeed]);

  const clearAiError = useCallback(() => setAiError(null), []);
  const clearAiLogs = useCallback(() => setAiLogs([]), []);

  const pushAiLog = useCallback(
    (
      entry: Omit<AiActivityLogEntry, 'id' | 'at'> & {
        id?: string;
        at?: string;
      }
    ) => {
      const next: AiActivityLogEntry = {
        id: entry.id || `ai-log-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        at: entry.at || new Date().toISOString(),
        operation: entry.operation,
        status: entry.status,
        requestedModel: entry.requestedModel,
        model: entry.model,
        durationMs: entry.durationMs,
        message: entry.message,
        preview: entry.preview,
      };
      setAiLogs((prev) => [next, ...prev].slice(0, 40));
      if (entry.model) setLastAiModel(entry.model);
      console.info('[ResearchFlow AI][ui]', next);
    },
    []
  );

  const recordAiMeta = useCallback(
    (meta?: AiCallMeta, fallbackMessage?: string) => {
      if (!meta) return;
      pushAiLog({
        operation: meta.operation,
        status: meta.ok ? 'success' : 'error',
        requestedModel: meta.requestedModel,
        model: meta.model,
        durationMs: meta.durationMs,
        message: meta.message || fallbackMessage || `${meta.operation} completed`,
        preview: meta.preview,
      });
    },
    [pushAiLog]
  );

  const stopTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const applyPlan = useCallback((plan: ResearchPlan) => {
    setPlanMeta({ title: plan.title, summary: plan.summary });
    setActivePlan(planToUiSections(plan));
  }, []);

  const generatePlan = useCallback(async () => {
    const currentBrief = briefRef.current;
    if (!currentBrief.topic.trim() || isGeneratingPlan) return;

    setIsGeneratingPlan(true);
    setAiError(null);
    setAiStatusMessage('Creating your research plan...');
    pushAiLog({
      operation: 'plan',
      status: 'started',
      message: 'Planner Agent started — requesting OpenRouter plan',
    });

    try {
      const { plan, meta } = await requestResearchPlan({
        topic: currentBrief.topic.trim(),
        depth: currentBrief.depth,
        audience: currentBrief.audience,
        tone: currentBrief.tone,
        targetLength: currentBrief.targetLength,
        preferredSources: currentBrief.preferredSources,
      });

      recordAiMeta(meta, `Plan generated (${plan.sections.length} sections)`);
      applyPlan(plan);
      setCurrentScreen('plan');
      setAiStatusMessage(
        meta?.model
          ? `Plan ready · model: ${meta.model}`
          : 'Plan ready'
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to generate the research plan. Please try again.';
      setAiError(message);
      pushAiLog({
        operation: 'plan',
        status: 'error',
        message,
      });
      setAiStatusMessage(null);
    } finally {
      setIsGeneratingPlan(false);
    }
  }, [applyPlan, isGeneratingPlan, pushAiLog, recordAiMeta]);

  const improvePlan = useCallback(
    async (action: PlanImproveAction) => {
      const currentBrief = briefRef.current;
      const sections = planRef.current;
      if (!sections.length || isImprovingPlan || isGeneratingPlan) return;

      setIsImprovingPlan(true);
      setAiError(null);
      setAiStatusMessage('Improving your research plan...');
      pushAiLog({
        operation: 'improve-plan',
        status: 'started',
        message: `Improving plan (${action})`,
      });

      try {
        const currentPlan = uiSectionsToPlan(
          sections,
          planMetaRef.current?.title || currentBrief.topic,
          planMetaRef.current?.summary
        );

        const { plan, meta } = await requestImprovedPlan({
          topic: currentBrief.topic.trim(),
          depth: currentBrief.depth,
          action,
          plan: currentPlan,
          audience: currentBrief.audience,
          tone: currentBrief.tone,
          targetLength: currentBrief.targetLength,
          preferredSources: currentBrief.preferredSources,
        });

        recordAiMeta(meta, 'Plan improved successfully');
        applyPlan(plan);
        setAiStatusMessage(
          meta?.model ? `Plan updated · model: ${meta.model}` : 'Plan updated'
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unable to improve the research plan. Please try again.';
        setAiError(message);
        pushAiLog({
          operation: 'improve-plan',
          status: 'error',
          message,
        });
        setAiStatusMessage(null);
      } finally {
        setIsImprovingPlan(false);
      }
    },
    [applyPlan, isGeneratingPlan, isImprovingPlan, pushAiLog, recordAiMeta]
  );

  const finishCompletedRun = useCallback(
    (input: {
      sections: ReportSectionItem[];
      sources: SourceItem[];
      durationSec: number;
      totalCost: number;
      totalTokens: number;
      events: AgentTechnicalEvent[];
      agents: AgentInfo[];
    }) => {
      stopTimers();
      const currentBrief = briefRef.current;
      const plan = planRef.current;

      const completedAgents = input.agents.map((a) => ({
        ...a,
        status: 'completed' as const,
        currentAction:
          a.roleCategory === 'writer'
            ? 'All sections synthesized'
            : a.roleCategory === 'verifier'
              ? 'Verification complete'
              : a.roleCategory === 'researcher'
                ? 'Target sources indexed'
                : 'Research plan finalized',
      }));

      const newCompletedRun: ResearchRun = {
        id: `run-${Date.now().toString(36)}`,
        topic: currentBrief.topic,
        depth: currentBrief.depth,
        audience: currentBrief.audience,
        tone: currentBrief.tone,
        targetLength: currentBrief.targetLength,
        preferredSources: currentBrief.preferredSources,
        status: 'completed',
        createdAt: 'Just now',
        durationFormatted: `${Math.floor(input.durationSec / 60)}m ${input.durationSec % 60}s`,
        totalDurationSec: input.durationSec,
        totalCost: Number(input.totalCost.toFixed(4)),
        totalTokens: input.totalTokens,
        sectionsCount: plan.length,
        sourcesCount: input.sources.length,
        plan,
        agents: completedAgents,
        events: input.events,
        sources: input.sources,
        reportSections: input.sections,
      };

      setActiveRun(newCompletedRun);
      setHistoryRuns((prev) => [newCompletedRun, ...prev.filter((r) => r.id !== newCompletedRun.id)]);
      setLiveAgents(completedAgents);
      setIsSimulating(false);
      setIsRunCompleted(true);
      setIsWritingReport(false);
      setSimulationProgress(100);
      setAiStatusMessage(null);

      try {
        import('canvas-confetti').then((confettiModule) => {
          confettiModule.default({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        });
      } catch {
        // ignore
      }
    },
    [stopTimers]
  );

  const runHybridLiveResearch = useCallback(async () => {
    cancelledRef.current = false;
    const currentBrief = briefRef.current;
    const plan = planRef.current;
    const startedAt = Date.now();

    let usageTokens = 0;
    let usageCost = 0;
    const collectedEvents: AgentTechnicalEvent[] = [];
    let eventSeq = 0;

    const applyUsage = (meta: AiCallMeta | undefined, agentIds: string[]) => {
      const { tokens, cost } = usageFromMeta(meta);
      if (tokens === 0 && cost === 0) return;
      usageTokens += tokens;
      usageCost += cost;
      setCurrentTokens(usageTokens);
      setCurrentCost(Number(usageCost.toFixed(4)));
      if (agentIds.length && (tokens > 0 || cost > 0)) {
        const shareTokens = Math.floor(tokens / agentIds.length);
        const shareCost = cost / agentIds.length;
        setLiveAgents((agents) =>
          agents.map((a) =>
            agentIds.includes(a.id)
              ? {
                  ...a,
                  tokens: a.tokens + shareTokens,
                  cost: Number((a.cost + shareCost).toFixed(4)),
                }
              : a
          )
        );
      }
    };

    const pushLiveEvent = (
      event: Omit<AgentTechnicalEvent, 'id' | 'timestamp'> & {
        id?: string;
        timestamp?: string;
      }
    ) => {
      eventSeq += 1;
      const next: AgentTechnicalEvent = {
        ...event,
        id:
          event.id ||
          `evt-${Date.now().toString(36)}-${eventSeq}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: event.timestamp || nowClock(),
      };
      collectedEvents.unshift(next);
      setLiveEvents([...collectedEvents]);
      return next;
    };

    try {
      setAiStatusMessage('Research agents gathering sources via OpenRouter...');
      setSimulationProgress(6);
      setLiveAgents((agents) =>
        agents.map((a) => {
          if (a.id === 'planner-01') {
            return { ...a, status: 'completed', currentAction: 'Research plan finalized' };
          }
          if (a.roleCategory === 'researcher') {
            return {
              ...a,
              status: 'running',
              currentAction: 'Querying knowledge sources for the approved plan...',
              elapsedSec: 1,
            };
          }
          return { ...a, status: 'pending' };
        })
      );

      pushLiveEvent({
        agentId: 'planner-01',
        agentName: 'Planner Agent',
        title: 'Approved plan handed to research agents',
        badgeType: 'plan',
        toolName: 'PlanHandoff',
        input: currentBrief.topic.slice(0, 160),
        output: `${plan.length} sections ready for evidence gathering`,
      });

      pushAiLog({
        operation: 'research',
        status: 'started',
        message: 'Research Agent started — requesting OpenRouter research bundle',
      });

      const researchResult = await requestResearchBundle({
        topic: currentBrief.topic,
        depth: currentBrief.depth,
        planSections: plan.map((s) => ({
          id: s.id,
          title: s.title,
          subQuestions: s.subQuestions,
        })),
        audience: currentBrief.audience,
        tone: currentBrief.tone,
        preferredSources: currentBrief.preferredSources,
      });

      if (cancelledRef.current) return;

      const { research, meta: researchMeta } = researchResult;
      recordAiMeta(researchMeta, 'Research bundle generated');
      applyUsage(researchMeta, [
        'researcher-alpha',
        'researcher-beta',
        'researcher-gamma',
        'researcher-delta',
      ]);

      setSimulationProgress(20);
      setAiStatusMessage(`Indexing ${research.sources.length} AI research sources...`);

      setLiveSources([]);
      for (let i = 0; i < research.sources.length; i++) {
        if (cancelledRef.current) return;
        setLiveSources(research.sources.slice(0, i + 1));
        setSimulationProgress(20 + Math.round(((i + 1) / research.sources.length) * 18));
        await sleep(180);
      }

      for (const draft of research.events) {
        if (cancelledRef.current) return;
        pushLiveEvent({
          agentId: draft.agentId,
          agentName: draft.agentName,
          title: draft.title,
          badgeType: draft.badgeType,
          toolName: draft.toolName,
          input: draft.input,
          output: draft.output,
          tokens: draft.tokens,
          durationSec: researchMeta?.durationMs
            ? Number(
                (
                  researchMeta.durationMs /
                  1000 /
                  Math.max(research.events.length, 1)
                ).toFixed(1)
              )
            : undefined,
        });
        await sleep(120);
      }

      setLiveAgents((agents) =>
        agents.map((a) => {
          const update = research.agentUpdates.find((u) => u.agentId === a.id);
          if (a.roleCategory === 'researcher') {
            return {
              ...a,
              status: 'completed',
              currentAction: update?.currentAction || 'Target sources indexed',
              sourcesCount: update?.sourcesCount ?? Math.ceil(research.sources.length / 4),
              findingsCount:
                update?.findingsCount ?? Math.ceil(research.findings.length / 4),
            };
          }
          if (a.id === 'writer-01') {
            return {
              ...a,
              status: 'running',
              currentAction: 'Preparing section drafts from AI findings...',
            };
          }
          return a;
        })
      );

      setSimulationProgress(42);
      if (cancelledRef.current) return;

      setIsWritingReport(true);
      const findings = research.findings.length
        ? research.findings
        : research.sources.map((s) => `${s.name}: ${s.snippet}`);
      const sourcePayload = compactSources(research.sources);
      const generatedSections: ReportSectionItem[] = [];

      for (let i = 0; i < plan.length; i++) {
        if (cancelledRef.current) return;
        const section = plan[i];
        const orderNumber = section.orderNumber || String(i + 1).padStart(2, '0');

        setActiveStreamingSectionIndex(i);
        setAiStatusMessage(`Writing section ${i + 1}/${plan.length}: ${section.title}`);
        setLiveAgents((agents) =>
          agents.map((a) =>
            a.id === 'writer-01'
              ? {
                  ...a,
                  status: 'running',
                  currentAction: `Writing section ${orderNumber}: ${section.title}`,
                }
              : a.id === 'verifier-01'
                ? { ...a, status: 'pending', currentAction: 'Waiting for next draft' }
                : a
          )
        );
        pushLiveEvent({
          agentId: 'writer-01',
          agentName: 'Writer Agent',
          title: `Writing section ${orderNumber}: ${section.title}`,
          badgeType: 'write',
          toolName: 'OpenRouterWriter',
          input: section.subQuestions.slice(0, 3).join(' | ') || section.title,
        });
        setSimulationProgress(45 + Math.round((i / Math.max(plan.length, 1)) * 40));

        const writtenResult = await requestWrittenSection({
          topic: currentBrief.topic,
          sectionTitle: section.title,
          sectionId: section.id,
          orderNumber,
          subQuestions: section.subQuestions,
          findings,
          sources: sourcePayload,
          audience: currentBrief.audience,
          tone: currentBrief.tone,
          targetLength: currentBrief.targetLength,
        });
        const written = writtenResult.section;
        recordAiMeta(
          writtenResult.meta,
          `Wrote section ${orderNumber}: ${written.sectionTitle}`
        );
        applyUsage(writtenResult.meta, ['writer-01']);

        if (cancelledRef.current) return;

        setAiStatusMessage(`Verifying claims for: ${section.title}`);
        setLiveAgents((agents) =>
          agents.map((a) => {
            if (a.id === 'verifier-01') {
              return {
                ...a,
                status: 'running',
                currentAction: `Fact-checking section ${orderNumber}`,
              };
            }
            return a;
          })
        );
        pushLiveEvent({
          agentId: 'verifier-01',
          agentName: 'Verifier Agent',
          title: `Verifying section ${orderNumber}: ${section.title}`,
          badgeType: 'verify',
          toolName: 'OpenRouterVerifier',
          input: written.sectionTitle,
        });

        let verification;
        try {
          const verifyResult = await requestVerification({
            topic: currentBrief.topic,
            sectionTitle: written.sectionTitle,
            content: written.content,
            findings,
            sources: sourcePayload,
          });
          verification = verifyResult.verification;
          recordAiMeta(
            verifyResult.meta,
            `Verified section ${orderNumber} (${verification.confidence})`
          );
          applyUsage(verifyResult.meta, ['verifier-01']);
        } catch {
          verification = {
            confidence: 'medium' as const,
            verifiedClaims: written.keyPoints.slice(0, 3),
            unverifiedClaims: [],
            warnings: ['Verification partially unavailable for this section.'],
            suggestions: [],
          };
          pushAiLog({
            operation: 'verify',
            status: 'error',
            message: `Verification fallback used for section ${orderNumber}`,
          });
        }

        if (cancelledRef.current) return;

        const reportItem = writtenSectionToReportItem({
          id: section.id,
          orderNumber,
          written,
          verification,
          supportingSourceIds: research.sources
            .slice(0, Math.min(4, research.sources.length))
            .map((s) => s.id),
        });

        generatedSections.push(reportItem);
        setLiveReportSections([...generatedSections]);
      }

      if (cancelledRef.current) return;

      pushLiveEvent({
        agentId: 'writer-01',
        agentName: 'Writer Agent',
        title: 'All report sections synthesized',
        badgeType: 'write',
        toolName: 'OpenRouterWriter',
        output: `${generatedSections.length} sections complete`,
      });
      pushLiveEvent({
        agentId: 'verifier-01',
        agentName: 'Verifier Agent',
        title: 'Final verification pass complete',
        badgeType: 'verify',
        toolName: 'OpenRouterVerifier',
        output: 'Claims reviewed against AI research findings',
      });

      let finalAgents: AgentInfo[] = [];
      setLiveAgents((agents) => {
        finalAgents = agents.map((a) => ({
          ...a,
          status: 'completed' as const,
          currentAction:
            a.id === 'writer-01'
              ? 'All sections synthesized'
              : a.id === 'verifier-01'
                ? 'Verification complete'
                : a.currentAction,
        }));
        return finalAgents;
      });

      const durationSec = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
      finishCompletedRun({
        sections: generatedSections,
        sources: research.sources,
        durationSec,
        totalCost: usageCost,
        totalTokens: usageTokens,
        events: collectedEvents,
        agents: finalAgents.length ? finalAgents : createFreshLiveAgents(),
      });
    } catch (error) {
      if (cancelledRef.current) return;
      setIsSimulating(false);
      setIsWritingReport(false);
      setAiStatusMessage(null);
      setAiError(
        error instanceof Error
          ? error.message
          : 'Unable to generate the research report. Please try again.'
      );
      setLiveAgents((agents) =>
        agents.map((a) =>
          a.status === 'running'
            ? { ...a, status: 'failed', currentAction: 'Generation interrupted' }
            : a
        )
      );
    }
  }, [finishCompletedRun, pushAiLog, recordAiMeta]);

  const approveAndStartResearch = useCallback(() => {
    stopTimers();
    cancelledRef.current = false;
    setAiError(null);
    setIsSimulating(true);
    setSimulationProgress(3);
    setElapsedSeconds(0);
    setIsRunCompleted(false);
    setCurrentCost(0);
    setCurrentTokens(0);
    setLiveReportSections([]);
    setActiveStreamingSectionIndex(0);
    setLiveSources([]);
    setLiveEvents([]);
    setLiveAgents(createFreshLiveAgents());
    setCurrentScreen('live');

    // Wall-clock timer only — cost/tokens come from real OpenRouter usage.
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
      setLiveAgents((agents) =>
        agents.map((a) =>
          a.status === 'running' ? { ...a, elapsedSec: a.elapsedSec + 1 } : a
        )
      );
    }, 1000);

    void runHybridLiveResearch();
  }, [runHybridLiveResearch, stopTimers]);

  const retryResearch = useCallback(() => {
    if (isSimulating || isWritingReport) return;
    pushAiLog({
      operation: 'write',
      status: 'started',
      message: 'Retry requested — restarting research generation',
    });
    approveAndStartResearch();
  }, [approveAndStartResearch, isSimulating, isWritingReport, pushAiLog]);

  const cancelResearch = useCallback(() => {
    cancelledRef.current = true;
    stopTimers();
    setIsSimulating(false);
    setIsWritingReport(false);
    setAiStatusMessage(null);
    setLiveAgents((agents) =>
      agents.map((a) =>
        a.status === 'running' ? { ...a, status: 'warning', currentAction: 'Cancelled by user' } : a
      )
    );
  }, [stopTimers]);

  const fastForwardComplete = useCallback(() => {
    cancelledRef.current = true;
    stopTimers();
    setIsSimulating(false);
    setIsWritingReport(false);
    setIsRunCompleted(true);
    setSimulationProgress(100);
    setElapsedSeconds(42);
    setCurrentCost(0.18);
    setCurrentTokens(14850);
    setAiStatusMessage(null);
    setAiError(null);
    setLiveAgents(
      INITIAL_AGENTS_TEMPLATE.map((a) => ({
        ...a,
        status: 'completed',
        currentAction: 'Verification complete',
      }))
    );
    setLiveEvents(
      MOCK_LIVE_EVENTS.map((event, index) => ({
        ...event,
        id: `${event.id}-sample-${index}`,
      }))
    );
    setLiveSources(MOCK_SOURCES);
    setLiveReportSections(HEALTHCARE_REPORT_SECTIONS);

    const fullRun: ResearchRun = {
      id: `run-${Date.now().toString(36)}`,
      topic: briefRef.current.topic,
      depth: briefRef.current.depth,
      audience: briefRef.current.audience,
      tone: briefRef.current.tone,
      targetLength: briefRef.current.targetLength,
      preferredSources: briefRef.current.preferredSources,
      status: 'completed',
      createdAt: 'Just now',
      durationFormatted: '0m 42s',
      totalDurationSec: 42,
      totalCost: 0.18,
      totalTokens: 14850,
      sectionsCount: planRef.current.length,
      sourcesCount: MOCK_SOURCES.length,
      plan: planRef.current,
      agents: INITIAL_AGENTS_TEMPLATE.map((a) => ({ ...a, status: 'completed' })),
      events: MOCK_LIVE_EVENTS,
      sources: MOCK_SOURCES,
      reportSections: HEALTHCARE_REPORT_SECTIONS,
    };

    setActiveRun(fullRun);
    setHistoryRuns((prev) => [fullRun, ...prev]);
    setCurrentScreen('report');
  }, [stopTimers]);

  const regenerateReportSection = useCallback(async (sectionId: string) => {
    const run = activeRun;
    if (!run) return;

    const section = run.reportSections.find((s) => s.id === sectionId);
    const planSection =
      run.plan.find((s) => s.id === sectionId) ||
      run.plan.find((s) => s.title === section?.title);

    if (!section) return;

    setIsWritingReport(true);
    setAiError(null);
    setAiStatusMessage(`Rewriting section: ${section.title}`);
    pushAiLog({
      operation: 'write',
      status: 'started',
      message: `Regenerating section: ${section.title}`,
    });

    try {
      const findings = run.sources.map((s) => `${s.name}: ${s.snippet}`);
      const writtenResult = await requestWrittenSection({
        topic: run.topic,
        sectionTitle: section.title,
        sectionId: section.id,
        orderNumber: section.orderNumber,
        subQuestions: planSection?.subQuestions ?? [],
        findings,
        sources: compactSources(run.sources),
        audience: run.audience,
        tone: run.tone,
        targetLength: run.targetLength,
      });
      const written = writtenResult.section;
      recordAiMeta(writtenResult.meta, `Rewrote section: ${written.sectionTitle}`);

      setAiStatusMessage('Verifying claims...');
      let verification;
      try {
        const verifyResult = await requestVerification({
          topic: run.topic,
          sectionTitle: written.sectionTitle,
          content: written.content,
          findings,
          sources: compactSources(run.sources),
        });
        verification = verifyResult.verification;
        recordAiMeta(verifyResult.meta, `Re-verified section: ${written.sectionTitle}`);
      } catch {
        verification = undefined;
        pushAiLog({
          operation: 'verify',
          status: 'error',
          message: 'Verification unavailable during regenerate',
        });
      }

      const updated = writtenSectionToReportItem({
        id: section.id,
        orderNumber: section.orderNumber,
        written,
        verification,
        supportingSourceIds: section.supportingSourceIds,
      });

      const nextSections = run.reportSections.map((s) => (s.id === sectionId ? updated : s));
      const nextRun = { ...run, reportSections: nextSections };
      setActiveRun(nextRun);
      setHistoryRuns((prev) => prev.map((r) => (r.id === run.id ? nextRun : r)));
      setLiveReportSections(nextSections);
      setAiStatusMessage(
        writtenResult.meta?.model
          ? `Section regenerated · model: ${writtenResult.meta.model}`
          : 'Section regenerated'
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to regenerate this section. Please try again.';
      setAiError(message);
      pushAiLog({
        operation: 'write',
        status: 'error',
        message,
      });
      setAiStatusMessage(null);
    } finally {
      setIsWritingReport(false);
    }
  }, [activeRun, pushAiLog, recordAiMeta]);

  const viewReport = useCallback((run?: ResearchRun) => {
    if (run) setActiveRun(run);
    setCurrentScreen('report');
  }, []);

  const startReplay = useCallback((run: ResearchRun) => {
    setReplayRunTarget(run);
    setReplayActive(true);
  }, []);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      stopTimers();
    };
  }, [stopTimers]);

  return (
    <ResearchContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        brief,
        setBrief,
        activePlan,
        setActivePlan,
        planMeta,
        historyRuns,
        activeRun,
        setActiveRun,
        isSimulating,
        simulationProgress,
        simulationSpeed,
        setSimulationSpeed,
        elapsedSeconds,
        liveAgents,
        liveEvents,
        liveSources,
        liveReportSections,
        activeStreamingSectionIndex,
        currentCost,
        currentTokens,
        isRunCompleted,
        isGeneratingPlan,
        isImprovingPlan,
        isWritingReport,
        aiStatusMessage,
        aiError,
        aiLogs,
        lastAiModel,
        storageReady,
        clearAiError,
        clearAiLogs,
        generatePlan,
        improvePlan,
        approveAndStartResearch,
        retryResearch,
        cancelResearch,
        fastForwardComplete,
        regenerateReportSection,
        viewReport,
        startReplay,
        replayActive,
        setReplayActive,
        replayRunTarget,
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
};

export const useResearch = () => {
  const context = useContext(ResearchContext);
  if (!context) {
    throw new Error('useResearch must be used within a ResearchProvider');
  }
  return context;
};

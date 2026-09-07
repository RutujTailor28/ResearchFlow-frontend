'use client';

import React from 'react';
import {
  Compass,
  Search,
  BookOpen,
  PenTool,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Clock,
  Coins,
} from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';
import type { AgentInfo, AgentStatus } from '../../types';
import { cn } from '../../lib/utils';

type SpecMeta = {
  liveId: string;
  title: string;
  icon: typeof Compass;
  color: string;
  capabilities: string[];
  tools: string[];
  aiOps?: Array<'plan' | 'improve-plan' | 'write' | 'verify'>;
};

const AGENT_SPECS: SpecMeta[] = [
  {
    liveId: 'planner-01',
    title: 'Domain Ontology & Deconstruction Specialist',
    icon: Compass,
    color: 'bg-[#1B61EB]',
    capabilities: [
      'Semantic query deconstruction',
      'Multi-vector research path generation',
      'Dependency DAG mapping',
      'Section scope boundary setting',
    ],
    tools: ['OpenRouter Planner', 'PlanDecomposer', 'ScopeValidator'],
    aiOps: ['plan', 'improve-plan'],
  },
  {
    liveId: 'researcher-alpha',
    title: 'Clinical Trials & Peer-Reviewed Literature',
    icon: Search,
    color: 'bg-[#7AA5A7]',
    capabilities: [
      'Literature & trial discovery',
      'Source quality scoring',
      'Finding extraction',
      'Cross-document triangulation',
    ],
    tools: ['Mock Source Index', 'FindingSynthesizer', 'WebSearchAPI'],
  },
  {
    liveId: 'researcher-beta',
    title: 'Hospital Operations & EHR Systems',
    icon: BookOpen,
    color: 'bg-[#86B0FF]',
    capabilities: [
      'Operational workflow analysis',
      'Document extraction',
      'Economic metric normalization',
      'Implementation case mining',
    ],
    tools: ['Mock Source Index', 'DocumentExtractor', 'EconomicModeler'],
  },
  {
    liveId: 'researcher-gamma',
    title: 'Technology & Algorithm Benchmarks',
    icon: Search,
    color: 'bg-[#1B61EB]',
    capabilities: [
      'Model architecture review',
      'Benchmark paper indexing',
      'Technical trade-off analysis',
      'Capability horizon mapping',
    ],
    tools: ['Mock Source Index', 'ArXivIndexReader', 'TechBenchmarkParser'],
  },
  {
    liveId: 'researcher-delta',
    title: 'Regulatory Pipelines & Governance',
    icon: Search,
    color: 'bg-[#7AA5A7]',
    capabilities: [
      'Regulatory clearance tracking',
      'Privacy / compliance audits',
      'Policy discrepancy detection',
      'Governance checklist drafting',
    ],
    tools: ['Mock Source Index', 'FDADatabaseQuery', 'RegulatoryParser'],
  },
  {
    liveId: 'writer-01',
    title: 'Structural Continuity & Analytical Synthesis',
    icon: PenTool,
    color: 'bg-[#24343B]',
    capabilities: [
      'Section-by-section synthesis',
      'Inline citation anchoring',
      'Audience / tone adaptation',
      'Key-point extraction',
    ],
    tools: ['OpenRouter Writer', 'ReportComposer', 'CitationMapper'],
    aiOps: ['write'],
  },
  {
    liveId: 'verifier-01',
    title: 'Hallucination Elimination & Cross-Audit',
    icon: ShieldCheck,
    color: 'bg-[#1B61EB]',
    capabilities: [
      'Claim-to-source audit',
      'Contradiction isolation',
      'Confidence scoring',
      'Unsupported claim warnings',
    ],
    tools: ['OpenRouter Verifier', 'ClaimVerificationEngine', 'ConfidenceScorer'],
    aiOps: ['verify'],
  },
];

function statusStyles(status: AgentStatus) {
  switch (status) {
    case 'running':
      return 'text-[#1B61EB] bg-[#F2FAFF] border-[#86B0FF]';
    case 'completed':
      return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    case 'failed':
      return 'text-rose-700 bg-rose-50 border-rose-200';
    case 'warning':
      return 'text-amber-700 bg-amber-50 border-amber-200';
    case 'retrying':
      return 'text-[#1B61EB] bg-[#F2FAFF] border-[#86B0FF]';
    default:
      return 'text-[#53616A] bg-[#F2FAFF] border-[#D5D9DC]';
  }
}

function StatusIcon({ status }: { status: AgentStatus }) {
  if (status === 'running' || status === 'retrying') {
    return <Loader2 className="w-3 h-3 animate-spin" />;
  }
  if (status === 'completed') {
    return <CheckCircle2 className="w-3 h-3" />;
  }
  if (status === 'failed' || status === 'warning') {
    return <AlertCircle className="w-3 h-3" />;
  }
  return <Clock className="w-3 h-3" />;
}

function formatElapsed(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export const AgentsOverviewView: React.FC = () => {
  const {
    liveAgents,
    liveEvents,
    isSimulating,
    isRunCompleted,
    aiLogs,
    lastAiModel,
    currentTokens,
    currentCost,
  } = useResearch();

  const runningCount = liveAgents.filter((a) => a.status === 'running').length;
  const completedCount = liveAgents.filter((a) => a.status === 'completed').length;

  const resolveAgent = (liveId: string): AgentInfo | undefined =>
    liveAgents.find((a) => a.id === liveId);

  const recentForAgent = (liveId: string, aiOps?: SpecMeta['aiOps']) => {
    const seen = new Set<string>();

    const eventHits = liveEvents
      .filter((e) => e.agentId === liveId)
      .filter((e) => {
        if (seen.has(e.id)) return false;
        seen.add(e.id);
        return true;
      })
      .slice(0, 3)
      .map((e, index) => ({
        id: `event-${liveId}-${e.id}-${index}`,
        label: e.title,
        at: e.timestamp,
        kind: 'event' as const,
      }));

    const logHits = aiLogs
      .filter((l) =>
        aiOps
          ? aiOps.includes(l.operation as 'plan' | 'improve-plan' | 'write' | 'verify')
          : false
      )
      .slice(0, 3)
      .map((l, index) => ({
        id: `ai-${liveId}-${l.id}-${index}`,
        label: l.message,
        at: new Date(l.at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        kind: 'ai' as const,
        model: l.model,
        status: l.status,
      }));

    return [...logHits, ...eventHits].slice(0, 4);
  };

  const swarmLabel = isSimulating
    ? 'Active Run In Progress'
    : isRunCompleted
      ? 'Last Run Completed'
      : 'All Ready (Standby)';

  return (
    <div className="w-full py-6 sm:py-8 px-4 sm:px-6 lg:px-8 xl:px-10 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F2FAFF] border border-[#86B0FF] text-[#1B61EB] text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            {liveAgents.length} Agents · Live Activity
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F2027]">
            Research Agent Swarm Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#53616A] mt-1">
            Live status, current actions, and OpenRouter AI calls for each agent in the active research run.
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#D5D9DC] shadow-2xs text-xs">
            <span className="text-[#53616A]">Swarm Status:</span>
            {isSimulating ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#1B61EB] bg-[#F2FAFF] px-2 py-0.5 rounded-full border border-[#86B0FF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1B61EB] animate-pulse" />
                {swarmLabel}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                {swarmLabel}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-[#53616A]">
            <span className="font-mono bg-white border border-[#D5D9DC] px-2 py-1 rounded-md">
              running {runningCount}
            </span>
            <span className="font-mono bg-white border border-[#D5D9DC] px-2 py-1 rounded-md">
              completed {completedCount}/{liveAgents.length}
            </span>
            {lastAiModel && (
              <span className="font-mono bg-[#F2FAFF] border border-[#86B0FF] text-[#1B61EB] px-2 py-1 rounded-md truncate max-w-[220px]">
                model: {lastAiModel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Live telemetry strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-white border border-[#D5D9DC] text-xs">
          <span className="text-[10px] text-[#7D878D] uppercase tracking-wider block mb-1">
            Active Agents
          </span>
          <span className="font-mono text-lg font-semibold text-[#0F2027]">{runningCount}</span>
        </div>
        <div className="p-3 rounded-xl bg-white border border-[#D5D9DC] text-xs">
          <span className="text-[10px] text-[#7D878D] uppercase tracking-wider block mb-1">
            Timeline Events
          </span>
          <span className="font-mono text-lg font-semibold text-[#0F2027]">{liveEvents.length}</span>
        </div>
        <div className="p-3 rounded-xl bg-white border border-[#D5D9DC] text-xs">
          <span className="text-[10px] text-[#7D878D] uppercase tracking-wider block mb-1">
            Tokens (session)
          </span>
          <span className="font-mono text-lg font-semibold text-[#0F2027]">
            {currentTokens.toLocaleString()}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-white border border-[#D5D9DC] text-xs">
          <span className="text-[10px] text-[#7D878D] uppercase tracking-wider block mb-1">
            Est. Cost
          </span>
          <span className="font-mono text-lg font-semibold text-[#1B61EB]">
            ${currentCost.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Grid of live agent cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {AGENT_SPECS.map((spec) => {
          const Icon = spec.icon;
          const live = resolveAgent(spec.liveId);
          const status = live?.status ?? 'pending';
          const activity = recentForAgent(spec.liveId, spec.aiOps);
          const relatedAi = aiLogs.find(
            (l) =>
              l.status === 'success' &&
              spec.aiOps?.includes(l.operation as 'plan' | 'improve-plan' | 'write' | 'verify') &&
              l.model
          );

          return (
            <div
              key={spec.liveId}
              className="p-4 sm:p-5 rounded-2xl border border-[#D5D9DC] bg-white hover:border-[#86B0FF] shadow-2xs hover:shadow-xs transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl ${spec.color} text-white flex items-center justify-center shrink-0 shadow-xs`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#0F2027] leading-snug">
                      {live?.name || spec.liveId}
                    </h3>
                    <p className="text-xs text-[#53616A] line-clamp-2">
                      {live?.roleTitle || spec.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="font-mono text-[10px] bg-[#F2FAFF] text-[#53616A] border border-[#D5D9DC] px-1.5 py-0.5 rounded">
                        {relatedAi?.model || lastAiModel || 'OpenRouter / mock tools'}
                      </span>
                      <span className="font-mono text-[10px] text-[#7D878D]">{spec.liveId}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={cn(
                    'inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-full border self-start',
                    statusStyles(status)
                  )}
                >
                  <StatusIcon status={status} />
                  {status.toUpperCase()}
                </span>
              </div>

              {/* Live current action */}
              <div className="rounded-lg bg-[#F2FAFF]/70 border border-[#D5D9DC] px-3 py-2">
                <span className="text-[10px] font-semibold text-[#7D878D] uppercase tracking-wider block mb-1">
                  Current Action
                </span>
                <p className="text-xs text-[#0F2027] leading-relaxed">
                  {live?.currentAction || 'Standing by for next research handoff.'}
                </p>
              </div>

              {/* Live metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded-lg border border-[#D5D9DC] bg-[#F2FAFF]/40">
                  <span className="text-[10px] text-[#7D878D] block">Elapsed</span>
                  <span className="font-mono font-semibold text-[#0F2027]">
                    {formatElapsed(live?.elapsedSec ?? 0)}
                  </span>
                </div>
                <div className="p-2 rounded-lg border border-[#D5D9DC] bg-[#F2FAFF]/40">
                  <span className="text-[10px] text-[#7D878D] block">Tokens</span>
                  <span className="font-mono font-semibold text-[#0F2027]">
                    {(live?.tokens ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="p-2 rounded-lg border border-[#D5D9DC] bg-[#F2FAFF]/40">
                  <span className="text-[10px] text-[#7D878D] flex items-center gap-1">
                    <Coins className="w-3 h-3" /> Cost
                  </span>
                  <span className="font-mono font-semibold text-[#1B61EB]">
                    ${(live?.cost ?? 0).toFixed(3)}
                  </span>
                </div>
                <div className="p-2 rounded-lg border border-[#D5D9DC] bg-[#F2FAFF]/40">
                  <span className="text-[10px] text-[#7D878D] block">Findings / Sources</span>
                  <span className="font-mono font-semibold text-[#0F2027]">
                    {live?.findingsCount ?? 0} / {live?.sourcesCount ?? 0}
                  </span>
                </div>
              </div>

              {/* Recent real activity */}
              <div className="space-y-1.5 pt-1 border-t border-[#D5D9DC]">
                <span className="text-[10px] font-semibold text-[#7D878D] uppercase tracking-wider block">
                  Recent Activity
                </span>
                {activity.length === 0 ? (
                  <p className="text-xs text-[#7D878D]">No activity recorded yet for this agent.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {activity.map((item, index) => (
                      <li
                        key={`${item.id}-${index}`}
                        className="text-xs text-[#24343B] flex items-start gap-2"
                      >
                        <span className="font-mono text-[10px] text-[#7D878D] shrink-0 mt-0.5">
                          {item.at}
                        </span>
                        <span className="min-w-0">
                          <span className="line-clamp-2">{item.label}</span>
                          {'model' in item && item.model ? (
                            <span className="block font-mono text-[10px] text-[#1B61EB] truncate">
                              {item.model}
                            </span>
                          ) : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Capabilities (compact) */}
              <div className="space-y-1.5 pt-1 border-t border-[#D5D9DC]">
                <span className="text-[10px] font-semibold text-[#7D878D] uppercase tracking-wider block">
                  Capabilities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {spec.capabilities.slice(0, 4).map((cap) => (
                    <span
                      key={cap}
                      className="text-[10px] bg-[#F2FAFF] border border-[#D5D9DC] text-[#53616A] px-2 py-0.5 rounded-md"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[#D5D9DC]">
                {spec.tools.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] bg-white border border-[#D5D9DC] text-[#53616A] px-2 py-0.5 rounded-md"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

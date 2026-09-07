import { ResearchRun } from '../types';
import { HEALTHCARE_DEFAULT_PLAN } from './samplePlans';
import { INITIAL_AGENTS_TEMPLATE } from './agents';
import { MOCK_LIVE_EVENTS } from './agentEvents';
import { MOCK_SOURCES } from './sources';
import { HEALTHCARE_REPORT_SECTIONS } from './sampleReports';

export const COMPLETED_HEALTHCARE_RUN: ResearchRun = {
  id: 'run-ai-health-2026',
  topic: 'How will artificial intelligence transform healthcare over the next five years?',
  depth: 'standard',
  audience: 'Technical',
  tone: 'Analytical',
  targetLength: 'Medium',
  preferredSources: ['Academic Papers', 'Official Sources', 'Industry Reports', 'Government Data'],
  status: 'completed',
  createdAt: 'September 7, 2026',
  durationFormatted: '3m 24s',
  totalDurationSec: 204,
  totalCost: 0.18,
  totalTokens: 14850,
  sectionsCount: 5,
  sourcesCount: 15,
  plan: HEALTHCARE_DEFAULT_PLAN,
  agents: INITIAL_AGENTS_TEMPLATE.map(a => ({
    ...a,
    status: 'completed',
    elapsedSec: a.id === 'planner-01' ? 12 : a.id.includes('researcher') ? 85 : 45,
    currentAction: 'Task finished successfully'
  })),
  events: MOCK_LIVE_EVENTS,
  sources: MOCK_SOURCES,
  reportSections: HEALTHCARE_REPORT_SECTIONS
};

export const MOCK_HISTORY_RUNS: ResearchRun[] = [
  COMPLETED_HEALTHCARE_RUN,
  {
    id: 'run-ev-batteries-2026',
    topic: 'Commercialization Roadmap of Solid-State Electrolyte Batteries for Automotive EV Fleets',
    depth: 'deep',
    audience: 'Executive',
    tone: 'Professional',
    targetLength: 'Long',
    preferredSources: ['Industry Reports', 'Academic Papers', 'News Publications'],
    status: 'completed',
    createdAt: 'September 5, 2026',
    durationFormatted: '6m 12s',
    totalDurationSec: 372,
    totalCost: 0.42,
    totalTokens: 32400,
    sectionsCount: 8,
    sourcesCount: 28,
    plan: [
      { id: 'ev-1', orderNumber: '01', title: 'Solid-State Chemistry Breakthroughs', subQuestions: ['Sulfide vs Oxide electrolytes', 'Anode-free silicon integration'] },
      { id: 'ev-2', orderNumber: '02', title: 'Manufacturing Scalability & Roll-to-Roll Yields', subQuestions: ['Dry electrode coating bottlenecks', 'Cleanroom tolerances'] },
      { id: 'ev-3', orderNumber: '03', title: 'OEM Automotive Commitments (Toyota, QuantumScape, CATL)', subQuestions: ['Pilot line timelines', 'Energy density benchmarks 450+ Wh/kg'] }
    ],
    agents: INITIAL_AGENTS_TEMPLATE.map(a => ({ ...a, status: 'completed' })),
    events: MOCK_LIVE_EVENTS.slice(0, 5),
    sources: MOCK_SOURCES.slice(0, 4),
    reportSections: HEALTHCARE_REPORT_SECTIONS.slice(0, 3).map(s => ({ ...s, title: `${s.title} (EV Edition)` }))
  },
  {
    id: 'run-climate-g7-2026',
    topic: 'Comparative Carbon Pricing & Cross-Border Adjustment Mechanisms across G7 Economies',
    depth: 'standard',
    audience: 'Executive',
    tone: 'Academic',
    targetLength: 'Medium',
    preferredSources: ['Government Data', 'Academic Papers', 'Official Sources'],
    status: 'failed',
    failureReason: 'Researcher agent timeout — primary source repository rate limit encountered',
    partialResults: true,
    createdAt: 'September 4, 2026',
    durationFormatted: '1m 45s',
    totalDurationSec: 105,
    totalCost: 0.09,
    totalTokens: 7850,
    sectionsCount: 4,
    sourcesCount: 8,
    plan: [
      { id: 'cl-1', orderNumber: '01', title: 'EU CBAM Phase II Enforcement Metrics', subQuestions: ['Scope 3 import penalties', 'Steel & aluminum tariffs'] },
      { id: 'cl-2', orderNumber: '02', title: 'US Clean Competition Act Reconciliation', subQuestions: ['Emissions intensity calculations'] }
    ],
    agents: INITIAL_AGENTS_TEMPLATE.map(a => a.id === 'researcher-beta' ? ({ ...a, status: 'failed', currentAction: 'Rate limit timeout on World Bank API (504)' }) : ({ ...a, status: 'completed' })),
    events: MOCK_LIVE_EVENTS.slice(0, 4),
    sources: MOCK_SOURCES.slice(0, 3),
    reportSections: HEALTHCARE_REPORT_SECTIONS.slice(0, 2)
  },
  {
    id: 'run-multiagent-enterprise',
    topic: 'Autonomous Multi-Agent Orchestration Frameworks in Enterprise Financial Auditing',
    depth: 'standard',
    audience: 'Technical',
    tone: 'Analytical',
    targetLength: 'Medium',
    preferredSources: ['Academic Papers', 'Industry Reports'],
    status: 'completed',
    createdAt: 'September 2, 2026',
    durationFormatted: '3m 10s',
    totalDurationSec: 190,
    totalCost: 0.19,
    totalTokens: 15400,
    sectionsCount: 5,
    sourcesCount: 16,
    plan: [
      { id: 'ma-1', orderNumber: '01', title: 'Architecture of Multi-Agent Consensus in Ledger Reconciliation', subQuestions: ['Byzantine fault tolerance in LLM debate'] },
      { id: 'ma-2', orderNumber: '02', title: 'Audit Trail Provenance & Regulatory Compliance', subQuestions: ['SOC2 Type II compliance with autonomous agents'] }
    ],
    agents: INITIAL_AGENTS_TEMPLATE.map(a => ({ ...a, status: 'completed' })),
    events: MOCK_LIVE_EVENTS.slice(0, 6),
    sources: MOCK_SOURCES.slice(1, 5),
    reportSections: HEALTHCARE_REPORT_SECTIONS.slice(0, 4)
  }
];

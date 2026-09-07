import React, { useState } from 'react';
import { useResearch } from '../../context/ResearchContext';
import { AgentTeamPanel } from './AgentTeamPanel';
import { ActivityTimeline } from './ActivityTimeline';
import { LiveReportStreaming } from './LiveReportStreaming';
import { LiveSourcesDrawer } from './LiveSourcesDrawer';
import { cn } from '../../lib/utils';
import { Bot, FileText, Globe, RefreshCw } from 'lucide-react';

export const LiveRunView: React.FC = () => {
  const {
    brief,
    activePlan,
    isRunCompleted,
    liveAgents,
    liveEvents,
    liveSources,
    liveReportSections,
    aiStatusMessage,
    aiError,
    lastAiModel,
    retryResearch,
    isSimulating,
    isWritingReport,
    clearAiError,
  } = useResearch();

  // Mobile/tablet layout tabs (< 1024px)
  const [mobileTab, setMobileTab] = useState<'agents' | 'report' | 'sources'>('report');
  const isRetrying = isSimulating || isWritingReport;

  return (
    <div className="flex flex-col h-full bg-[#F2FAFF] overflow-hidden">
      {(aiStatusMessage || aiError || lastAiModel) && (
        <div
          className={`shrink-0 px-4 py-2.5 text-xs border-b flex flex-wrap items-center justify-between gap-2 ${
            aiError
              ? 'bg-rose-50 border-rose-200 text-rose-700'
              : 'bg-[#F2FAFF] border-[#86B0FF] text-[#0F2027]'
          }`}
          role="status"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
            <span className="min-w-0">
              {aiError || aiStatusMessage || 'AI run in progress'}
            </span>
            {lastAiModel && (
              <span
                className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                  aiError
                    ? 'text-rose-700 bg-white border-rose-200'
                    : 'text-[#1B61EB] bg-white border-[#86B0FF]'
                }`}
              >
                model: {lastAiModel}
              </span>
            )}
          </div>

          {aiError && (
            <button
              type="button"
              id="live-ai-try-again-btn"
              onClick={() => {
                clearAiError();
                retryResearch();
              }}
              disabled={isRetrying}
              className="inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-lg bg-[#1B61EB] hover:bg-[#1551CA] text-white text-[11px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'Retrying...' : 'Try again'}</span>
            </button>
          )}
        </div>
      )}

      {/* Mobile & Tablet Tab Switcher (visible on < 1024px / < lg) */}
      <div className="lg:hidden h-12 bg-white border-b border-[#D5D9DC] px-3 sm:px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center bg-[#F2FAFF] p-1 rounded-lg text-xs font-medium w-full justify-between border border-[#D5D9DC] gap-1">
          <button
            onClick={() => setMobileTab('report')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md transition-all text-xs cursor-pointer',
              mobileTab === 'report'
                ? 'bg-[#1B61EB] text-white font-semibold shadow-2xs'
                : 'text-[#53616A] hover:text-[#0F2027]'
            )}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Report</span>
          </button>
          <button
            onClick={() => setMobileTab('agents')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md transition-all text-xs cursor-pointer',
              mobileTab === 'agents'
                ? 'bg-[#1B61EB] text-white font-semibold shadow-2xs'
                : 'text-[#53616A] hover:text-[#0F2027]'
            )}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Agents</span>
          </button>
          <button
            onClick={() => setMobileTab('sources')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md transition-all text-xs cursor-pointer',
              mobileTab === 'sources'
                ? 'bg-[#1B61EB] text-white font-semibold shadow-2xs'
                : 'text-[#53616A] hover:text-[#0F2027]'
            )}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Sources ({liveSources.length})</span>
          </button>
        </div>
      </div>

      {/* Content Layout: 3-column on >= 1024px (lg), tabbed full-width on < 1024px (< lg) */}
      <div className="flex-1 lg:grid lg:grid-cols-[280px_1fr_240px] xl:grid-cols-[300px_1fr_260px] overflow-hidden h-full">
        {/* Left: Agent Activity (Agent Team & Orchestration + Recent Events) */}
        <section
          className={cn(
            'border-r border-[#D5D9DC] bg-white overflow-hidden flex flex-col h-full',
            mobileTab !== 'agents' ? 'hidden lg:flex' : 'flex'
          )}
        >
          <div className="flex-1 overflow-y-auto min-h-0">
            <AgentTeamPanel agents={liveAgents} />
          </div>
          <div className="h-[210px] shrink-0 overflow-hidden border-t border-[#D5D9DC]">
            <ActivityTimeline events={liveEvents} />
          </div>
        </section>

        {/* Center: Report Preview */}
        <div
          className={cn(
            'h-full overflow-hidden min-w-0',
            mobileTab !== 'report' ? 'hidden lg:block' : 'block'
          )}
        >
          <LiveReportStreaming
            sections={liveReportSections}
            totalPlannedSections={activePlan.length}
            isCompleted={isRunCompleted}
            topic={brief.topic}
          />
        </div>

        {/* Right: Metadata & Sources (Sources & Evidence + Run Economics) */}
        <div
          className={cn(
            'h-full overflow-hidden min-w-0',
            mobileTab !== 'sources' ? 'hidden lg:block' : 'block'
          )}
        >
          <LiveSourcesDrawer
            sources={liveSources}
            isOpen={true}
          />
        </div>
      </div>
    </div>
  );
};

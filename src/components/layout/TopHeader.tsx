import React from 'react';
import {
  Sparkles,
  PlusCircle,
  Clock,
  Coins,
  Cpu,
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  Menu
} from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';
import { cn } from '../../lib/utils';

interface TopHeaderProps {
  onToggleMobileSidebar?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleMobileSidebar }) => {
  const {
    currentScreen,
    setCurrentScreen,
    isSimulating,
    isRunCompleted,
    elapsedSeconds,
    currentCost,
    currentTokens,
    fastForwardComplete,
    approveAndStartResearch,
    cancelResearch,
    viewReport,
    activeRun
  } = useResearch();

  const formattedTime = `${Math.floor(elapsedSeconds / 60)
    .toString()
    .padStart(2, '0')}:${(elapsedSeconds % 60).toString().padStart(2, '0')}.${(
    (elapsedSeconds * 13) % 100
  )
    .toString()
    .padStart(2, '0')}`;

  const runId = activeRun ? activeRun.id.toUpperCase().replace('RUN-', 'RF-') : 'RF-2941-X';

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'new':
        return 'Create Research Brief';
      case 'plan':
        return 'Planner Agent Review';
      case 'live':
        return 'Live Multi-Agent Orchestration';
      case 'report':
        return 'Synthesized Research Report';
      case 'history':
        return 'Research History & Runs';
      case 'agents':
        return 'Agent Cluster Architecture';
      case 'settings':
        return 'Platform Settings';
      default:
        return 'ResearchFlow';
    }
  };

  // If on Live Screen, render the Geometric Balance live header
  if (currentScreen === 'live') {
    return (
      <header className="h-[60px] sm:h-[64px] bg-white border-b border-[#D5D9DC] flex items-center justify-between px-3 sm:px-6 lg:px-8 z-20 shrink-0 gap-2">
        {/* Left: Mobile Sidebar Toggle + Status */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-1.5 rounded-lg text-[#53616A] hover:text-[#0F2027] hover:bg-[#F2FAFF] transition-colors shrink-0"
            aria-label="Open navigation menu"
            id="mobile-sidebar-toggle-live"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2 h-2 rounded-full bg-[#1B61EB] shadow-[0_0_8px_rgba(27,97,235,0.5)] shrink-0"></div>
            <span className="font-medium text-xs sm:text-sm text-[#0F2027] truncate">
              {isRunCompleted ? 'Completed' : isSimulating ? 'Running' : 'Paused'}
            </span>
          </div>

          <div className="hidden md:block h-4 w-px bg-[#D5D9DC]"></div>
          <span className="hidden md:inline font-mono text-xs text-[#7D878D] shrink-0">RUN: {runId}</span>
        </div>

        {/* Right: Metrics & Actions */}
        <div className="flex items-center gap-3 sm:gap-6 lg:gap-8 shrink-0">
          {/* Time & Cost Metrics */}
          <div className="flex items-center gap-3 sm:gap-6 text-right">
            <div className="flex flex-col items-end">
              <span className="text-[9px] sm:text-[10px] text-[#7D878D] uppercase tracking-wider font-mono">Time</span>
              <span className="font-mono text-xs sm:text-sm text-[#0F2027] font-semibold">{formattedTime}</span>
            </div>
            <div className="hidden xs:flex flex-col items-end">
              <span className="text-[9px] sm:text-[10px] text-[#7D878D] uppercase tracking-wider font-mono">Tokens</span>
              <span className="font-mono text-xs sm:text-sm text-[#0F2027]">{currentTokens.toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] sm:text-[10px] text-[#7D878D] uppercase tracking-wider font-mono">Cost</span>
              <span className="font-mono text-xs sm:text-sm text-[#1B61EB] font-bold">${currentCost.toFixed(2)}</span>
            </div>
          </div>

          {!isRunCompleted && isSimulating && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={fastForwardComplete}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border border-[#86B0FF] text-[#1B61EB] bg-[#F2FAFF] text-xs font-semibold rounded-md hover:bg-[#86B0FF]/20 transition-colors cursor-pointer"
                title="Instantly complete synthesis"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#1B61EB]" />
                <span className="hidden md:inline">Instant Demo</span>
              </button>
              <button
                onClick={cancelResearch}
                className="px-2.5 sm:px-4 py-1.5 border border-rose-200 text-rose-600 text-xs font-semibold rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          {isRunCompleted && (
            <button
              onClick={() => viewReport()}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-[#1B61EB] text-white text-xs font-semibold rounded-md hover:bg-[#1551CA] transition-colors shadow-xs cursor-pointer"
            >
              <span>View Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>
    );
  }

  // Standard Header for other screens
  return (
    <header className="h-[60px] sm:h-[64px] bg-white border-b border-[#D5D9DC] px-3 sm:px-6 lg:px-8 flex items-center justify-between z-20 shrink-0 gap-2">
      {/* Left: Hamburger + Breadcrumbs & Context Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1.5 rounded-lg text-[#53616A] hover:text-[#0F2027] hover:bg-[#F2FAFF] transition-colors shrink-0"
          aria-label="Open navigation menu"
          id="mobile-sidebar-toggle-standard"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-[#7D878D] min-w-0">
          <span className="hidden sm:inline">ResearchFlow</span>
          <span className="hidden sm:inline">/</span>
          <span className="text-[#0F2027] font-semibold truncate">{getScreenTitle()}</span>
        </div>

        {/* Live Status Pill when running in background */}
        {isSimulating && (
          <div
            onClick={() => setCurrentScreen('live')}
            className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#F2FAFF] border border-[#86B0FF] text-[#1B61EB] text-xs font-mono cursor-pointer hover:bg-[#86B0FF]/15 transition-colors shadow-2xs shrink-0"
          >
            <div className="w-2 h-2 rounded-full bg-[#1B61EB] shadow-[0_0_8px_rgba(27,97,235,0.5)]"></div>
            <span className="font-sans font-medium">Running:</span>
            <span>
              {Math.floor(elapsedSeconds / 60)
                .toString()
                .padStart(2, '0')}
              :{(elapsedSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

      {/* Right: Quick actions & utilities */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {currentScreen !== 'report' && (
          <button
            id="quick-demo-complete-btn"
            onClick={fastForwardComplete}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F2FAFF] border border-[#86B0FF] text-[#1B61EB] text-xs font-medium hover:bg-[#86B0FF]/20 transition-colors cursor-pointer"
            title="Load fully populated interactive sample report immediately"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1B61EB]" />
            <span>Load Sample Report</span>
          </button>
        )}

        {currentScreen === 'new' && (
          <button
            id="header-start-plan-btn"
            onClick={() => approveAndStartResearch()}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-md bg-[#1B61EB] text-white text-xs font-semibold hover:bg-[#1551CA] transition-colors shadow-2xs cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span><span className="hidden xs:inline">Start </span>Live Demo</span>
          </button>
        )}

        {currentScreen !== 'new' && (
          <button
            id="header-new-research-btn"
            onClick={() => setCurrentScreen('new')}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-md bg-white border border-[#D5D9DC] text-[#1B61EB] hover:bg-[#F2FAFF] text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#1B61EB]" />
            <span><span className="hidden xs:inline">New </span>Research</span>
          </button>
        )}
      </div>
    </header>
  );
};

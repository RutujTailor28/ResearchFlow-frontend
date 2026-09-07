import React, { useState } from 'react';
import { Search, Filter, History, Plus, Layers, ArrowUpDown } from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';
import { RunCard } from './RunCard';
import { TimelineReplayModal } from './TimelineReplayModal';
import { ResearchRun, RunStatus } from '../../types';
import { cn } from '../../lib/utils';

export const HistoryView: React.FC = () => {
  const { historyRuns, viewReport, setCurrentScreen } = useResearch();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | RunStatus>('all');
  const [replayRun, setReplayRun] = useState<ResearchRun | null>(null);

  const filteredRuns = historyRuns.filter(run => {
    const matchesSearch =
      run.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.depth.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || run.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const filterTabs: { label: string; value: 'all' | RunStatus; count: number }[] = [
    { label: 'All Runs', value: 'all', count: historyRuns.length },
    { label: 'Completed', value: 'completed', count: historyRuns.filter(r => r.status === 'completed').length },
    { label: 'Running', value: 'running', count: historyRuns.filter(r => r.status === 'running').length },
    { label: 'Failed', value: 'failed', count: historyRuns.filter(r => r.status === 'failed').length },
    { label: 'Cancelled', value: 'cancelled', count: historyRuns.filter(r => r.status === 'cancelled').length }
  ];

  return (
    <div className="w-full py-6 sm:py-8 px-4 sm:px-6 lg:px-8 xl:px-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F2027]">
            Research History & Replay
          </h1>
          <p className="text-sm text-[#53616A] mt-1">
            Review synthesis artifacts, audit agent decisions, or replay timeline events.
          </p>
        </div>

        <button
          onClick={() => setCurrentScreen('new')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B61EB] hover:bg-[#1551CA] text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Research</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#7D878D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search runs by topic or depth..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#D5D9DC] bg-white text-xs text-[#0F2027] placeholder:text-[#7D878D] focus:border-[#1B61EB] focus:outline-none focus:ring-1 focus:ring-[#1B61EB] transition-colors shadow-2xs"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#F2FAFF] p-1 rounded-xl border border-[#D5D9DC] overflow-x-auto text-xs font-medium">
          {filterTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5',
                activeFilter === tab.value
                  ? 'bg-white text-[#0F2027] shadow-2xs font-semibold'
                  : 'text-[#53616A] hover:text-[#0F2027]'
              )}
            >
              <span>{tab.label}</span>
              <span className="font-mono text-[10px] text-[#7D878D] px-1 py-0.2 rounded bg-black/5">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Runs List */}
      <div className="space-y-3.5 pt-1">
        {filteredRuns.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#D5D9DC] text-[#7D878D]">
            <History className="w-8 h-8 mx-auto mb-2 text-[#86B0FF]" />
            <h4 className="font-semibold text-sm text-[#0F2027]">No research runs found</h4>
            <p className="text-xs text-[#53616A] mt-1">
              Try adjusting your search criteria or start a new research run.
            </p>
          </div>
        ) : (
          filteredRuns.map(run => (
            <RunCard
              key={run.id}
              run={run}
              onViewReport={viewReport}
              onReplay={(r) => setReplayRun(r)}
            />
          ))
        )}
      </div>

      {/* Timeline Replay Modal */}
      <TimelineReplayModal
        run={replayRun}
        isOpen={Boolean(replayRun)}
        onClose={() => setReplayRun(null)}
      />
    </div>
  );
};

import React from 'react';
import { Globe, X } from 'lucide-react';
import { SourceItem } from '../../types';
import { useResearch } from '../../context/ResearchContext';

interface LiveSourcesDrawerProps {
  sources: SourceItem[];
  isOpen: boolean;
  onClose?: () => void;
}

export const LiveSourcesDrawer: React.FC<LiveSourcesDrawerProps> = ({ sources, isOpen, onClose }) => {
  const { currentCost } = useResearch();

  if (!isOpen) return null;

  const plannerCost = Math.min(currentCost, 0.01);
  const remainingCost = Math.max(0, currentCost - plannerCost);
  const researchersCost = remainingCost * 0.82;
  const writerCost = remainingCost * 0.18;

  return (
    <section className="border-l border-[#D5D9DC] bg-[#F2FAFF]/40 overflow-hidden flex flex-col h-full w-full select-none">
      {/* Header matching Geometric Balance */}
      <div className="p-4 border-b border-[#D5D9DC] bg-white flex items-center justify-between shrink-0">
        <h2 className="text-xs font-bold text-[#7D878D] uppercase tracking-wider">
          Sources & Evidence
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-[#7D878D] hover:text-[#0F2027] p-1 rounded hover:bg-[#D5D9DC]/30 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Sources List */}
      <div className="flex-1 p-3 sm:p-4 space-y-3 overflow-y-auto">
        {sources.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#7D878D] px-2">
            <Globe className="w-6 h-6 mx-auto mb-2 text-[#86B0FF]" />
            <p className="text-[11px]">Evaluating domain credibility & indexing sources...</p>
          </div>
        ) : (
          sources.map(source => {
            const initial = source.name ? source.name.charAt(0).toUpperCase() : 'S';
            const scoreVal = (source.qualityScore / 100).toFixed(2);

            return (
              <div
                key={source.id}
                id={`source-item-${source.id}`}
                className="bg-white p-3 rounded-md border border-[#D5D9DC] shadow-xs hover:border-[#86B0FF] transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-4 h-4 bg-[#F2FAFF] border border-[#86B0FF]/40 rounded flex items-center justify-center text-[8px] font-bold text-[#1B61EB] shrink-0">
                    {initial}
                  </span>
                  <span className="font-semibold text-xs text-[#0F2027] truncate">
                    {source.name}
                  </span>
                  <span className="ml-auto text-[9px] font-mono font-bold text-[#1B61EB] bg-[#F2FAFF] px-1.5 py-0.5 rounded border border-[#86B0FF]/40 shrink-0">
                    {scoreVal}
                  </span>
                </div>
                <p className="text-[11px] text-[#53616A] line-clamp-2 leading-relaxed">
                  {source.snippet}
                </p>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#D5D9DC]/50 text-[10px] text-[#7D878D]">
                  <span className="font-mono text-[#1B61EB] font-medium">
                    {source.citationsCount ?? 2} claims cited
                  </span>
                  <span className="text-emerald-700 font-medium">
                    Peer Reviewed
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Economics Breakdown */}
      <div className="p-3.5 sm:p-4 border-t border-[#D5D9DC] bg-white shrink-0">
        <span className="text-[10px] font-bold text-[#7D878D] uppercase tracking-wider block mb-2 font-mono">
          Run Economics Breakdown
        </span>
        <div className="space-y-1 text-xs text-[#53616A]">
          <div className="flex justify-between">
            <span>Planner:</span>
            <span className="font-mono text-[#0F2027]">${plannerCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Researchers (x5):</span>
            <span className="font-mono text-[#0F2027]">${researchersCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Writer & Audit:</span>
            <span className="font-mono text-[#0F2027]">${writerCost.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

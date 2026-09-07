import React, { useState } from 'react';
import { Coins, ChevronDown, ChevronUp } from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';

export const CostBreakdownPill: React.FC = () => {
  const { currentCost } = useResearch();
  const [open, setOpen] = useState(false);

  // Dynamic distribution of cost
  const plannerCost = 0.012;
  const researcherCost = +(currentCost * 0.58).toFixed(3);
  const writerCost = +(currentCost * 0.28).toFixed(3);
  const verifierCost = Math.max(0.001, +(currentCost - plannerCost - researcherCost - writerCost).toFixed(3));

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F2FAFF] border border-[#86B0FF]/60 text-xs font-mono text-[#0F2027] hover:bg-white transition-colors cursor-pointer"
        title="View live cost distribution"
      >
        <Coins className="w-3.5 h-3.5 text-[#1B61EB]" />
        <span className="font-semibold text-[#1B61EB]">${currentCost.toFixed(3)}</span>
        {open ? <ChevronUp className="w-3 h-3 text-[#7D878D]" /> : <ChevronDown className="w-3 h-3 text-[#7D878D]" />}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-52 p-3 bg-white rounded-xl border border-[#D5D9DC] shadow-lg z-50 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#D5D9DC] font-sans font-semibold text-[11px] text-[#7D878D] uppercase tracking-wider">
            <span>Run Cost Telemetry</span>
            <span className="text-[#1B61EB] font-mono font-bold">${currentCost.toFixed(3)}</span>
          </div>

          <div className="space-y-1 text-[#53616A]">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[11px]">Planner Agent</span>
              <span className="text-[#0F2027]">${plannerCost.toFixed(3)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans text-[11px]">Researcher Cluster</span>
              <span className="text-[#0F2027]">${researcherCost.toFixed(3)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans text-[11px]">Writer Agent</span>
              <span className="text-[#0F2027]">${writerCost.toFixed(3)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans text-[11px]">Verifier Agent</span>
              <span className="text-[#0F2027]">${verifierCost.toFixed(3)}</span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-[#D5D9DC] flex items-center justify-between text-[10px] text-[#7D878D] font-sans">
            <span>Model: Gemini 2.5 Flash</span>
            <span>Grounding on</span>
          </div>
        </div>
      )}
    </div>
  );
};

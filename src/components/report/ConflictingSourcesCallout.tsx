import React from 'react';
import { GitCompare, HelpCircle } from 'lucide-react';

interface ConflictingSourcesCalloutProps {
  statement?: string;
  sourceA: { name: string; value: string };
  sourceB: { name: string; value: string };
  implication?: string;
}

export const ConflictingSourcesCallout: React.FC<ConflictingSourcesCalloutProps> = ({
  statement,
  sourceA,
  sourceB,
  implication
}) => {
  return (
    <div className="p-4 my-4 rounded-xl bg-white border border-[#D5D9DC] shadow-2xs text-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[#D5D9DC]">
        <div className="flex items-center gap-2 text-[#1B61EB] font-semibold text-xs">
          <GitCompare className="w-4 h-4 text-[#1B61EB]" />
          <span>Conflicting Sources Identified</span>
        </div>
        <span className="text-[10px] font-mono uppercase bg-[#F2FAFF] text-[#1B61EB] px-2 py-0.5 rounded border border-[#86B0FF]">
          Source Variance
        </span>
      </div>

      <p className="text-[#53616A] text-xs leading-relaxed">
        {statement || 'Different research sources report divergent statistical metrics regarding adoption trajectory.'}
      </p>

      {/* Comparison boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-2.5 rounded-lg bg-[#F2FAFF] border border-[#D5D9DC]">
          <span className="text-[10px] text-[#7D878D] block mb-0.5 truncate font-medium">
            {sourceA.name}
          </span>
          <span className="text-sm font-bold text-[#0F2027]">{sourceA.value}</span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#F2FAFF] border border-[#D5D9DC]">
          <span className="text-[10px] text-[#7D878D] block mb-0.5 truncate font-medium">
            {sourceB.name}
          </span>
          <span className="text-sm font-bold text-[#0F2027]">{sourceB.value}</span>
        </div>
      </div>

      {implication && (
        <div className="pt-2 border-t border-[#D5D9DC] text-[11px] text-[#7D878D] leading-relaxed flex items-start gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#86B0FF] shrink-0 mt-0.5" />
          <span>{implication}</span>
        </div>
      )}
    </div>
  );
};

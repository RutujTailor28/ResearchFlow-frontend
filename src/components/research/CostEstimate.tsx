import React from 'react';
import { Calculator, Clock, Globe, Coins, ShieldCheck } from 'lucide-react';
import { ResearchDepth } from '../../types';

interface CostEstimateProps {
  depth: ResearchDepth;
}

export const CostEstimate: React.FC<CostEstimateProps> = ({ depth }) => {
  const metrics = {
    quick: {
      duration: '1–2 minutes',
      sources: '6 sources',
      tokens: '~6,500 tokens',
      cost: '$0.08',
      agentCount: '4 agents'
    },
    standard: {
      duration: '2–4 minutes',
      sources: '15 sources',
      tokens: '~14,850 tokens',
      cost: '$0.18',
      agentCount: '6 agents'
    },
    deep: {
      duration: '5–8 minutes',
      sources: '30 sources',
      tokens: '~32,400 tokens',
      cost: '$0.42',
      agentCount: '7 agents'
    }
  }[depth];

  return (
    <div className="p-4 rounded-xl bg-[#F2FAFF] border border-[#D5D9DC] text-xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D5D9DC]">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-[#1B61EB]" />
          <span className="font-semibold text-[#0F2027]">Estimated Resource Budget</span>
        </div>
        <span className="font-mono text-xs font-bold text-[#0F2027] bg-[#DBF262] px-2 py-0.5 rounded border border-[#DBF262]">
          Estimated: {metrics.cost}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
        <div>
          <span className="text-[#7D878D] block text-[11px] mb-0.5">Research Depth</span>
          <span className="font-medium text-[#0F2027] capitalize">{depth}</span>
        </div>
        <div>
          <span className="text-[#7D878D] block text-[11px] mb-0.5">Est. Duration</span>
          <span className="font-medium text-[#0F2027]">{metrics.duration}</span>
        </div>
        <div>
          <span className="text-[#7D878D] block text-[11px] mb-0.5">Target Sources</span>
          <span className="font-medium text-[#0F2027]">{metrics.sources}</span>
        </div>
        <div>
          <span className="text-[#7D878D] block text-[11px] mb-0.5">Token Allocation</span>
          <span className="font-mono font-medium text-[#0F2027]">{metrics.tokens}</span>
        </div>
      </div>
    </div>
  );
};

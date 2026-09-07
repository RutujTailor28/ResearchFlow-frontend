import React from 'react';
import { Zap, Compass, Layers, Check } from 'lucide-react';
import { ResearchDepth } from '../../types';
import { cn } from '../../lib/utils';

interface DepthSelectorProps {
  selectedDepth: ResearchDepth;
  onSelect: (depth: ResearchDepth) => void;
}

export const DepthSelector: React.FC<DepthSelectorProps> = ({ selectedDepth, onSelect }) => {
  const options: {
    id: ResearchDepth;
    name: string;
    badge?: string;
    questions: string;
    sources: string;
    time: string;
    cost: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'quick',
      name: 'Quick',
      questions: '3 research questions',
      sources: 'Up to 6 sources',
      time: '1–2 minutes',
      cost: '$0.08',
      icon: Zap
    },
    {
      id: 'standard',
      name: 'Standard',
      badge: 'Recommended',
      questions: '5 research questions',
      sources: 'Up to 15 sources',
      time: '2–4 minutes',
      cost: '$0.18',
      icon: Compass
    },
    {
      id: 'deep',
      name: 'Deep',
      questions: '8 research questions',
      sources: 'Up to 30 sources',
      time: '5–8 minutes',
      cost: '$0.42',
      icon: Layers
    }
  ];

  return (
    <div className="space-y-2.5">
      <label className="text-xs font-semibold text-[#0F2027] uppercase tracking-wider block">
        Research Depth
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {options.map(option => {
          const isSelected = selectedDepth === option.id;
          const Icon = option.icon;

          return (
            <div
              key={option.id}
              id={`depth-card-${option.id}`}
              onClick={() => onSelect(option.id)}
              className={cn(
                'relative flex flex-col p-4 rounded-xl border transition-all cursor-pointer select-none text-left',
                isSelected
                  ? 'border-[#1B61EB] bg-[#F2FAFF] shadow-xs ring-1 ring-[#1B61EB]/30'
                  : 'border-[#D5D9DC] bg-white hover:border-[#86B0FF] hover:bg-[#F2FAFF]/50'
              )}
            >
              {option.badge && (
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DBF262] text-[#0F2027] tracking-wide uppercase shadow-xs">
                  {option.badge}
                </span>
              )}

              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                      isSelected ? 'bg-[#1B61EB] text-white' : 'bg-[#F2FAFF] text-[#53616A] border border-[#D5D9DC]'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm text-[#0F2027]">{option.name}</span>
                </div>
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border flex items-center justify-center',
                    isSelected ? 'border-[#1B61EB] bg-[#1B61EB] text-white' : 'border-[#D5D9DC]'
                  )}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </div>

              <div className="space-y-1 text-xs text-[#53616A] mt-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#7D878D]">Structure:</span>
                  <span className="font-medium text-[#0F2027]">{option.questions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7D878D]">Target Sources:</span>
                  <span className="font-medium text-[#0F2027]">{option.sources}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7D878D]">Est. Runtime:</span>
                  <span className="font-medium text-[#0F2027]">{option.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

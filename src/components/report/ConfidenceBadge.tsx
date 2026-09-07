import React from 'react';
import { ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ConfidenceBadgeProps {
  confidence: 'High' | 'Medium' | 'Low';
  verifiedClaims: number;
  sourcesCount: number;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  verifiedClaims,
  sourcesCount
}) => {
  const getBadgeStyle = () => {
    switch (confidence) {
      case 'High':
        return {
          dot: 'bg-emerald-500',
          text: 'text-emerald-700',
          bg: 'bg-emerald-50/70 border-emerald-200/80',
          label: 'High confidence'
        };
      case 'Medium':
        return {
          dot: 'bg-[#1B61EB]',
          text: 'text-[#1B61EB]',
          bg: 'bg-[#F2FAFF] border-[#86B0FF]',
          label: 'Moderate confidence'
        };
      case 'Low':
      default:
        return {
          dot: 'bg-amber-500',
          text: 'text-amber-700',
          bg: 'bg-amber-50/70 border-amber-200/80',
          label: 'Low confidence'
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <div
      className={cn(
        'p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs mt-4 select-none',
        style.bg
      )}
    >
      <div className="flex items-center gap-2">
        <ShieldCheck className={cn('w-4 h-4', style.text)} />
        <div className="flex items-center gap-1.5">
          <span className={cn('w-2 h-2 rounded-full', style.dot)}></span>
          <span className={cn('font-semibold text-xs', style.text)}>
            {style.label}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[11px] text-[#53616A]">
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          <span className="font-semibold text-[#0F2027]">{verifiedClaims}</span> verified claims
        </span>
        <span className="text-[#7D878D]">•</span>
        <span>
          <span className="font-semibold text-[#0F2027]">{sourcesCount}</span> supporting sources
        </span>
      </div>
    </div>
  );
};

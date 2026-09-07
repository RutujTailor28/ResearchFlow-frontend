import React from 'react';
import { AlertTriangle, HelpCircle } from 'lucide-react';

interface UnverifiedClaimCalloutProps {
  claimText?: string;
}

export const UnverifiedClaimCallout: React.FC<UnverifiedClaimCalloutProps> = ({ claimText }) => {
  return (
    <div className="p-3.5 my-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs">
      <div className="flex items-center gap-2 text-amber-900 font-semibold mb-1">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>Unverified Claim Flagged by Verifier Agent</span>
      </div>
      <p className="text-[#92400E] leading-relaxed text-[11px]">
        {claimText || 'This statement could not be fully corroborated across cleared peer-reviewed clinical literature or official regulatory pipelines.'}
      </p>
      <div className="mt-2 text-[10px] text-amber-700/80 flex items-center gap-1 font-mono">
        <HelpCircle className="w-3 h-3" />
        <span>Source consensus: Insufficient empirical evidence (0 of 5 sources verified)</span>
      </div>
    </div>
  );
};

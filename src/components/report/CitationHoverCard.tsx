import React, { useState } from 'react';
import { SourceItem } from '../../types';
import { cn } from '../../lib/utils';

interface CitationHoverCardProps {
  idNumber: number;
  source?: SourceItem;
  onSourceClick?: (source: SourceItem) => void;
}

export const CitationHoverCard: React.FC<CitationHoverCardProps> = ({
  idNumber,
  source,
  onSourceClick
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        onClick={() => source && onSourceClick && onSourceClick(source)}
        className="inline-flex items-center justify-center font-mono text-[11px] font-semibold text-[#1B61EB] bg-[#F2FAFF] hover:bg-[#86B0FF]/25 px-1.5 py-0.2 rounded border border-[#86B0FF] mx-0.5 align-baseline cursor-pointer transition-colors"
      >
        [{idNumber}]
      </button>

      {/* Hover preview tooltip card */}
      {isHovered && source && (
        <span className="block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-white rounded-xl border border-[#D5D9DC] shadow-xl z-50 text-left text-xs pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <span className="flex items-center justify-between gap-1 mb-1.5">
            <span className="font-semibold text-[11px] text-[#0F2027] truncate">
              {source.name}
            </span>
            <span
              className={cn(
                'font-mono text-[9px] px-1.5 py-0.2 rounded font-semibold',
                source.qualityScore >= 90
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-[#F2FAFF] text-[#1B61EB] border border-[#86B0FF]'
              )}
            >
              Q: {source.qualityScore}
            </span>
          </span>

          <span className="block font-medium text-[11px] text-[#24343B] line-clamp-2 leading-snug mb-1">
            {source.title}
          </span>

          <span className="block text-[10px] text-[#53616A] line-clamp-2 leading-relaxed">
            {source.snippet}
          </span>

          <span className="mt-2 pt-1.5 border-t border-[#D5D9DC] flex items-center justify-between text-[9px] text-[#7D878D]">
            <span className="bg-[#F2FAFF] px-1.5 py-0.2 rounded border border-[#D5D9DC] text-[#24343B]">
              {source.category}
            </span>
            <span className="font-mono text-[#53616A] truncate max-w-[120px]">
              {source.domain}
            </span>
          </span>
        </span>
      )}
    </span>
  );
};

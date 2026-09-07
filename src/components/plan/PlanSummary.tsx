import React from 'react';
import { Bot, CheckCircle2 } from 'lucide-react';
import { ResearchBrief, PlanSectionItem } from '../../types';

interface PlanSummaryProps {
  brief: ResearchBrief;
  sections: PlanSectionItem[];
  planSummary?: string | null;
}

export const PlanSummary: React.FC<PlanSummaryProps> = ({ brief, sections, planSummary }) => {
  const totalQuestions = sections.reduce((acc, s) => acc + s.subQuestions.length, 0);

  const estimatedSources = brief.depth === 'quick' ? 6 : brief.depth === 'deep' ? 30 : 15;
  const estimatedTime =
    brief.depth === 'quick' ? '1–2 minutes' : brief.depth === 'deep' ? '5–8 minutes' : '2–4 minutes';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 p-4 rounded-xl bg-white border border-[#D5D9DC] shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-[#7D878D] uppercase tracking-wider">
            Research Topic & Context
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[#1B61EB] bg-[#F2FAFF] px-2 py-0.5 rounded border border-[#86B0FF]">
            {brief.depth.toUpperCase()} RESEARCH
          </span>
        </div>
        <h2 className="text-sm sm:text-base font-semibold text-[#0F2027] leading-snug mb-2 line-clamp-2">
          {brief.topic}
        </h2>
        {planSummary ? (
          <p className="text-[11px] text-[#53616A] leading-relaxed mb-3 line-clamp-3">
            {planSummary}
          </p>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2 pt-2.5 border-t border-[#D5D9DC] text-xs">
          <div>
            <span className="text-[#7D878D] block text-[11px]">Target Audience</span>
            <span className="font-medium text-[#0F2027]">{brief.audience}</span>
          </div>
          <div>
            <span className="text-[#7D878D] block text-[11px]">Tone Style</span>
            <span className="font-medium text-[#0F2027]">{brief.tone}</span>
          </div>
          <div>
            <span className="text-[#7D878D] block text-[11px]">Est. Sources Target</span>
            <span className="font-medium text-[#0F2027]">{estimatedSources} sources</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#F2FAFF] border border-[#D5D9DC] shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#1B61EB] text-white flex items-center justify-center">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-xs text-[#0F2027]">Planner Agent</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Complete
            </span>
          </div>

          <p className="text-[11px] text-[#53616A] mb-3">
            Generated research architecture and mapped target domain ontologies.
          </p>
        </div>

        <div className="space-y-1 pt-2 border-t border-[#D5D9DC] text-xs text-[#24343B]">
          <div className="flex items-center justify-between">
            <span className="text-[#7D878D]">Generated:</span>
            <span className="font-semibold text-[#0F2027]">
              {sections.length} sections ({totalQuestions} questions)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#7D878D]">Est. Runtime:</span>
            <span className="font-medium text-[#0F2027]">{estimatedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

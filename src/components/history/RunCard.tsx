import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Coins,
  FileText,
  Play,
  ArrowRight,
  HelpCircle,
  Globe,
  Layers,
  StopCircle
} from 'lucide-react';
import { ResearchRun } from '../../types';
import { cn } from '../../lib/utils';

interface RunCardProps {
  run: ResearchRun;
  onViewReport: (run: ResearchRun) => void;
  onReplay: (run: ResearchRun) => void;
}

export const RunCard: React.FC<RunCardProps> = ({ run, onViewReport, onReplay }) => {
  const getStatusBadge = () => {
    switch (run.status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Completed
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Failed
          </span>
        );
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#1B61EB] bg-[#F2FAFF] px-2 py-0.5 rounded-full border border-[#86B0FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B61EB] animate-pulse"></span>
            Running
          </span>
        );
      case 'cancelled':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7D878D] bg-[#F2FAFF] px-2 py-0.5 rounded-full">
            <StopCircle className="w-3 h-3 text-[#7D878D]" />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div
      id={`history-run-${run.id}`}
      className="p-5 rounded-2xl border border-[#D5D9DC] bg-white hover:border-[#86B0FF] shadow-2xs hover:shadow-xs transition-all space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge()}
            <span className="font-mono text-[10px] uppercase font-semibold text-[#1B61EB] bg-[#F2FAFF] px-2 py-0.5 rounded border border-[#86B0FF]">
              {run.depth} Research
            </span>
            <span className="text-[11px] text-[#7D878D]">•</span>
            <span className="text-xs text-[#53616A]">{run.createdAt}</span>
          </div>

          <h3 className="text-sm sm:text-base font-semibold text-[#0F2027] leading-snug">
            {run.topic}
          </h3>

          {run.failureReason && (
            <div className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-200 text-xs text-rose-800 flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Failure: </span>
                <span>{run.failureReason}</span>
                {run.partialResults && (
                  <span className="text-[11px] text-rose-600 block mt-0.5 font-medium">
                    (Partial research results available for inspection)
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
          <button
            onClick={() => onReplay(run)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D5D9DC] bg-white hover:bg-[#F2FAFF] text-xs font-medium text-[#24343B] transition-colors shadow-2xs"
            title="Replay simulated agent orchestration"
          >
            <Play className="w-3 h-3 text-[#1B61EB]" />
            <span>Replay</span>
          </button>

          <button
            onClick={() => onViewReport(run)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B61EB] hover:bg-[#1551CA] text-white text-xs font-medium transition-colors shadow-2xs"
          >
            <span>View Report</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#D5D9DC] text-xs text-[#53616A]">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#7D878D]" />
          <span>
            <span className="font-semibold text-[#0F2027]">{run.sectionsCount}</span> sections
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-[#7D878D]" />
          <span>
            <span className="font-semibold text-[#0F2027]">{run.sourcesCount}</span> sources
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#7D878D]" />
          <span className="font-mono">
            {run.durationFormatted}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Coins className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-mono font-semibold text-[#0F2027]">
            ${run.totalCost.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

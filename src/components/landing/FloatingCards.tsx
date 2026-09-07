import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Compass, 
  Cpu, 
  TrendingUp,
  ExternalLink
} from 'lucide-react';

export const LeftFloatingCard: React.FC = () => {
  return (
    <div className="relative group select-none max-w-full">
      {/* Small floating circular badge near card */}
      <div className="absolute -top-3 right-0 xl:-right-3.5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#D5D9DC] shadow-md flex items-center justify-center text-[#1B61EB] z-20 transition-transform duration-300 group-hover:scale-110">
        <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-[#1B61EB]" />
      </div>

      {/* Main Left Card - Research Plan */}
      <div className="w-full max-w-[280px] sm:max-w-[295px] rounded-2xl bg-white/95 backdrop-blur-md border border-[#D5D9DC] p-3.5 sm:p-4 shadow-xl rotate-0 xl:-rotate-6 hover:rotate-0 transition-all duration-500 ease-out mx-auto">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D5D9DC]/60">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#F2FAFF] border border-[#86B0FF] flex items-center justify-center text-[#1B61EB]">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0F2027]">Research Plan</h4>
              <p className="text-[10px] text-[#7D878D]">Autonomous Deconstruction</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Active
          </span>
        </div>

        {/* Plan Checklist Items */}
        <div className="space-y-2 pt-3 text-xs">
          {/* Item 1: Complete */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#F2FAFF]/60 border border-[#D5D9DC]/70">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium text-[11px] text-[#0F2027]">
                1. Market Overview
              </span>
            </div>
            <span className="text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
              Complete
            </span>
          </div>

          {/* Item 2: Researching */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#86B0FF] ring-1 ring-[#1B61EB]/15 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-[#1B61EB] border-t-transparent animate-spin shrink-0"></div>
              <span className="font-semibold text-[11px] text-[#0F2027]">
                2. Industry Trends
              </span>
            </div>
            <span className="text-[10px] font-mono font-semibold text-[#1B61EB] bg-[#F2FAFF] px-1.5 py-0.2 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1B61EB] animate-ping"></span>
              Active
            </span>
          </div>

          {/* Item 3: Pending */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#F2FAFF]/40 border border-dashed border-[#D5D9DC]">
            <div className="flex items-center gap-2 opacity-70">
              <Clock className="w-3.5 h-3.5 text-[#7D878D] shrink-0" />
              <span className="font-medium text-[11px] text-[#53616A]">
                3. Technical Analysis
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#7D878D] bg-black/5 px-1.5 py-0.2 rounded">
              Queued
            </span>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="pt-2.5 mt-1 border-t border-[#D5D9DC]/60">
          <div className="flex items-center justify-between text-[10px] text-[#53616A] mb-1">
            <span className="font-medium">Synthesis Progress</span>
            <span className="font-mono font-bold text-[#0F2027]">68%</span>
          </div>
          <div className="w-full bg-[#D5D9DC]/60 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#1B61EB] h-full rounded-full transition-all duration-500" style={{ width: '68%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RightFloatingCard: React.FC = () => {
  return (
    <div className="relative group select-none max-w-full">
      {/* Small floating icon badge near card */}
      <div className="absolute -top-3 left-0 xl:-left-3 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#D5D9DC] shadow-md flex items-center justify-center text-amber-500 z-20 transition-transform duration-300 group-hover:scale-110">
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
      </div>

      {/* Main Right Card */}
      <div className="w-full max-w-[280px] sm:max-w-[295px] rounded-2xl bg-white/95 backdrop-blur-md border border-[#D5D9DC] p-3.5 sm:p-4 shadow-xl rotate-0 xl:rotate-6 hover:rotate-0 transition-all duration-500 ease-out space-y-3 mx-auto">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#D5D9DC]/60">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#DBF262]/50 border border-[#DBF262] flex items-center justify-center text-[#0F2027]">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0F2027]">AI Agents</h4>
              <p className="text-[10px] text-[#7D878D]">Swarm Orchestration</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-[#1B61EB] bg-[#F2FAFF] border border-[#86B0FF] px-2 py-0.5 rounded-full">
            5 Active
          </span>
        </div>

        {/* Agent Activity Items */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[11px] py-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-medium text-[#0F2027]">Planner Agent</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 font-semibold">Done</span>
          </div>

          <div className="flex items-center justify-between text-[11px] py-1 bg-[#F2FAFF] px-2 rounded-lg border border-[#86B0FF]/40">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1B61EB] animate-pulse"></span>
              <span className="font-semibold text-[#0F2027]">Researcher Alpha</span>
            </div>
            <span className="text-[10px] font-mono text-[#1B61EB] font-bold">Searching...</span>
          </div>

          <div className="flex items-center justify-between text-[11px] py-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7AA5A7] animate-pulse"></span>
              <span className="font-medium text-[#0F2027]">Researcher Beta</span>
            </div>
            <span className="text-[10px] font-mono text-[#7AA5A7] font-medium">Reading</span>
          </div>

          <div className="flex items-center justify-between text-[11px] py-0.5 opacity-70">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D5D9DC]"></span>
              <span className="font-medium text-[#53616A]">Synthesizer</span>
            </div>
            <span className="text-[10px] font-mono text-[#7D878D]">Waiting</span>
          </div>
        </div>

        {/* Overlapping secondary micro-card at bottom */}
        <div className="pt-2 border-t border-[#D5D9DC]/60 grid grid-cols-2 gap-2 text-left">
          <div className="p-2 rounded-xl bg-[#F2FAFF] border border-[#D5D9DC]">
            <span className="text-[10px] text-[#7D878D] block">Verified Sources</span>
            <div className="flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-bold text-[#0F2027]">28 Sources</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-[#F2FAFF] border border-[#D5D9DC]">
            <span className="text-[10px] text-[#7D878D] block">Confidence</span>
            <div className="flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#1B61EB]" />
              <span className="text-xs font-bold text-[#1B61EB]">98.4%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

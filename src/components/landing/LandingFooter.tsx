import React from 'react';
import { ArrowUpRight, Shield, Cpu } from 'lucide-react';

interface LandingFooterProps {
  onGetStarted: () => void;
  onNavigateTab?: (screen: string) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ 
  onGetStarted,
  onNavigateTab
}) => {
  return (
    <footer className="bg-[#0F2027] text-white border-t border-[#24343B] pt-12 sm:pt-16 pb-8 sm:pb-12">
      <div className="w-full px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 pb-10 sm:pb-12 border-b border-[#24343B]">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#1B61EB] rounded-xl flex items-center justify-center">
                <div className="w-3.5 h-3.5 border-2 border-[#DBF262] rounded-full"></div>
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                ResearchFlow
              </span>
            </div>

            <p className="text-sm text-[#A0A8AD] max-w-sm leading-relaxed">
              Autonomous multi-agent research generator. Turning complex questions into verifiable intelligence with independent fact audits and primary citations.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#DBF262] bg-white/5 border border-[#24343B] px-2.5 py-1 rounded-full">
                <Cpu className="w-3 h-3 text-[#DBF262]" />
                7 Autonomous Agents
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-white/5 border border-[#24343B] px-2.5 py-1 rounded-full">
                <Shield className="w-3 h-3 text-emerald-400" />
                Zero Hallucination Audit
              </span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#7D878D]">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-[#A0A8AD]">
              <li>
                <button
                  onClick={onGetStarted}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  New Research Brief
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab ? onNavigateTab('agents') : onGetStarted()}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Agent Swarm Roster
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab ? onNavigateTab('history') : onGetStarted()}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Research Archives
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab ? onNavigateTab('report') : onGetStarted()}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Verified Reports
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: CTA Card */}
          <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-[#24343B]/60 border border-[#24343B]">
            <h4 className="text-sm font-bold text-white">
              Launch Workspace
            </h4>
            <p className="text-xs text-[#A0A8AD] leading-relaxed">
              Explore live multi-agent execution on real-time benchmarks.
            </p>
            <button
              onClick={onGetStarted}
              className="w-full mt-2 inline-flex items-center justify-center gap-1.5 bg-[#1B61EB] hover:bg-[#1551CA] text-white text-xs font-semibold py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-[#7D878D] text-center sm:text-left">
          <p>© {new Date().getFullYear()} ResearchFlow. Multi-Agent Research Platform.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <span>Powered by Gemini 2.5</span>
            <span className="w-1 h-1 rounded-full bg-[#53616A] hidden sm:inline-block"></span>
            <span>Bi-directional Source Verification</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

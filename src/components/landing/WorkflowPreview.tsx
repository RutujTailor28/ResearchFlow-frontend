import React from 'react';
import { 
  Compass, 
  Search, 
  PenTool, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Database
} from 'lucide-react';

interface WorkflowPreviewProps {
  onGetStarted: () => void;
}

export const WorkflowPreview: React.FC<WorkflowPreviewProps> = ({ onGetStarted }) => {
  return (
    <section id="workflow" className="py-14 sm:py-20 bg-white border-t border-[#D5D9DC]">
      <div className="w-full px-4 sm:px-6 md:px-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2FAFF] border border-[#86B0FF] text-xs font-semibold text-[#1B61EB] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#1B61EB]" />
            <span>SWARM ARCHITECTURE</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F2027] tracking-tight">
            How Specialized Agents Collaborate
          </h2>

          <p className="text-sm sm:text-base text-[#53616A] leading-relaxed px-2">
            Instead of a single AI trying to do everything sequentially, tasks are decomposed and assigned to specialized agents with distinct domain capabilities.
          </p>
        </div>

        {/* Interactive Multi-Node Workflow Diagram */}
        <div className="p-4 sm:p-8 md:p-10 rounded-3xl bg-[#F2FAFF]/80 border border-[#D5D9DC] shadow-sm relative overflow-hidden">
          {/* Subtle grid background */}
          <div 
            className="absolute inset-0 bg-[radial-gradient(#86B0FF_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 space-y-6 sm:space-y-8">
            {/* Step 1: User Prompt */}
            <div className="flex flex-col items-center text-center max-w-md mx-auto">
              <span className="font-mono text-[10px] font-bold text-[#7D878D] uppercase tracking-wider mb-2">
                Step 1 • Initial User Prompt
              </span>
              <div className="w-full p-3.5 sm:p-4 rounded-2xl bg-white border border-[#D5D9DC] shadow-xs flex items-center justify-between gap-2.5 sm:gap-3">
                <div className="flex items-center gap-2.5 text-left min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#1B61EB] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    Q
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0F2027]">Research Query</p>
                    <p className="text-[11px] text-[#53616A] truncate">
                      "Transformative impact of AI on clinical healthcare over 5 years"
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-[#1B61EB] bg-[#F2FAFF] border border-[#86B0FF] px-2 py-0.5 rounded-md font-semibold shrink-0">
                  Standard Depth
                </span>
              </div>
            </div>

            {/* Connecting Vertical Pulse Line */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-0.5 h-6 bg-gradient-to-b from-[#1B61EB] to-[#86B0FF] relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#1B61EB] animate-ping"></div>
              </div>
            </div>

            {/* Step 2: Planner Agent */}
            <div className="flex flex-col items-center text-center max-w-md mx-auto">
              <span className="font-mono text-[10px] font-bold text-[#7D878D] uppercase tracking-wider mb-2">
                Step 2 • Domain Ontology Planner
              </span>
              <div className="w-full p-3.5 sm:p-4 rounded-2xl bg-white border border-[#1B61EB] shadow-xs flex items-center justify-between gap-2.5 sm:gap-3 ring-2 ring-[#1B61EB]/10">
                <div className="flex items-center gap-2.5 text-left min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#1B61EB] text-white flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs font-bold text-[#0F2027]">Planner Agent</p>
                      <span className="text-[9px] font-mono bg-[#DBF262] text-[#0F2027] font-bold px-1.5 py-0.2 rounded">Gemini 2.5 Pro</span>
                    </div>
                    <p className="text-[11px] text-[#53616A] truncate">Deconstructs into 4 targeted sections & 16 hypotheses</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                  ✓ Verified
                </span>
              </div>
            </div>

            {/* Connecting Vertical Line into Multi-Agent Branch */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-0.5 h-5 bg-[#86B0FF]"></div>
              <span className="text-[10px] font-mono font-semibold text-[#1B61EB] bg-white border border-[#86B0FF] px-2.5 py-0.5 rounded-full shadow-2xs max-w-[280px] sm:max-w-none">
                Parallel Handoff to 5 Specialized Agents
              </span>
              <div className="w-0.5 h-5 bg-[#86B0FF]"></div>
            </div>

            {/* Step 3: Parallel Swarm Researchers */}
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  { name: 'Clinical Trials Agent', domain: 'PubMed & Medline', icon: Search, color: 'text-[#1B61EB] bg-[#F2FAFF]' },
                  { name: 'Hospital Ops Agent', domain: 'EHR & Workflow Studies', icon: Database, color: 'text-[#7AA5A7] bg-[#F2FAFF]' },
                  { name: 'Market Dynamics Agent', domain: 'VC Investments & 10-K', icon: Search, color: 'text-[#1B61EB] bg-[#F2FAFF]' },
                  { name: 'Regulatory Law Agent', domain: 'FDA 510(k) Approvals', icon: ShieldCheck, color: 'text-[#7AA5A7] bg-[#F2FAFF]' },
                  { name: 'Ethics & Safety Agent', domain: 'Algorithmic Bias Studies', icon: Compass, color: 'text-[#1B61EB] bg-[#F2FAFF]' },
                ].map((agent, i) => {
                  const Icon = agent.icon;
                  return (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-white border border-[#D5D9DC] hover:border-[#86B0FF] hover:shadow-xs transition-all space-y-2 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-6 h-6 rounded-lg ${agent.color} flex items-center justify-center`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0F2027]">{agent.name}</p>
                        <p className="text-[10px] font-mono text-[#7D878D]">{agent.domain}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Connecting Line from Swarm into Synthesis & Fact Check */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-0.5 h-5 bg-[#86B0FF]"></div>
            </div>

            {/* Step 4 & 5: Writer and Verifier */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 max-w-2xl mx-auto">
              {/* Writer Agent */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#D5D9DC] flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#24343B] text-white flex items-center justify-center shrink-0">
                    <PenTool className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0F2027]">Writer Agent</p>
                    <p className="text-[11px] text-[#53616A] truncate">Synthesizes multi-vector draft</p>
                  </div>
                </div>
                <span className="font-mono text-[10px] bg-[#F2FAFF] border border-[#D5D9DC] px-2 py-0.5 rounded text-[#24343B] font-semibold shrink-0">
                  Continuity
                </span>
              </div>

              {/* Fact Verifier */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#D5D9DC] flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0F2027]">Fact Verifier</p>
                    <p className="text-[11px] text-[#53616A] truncate">Bi-directional claim audit</p>
                  </div>
                </div>
                <span className="font-mono text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold shrink-0">
                  Zero Hallucination
                </span>
              </div>
            </div>

            {/* Final Output Banner - fully responsive for mobile */}
            <div className="pt-3 sm:pt-4 flex flex-col items-center">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 p-3.5 sm:p-4 px-4 sm:px-5 rounded-2xl bg-white border border-[#1B61EB] shadow-md w-full max-w-xl text-center sm:text-left">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-5 h-5 text-[#1B61EB] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0F2027]">Verified Research Dossier</p>
                    <p className="text-[10px] text-[#53616A] leading-tight">28 Primary Sources • 98.4% Confidence • Executive PDF/Markdown</p>
                  </div>
                </div>
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto bg-[#1B61EB] hover:bg-[#1551CA] text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <span>Launch Swarm</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

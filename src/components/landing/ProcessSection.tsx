import React from 'react';
import { 
  Compass, 
  Search, 
  Cpu, 
  ShieldCheck, 
  FileText, 
  ChevronRight
} from 'lucide-react';

interface ProcessSectionProps {
  onSelectStep?: (step: string) => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = () => {
  const steps = [
    {
      id: 'plan',
      label: 'PLAN',
      title: 'Ontology Deconstruction',
      desc: 'Breaks question into targeted hypotheses',
      icon: Compass,
      color: 'text-[#1B61EB] bg-[#F2FAFF] border-[#86B0FF]',
    },
    {
      id: 'research',
      label: 'RESEARCH',
      title: 'Parallel Exploration',
      desc: 'Simultaneous deep querying across indices',
      icon: Search,
      color: 'text-[#7AA5A7] bg-[#F2FAFF] border-[#D5D9DC]',
    },
    {
      id: 'analyze',
      label: 'ANALYZE',
      title: 'Multi-Vector Correlate',
      desc: 'Extracts empirical data points & trends',
      icon: Cpu,
      color: 'text-[#1B61EB] bg-[#DBF262]/30 border-[#DBF262]',
    },
    {
      id: 'verify',
      label: 'VERIFY',
      title: 'Hallucination Audit',
      desc: 'Bi-directional claim-to-source checks',
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'report',
      label: 'REPORT',
      title: 'Publication Synthesis',
      desc: 'Structured dossier with full citations',
      icon: FileText,
      color: 'text-[#24343B] bg-white border-[#D5D9DC]',
    },
  ];

  return (
    <section id="how-it-works" className="py-10 sm:py-14 border-t border-[#D5D9DC]/70 bg-white/40">
      <div className="w-full px-4 sm:px-6 md:px-10">
        <div className="text-center space-y-1.5 mb-6 sm:mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#7D878D]">
            Autonomous Orchestration Pipeline
          </p>
          <h3 className="text-lg sm:text-xl font-bold text-[#0F2027]">
            From Complex Question to Verified Report
          </h3>
        </div>

        {/* Process Flow Cards Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="group relative p-3.5 sm:p-4 rounded-2xl bg-white border border-[#D5D9DC] hover:border-[#86B0FF] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${step.color} transition-transform group-hover:scale-105`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-[#7D878D] group-hover:text-[#1B61EB] transition-colors">
                      0{index + 1}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] font-bold tracking-wider text-[#1B61EB] uppercase block mb-1">
                    {step.label}
                  </span>
                  <h4 className="text-xs font-bold text-[#0F2027] group-hover:text-[#1B61EB] transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-[#53616A] mt-1 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Right Arrow indicator for flow on large screens */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-[#D5D9DC] items-center justify-center z-10 shadow-xs">
                    <ChevronRight className="w-3.5 h-3.5 text-[#7D878D]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

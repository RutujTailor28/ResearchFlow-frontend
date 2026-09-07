import React from 'react';
import { 
  Compass, 
  Search, 
  PenTool, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface FeaturesSectionProps {
  onExploreAgents?: () => void;
  onGetStarted: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ 
  onGetStarted 
}) => {
  const features = [
    {
      id: 'planner',
      badge: 'Architecture',
      title: 'Planner Agent',
      subtitle: 'Gemini 2.5 Pro Powered',
      description: 'Breaks complex briefs into structured research questions, sub-topics, hypotheses, and verifiable milestones.',
      icon: Compass,
      color: 'bg-[#1B61EB] text-white',
      tags: ['Ontology Mapping', 'Plan Review', 'Semantic Scope'],
      metrics: '3.2s generation time'
    },
    {
      id: 'researchers',
      badge: 'Swarm Execution',
      title: 'Parallel Researchers',
      subtitle: '5 Specialized Sub-Agents',
      description: 'Crawls PubMed, arXiv, regulatory databases, and financial filings simultaneously to eliminate research bottlenecks.',
      icon: Search,
      color: 'bg-[#7AA5A7] text-white',
      tags: ['Multi-Source Scraping', 'Domain Specialization', 'Live Tool Calls'],
      metrics: '28+ sources analyzed in parallel'
    },
    {
      id: 'writer',
      badge: 'Synthesis Engine',
      title: 'AI Writer',
      subtitle: 'Editorial Continuity',
      description: 'Transforms heterogeneous research notes into cohesive, executive-ready dossiers formatted with figures and inline references.',
      icon: PenTool,
      color: 'bg-[#24343B] text-white',
      tags: ['Executive Briefs', 'Continuous Narrative', 'Markdown & LaTeX'],
      metrics: 'Zero token-limit loss'
    },
    {
      id: 'verifier',
      badge: 'Accuracy Audit',
      title: 'Fact Verifier',
      subtitle: 'Zero Hallucinations',
      description: 'Bi-directionally cross-references every assertion against source texts, flags divergent figures, and scores confidence.',
      icon: ShieldCheck,
      color: 'bg-emerald-600 text-white',
      tags: ['Citation Provenance', 'Variance Identification', 'Confidence Scoring'],
      metrics: '100% claim-to-source audit'
    }
  ];

  return (
    <section id="features" className="py-14 sm:py-20 bg-[#F2FAFF] border-t border-[#D5D9DC]">
      <div className="w-full px-4 sm:px-6 md:px-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D5D9DC] text-xs font-semibold text-[#1B61EB] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#1B61EB]" />
            <span>POWERED BY AI AGENTS</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F2027] tracking-tight">
            One research workflow. <br className="hidden sm:inline" />
            Multiple specialized agents.
          </h2>

          <p className="text-sm sm:text-base text-[#53616A] leading-relaxed px-2">
            Your AI team collaborates from planning to final verification, operating concurrently with verified handoffs and independent audits.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="group p-5 sm:p-6 rounded-2xl bg-white border border-[#D5D9DC] hover:border-[#86B0FF] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${feat.color} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] uppercase font-bold text-[#7D878D] bg-[#F2FAFF] border border-[#D5D9DC] px-2 py-0.5 rounded-full">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0F2027] group-hover:text-[#1B61EB] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-[11px] font-mono text-[#7D878D] mt-0.5 mb-3">
                    {feat.subtitle}
                  </p>

                  <p className="text-xs text-[#53616A] leading-relaxed mb-4">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D5D9DC]/60 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {feat.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium bg-[#F2FAFF] text-[#24343B] border border-[#D5D9DC] px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#7D878D] font-mono pt-1">
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {feat.metrics}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Prompt */}
        <div className="mt-10 sm:mt-12 text-center">
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1B61EB] hover:text-[#1551CA] transition-colors group cursor-pointer"
          >
            <span>Launch research workspace to watch the swarm live</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

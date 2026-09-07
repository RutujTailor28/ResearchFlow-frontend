import React from 'react';
import { LandingNav } from './LandingNav';
import { HeroSection } from './HeroSection';
import { ProcessSection } from './ProcessSection';
import { FeaturesSection } from './FeaturesSection';
import { WorkflowPreview } from './WorkflowPreview';
import { LandingFooter } from './LandingFooter';
import { ArrowUpRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface LandingPageViewProps {
  onGetStarted: () => void;
  onNavigate?: (screen: any) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onGetStarted,
  onNavigate
}) => {
  return (
    <div className="min-h-screen bg-[#F2FAFF] text-[#0F2027] selection:bg-[#1B61EB]/20 selection:text-[#0F2027]">
      {/* 1. Clean Top Navigation (matching reference layout) */}
      <LandingNav
        onGetStarted={onGetStarted}
        onNavigateTab={(tab) => {
          if (onNavigate) {
            onNavigate(tab);
          }
        }}
      />

      {/* 2. Hero Section with soft blurred glows, centered headline, capability chips & floating UI cards */}
      <HeroSection onGetStarted={onGetStarted} />

      {/* 3. Trusted / Process Pipeline Section (PLAN -> RESEARCH -> ANALYZE -> VERIFY -> REPORT) */}
      <ProcessSection />

      {/* 4. Features Section (4 Agent capability cards) */}
      <FeaturesSection
        onGetStarted={onGetStarted}
        onExploreAgents={() => {
          if (onNavigate) onNavigate('agents');
        }}
      />

      {/* 5. Live Multi-Agent Swarm Workflow Preview */}
      <WorkflowPreview onGetStarted={onGetStarted} />

      {/* 6. Pre-Footer Call to Action Banner */}
      <section className="py-20 bg-gradient-to-b from-white to-[#F2FAFF] border-t border-[#D5D9DC]">
        <div className="w-full px-4 sm:px-6 md:px-10 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2FAFF] border border-[#86B0FF] text-xs font-semibold text-[#1B61EB]">
            <Sparkles className="w-3.5 h-3.5 text-[#1B61EB]" />
            <span>INSTANT RESEARCH WORKSPACE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F2027] tracking-tight">
            Ready to turn complex questions into verified reports?
          </h2>

          <p className="text-base text-[#53616A] max-w-xl mx-auto leading-relaxed">
            Experience the future of research with autonomous agents planning, gathering, synthesizing, and auditing in real-time.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1B61EB] hover:bg-[#1551CA] text-white font-semibold text-sm px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer group"
            >
              <span>Get Started Now</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-[#7D878D]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Real-time multi-agent execution
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              100% primary source audits
            </span>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <LandingFooter
        onGetStarted={onGetStarted}
        onNavigateTab={(tab) => {
          if (onNavigate) onNavigate(tab);
        }}
      />
    </div>
  );
};

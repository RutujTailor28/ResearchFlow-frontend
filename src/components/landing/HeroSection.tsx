import React from 'react';
import { 
  Sparkles, 
  ArrowUpRight, 
  Play, 
  Compass, 
  Search, 
  ShieldCheck, 
  FileText,
  ChevronRight
} from 'lucide-react';
import { LeftFloatingCard, RightFloatingCard } from './FloatingCards';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const scrollToWorkflow = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 max-w-full">
      {/* Soft Blurred Gradient Ambient Glows (contained to prevent horizontal overflow) */}
      <div 
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[650px] -z-10 overflow-hidden"
        aria-hidden="true"
      >
        {/* Mint / Seafoam Glow on top-left */}
        <div className="absolute top-10 left-12 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-[#7AA5A7]/15 blur-[90px]" />
        {/* Lime Yellow Accent subtle glow */}
        <div className="absolute top-28 left-48 w-52 sm:w-60 h-52 sm:h-60 rounded-full bg-[#DBF262]/20 blur-[80px]" />
        {/* Sky Blue Glow in center */}
        <div className="absolute top-4 left-1/3 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[#86B0FF]/25 blur-[100px]" />
        {/* Soft Lavender / Sky Glow on top-right */}
        <div className="absolute top-12 right-16 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-[#86B0FF]/20 blur-[90px]" />
        <div className="absolute top-36 right-36 w-52 sm:w-64 h-52 sm:h-64 rounded-full bg-[#DBF262]/10 blur-[80px]" />
      </div>

      <div className="w-full px-4 sm:px-6 md:px-10 relative">
        {/* Top Centered Hero Pill Badge */}
        <div className="flex justify-center mb-5 sm:mb-6">
          <div 
            onClick={onGetStarted}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#D5D9DC] text-[11px] sm:text-xs text-[#24343B] font-medium shadow-2xs hover:border-[#86B0FF] transition-all cursor-pointer group max-w-full"
          >
            <span className="font-semibold text-[10px] sm:text-[11px] text-[#1B61EB] bg-[#F2FAFF] border border-[#86B0FF]/60 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
              New
            </span>
            <span className="flex items-center gap-1 truncate">
              <Sparkles className="w-3.5 h-3.5 text-[#1B61EB] shrink-0" />
              <span className="truncate">Multi-Agent Research Swarm</span>
            </span>
            <ChevronRight className="w-3 h-3 text-[#7D878D] group-hover:translate-x-0.5 transition-transform shrink-0" />
          </div>
        </div>

        {/* Main Hero Container with Floating Cards */}
        <div className="relative">
          {/* Left Floating Card - Positioned on large desktop */}
          <div className="hidden xl:block absolute left-0 top-12 -translate-x-2 2xl:-translate-x-4 z-10">
            <LeftFloatingCard />
          </div>

          {/* Right Floating Card - Positioned on large desktop */}
          <div className="hidden xl:block absolute right-0 top-12 translate-x-2 2xl:translate-x-4 z-10">
            <RightFloatingCard />
          </div>

          {/* Central Hero Text Block */}
          <div className="w-full max-w-5xl mx-auto text-center space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold tracking-tight text-[#0F2027] leading-[1.1]">
              <span>Research smarter with</span>
              <br />
              <span className="text-[#0F2027]">
                your AI team.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#53616A] max-w-2xl mx-auto leading-relaxed font-normal px-2">
              Watch specialized AI agents plan your research, analyze reliable sources, write structured reports, and verify every important claim — working in parallel.
            </p>

            {/* Capability Chips Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 sm:pt-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/90 border border-[#D5D9DC] text-[11px] sm:text-xs font-medium text-[#24343B] shadow-2xs">
                <Compass className="w-3.5 h-3.5 text-[#1B61EB]" />
                <span>AI Planning</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/90 border border-[#D5D9DC] text-[11px] sm:text-xs font-medium text-[#24343B] shadow-2xs">
                <Search className="w-3.5 h-3.5 text-[#7AA5A7]" />
                <span>Parallel Research</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/90 border border-[#D5D9DC] text-[11px] sm:text-xs font-medium text-[#24343B] shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Source Verification</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/90 border border-[#D5D9DC] text-[11px] sm:text-xs font-medium text-[#24343B] shadow-2xs">
                <FileText className="w-3.5 h-3.5 text-[#1B61EB]" />
                <span>Report Generation</span>
              </div>
            </div>

            {/* Hero CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 sm:pt-4">
              <button
                id="hero-get-started-btn"
                onClick={onGetStarted}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1B61EB] hover:bg-[#1551CA] text-white text-sm font-semibold px-7 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-md hover:shadow-lg transition-all group cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button
                id="hero-how-it-works-btn"
                onClick={scrollToWorkflow}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/90 hover:bg-white text-[#0F2027] border border-[#D5D9DC] text-sm font-medium px-6 sm:px-7 py-3 sm:py-3.5 rounded-full shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-[#1B61EB] fill-[#1B61EB]" />
                <span>See How It Works</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Floating Cards Display (Stacked below CTAs, perfectly centered and responsive) */}
        <div className="xl:hidden mt-10 sm:mt-12 flex flex-col md:flex-row items-center justify-center gap-5 sm:gap-6">
          <LeftFloatingCard />
          <RightFloatingCard />
        </div>
      </div>
    </section>
  );
};

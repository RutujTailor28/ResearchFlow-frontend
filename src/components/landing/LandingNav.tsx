import React, { useState } from 'react';
import { Sparkles, ArrowRight, Menu, X, ArrowUpRight, Radio } from 'lucide-react';

interface LandingNavProps {
  onGetStarted: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({
  onGetStarted,
  onNavigateTab
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (onNavigateTab) {
      onNavigateTab(sectionId);
    }
  };

  const handleLiveResearchClick = () => {
    setMobileMenuOpen(false);
    if (onNavigateTab) {
      onNavigateTab('live');
    } else {
      onGetStarted();
    }
  };

  const handleGetStartedClick = () => {
    setMobileMenuOpen(false);
    onGetStarted();
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#F2FAFF]/90 border-b border-[#D5D9DC]/70 transition-all">
      <div className="w-full px-4 sm:px-6 md:px-10 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={handleGetStartedClick}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none shrink-0"
          id="landing-logo"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#1B61EB] rounded-xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-[#DBF262] rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-[#DBF262] rounded-full"></div>
            </div>
          </div>
          <span className="font-bold text-base sm:text-lg tracking-tight text-[#0F2027]">
            ResearchFlow
          </span>
        </div>

        {/* Center Desktop Navigation (hidden below md: 768px) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#53616A]">
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-[#0F2027] transition-colors cursor-pointer py-1"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="hover:text-[#0F2027] transition-colors cursor-pointer py-1"
          >
            Agents
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="hover:text-[#0F2027] transition-colors cursor-pointer py-1"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('workflow')}
            className="hover:text-[#0F2027] transition-colors cursor-pointer py-1"
          >
            Workflow
          </button>
          <button
            onClick={handleLiveResearchClick}
            className="hover:text-[#1B61EB] transition-colors cursor-pointer py-1 flex items-center gap-1.5 text-[#24343B]"
          >
            <span>Research</span>
            <span className="text-[10px] bg-[#DBF262] text-[#0F2027] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
              Live
            </span>
          </button>
        </nav>

        {/* Right CTA Actions for Desktop/Tablet */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          <button
            id="landing-nav-cta"
            onClick={handleGetStartedClick}
            className="group inline-flex items-center gap-2 bg-[#1B61EB] hover:bg-[#1551CA] text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Get Started</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Actions (< md: 768px) */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={handleGetStartedClick}
            className="hidden xs:inline-flex items-center gap-1 bg-[#1B61EB] text-white text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer shadow-2xs"
          >
            <span>Get Started</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#53616A] hover:text-[#0F2027] hover:bg-white/80 active:bg-white transition-colors border border-[#D5D9DC]/60"
            aria-label="Toggle Navigation Menu"
            id="mobile-nav-toggle"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#0F2027]" /> : <Menu className="w-5 h-5 text-[#0F2027]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 sm:px-6 pt-3 pb-6 bg-[#F2FAFF] border-b border-[#D5D9DC] shadow-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col divide-y divide-[#D5D9DC]/60">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left text-sm font-medium text-[#24343B] hover:text-[#1B61EB] py-3 transition-colors flex items-center justify-between"
            >
              <span>How It Works</span>
              <span className="text-xs text-[#7D878D]">Pipeline</span>
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-left text-sm font-medium text-[#24343B] hover:text-[#1B61EB] py-3 transition-colors flex items-center justify-between"
            >
              <span>Agents</span>
              <span className="text-xs text-[#7D878D]">Swarm</span>
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-left text-sm font-medium text-[#24343B] hover:text-[#1B61EB] py-3 transition-colors flex items-center justify-between"
            >
              <span>Features</span>
              <span className="text-xs text-[#7D878D]">Capabilities</span>
            </button>
            <button
              onClick={() => scrollToSection('workflow')}
              className="text-left text-sm font-medium text-[#24343B] hover:text-[#1B61EB] py-3 transition-colors flex items-center justify-between"
            >
              <span>Workflow</span>
              <span className="text-xs text-[#7D878D]">Interactive</span>
            </button>
            <button
              onClick={handleLiveResearchClick}
              className="text-left text-sm font-medium text-[#24343B] hover:text-[#1B61EB] py-3 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>Research Workspace</span>
                <span className="text-[10px] bg-[#DBF262] text-[#0F2027] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Live
                </span>
              </div>
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            </button>
          </div>

          <div className="pt-4">
            <button
              onClick={handleGetStartedClick}
              className="w-full text-center bg-[#1B61EB] hover:bg-[#1551CA] text-white text-sm font-semibold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started Now</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

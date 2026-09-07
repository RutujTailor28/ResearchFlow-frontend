'use client';

import React, { useState } from 'react';
import { ResearchProvider, useResearch } from './context/ResearchContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { LandingPageView } from './components/landing/LandingPageView';
import { NewResearchView } from './components/research/NewResearchView';
import { PlanReviewView } from './components/plan/PlanReviewView';
import { LiveRunView } from './components/live/LiveRunView';
import { ReportView } from './components/report/ReportView';
import { HistoryView } from './components/history/HistoryView';
import { AgentsOverviewView } from './components/agents/AgentsOverviewView';

const MainContent: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useResearch();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Marketing landing first — Get Started opens Create Research Brief workspace
  if (currentScreen === 'landing') {
    return (
      <LandingPageView
        onGetStarted={() => setCurrentScreen('new')}
        onNavigate={(screen) => setCurrentScreen(screen)}
      />
    );
  }

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'new':
        return <NewResearchView />;
      case 'plan':
        return <PlanReviewView />;
      case 'live':
        return <LiveRunView />;
      case 'report':
        return <ReportView />;
      case 'history':
        return <HistoryView />;
      case 'agents':
        return <AgentsOverviewView />;
      default:
        return <NewResearchView />;
    }
  };

  const isFullHeightScreen = currentScreen === 'live';

  return (
    <div className="flex h-screen w-screen bg-[#F2FAFF] overflow-hidden text-[#0F2027] font-sans antialiased">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <TopHeader onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        <main
          className={`flex-1 min-w-0 ${
            isFullHeightScreen
              ? 'overflow-hidden flex flex-col'
              : 'overflow-y-auto'
          }`}
        >
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ResearchProvider>
      <MainContent />
    </ResearchProvider>
  );
}

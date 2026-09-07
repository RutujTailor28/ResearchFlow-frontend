import React, { useState } from 'react';
import {
  PlusCircle,
  History,
  FileText,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  X
} from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';
import { ActiveScreen } from '../../types';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed: propCollapsed,
  onToggleCollapse: propToggle,
  isMobileOpen,
  onCloseMobile
}) => {
  const { currentScreen, setCurrentScreen, isSimulating, liveAgents } = useResearch();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const collapsed = propCollapsed !== undefined ? propCollapsed : internalCollapsed;
  const toggleCollapsed = propToggle || (() => setInternalCollapsed(!internalCollapsed));

  const agentBadgeCount = liveAgents.length || 7;

  const navItems: { id: ActiveScreen; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'new', label: 'New Research', icon: PlusCircle },
    { id: 'history', label: 'Research History', icon: History },
    { id: 'report', label: 'Reports', icon: FileText },
    { id: 'agents', label: 'Agent Activity', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (screenId: ActiveScreen) => {
    setCurrentScreen(screenId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const renderNavContent = (isMobileView: boolean = false) => (
    <>
      {/* Brand Header */}
      <div className="p-4 sm:p-6 flex items-center justify-between border-b border-[#24343B] h-16 shrink-0">
        <div
          onClick={() => handleNavClick('new')}
          className="flex items-center gap-2 cursor-pointer overflow-hidden group"
          id={isMobileView ? "mobile-sidebar-logo" : "sidebar-logo"}
        >
          <div className="w-8 h-8 bg-[#1B61EB] rounded-lg flex items-center justify-center shrink-0">
            <div className="w-4 h-4 border-2 border-[#DBF262] rounded-full"></div>
          </div>
          {(!collapsed || isMobileView) && (
            <span className="font-bold text-lg tracking-tight text-white">ResearchFlow</span>
          )}
        </div>

        {/* Action button: Close on mobile, Collapse on desktop */}
        {isMobileView ? (
          <button
            onClick={onCloseMobile}
            className="w-8 h-8 rounded-md text-[#A0A8AD] hover:text-white hover:bg-[#24343B] flex items-center justify-center transition-colors shrink-0"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            id="sidebar-toggle-btn"
            onClick={toggleCollapsed}
            className="w-7 h-7 rounded-md text-[#A0A8AD] hover:text-white hover:bg-[#24343B] flex items-center justify-center transition-colors shrink-0"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Live Running Indicator Quick Jump */}
      {isSimulating && (
        <div className="px-4 pt-3 pb-1 shrink-0">
          <button
            id={isMobileView ? "mobile-sidebar-live-jump-btn" : "sidebar-live-jump-btn"}
            onClick={() => handleNavClick('live')}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-md bg-[#24343B] border border-[#1B61EB]/50 text-[#86B0FF] text-xs font-medium transition-all hover:bg-[#1B61EB]/20 cursor-pointer',
              collapsed && !isMobileView && 'justify-center px-0'
            )}
            title="Live Research in Progress"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#86B0FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1B61EB]"></span>
            </span>
            {(!collapsed || isMobileView) && (
              <div className="flex items-center justify-between w-full truncate">
                <span className="truncate font-medium text-[#F2FAFF]">Live Run Active</span>
                <span className="text-[10px] font-mono uppercase bg-[#DBF262] text-[#0F2027] px-1 py-0.5 rounded font-bold">
                  REC
                </span>
              </div>
            )}
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="p-4 flex flex-col gap-1 flex-1 overflow-y-auto" id={isMobileView ? "mobile-sidebar-nav" : "sidebar-nav"}>
        {(!collapsed || isMobileView) && (
          <div className="px-3 py-2 text-xs font-semibold text-[#7D878D] uppercase tracking-wider mb-1">
            Menu
          </div>
        )}
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id || (item.id === 'new' && currentScreen === 'plan');

          return (
            <div
              key={item.id}
              id={isMobileView ? `mobile-nav-item-${item.id}` : `nav-item-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md font-medium cursor-pointer transition-colors text-xs relative min-w-0',
                isActive
                  ? 'bg-[#1B61EB] text-white shadow-xs'
                  : 'text-[#A0A8AD] hover:bg-[#24343B] hover:text-white',
                collapsed && !isMobileView && 'justify-center px-2'
              )}
              title={collapsed && !isMobileView ? item.label : undefined}
            >
              {isActive && (
                <span className="absolute left-1 w-1 h-3.5 bg-[#DBF262] rounded-full"></span>
              )}
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  isActive ? 'text-white' : 'text-[#A0A8AD]'
                )}
              />
              {(!collapsed || isMobileView) && (
                <span className="truncate min-w-0 flex-1">{item.label}</span>
              )}
              {(!collapsed || isMobileView) && item.id === 'agents' && (
                <span
                  className={cn(
                    'shrink-0 whitespace-nowrap text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border',
                    isActive
                      ? 'bg-white/15 text-[#DBF262] border-[#DBF262]/50'
                      : 'bg-[#24343B] text-[#DBF262] border-[#DBF262]/40'
                  )}
                >
                  {agentBadgeCount} Active
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Orchestrator Quick Status Widget */}
      {(!collapsed || isMobileView) && (
        <div className="p-3 mx-4 mb-4 rounded-lg bg-[#24343B] border border-[#53616A]/40 text-[11px] shrink-0">
          <div className="flex items-center justify-between text-[#D5D9DC] font-medium mb-1 gap-2">
            <span className="flex items-center gap-1.5 text-xs text-white min-w-0">
              <Zap className="w-3.5 h-3.5 text-[#DBF262] shrink-0" />
              <span className="truncate">Agent Cluster</span>
            </span>
            <span className="inline-flex items-center gap-1 shrink-0 whitespace-nowrap text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Nominal
            </span>
          </div>
          <p className="text-[#A0A8AD] leading-relaxed text-[11px]">
            Parallel retrieval enabled. Search grounding active.
          </p>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (>= 1024px: lg) */}
      <aside
        id="app-sidebar"
        className={cn(
          'hidden lg:flex w-[240px] h-full bg-[#0F2027] border-r border-[#24343B] flex-col shrink-0 transition-all duration-300 z-30 select-none sticky top-0',
          collapsed && 'w-[72px]'
        )}
      >
        {renderNavContent(false)}
      </aside>

      {/* Mobile Drawer Overlay (< 1024px: < lg) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <aside className="relative w-[280px] max-w-[85vw] h-full bg-[#0F2027] border-r border-[#24343B] flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200 select-none">
            {renderNavContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};

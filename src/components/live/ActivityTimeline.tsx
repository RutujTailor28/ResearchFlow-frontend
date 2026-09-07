import React, { useState } from 'react';
import {
  Terminal,
  Search,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  PenTool,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Code2,
  Clock,
  Coins
} from 'lucide-react';
import { AgentTechnicalEvent } from '../../types';
import { cn } from '../../lib/utils';

interface ActivityTimelineProps {
  events: AgentTechnicalEvent[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ events }) => {
  const [expandedId, setExpandedId] = useState<string | null>(events[0]?.id || null);

  const getBadgeConfig = (type: AgentTechnicalEvent['badgeType']) => {
    switch (type) {
      case 'search':
        return { icon: Search, color: 'text-[#1B61EB] bg-[#F2FAFF] border-[#86B0FF]' };
      case 'read':
        return { icon: BookOpen, color: 'text-[#7AA5A7] bg-[#7AA5A7]/10 border-[#7AA5A7]/30' };
      case 'finding':
        return { icon: CheckCircle2, color: 'text-[#1B61EB] bg-[#1B61EB]/10 border-[#86B0FF]' };
      case 'write':
        return { icon: PenTool, color: 'text-[#1B61EB] bg-[#F2FAFF] border-[#86B0FF]' };
      case 'verify':
        return { icon: ShieldCheck, color: 'text-[#7AA5A7] bg-[#7AA5A7]/15 border-[#7AA5A7]/40' };
      case 'alert':
        return { icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 border-amber-200' };
      case 'plan':
      default:
        return { icon: Terminal, color: 'text-[#53616A] bg-[#F2FAFF] border-[#D5D9DC]' };
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="flex flex-col h-full bg-[#F2FAFF]/30 border-t border-[#D5D9DC] overflow-hidden">
      {/* Header matching Geometric Balance */}
      <div className="p-4 border-b border-[#D5D9DC] bg-[#F2FAFF]/60 flex items-center justify-between shrink-0">
        <span className="text-[10px] font-bold text-[#7D878D] uppercase tracking-wider">Recent Events</span>
        <span className="text-[10px] text-[#1B61EB] font-medium cursor-pointer">
          {events.length} Logged
        </span>
      </div>

      {/* Events List */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {events.length === 0 ? (
          <div className="text-center py-6 text-xs text-[#7D878D]">
            Awaiting agent dispatch events...
          </div>
        ) : (
          events.map((event, index) => {
            const isExpanded = expandedId === event.id;
            const badge = getBadgeConfig(event.badgeType);
            const Icon = badge.icon;

            return (
              <div
                key={`${event.id}-${index}`}
                id={`timeline-event-${event.id}`}
                className={cn(
                  'rounded-lg border transition-all text-xs bg-white overflow-hidden',
                  isExpanded ? 'border-[#86B0FF] shadow-2xs' : 'border-[#D5D9DC] hover:border-[#86B0FF]'
                )}
              >
                {/* Event Summary Bar */}
                <div
                  onClick={() => toggleExpand(event.id)}
                  className="p-2.5 flex items-start justify-between gap-2 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <span className="font-mono text-[10px] text-[#7D878D] shrink-0 mt-0.5">
                      {event.timestamp}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#24343B] font-medium leading-tight truncate">
                        <strong className="text-[#0F2027] font-semibold mr-1">{event.agentName}:</strong>
                        {event.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[#7D878D] shrink-0">
                    {event.toolName && (
                      <span className="font-mono text-[9px] bg-[#F2FAFF] text-[#1B61EB] border border-[#86B0FF]/40 px-1.5 py-0.2 rounded hidden sm:inline-block">
                        {event.toolName}
                      </span>
                    )}
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </div>
                </div>

                {/* Expandable Technical Details in Monospace */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 border-t border-[#D5D9DC] bg-[#F2FAFF]/40 text-[10px] space-y-2 font-mono">
                    <div className="grid grid-cols-2 gap-2 text-[#7D878D] pt-1">
                      <div>
                        <span>Tool: </span>
                        <span className="font-semibold text-[#0F2027]">{event.toolName || 'CoreAgentLogic'}</span>
                      </div>
                      <div className="text-right">
                        <span>Runtime: </span>
                        <span className="text-[#0F2027]">{event.durationSec}s</span>
                        {event.tokens && (
                          <span className="ml-1 text-[#53616A]">({event.tokens} tok)</span>
                        )}
                      </div>
                    </div>

                    {event.input && (
                      <div className="p-2 rounded bg-white border border-[#D5D9DC] space-y-0.5">
                        <span className="text-[9px] font-semibold text-[#7D878D] uppercase tracking-wider block">
                          Tool Input:
                        </span>
                        <div className="text-[#0F2027] text-[10px] break-all leading-relaxed">
                          {event.input}
                        </div>
                      </div>
                    )}

                    {event.output && (
                      <div className="p-2 rounded bg-white border border-[#D5D9DC] space-y-0.5">
                        <span className="text-[9px] font-semibold text-[#7D878D] uppercase tracking-wider block">
                          Execution Output:
                        </span>
                        <div className="text-[#0F2027] text-[10px] break-all leading-relaxed">
                          {event.output}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

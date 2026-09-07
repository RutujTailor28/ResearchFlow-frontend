import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Search,
  BookOpen,
  PenTool,
  ShieldCheck,
  Compass,
  Cpu,
  FileText
} from 'lucide-react';
import { AgentInfo, AgentStatus } from '../../types';
import { cn } from '../../lib/utils';

interface AgentCardProps {
  agent: AgentInfo;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const getRoleIcon = () => {
    switch (agent.roleCategory) {
      case 'planner':
        return Compass;
      case 'researcher':
        return Search;
      case 'writer':
        return PenTool;
      case 'verifier':
        return ShieldCheck;
      default:
        return Cpu;
    }
  };

  const RoleIcon = getRoleIcon();

  const isRunning = agent.status === 'running';
  const isCompleted = agent.status === 'completed';
  const isPending = agent.status === 'pending';

  return (
    <div
      id={`agent-card-${agent.id}`}
      className={cn(
        'p-3 rounded-lg border transition-all duration-200 select-none',
        isRunning
          ? 'border-[#86B0FF] bg-[#F2FAFF]'
          : isCompleted
          ? 'border-[#D5D9DC] bg-white'
          : 'border-[#D5D9DC] bg-white opacity-60'
      )}
    >
      {/* Header with Title and Geometric Status Badge */}
      <div className="flex justify-between items-start mb-1.5">
        <span className="text-xs font-bold text-[#0F2027] flex items-center gap-1.5">
          <RoleIcon className={cn('w-3.5 h-3.5', isRunning ? 'text-[#1B61EB]' : isCompleted ? 'text-[#7AA5A7]' : 'text-[#7D878D]')} />
          {agent.name}
        </span>

        {isCompleted && (
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
            ✓ COMPLETE
          </span>
        )}

        {isRunning && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1B61EB] animate-pulse"></div>
            <span className="text-[10px] text-[#1B61EB] font-bold uppercase">
              {agent.roleCategory === 'researcher' ? 'SEARCHING' : 'ACTIVE'}
            </span>
          </div>
        )}

        {isPending && (
          <span className="text-[10px] text-[#7D878D] font-bold uppercase">
            {agent.roleCategory === 'writer' ? 'WAITING' : 'PENDING'}
          </span>
        )}

        {!isCompleted && !isRunning && !isPending && (
          <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded uppercase">
            {agent.status}
          </span>
        )}
      </div>

      {/* Description / Query Text */}
      <div
        className={cn(
          'text-[11px] leading-relaxed line-clamp-2',
          isRunning ? 'text-[#24343B] font-medium' : isCompleted ? 'text-[#53616A]' : 'text-[#7D878D]'
        )}
      >
        {isRunning && agent.roleCategory === 'researcher' ? (
          <span>Query: "{agent.currentAction}"</span>
        ) : (
          <span>{agent.currentAction}</span>
        )}
      </div>

      {/* Mini Progress Bar for active running agents */}
      {isRunning && (
        <div className="mt-2 h-1 w-full bg-[#86B0FF]/25 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1B61EB] transition-all duration-300"
            style={{ width: `${Math.min(95, Math.max(30, (agent.elapsedSec * 18) % 100))}%` }}
          ></div>
        </div>
      )}

      {/* Bottom Technical Metric Subtext */}
      <div className="mt-2 pt-1.5 border-t border-[#D5D9DC]/70 flex items-center justify-between text-[10px] font-mono text-[#7D878D]">
        <div className="flex items-center gap-2">
          {agent.sourcesCount !== undefined && agent.sourcesCount > 0 && (
            <span>
              <strong className="text-[#0F2027]">{agent.sourcesCount}</strong> sources
            </span>
          )}
          {agent.findingsCount !== undefined && agent.findingsCount > 0 && (
            <span>
              <strong className="text-[#0F2027]">{agent.findingsCount}</strong> findings
            </span>
          )}
          {(!agent.sourcesCount || agent.sourcesCount === 0) && (
            <span>{agent.elapsedSec > 0 ? `${agent.elapsedSec}s elapsed` : 'Standby'}</span>
          )}
        </div>

        {agent.tokens > 0 && (
          <span className="text-[#53616A]">
            {agent.tokens.toLocaleString()} tok
          </span>
        )}
      </div>
    </div>
  );
};

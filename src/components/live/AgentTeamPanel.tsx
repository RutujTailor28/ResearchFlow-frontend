import React from 'react';
import { Bot, Activity, Layers, Cpu, Zap } from 'lucide-react';
import { AgentInfo } from '../../types';
import { AgentCard } from './AgentCard';

interface AgentTeamPanelProps {
  agents: AgentInfo[];
}

export const AgentTeamPanel: React.FC<AgentTeamPanelProps> = ({ agents }) => {
  const activeCount = agents.filter(a => a.status === 'running').length;
  const completedCount = agents.filter(a => a.status === 'completed').length;

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Panel Header */}
      <div className="p-4 border-b border-[#D5D9DC] bg-[#F2FAFF]/50">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#7D878D] uppercase tracking-wider">
            Agent Team & Orchestration
          </h2>
          {activeCount > 0 ? (
            <span className="text-[10px] font-mono text-[#0F2027] bg-[#DBF262] px-2 py-0.5 rounded font-bold">
              {activeCount} ACTIVE
            </span>
          ) : (
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
              {completedCount}/{agents.length} DONE
            </span>
          )}
        </div>
      </div>

      {/* Agents List */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
};

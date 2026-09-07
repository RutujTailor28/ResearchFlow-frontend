import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  X,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { ResearchRun } from '../../types';
import { cn } from '../../lib/utils';

interface TimelineReplayModalProps {
  run: ResearchRun | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TimelineReplayModal: React.FC<TimelineReplayModalProps> = ({
  run,
  isOpen,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState<1 | 2>(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const replayEvents = [
    { time: '00:00', title: 'Planner Agent Initialized', agent: 'Planner Agent', desc: 'Ontology mapping and structural brief parsing.' },
    { time: '00:08', title: 'Research Plan Formulated', agent: 'Planner Agent', desc: 'Synthesized 5 research sections and 15 targeted questions.' },
    { time: '00:15', title: 'Researcher Alpha Dispatched', agent: 'Researcher Alpha', desc: 'Targeting clinical validation studies and trial datasets.' },
    { time: '00:17', title: 'Researcher Beta Dispatched', agent: 'Researcher Beta', desc: 'Targeting hospital operational metrics and physician survey data.' },
    { time: '00:20', title: 'Parallel Web Search Executed', agent: 'Researcher Alpha & Beta', desc: 'Querying WHO, PubMed, FDA databases via grounded tools.' },
    { time: '00:28', title: 'Primary Source Verified (WHO)', agent: 'Researcher Alpha', desc: 'Extracted peer-reviewed benchmarks on diagnostic accuracy.' },
    { time: '00:33', title: 'Conflicting Data Flagged', agent: 'Researcher Gamma', desc: 'Discrepancy in adoption statistics isolated between McKinsey & AMA.' },
    { time: '00:37', title: 'Lead Writer Synthesized Draft', agent: 'Lead Writer', desc: 'Drafted 5 sections with integrated citations [1]-[6].' },
    { time: '00:42', title: 'Verification & Fact-Check Completed', agent: 'Verifier Agent', desc: 'Audit complete: 28 claims verified, confidence rating: High (94%).' }
  ];

  // Auto-play timer
  useEffect(() => {
    if (!isOpen) return;

    if (isPlaying) {
      const intervalMs = speed === 1 ? 1500 : 750;
      timerRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= replayEvents.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isOpen, speed, replayEvents.length]);

  if (!isOpen || !run) return null;

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const progressPercent = Math.round(((currentStep + 1) / replayEvents.length) * 100);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl border border-[#D5D9DC] shadow-2xl max-w-2xl w-full p-4 sm:p-6 text-left space-y-4 sm:space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-[#1B61EB] bg-[#F2FAFF] border border-[#86B0FF] px-2 py-0.5 rounded font-semibold">
                EXECUTION REPLAY
              </span>
              <span className="text-xs text-[#7D878D] truncate max-w-[200px] sm:max-w-xs">
                {run.topic}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#0F2027] mt-1">
              Multi-Agent Orchestration Replay
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7D878D] hover:text-[#0F2027] hover:bg-[#F2FAFF] cursor-pointer shrink-0"
            aria-label="Close replay modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Playback Controls Bar */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-[#F2FAFF] border border-[#D5D9DC] flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-[#1B61EB] hover:bg-[#1551CA] text-white transition-colors cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            <button
              onClick={handleRestart}
              className="p-2 rounded-lg bg-white border border-[#D5D9DC] text-[#53616A] hover:text-[#0F2027] hover:bg-[#F2FAFF] transition-colors cursor-pointer"
              title="Restart timeline"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              onClick={() => setSpeed(speed === 1 ? 2 : 1)}
              className="px-2 sm:px-2.5 py-1.5 rounded-lg bg-white border border-[#D5D9DC] text-xs font-mono font-medium text-[#53616A] hover:text-[#0F2027] transition-colors cursor-pointer"
            >
              {speed}x Speed
            </button>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs text-[#7D878D]">
            <Clock className="w-3.5 h-3.5" />
            <span>{replayEvents[currentStep]?.time || '00:00'}</span>
            <span>/</span>
            <span>00:42</span>
          </div>
        </div>

        {/* Progress Timeline bar */}
        <div className="w-full bg-[#D5D9DC] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#1B61EB] h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Event List with active indicator */}
        <div className="space-y-2 max-h-60 sm:max-h-72 overflow-y-auto pr-1">
          {replayEvents.map((evt, idx) => {
            const isCurrent = idx === currentStep;
            const isPassed = idx < currentStep;

            return (
              <div
                key={idx}
                className={cn(
                  'p-2.5 sm:p-3 rounded-xl border transition-all text-xs flex items-start gap-2.5 sm:gap-3',
                  isCurrent
                    ? 'bg-[#F2FAFF] border-[#86B0FF] ring-1 ring-[#1B61EB]/20 shadow-xs'
                    : isPassed
                    ? 'bg-white border-[#D5D9DC] opacity-90'
                    : 'bg-[#F2FAFF]/40 border-[#D5D9DC]/70 opacity-40'
                )}
              >
                <div className="flex flex-col items-center pt-0.5 shrink-0">
                  <span className="font-mono text-[10px] text-[#7D878D] font-semibold">
                    {evt.time}
                  </span>
                  {isPassed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-1" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-[#1B61EB] animate-ping mt-2"></span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D5D9DC] mt-2"></span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <h5 className={cn('font-semibold text-xs', isCurrent ? 'text-[#1B61EB]' : 'text-[#0F2027]')}>
                      {evt.title}
                    </h5>
                    <span className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#D5D9DC] text-[#53616A]">
                      {evt.agent}
                    </span>
                  </div>
                  <p className="text-[#53616A] text-[11px] mt-0.5 leading-relaxed">
                    {evt.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-[#D5D9DC] flex items-center justify-between text-xs text-[#7D878D] gap-2">
          <span className="truncate">Multi-agent handoff orchestration</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-[#F2FAFF] text-[#24343B] border border-[#D5D9DC] rounded-lg hover:bg-[#D5D9DC]/40 font-medium cursor-pointer shrink-0"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

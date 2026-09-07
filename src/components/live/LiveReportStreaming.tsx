import React from 'react';
import { FileText, Sparkles, CheckCircle2, Bot, BookOpen, AlertCircle, ArrowUpRight } from 'lucide-react';
import { ReportSectionItem } from '../../types';
import { cn } from '../../lib/utils';

interface LiveReportStreamingProps {
  sections: ReportSectionItem[];
  totalPlannedSections: number;
  isCompleted: boolean;
  topic: string;
  onCitationClick?: (citationId: number) => void;
}

export const LiveReportStreaming: React.FC<LiveReportStreamingProps> = ({
  sections,
  totalPlannedSections,
  isCompleted,
  topic,
  onCitationClick
}) => {
  const currentSectionIndex = sections.length;
  const progressPercent = Math.min(100, Math.round((sections.length / Math.max(1, totalPlannedSections)) * 100));

  // Render text with interactive [1], [2] citation badges
  const renderParagraphWithCitations = (text: string) => {
    const parts = text.split(/(\[\d+\])/g);

    return parts.map((part, i) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const citationId = parseInt(match[1], 10);
        return (
          <span
            key={i}
            onClick={() => onCitationClick && onCitationClick(citationId)}
            className="inline-flex items-center justify-center mx-0.5 px-1.5 py-0.2 rounded font-mono text-[11px] font-semibold bg-[#F2FAFF] text-[#1B61EB] hover:bg-[#86B0FF]/20 border border-[#86B0FF] cursor-pointer transition-colors"
            title={`Source citation [${citationId}] - click to view source`}
          >
            [{citationId}]
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <section className="bg-white flex flex-col p-6 sm:p-10 overflow-y-auto shadow-inner h-full">
      <div className="w-full max-w-none">
        {/* Status header row */}
        <div className="flex justify-between items-center mb-6">
          <span className="px-2 py-0.5 rounded text-[10px] bg-[#F2FAFF] text-[#53616A] border border-[#D5D9DC] font-mono">
            {isCompleted ? 'v1.0 (Final)' : 'v0.4 (Draft)'}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7D878D]">
              {isCompleted
                ? `Completed ${sections.length} Sections`
                : `Writing Section ${Math.min(totalPlannedSections, Math.max(1, sections.length))} of ${totalPlannedSections}`}
            </span>
            <div className="w-24 h-1.5 bg-[#D5D9DC]/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1B61EB] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold mb-8 text-[#0F2027] leading-tight">
          {topic}
        </h1>

        {/* Content sections */}
        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-[#7D878D]">
            <div className="w-10 h-10 rounded-lg bg-[#F2FAFF] text-[#1B61EB] border border-[#86B0FF]/40 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <h4 className="font-semibold text-sm text-[#0F2027]">Research Agents Gathering Evidence</h4>
            <p className="text-xs text-[#7D878D] max-w-sm mt-1">
              Writer Agent will synthesize structured modules as primary evidence passes verification.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sections.map((section, sIdx) => {
              const isLastStreamed = sIdx === sections.length - 1 && !isCompleted;

              return (
                <div key={section.id}>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[#7D878D] mb-3">
                    {section.orderNumber}. {section.title}
                  </h4>

                  <div className="space-y-4 text-sm leading-relaxed text-[#24343B]">
                    {section.paragraphs.map((paragraph, pIdx) => {
                      const isStreamingParagraph = isLastStreamed && pIdx === section.paragraphs.length - 1;

                      if (isStreamingParagraph) {
                        return (
                          <div
                            key={pIdx}
                            className="p-3 bg-[#F2FAFF] border-l-4 border-[#1B61EB] rounded text-sm italic text-[#24343B] relative my-3"
                          >
                            <span className="absolute -left-6 top-1 w-1 h-full bg-[#86B0FF]/30 rounded-full"></span>
                            "{paragraph}"
                            <span className="inline-block w-1 h-4 bg-[#1B61EB] ml-1 translate-y-0.5 animate-pulse"></span>
                          </div>
                        );
                      }

                      return (
                        <p key={pIdx} className="leading-relaxed">
                          {renderParagraphWithCitations(paragraph)}
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Waiting for next section visual pulse */}
            {!isCompleted && (
              <div className="p-3 bg-[#F2FAFF] border-l-4 border-[#1B61EB] rounded text-sm italic text-[#53616A] relative mt-4 animate-pulse">
                <span className="absolute -left-6 top-1 w-1 h-full bg-[#86B0FF]/30 rounded-full"></span>
                "Synthesizing institutional findings, aligning with peer-reviewed literature..."
                <span className="inline-block w-1 h-4 bg-[#1B61EB] ml-1 translate-y-0.5 animate-pulse"></span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

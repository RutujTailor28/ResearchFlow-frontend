import React, { useState } from 'react';
import { BookOpen, ExternalLink, Copy, Check, ShieldCheck } from 'lucide-react';
import { SourceItem } from '../../types';

interface SourceBibliographyProps {
  sources: SourceItem[];
}

export const SourceBibliography: React.FC<SourceBibliographyProps> = ({ sources }) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyCitation = (source: SourceItem) => {
    const citation = `[${source.id}] ${source.name} (${source.publishedYear || '2026'}). "${source.title}". Accessed ${source.accessedDate || 'September 2026'}. ${source.url}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(source.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="report-sources-section" className="pt-8 border-t border-[#D5D9DC] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#1B61EB] shrink-0" />
          <h2 className="text-base sm:text-lg font-bold text-[#0F2027]">
            Source Bibliography ({sources.length})
          </h2>
        </div>
        <span className="text-[11px] sm:text-xs text-[#7D878D]">
          Grounding verified across peer-reviewed and official indices
        </span>
      </div>

      <div className="space-y-3">
        {sources.map(source => (
          <div
            key={source.id}
            id={`bib-source-${source.id}`}
            className="p-3 sm:p-3.5 rounded-xl border border-[#D5D9DC] bg-white hover:border-[#86B0FF] transition-all text-xs group"
          >
            <div className="flex flex-col sm:flex-row items-start justify-between gap-2.5 sm:gap-3">
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                {/* Number Badge */}
                <span className="font-mono text-xs font-bold text-[#1B61EB] bg-[#F2FAFF] border border-[#86B0FF] px-2 py-0.5 rounded shrink-0">
                  [{source.id}]
                </span>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-xs text-[#0F2027]">
                      {source.name}
                    </span>
                    <span className="text-[#7D878D]">•</span>
                    <span className="text-[#53616A] font-mono text-[11px] truncate max-w-[180px] sm:max-w-none">
                      {source.domain}
                    </span>
                  </div>

                  <h4 className="font-medium text-xs text-[#24343B] leading-snug">
                    {source.title}
                  </h4>

                  <p className="text-[#53616A] text-[11px] leading-relaxed line-clamp-2">
                    {source.snippet}
                  </p>

                  <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] text-[#7D878D] font-mono">
                    <span>Published: {source.publishedYear || '2026'}</span>
                    <span>•</span>
                    <span>Accessed: {source.accessedDate || 'September 2026'}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">Quality Score: {source.qualityScore}%</span>
                  </div>
                </div>
              </div>

              {/* Source action tools */}
              <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0 pt-1 sm:pt-0">
                <button
                  onClick={() => copyCitation(source)}
                  className="p-1.5 rounded-md text-[#7D878D] hover:text-[#0F2027] hover:bg-[#F2FAFF] transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                  title="Copy citation format"
                >
                  {copiedId === source.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Cite</span>
                    </>
                  )}
                </button>

                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md text-[#1B61EB] hover:bg-[#F2FAFF] transition-colors flex items-center gap-1 text-[11px]"
                  title="Open original publication link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Visit</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

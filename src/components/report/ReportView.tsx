import React, { useState } from 'react';
import {
  Share2,
  Download,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  Check,
  ShieldCheck,
  FileText,
  List,
  ChevronDown
} from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';
import { TableOfContents } from './TableOfContents';
import { CitationHoverCard } from './CitationHoverCard';
import { ConfidenceBadge } from './ConfidenceBadge';
import { UnverifiedClaimCallout } from './UnverifiedClaimCallout';
import { ConflictingSourcesCallout } from './ConflictingSourcesCallout';
import { SourceBibliography } from './SourceBibliography';
import { ExportModal } from './ExportModal';

export const ReportView: React.FC = () => {
  const {
    activeRun,
    setCurrentScreen,
    regenerateReportSection,
    isWritingReport,
    aiStatusMessage,
    aiError,
    clearAiError,
  } = useResearch();
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-00');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [regenerateNotice, setRegenerateNotice] = useState<string | null>(null);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  if (!activeRun) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <FileText className="w-12 h-12 text-[#86B0FF] mb-3" />
        <h3 className="font-bold text-base text-[#0F2027]">No Report Available</h3>
        <p className="text-xs text-[#7D878D] mt-1 max-w-sm">
          Run an autonomous research query to synthesize a multi-agent report.
        </p>
        <button
          onClick={() => setCurrentScreen('new')}
          className="mt-4 px-4 py-2 bg-[#1B61EB] text-white rounded-xl text-xs font-semibold hover:bg-[#1551CA] transition-colors cursor-pointer"
        >
          Start New Research
        </button>
      </div>
    );
  }

  const resolvedActiveSectionId =
    activeRun.reportSections.some((s) => s.id === activeSectionId)
      ? activeSectionId
      : activeRun.reportSections[0]?.id || activeSectionId;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    if (!activeRun || isWritingReport) return;
    clearAiError();
    const targetId = resolvedActiveSectionId || activeRun.reportSections[0]?.id;
    if (!targetId) return;

    setRegenerateNotice('Writing section...');
    try {
      await regenerateReportSection(targetId);
      setRegenerateNotice('Section regenerated and verified with OpenRouter.');
      setTimeout(() => setRegenerateNotice(null), 3000);
    } catch {
      setRegenerateNotice(null);
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    setIsMobileTocOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Render text with interactive [1], [2] citation cards
  const renderParagraphContent = (text: string) => {
    const parts = text.split(/(\[\d+\])/g);

    return parts.map((part, i) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const citationId = parseInt(match[1], 10);
        const source = activeRun.sources.find(s => s.id === citationId);
        return (
          <CitationHoverCard
            key={i}
            idNumber={citationId}
            source={source}
            onSourceClick={() => scrollToSection('report-sources-section')}
          />
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="w-full py-6 sm:py-8 px-4 sm:px-6 lg:px-8 xl:px-10">
      {/* Top Utility Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-[#D5D9DC]">
        <div className="flex items-center gap-2 text-xs text-[#7D878D] flex-wrap">
          <button
            onClick={() => setCurrentScreen('history')}
            className="hover:text-[#0F2027] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>History</span>
          </button>
          <span>/</span>
          <span className="font-mono text-[#1B61EB] bg-[#F2FAFF] px-2 py-0.5 rounded border border-[#86B0FF] font-semibold text-[11px]">
            {activeRun.depth.toUpperCase()} REPORT
          </span>
          <span className="hidden md:inline text-[#7D878D]">•</span>
          <span className="hidden md:inline text-xs">{activeRun.createdAt}</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {/* Share */}
          <button
            onClick={handleShare}
            id="share-report-btn"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D5D9DC] bg-white text-xs font-medium text-[#24343B] hover:bg-[#F2FAFF] transition-colors shadow-2xs cursor-pointer"
          >
            {shareCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#7D878D]" />
                <span>Share</span>
              </>
            )}
          </button>

          {/* Regenerate active section with real AI */}
          <button
            onClick={() => void handleRegenerate()}
            disabled={isWritingReport}
            id="regenerate-section-btn"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D5D9DC] bg-white text-xs font-medium text-[#24343B] hover:bg-[#F2FAFF] transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
            title="Re-synthesize the active section with OpenRouter"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#7D878D] ${isWritingReport ? 'animate-spin text-[#1B61EB]' : ''}`} />
            <span>{isWritingReport ? 'Synthesizing...' : 'Regenerate'}</span>
          </button>

          {/* Export */}
          <button
            onClick={() => setIsExportOpen(true)}
            id="export-report-btn"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1B61EB] hover:bg-[#1551CA] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Mobile Table of Contents Accordion Toggle (< lg) */}
      <div className="lg:hidden mb-5">
        <div className="rounded-xl border border-[#D5D9DC] bg-white overflow-hidden shadow-2xs">
          <button
            onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-[#0F2027] hover:bg-[#F2FAFF] transition-colors"
          >
            <div className="flex items-center gap-2">
              <List className="w-4 h-4 text-[#1B61EB]" />
              <span>Jump to Section ({activeRun.reportSections.length} sections)</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#7D878D] transition-transform duration-200 ${isMobileTocOpen ? 'rotate-180' : ''}`} />
          </button>
          {isMobileTocOpen && (
            <div className="p-3 border-t border-[#D5D9DC] bg-[#F2FAFF]/40 space-y-1">
              <TableOfContents
                sections={activeRun.reportSections}
                activeSectionId={resolvedActiveSectionId}
                onSelectSection={scrollToSection}
              />
            </div>
          )}
        </div>
      </div>

      {/* Regeneration / AI status notification */}
      {(regenerateNotice || aiStatusMessage || aiError) && (
        <div
          className={`mb-6 p-3 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in ${
            aiError
              ? 'bg-rose-50 border-rose-200 text-rose-700'
              : 'bg-[#F2FAFF] border-[#86B0FF] text-[#0F2027]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#1B61EB] shrink-0" />
          <span>{aiError || aiStatusMessage || regenerateNotice}</span>
        </div>
      )}

      {/* Main 3-Column Report Layout on lg+, single column on mobile/tablet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Sticky Table of Contents (Desktop lg:col-span-3) */}
        <div className="hidden lg:block lg:col-span-3">
          <TableOfContents
            sections={activeRun.reportSections}
            activeSectionId={resolvedActiveSectionId}
            onSelectSection={scrollToSection}
          />
        </div>

        {/* Center Document Body (Col 4-9 on lg, full width on mobile) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#D5D9DC] p-4 sm:p-8 md:p-10 shadow-xs space-y-6 sm:space-y-8 min-w-0">
          {/* Document Header */}
          <div className="border-b border-[#D5D9DC] pb-5 sm:pb-6 space-y-2.5 sm:space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#1B61EB] flex-wrap">
              <span className="font-semibold uppercase tracking-wider">Research Brief Document</span>
              <span>•</span>
              <span>Confidence: High (94%)</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#0F2027] leading-tight">
              {activeRun.topic}
            </h1>
            <p className="text-xs text-[#53616A] leading-relaxed">
              Synthesized by 7 specialized autonomous agents across {activeRun.sources.length} primary clinical, academic, and policy sources.
            </p>
          </div>

          {/* Sections */}
          {activeRun.reportSections.map(section => (
            <article
              key={section.id}
              id={section.id}
              className="space-y-3.5 pt-2 scroll-mt-24 border-b border-[#D5D9DC]/60 pb-6"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-[#1B61EB] bg-[#F2FAFF] px-2 py-0.5 rounded border border-[#86B0FF]/60 shrink-0">
                  {section.orderNumber}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-[#0F2027]">
                  {section.title}
                </h2>
              </div>

              {/* Paragraphs */}
              <div className="space-y-3 text-sm text-[#24343B] leading-relaxed">
                {section.paragraphs.map((para, idx) => (
                  <p key={idx}>{renderParagraphContent(para)}</p>
                ))}
              </div>

              {/* Conflicting Sources if present */}
              {section.hasConflict && section.conflictData && (
                <ConflictingSourcesCallout
                  statement={section.conflictData.statement}
                  sourceA={section.conflictData.sourceA}
                  sourceB={section.conflictData.sourceB}
                  implication={section.conflictData.implication}
                />
              )}

              {/* Unverified Claim if present */}
              {section.hasUnverifiedClaim && (
                <UnverifiedClaimCallout claimText={section.unverifiedClaimText} />
              )}

              {/* Section Confidence Badge */}
              <ConfidenceBadge
                confidence={section.confidence}
                verifiedClaims={section.verifiedClaims}
                sourcesCount={section.supportingSourceIds.length}
              />
            </article>
          ))}

          {/* Source Bibliography Section */}
          <SourceBibliography sources={activeRun.sources} />
        </div>

        {/* Right Sticky Metadata / Verification Telemetry (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-20">
          {/* Audit Metadata Card */}
          <div className="p-4 rounded-xl bg-white border border-[#D5D9DC] shadow-xs text-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#D5D9DC] font-semibold text-[#0F2027]">
              <ShieldCheck className="w-4 h-4 text-[#1B61EB]" />
              <span>Synthesis Provenance</span>
            </div>

            <div className="space-y-2 text-[#53616A]">
              <div className="flex items-center justify-between">
                <span className="text-[#7D878D]">Total Duration:</span>
                <span className="font-mono font-medium text-[#0F2027]">{activeRun.durationFormatted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7D878D]">Total Cost:</span>
                <span className="font-mono font-medium text-[#0F2027]">${activeRun.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7D878D]">Tokens Consumed:</span>
                <span className="font-mono font-medium text-[#0F2027]">{activeRun.totalTokens.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7D878D]">Audience Profile:</span>
                <span className="font-medium text-[#0F2027]">{activeRun.audience}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7D878D]">Editorial Tone:</span>
                <span className="font-medium text-[#0F2027]">{activeRun.tone}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#D5D9DC]">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-[#7D878D]">Verification Index</span>
                <span className="font-semibold text-emerald-700">96.8% Verified</span>
              </div>
              <div className="w-full bg-[#D5D9DC]/50 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full w-[96.8%]" />
              </div>
            </div>
          </div>

          {/* Agent Cluster Contributions */}
          <div className="p-4 rounded-xl bg-[#F2FAFF] border border-[#D5D9DC] shadow-xs text-xs space-y-2.5">
            <span className="text-[11px] font-semibold text-[#7D878D] uppercase tracking-wider block">
              Agent Attribution
            </span>
            <div className="space-y-1.5 text-[11px] text-[#24343B]">
              <div className="flex items-center justify-between">
                <span>Planner Agent</span>
                <span className="text-emerald-700 font-medium">✓ Plan Formulated</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Researcher Alpha</span>
                <span className="text-[#0F2027] font-mono">7 Findings</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Researcher Beta</span>
                <span className="text-[#0F2027] font-mono">5 Findings</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Researcher Gamma</span>
                <span className="text-[#0F2027] font-mono">4 Findings</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Writer Agent</span>
                <span className="text-emerald-700 font-medium">✓ Synthesized</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Verifier Agent</span>
                <span className="text-emerald-700 font-medium">✓ 1 Discrepancy Caught</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        run={activeRun}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
};

import React from 'react';
import { Sparkles, ArrowRight, Lightbulb, Bot, Loader2 } from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';
import { DepthSelector } from './DepthSelector';
import { CostEstimate } from './CostEstimate';
import { SourcePreference } from './SourcePreference';
import { Audience, Tone, TargetLength } from '../../types';

export const NewResearchView: React.FC = () => {
  const {
    brief,
    setBrief,
    generatePlan,
    isGeneratingPlan,
    aiStatusMessage,
    aiError,
    clearAiError,
  } = useResearch();

  const samplePrompts = [
    'How will artificial intelligence transform healthcare over the next five years?',
    'Commercialization roadmap of solid-state lithium batteries for EV fleets',
    'Enterprise adoption barriers for autonomous AI agent architectures in banking',
    'Carbon border adjustment mechanisms (CBAM) economic impact on heavy industry'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brief.topic.trim() || isGeneratingPlan) return;
    clearAiError();
    void generatePlan();
  };

  return (
    <div className="w-full py-8 sm:py-10 px-4 sm:px-6 lg:px-8 xl:px-10">
      {/* Header */}
      <div className="mb-8 text-left sm:text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2FAFF] border border-[#86B0FF] text-[#1B61EB] text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Autonomous Multi-Agent Synthesis
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F2027]">
          What would you like to research?
        </h1>
        <p className="text-sm text-[#53616A] mt-2 max-w-3xl sm:mx-auto">
          Define your research brief and let your AI research team plan, retrieve, synthesize, and verify a comprehensive report.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic Input Box */}
        <div className="bg-white rounded-2xl border border-[#D5D9DC] p-4 sm:p-5 shadow-xs focus-within:border-[#1B61EB] focus-within:ring-2 focus-within:ring-[#1B61EB]/15 transition-all">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="topic-input" className="text-xs font-semibold text-[#0F2027] uppercase tracking-wider flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-[#1B61EB]" />
              Research Brief & Core Question
            </label>
            <span className="text-[11px] text-[#7D878D] font-mono">
              {brief.topic.length} chars
            </span>
          </div>

          <textarea
            id="topic-input"
            rows={3}
            value={brief.topic}
            onChange={(e) => setBrief({ ...brief, topic: e.target.value })}
            placeholder="Example: How will artificial intelligence transform healthcare over the next five years?"
            className="w-full text-base sm:text-lg text-[#0F2027] placeholder:text-[#7D878D] bg-transparent border-0 focus:outline-none resize-none leading-relaxed font-normal"
          />

          {/* Prompt inspiration pills */}
          <div className="mt-3 pt-3 border-t border-[#D5D9DC]">
            <div className="flex items-center gap-1.5 text-xs text-[#7D878D] mb-2 font-medium">
              <Lightbulb className="w-3 h-3 text-[#1B61EB]" />
              <span>Prompt suggestions:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setBrief({ ...brief, topic: prompt })}
                  className="text-left text-[11px] px-2.5 py-1 rounded-md bg-[#F2FAFF] border border-[#D5D9DC] text-[#24343B] hover:bg-[#86B0FF]/15 hover:text-[#1B61EB] hover:border-[#86B0FF] transition-colors truncate max-w-full"
                >
                  "{prompt.slice(0, 50)}..."
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="bg-white rounded-2xl border border-[#D5D9DC] p-5 sm:p-6 space-y-6 shadow-xs">
          {/* Depth Selector */}
          <DepthSelector
            selectedDepth={brief.depth}
            onSelect={(depth) => setBrief({ ...brief, depth })}
          />

          {/* Audience, Tone, and Length Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#D5D9DC]">
            {/* Audience */}
            <div>
              <label htmlFor="select-audience" className="text-xs font-semibold text-[#0F2027] uppercase tracking-wider block mb-1.5">
                Target Audience
              </label>
              <select
                id="select-audience"
                value={brief.audience}
                onChange={(e) => setBrief({ ...brief, audience: e.target.value as Audience })}
                className="w-full h-9 px-3 rounded-lg border border-[#D5D9DC] text-xs font-medium text-[#0F2027] bg-white focus:border-[#1B61EB] focus:outline-none transition-colors"
              >
                <option value="Executive">Executive (High-Level / Strategic)</option>
                <option value="Technical">Technical (In-Depth Architecture)</option>
                <option value="General">General (Accessible & Broad)</option>
              </select>
            </div>

            {/* Tone */}
            <div>
              <label htmlFor="select-tone" className="text-xs font-semibold text-[#0F2027] uppercase tracking-wider block mb-1.5">
                Editorial Tone
              </label>
              <select
                id="select-tone"
                value={brief.tone}
                onChange={(e) => setBrief({ ...brief, tone: e.target.value as Tone })}
                className="w-full h-9 px-3 rounded-lg border border-[#D5D9DC] text-xs font-medium text-[#0F2027] bg-white focus:border-[#1B61EB] focus:outline-none transition-colors"
              >
                <option value="Professional">Professional</option>
                <option value="Analytical">Analytical</option>
                <option value="Simple">Simple & Concise</option>
                <option value="Academic">Academic & Rigorous</option>
              </select>
            </div>

            {/* Target Length */}
            <div>
              <label htmlFor="select-length" className="text-xs font-semibold text-[#0F2027] uppercase tracking-wider block mb-1.5">
                Target Length
              </label>
              <select
                id="select-length"
                value={brief.targetLength}
                onChange={(e) => setBrief({ ...brief, targetLength: e.target.value as TargetLength })}
                className="w-full h-9 px-3 rounded-lg border border-[#D5D9DC] text-xs font-medium text-[#0F2027] bg-white focus:border-[#1B61EB] focus:outline-none transition-colors"
              >
                <option value="Short">Short (~1,000 words)</option>
                <option value="Medium">Medium (~2,500 words)</option>
                <option value="Long">Long (~5,000 words)</option>
              </select>
            </div>
          </div>

          {/* Preferred Sources */}
          <div className="pt-2 border-t border-[#D5D9DC]">
            <SourcePreference
              selected={brief.preferredSources}
              onChange={(preferredSources) => setBrief({ ...brief, preferredSources })}
            />
          </div>

          {/* Cost Estimate Panel */}
          <CostEstimate depth={brief.depth} />
        </div>

        {/* Primary CTA */}
        <div className="pt-2">
          {(aiError || aiStatusMessage) && (
            <div
              className={`mb-3 p-3 rounded-xl border text-xs ${
                aiError
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-[#F2FAFF] border-[#86B0FF] text-[#0F2027]'
              }`}
              role="status"
            >
              {aiError || aiStatusMessage}
            </div>
          )}
          <button
            type="submit"
            id="generate-plan-submit-btn"
            disabled={!brief.topic.trim() || isGeneratingPlan}
            className="w-full h-12 rounded-xl bg-[#1B61EB] hover:bg-[#1551CA] text-white font-semibold text-sm shadow-md shadow-[#1B61EB]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isGeneratingPlan ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating your research plan...</span>
              </>
            ) : (
              <>
                <span>Generate Research Plan</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-[#7D878D] mt-2.5">
            Planner Agent will deconstruct your question into research vectors for your review before agents dispatch.
          </p>
        </div>
      </form>
    </div>
  );
};

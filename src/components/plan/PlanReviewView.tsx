import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, Check, Save, Layers, Loader2, Sparkles } from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';
import { PlanSectionCard } from './PlanSectionCard';
import { PlanSummary } from './PlanSummary';
import { PlanSectionItem } from '../../types';
import { PLAN_IMPROVE_ACTIONS } from '../../lib/ai/client';
import type { PlanImproveAction } from '../../types/ai';

export const PlanReviewView: React.FC = () => {
  const {
    brief,
    activePlan,
    setActivePlan,
    setCurrentScreen,
    approveAndStartResearch,
    improvePlan,
    isImprovingPlan,
    aiStatusMessage,
    aiError,
    clearAiError,
    planMeta,
  } = useResearch();
  const [draftSaved, setDraftSaved] = useState(false);

  const handleImprove = (action: PlanImproveAction) => {
    if (isImprovingPlan) return;
    clearAiError();
    void improvePlan(action);
  };

  const handleUpdateTitle = (id: string, newTitle: string) => {
    setActivePlan(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
  };

  const handleDeleteSection = (id: string) => {
    setActivePlan(prev => {
      const filtered = prev.filter(s => s.id !== id);
      return filtered.map((s, idx) => ({
        ...s,
        orderNumber: (idx + 1).toString().padStart(2, '0')
      }));
    });
  };

  const handleAddSubQuestion = (id: string, question: string) => {
    setActivePlan(prev => prev.map(s => s.id === id ? { ...s, subQuestions: [...s.subQuestions, question] } : s));
  };

  const handleDeleteSubQuestion = (id: string, qIndex: number) => {
    setActivePlan(prev => prev.map(s => s.id === id ? { ...s, subQuestions: s.subQuestions.filter((_, idx) => idx !== qIndex) } : s));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setActivePlan(prev => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy.map((s, idx) => ({ ...s, orderNumber: (idx + 1).toString().padStart(2, '0') }));
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === activePlan.length - 1) return;
    setActivePlan(prev => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy.map((s, idx) => ({ ...s, orderNumber: (idx + 1).toString().padStart(2, '0') }));
    });
  };

  const handleAddSection = () => {
    const nextNum = (activePlan.length + 1).toString().padStart(2, '0');
    const newSection: PlanSectionItem = {
      id: `sec-custom-${Date.now().toString(36)}`,
      orderNumber: nextNum,
      title: 'New Research Pillar & Empirical Focus',
      subQuestions: [
        'What specific quantitative data validates this area?',
        'What are the primary expert perspectives?'
      ]
    };
    setActivePlan(prev => [...prev, newSection]);
  };

  const handleSaveDraft = () => {
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2500);
  };

  return (
    <div className="w-full py-6 sm:py-8 px-4 sm:px-6 lg:px-8 xl:px-10 pb-28">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs text-[#7D878D] mb-4">
        <button
          onClick={() => setCurrentScreen('new')}
          className="hover:text-[#0F2027] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Edit Brief</span>
        </button>
        <span>/</span>
        <span className="text-[#0F2027] font-medium">Plan Review</span>
      </div>

      {/* Screen Title */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F2027]">
          Review your research plan
        </h1>
        <p className="text-xs sm:text-sm text-[#53616A] mt-1">
          The AI Planner formulated this research structure. Reorder, refine, or add questions before research agents dispatch.
        </p>
      </div>

      {/* Summary Component */}
      <div className="mb-6">
        <PlanSummary brief={brief} sections={activePlan} planSummary={planMeta?.summary} />
      </div>

      {/* AI Plan Improvement Actions */}
      <div className="mb-4 p-3 sm:p-4 rounded-xl bg-white border border-[#D5D9DC] shadow-xs">
        <div className="flex items-center gap-2 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-[#1B61EB]" />
          <span className="text-xs font-semibold text-[#0F2027]">AI Plan Improvements</span>
          {isImprovingPlan && (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#1B61EB]">
              <Loader2 className="w-3 h-3 animate-spin" />
              {aiStatusMessage || 'Improving plan...'}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PLAN_IMPROVE_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              disabled={isImprovingPlan}
              onClick={() => handleImprove(action.id)}
              id={`improve-plan-${action.id}-btn`}
              className="px-2.5 py-1.5 rounded-lg border border-[#D5D9DC] bg-[#F2FAFF] text-[11px] font-medium text-[#24343B] hover:border-[#86B0FF] hover:text-[#1B61EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {action.label}
            </button>
          ))}
        </div>
        {aiError && (
          <p className="mt-2 text-xs text-rose-700" role="alert">
            {aiError}
          </p>
        )}
      </div>

      {/* Section List Header */}
      <div className="flex items-center justify-between mb-3 pt-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#1B61EB]" />
          <h2 className="text-sm font-semibold text-[#0F2027]">
            Research Sections ({activePlan.length})
          </h2>
        </div>
        <button
          onClick={handleAddSection}
          id="add-section-btn"
          disabled={isImprovingPlan}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D5D9DC] bg-white text-xs font-medium text-[#24343B] hover:bg-[#F2FAFF] hover:border-[#86B0FF] transition-colors shadow-xs cursor-pointer disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5 text-[#1B61EB]" />
          <span>Add Section</span>
        </button>
      </div>

      {/* Vertically Rendered Sections */}
      <div className="space-y-3">
        {activePlan.map((section, index) => (
          <PlanSectionCard
            key={section.id}
            section={section}
            index={index}
            totalSections={activePlan.length}
            onUpdateTitle={handleUpdateTitle}
            onDeleteSection={handleDeleteSection}
            onAddSubQuestion={handleAddSubQuestion}
            onDeleteSubQuestion={handleDeleteSubQuestion}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
          />
        ))}
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-[240px] bg-white/95 backdrop-blur-sm border-t border-[#D5D9DC] py-3 sm:py-3.5 px-4 sm:px-6 lg:px-8 xl:px-10 z-30 shadow-lg transition-all">
        <div className="w-full flex items-center justify-between gap-3">
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-semibold text-[#0F2027]">Plan looks good?</span>
            <span className="text-[11px] text-[#7D878D]">
              {activePlan.length} sections will be assigned across 5 parallel research agents.
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={handleSaveDraft}
              id="save-plan-draft-btn"
              className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl border border-[#D5D9DC] bg-white hover:bg-[#F2FAFF] text-xs font-medium text-[#24343B] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {draftSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Saved</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-[#7D878D]" />
                  <span>Save Draft</span>
                </>
              )}
            </button>

            <button
              onClick={approveAndStartResearch}
              id="approve-start-research-btn"
              disabled={isImprovingPlan || activePlan.length === 0}
              className="flex-1 sm:flex-initial px-4 sm:px-5 py-2 rounded-xl bg-[#1B61EB] hover:bg-[#1551CA] text-white text-xs font-semibold shadow-md shadow-[#1B61EB]/20 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Approve & Start</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

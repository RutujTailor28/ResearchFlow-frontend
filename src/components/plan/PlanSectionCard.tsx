import React, { useState } from 'react';
import {
  GripVertical,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronUp,
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import { PlanSectionItem } from '../../types';

interface PlanSectionCardProps {
  section: PlanSectionItem;
  index: number;
  totalSections: number;
  onUpdateTitle: (id: string, newTitle: string) => void;
  onDeleteSection: (id: string) => void;
  onAddSubQuestion: (id: string, question: string) => void;
  onDeleteSubQuestion: (id: string, qIndex: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export const PlanSectionCard: React.FC<PlanSectionCardProps> = ({
  section,
  index,
  totalSections,
  onUpdateTitle,
  onDeleteSection,
  onAddSubQuestion,
  onDeleteSubQuestion,
  onMoveUp,
  onMoveDown
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(section.title);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  const saveTitle = () => {
    if (titleText.trim()) {
      onUpdateTitle(section.id, titleText.trim());
    }
    setIsEditingTitle(false);
  };

  const handleAddQuestion = () => {
    if (newQuestionText.trim()) {
      onAddSubQuestion(section.id, newQuestionText.trim());
      setNewQuestionText('');
      setIsAddingQuestion(false);
    }
  };

  return (
    <div
      id={`plan-section-${section.id}`}
      className="bg-white rounded-xl border border-[#D5D9DC] p-4 sm:p-5 shadow-xs hover:border-[#86B0FF] transition-all space-y-3.5 group"
    >
      {/* Header with drag handle, section number, title, and actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Reorder controls */}
          <div className="flex flex-col items-center gap-0.5 text-[#7D878D] pt-0.5 shrink-0">
            <button
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className="hover:text-[#0F2027] disabled:opacity-20 p-0.5 rounded hover:bg-[#F2FAFF]"
              title="Move section up"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <GripVertical className="w-3.5 h-3.5 cursor-grab text-[#86B0FF]" />
            <button
              onClick={() => onMoveDown(index)}
              disabled={index === totalSections - 1}
              className="hover:text-[#0F2027] disabled:opacity-20 p-0.5 rounded hover:bg-[#F2FAFF]"
              title="Move section down"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section Number Badge */}
          <span className="font-mono font-semibold text-xs text-[#1B61EB] bg-[#F2FAFF] px-2 py-0.5 rounded border border-[#86B0FF]/60 mt-0.5 shrink-0">
            {section.orderNumber}
          </span>

          {/* Section Title or Edit Input */}
          <div className="flex-1">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={titleText}
                  onChange={(e) => setTitleText(e.target.value)}
                  className="flex-1 px-2.5 py-1 text-sm font-semibold text-[#0F2027] border border-[#1B61EB] rounded-md focus:outline-none ring-1 ring-[#1B61EB]"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveTitle();
                    if (e.key === 'Escape') setIsEditingTitle(false);
                  }}
                />
                <button
                  onClick={saveTitle}
                  className="p-1 rounded bg-[#1B61EB] text-white hover:bg-[#1551CA]"
                  title="Save title"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsEditingTitle(false)}
                  className="p-1 rounded bg-[#F2FAFF] text-[#53616A] hover:bg-[#D5D9DC]"
                  title="Cancel edit"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm sm:text-base text-[#0F2027] leading-snug">
                  {section.title}
                </h3>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="opacity-0 group-hover:opacity-100 text-[#7D878D] hover:text-[#0F2027] p-1 rounded transition-opacity"
                  title="Edit title"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Delete Section button */}
        {totalSections > 1 && (
          <button
            onClick={() => onDeleteSection(section.id)}
            className="text-[#7D878D] hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors shrink-0"
            title="Delete section"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sub questions list */}
      <div className="pl-8 sm:pl-10 space-y-2">
        <div className="text-[11px] font-medium text-[#7D878D] uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3 h-3 text-[#1B61EB]" />
          <span>Research Target Questions ({section.subQuestions.length})</span>
        </div>

        <div className="space-y-1.5">
          {section.subQuestions.map((question, qIdx) => (
            <div
              key={qIdx}
              className="flex items-start justify-between gap-2 p-2 rounded-lg bg-[#F2FAFF] border border-[#D5D9DC] text-xs text-[#24343B] group/q"
            >
              <span className="flex-1 leading-relaxed">
                <span className="font-mono text-[10px] text-[#7D878D] mr-1.5 font-medium">
                  {qIdx + 1}.
                </span>
                {question}
              </span>
              <button
                onClick={() => onDeleteSubQuestion(section.id, qIdx)}
                className="opacity-0 group-hover/q:opacity-100 text-[#7D878D] hover:text-rose-500 p-0.5 rounded transition-opacity shrink-0"
                title="Remove question"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Question input or button */}
        {isAddingQuestion ? (
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="e.g. What specific datasets or benchmarks validate this?"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-[#86B0FF] bg-white text-[#0F2027] focus:outline-none ring-1 ring-[#1B61EB]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddQuestion();
                if (e.key === 'Escape') setIsAddingQuestion(false);
              }}
            />
            <button
              onClick={handleAddQuestion}
              className="px-2.5 py-1.5 bg-[#1B61EB] text-white rounded-lg text-xs font-medium hover:bg-[#1551CA]"
            >
              Add
            </button>
            <button
              onClick={() => setIsAddingQuestion(false)}
              className="px-2.5 py-1.5 bg-[#F2FAFF] text-[#53616A] border border-[#D5D9DC] rounded-lg text-xs font-medium hover:bg-[#D5D9DC]"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingQuestion(true)}
            className="inline-flex items-center gap-1.5 text-xs text-[#1B61EB] hover:text-[#1551CA] font-medium py-1 px-2 rounded-md hover:bg-[#F2FAFF] transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add research question</span>
          </button>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { List, BookOpen, Layers } from 'lucide-react';
import { ReportSectionItem } from '../../types';
import { cn } from '../../lib/utils';

interface TableOfContentsProps {
  sections: ReportSectionItem[];
  activeSectionId: string;
  onSelectSection: (id: string) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  sections,
  activeSectionId,
  onSelectSection
}) => {
  return (
    <nav className="sticky top-20 space-y-3 select-none">
      <div className="flex items-center gap-2 pb-2 border-b border-[#D5D9DC] text-xs font-semibold text-[#0F2027]">
        <List className="w-4 h-4 text-[#1B61EB]" />
        <span>Table of Contents</span>
      </div>

      <div className="space-y-1 text-xs">
        {sections.map(section => {
          const isActive = activeSectionId === section.id;

          return (
            <button
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              className={cn(
                'w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-2',
                isActive
                  ? 'bg-[#F2FAFF] text-[#1B61EB] font-semibold border border-[#86B0FF]'
                  : 'text-[#53616A] hover:text-[#0F2027] hover:bg-[#F2FAFF]'
              )}
            >
              <span className="font-mono text-[10px] text-[#7D878D] shrink-0">
                {section.orderNumber}
              </span>
              <span className="truncate leading-snug">{section.title}</span>
            </button>
          );
        })}

        {/* Bibliography link */}
        <button
          onClick={() => onSelectSection('report-sources-section')}
          className={cn(
            'w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-2 pt-2 border-t border-[#D5D9DC]',
            activeSectionId === 'report-sources-section'
              ? 'bg-[#F2FAFF] text-[#1B61EB] font-semibold border border-[#86B0FF]'
              : 'text-[#53616A] hover:text-[#0F2027] hover:bg-[#F2FAFF]'
          )}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#1B61EB] shrink-0" />
          <span className="truncate leading-snug">Source Bibliography</span>
        </button>
      </div>
    </nav>
  );
};

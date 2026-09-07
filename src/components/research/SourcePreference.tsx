import React from 'react';
import { SourceCategory } from '../../types';
import { BookOpen, ShieldCheck, TrendingUp, Newspaper, Building2, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SourcePreferenceProps {
  selected: SourceCategory[];
  onChange: (sources: SourceCategory[]) => void;
}

export const SourcePreference: React.FC<SourcePreferenceProps> = ({ selected, onChange }) => {
  const categories: { name: SourceCategory; icon: React.ComponentType<{ className?: string }> }[] = [
    { name: 'Academic Papers', icon: BookOpen },
    { name: 'Official Sources', icon: ShieldCheck },
    { name: 'Industry Reports', icon: TrendingUp },
    { name: 'News Publications', icon: Newspaper },
    { name: 'Government Data', icon: Building2 },
  ];

  const toggleCategory = (cat: SourceCategory) => {
    if (selected.includes(cat)) {
      if (selected.length > 1) {
        onChange(selected.filter(s => s !== cat));
      }
    } else {
      onChange([...selected, cat]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-[#0F2027] uppercase tracking-wider block">
        Preferred Source Repositories
      </label>
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => {
          const isSelected = selected.includes(cat.name);
          const Icon = cat.icon;

          return (
            <button
              key={cat.name}
              type="button"
              id={`source-tag-${cat.name.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => toggleCategory(cat.name)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer',
                isSelected
                  ? 'border-[#1B61EB] bg-[#F2FAFF] text-[#1B61EB] font-semibold'
                  : 'border-[#D5D9DC] bg-white text-[#53616A] hover:border-[#86B0FF] hover:bg-[#F2FAFF]/50'
              )}
            >
              <Icon className={cn('w-3.5 h-3.5', isSelected ? 'text-[#1B61EB]' : 'text-[#7D878D]')} />
              <span>{cat.name}</span>
              {isSelected && <Check className="w-3 h-3 ml-0.5 text-[#1B61EB] stroke-[2.5]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

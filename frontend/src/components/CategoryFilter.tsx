'use client';

import type { Category } from '@/types/product';
import { CATEGORIES, CATEGORY_STYLES } from '@/types/product';

interface CategoryFilterProps {
  selected: Category | null;
  onChange: (category: Category | null) => void;
  disabled: boolean;
}

export default function CategoryFilter({
  selected,
  onChange,
  disabled,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* "All" pill */}
      <button
        onClick={() => onChange(null)}
        disabled={disabled}
        className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${
          selected === null
            ? 'border-transparent bg-gradient-to-br from-[#618764] to-[#2B5748] font-semibold text-white shadow-lg shadow-[#2B5748]/30'
            : 'border-white/[0.08] bg-[#0c120f] text-slate-400 hover:border-[#618764]/40 hover:text-slate-100'
        }`}
      >
        All
      </button>

      {CATEGORIES.map((cat) => {
        const style = CATEGORY_STYLES[cat];
        const isActive = selected === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            disabled={disabled}
            className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${
              isActive
                ? 'font-semibold'
                : 'border-white/[0.08] bg-[#0c120f] text-slate-400 hover:border-[#618764]/40 hover:text-slate-100'
            }`}
            style={
              isActive
                ? {
                    color: style.color,
                    background: style.bg,
                    borderColor: style.color + '66',
                  }
                : {}
            }
          >
            {style.label}
          </button>
        );
      })}
    </div>
  );
}

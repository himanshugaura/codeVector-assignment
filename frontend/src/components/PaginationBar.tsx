'use client';

interface PaginationBarProps {
  page: number;
  hasPrev: boolean;
  hasNext: boolean;
  isLoading: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export default function PaginationBar({
  page,
  hasPrev,
  hasNext,
  isLoading,
  onPrev,
  onNext,
}: PaginationBarProps) {
  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <button
        onClick={onPrev}
        disabled={!hasPrev || isLoading}
        className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#0c120f] px-5 py-2.5 text-sm font-medium text-slate-300 transition-all duration-150 hover:border-[#618764]/40 hover:bg-[#618764]/10 hover:text-[#9CB080] disabled:cursor-not-allowed disabled:opacity-30"
      >
        ← Previous
      </button>

      <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-[#0c120f] px-4 py-2.5">
        <span className="text-[13px] text-slate-500">Page</span>
        <span className="text-[13px] font-semibold tabular-nums text-slate-200">
          {page}
        </span>
      </div>

      <button
        onClick={onNext}
        disabled={!hasNext || isLoading}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#618764] to-[#2B5748] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#2B5748]/30 transition-all duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
      >
        Next →
      </button>
    </div>
  );
}

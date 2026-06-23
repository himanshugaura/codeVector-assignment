export default function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-[#111120] p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="skeleton h-4 w-3/5 rounded-md" />
        <div className="skeleton h-4 w-1/4 rounded-full" />
      </div>
      {/* Price */}
      <div className="skeleton h-6 w-1/3 rounded-md" />
      {/* Meta */}
      <div className="flex flex-col gap-2 border-t border-white/[0.06] pt-3">
        <div className="skeleton h-2.5 w-4/5 rounded-md" />
        <div className="skeleton h-2.5 w-3/5 rounded-md" />
        <div className="skeleton h-2.5 w-4/5 rounded-md" />
      </div>
    </div>
  );
}

import type { Product } from '@/types/product';
import { CATEGORY_STYLES } from '@/types/product';

interface ProductCardProps {
  product: Product;
  index: number;
}

function formatPrice(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const style = CATEGORY_STYLES[product.category];

  return (
    <div
      className="card-enter group relative flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-[#0a0c0a] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#618764]/60 hover:bg-[#101512] hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_40px_rgba(97,135,100,0.15)]"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[#618764]/[0.06] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      {/* Header — name + category badge */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="flex-1 text-[15px] font-semibold leading-snug text-slate-100">
          {product.name}
        </h3>
        <span
          className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
          style={{
            color: style.color,
            background: style.bg,
            border: `1px solid ${style.color}44`,
          }}
        >
          {style.label}
        </span>
      </div>

      {/* Price */}
      <div className="text-[22px] font-bold tracking-tight text-emerald-400">
        {formatPrice(product.price)}
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1.5 border-t border-white/[0.06] pt-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            ID
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            #{product.id}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Created
          </span>
          <span className="text-[11px] tabular-nums text-slate-400">
            {formatDate(product.createdAt)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Updated
          </span>
          <span className="text-[11px] tabular-nums text-slate-400">
            {formatDate(product.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

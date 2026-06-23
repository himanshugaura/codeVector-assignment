'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import CategoryFilter from '@/components/CategoryFilter';
import PaginationBar from '@/components/PaginationBar';
import ProductCard from '@/components/ProductCard';
import SkeletonCard from '@/components/SkeletonCard';
import type { ApiResponse, Category, Product } from '@/types/product';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

const LIMIT_OPTIONS = [20, 50, 100] as const;
type Limit = (typeof LIMIT_OPTIONS)[number];

function HomeContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialCategory = (searchParams.get('category') as Category) || null;
  const initialLimit = (Number(searchParams.get('limit')) || 20) as Limit;
  const initialCursor = searchParams.get('cursor') || null;
  const initialPage = Number(searchParams.get('page')) || 1;


  const [products, setProducts]       = useState<Product[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState<string | null>(null);


  const [currentCursor, setCurrentCursor] = useState<string | null>(initialCursor);
  const [nextCursor, setNextCursor]       = useState<string | null>(null);
  const cursorStackRef                    = useRef<(string | null)[]>([]);
  const [page, setPage]                   = useState(initialPage);

  const [category, setCategory] = useState<Category | null>(initialCategory);
  const [limit, setLimit]       = useState<Limit>(initialLimit);

  const updateUrl = useCallback((newCursor: string | null, newCategory: Category | null, newLimit: Limit, newPage: number) => {
    const params = new URLSearchParams();
    if (newCursor) params.set('cursor', newCursor);
    if (newCategory) params.set('category', newCategory);
    params.set('limit', String(newLimit));
    params.set('page', String(newPage));
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router]);


  const fetchProducts = useCallback(
    async (cursor: string | null, fetchCategory: Category | null, fetchLimit: Limit) => {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({ limit: String(fetchLimit) });
      if (cursor)   params.set('cursor', cursor);
      if (fetchCategory) params.set('category', fetchCategory);

      try {
        const res = await fetch(`${API_BASE}/products?${params.toString()}`);

        if (!res.ok) {
          const body = await res.json().catch(() => ({})) as { message?: string };
          throw new Error(body.message ?? `Server error ${res.status}`);
        }

        const json = (await res.json()) as ApiResponse;
        setProducts(json.data.items);
        setNextCursor(json.data.nextCursor);
        setHasNextPage(json.data.hasNextPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setProducts([]);
        setHasNextPage(false);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchProducts(currentCursor, category, limit);
    updateUrl(currentCursor, category, limit, page);
  }, [currentCursor, category, limit, page, fetchProducts, updateUrl]);


  function goNext() {
    if (!nextCursor || isLoading) return;
    cursorStackRef.current.push(currentCursor);
    setCurrentCursor(nextCursor);
    setPage((p) => p + 1);
  }

  function goBack() {
    if (cursorStackRef.current.length === 0 || isLoading) return;
    const prev = cursorStackRef.current.pop() ?? null;
    setCurrentCursor(prev);
    setPage((p) => p - 1);
  }

  function handleCategoryChange(cat: Category | null) {
    setCategory(cat);
    setCurrentCursor(null);
    cursorStackRef.current = [];
    setPage(1);
  }

  function handleLimitChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLimit(Number(e.target.value) as Limit);
    setCurrentCursor(null);
    cursorStackRef.current = [];
    setPage(1);
  }

  function retry() {
    fetchProducts(currentCursor, category, limit);
  }


  const skeletonCount = Math.min(limit, 12);

  return (
    <div className="flex min-h-screen flex-col">
      <div
        className="pointer-events-none fixed left-1/2 top-0 -translate-x-1/2"
        style={{
          width: 900,
          height: 400,
          background:
            'radial-gradient(ellipse, rgba(97,135,100,0.1) 0%, transparent 70%)',
        }}
      />

      

      {/* ── Main ── */}
      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-6 pb-16 pt-8">

        {/* ── Controls ── */}
        <div className="mb-6 flex flex-wrap items-start gap-4">
          <div className="flex-1">
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Filter by Category
            </p>
            <CategoryFilter
              selected={category}
              onChange={handleCategoryChange}
              disabled={isLoading}
            />
          </div>

          {/* Limit selector */}
          <div className="flex-shrink-0">
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Per Page
            </p>
            <select
              value={limit}
              onChange={handleLimitChange}
              disabled={isLoading}
              className="rounded-lg border border-white/[0.08] bg-[#0c120f] px-3 py-1.5 text-sm text-slate-300 outline-none transition-colors hover:border-[#618764]/40 focus:border-[#618764]/50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {LIMIT_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="mb-5 flex min-h-11 items-center justify-between rounded-xl border border-white/[0.06] bg-[#0c120f] px-4 py-2.5">
          {isLoading ? (
            <div className="flex items-center gap-2 text-[13px] text-slate-500">
              <div className="h-1.5 w-1.5 rounded-full bg-[#618764] pulse-dot" />
              Loading products...
            </div>
          ) : error ? (
            <span className="text-[13px] text-red-400">
              Failed to load products
            </span>
          ) : (
            <>
              <div className="flex items-center gap-2 text-[13px] text-slate-400">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 pulse-dot" />
                Showing{' '}
                <span className="font-semibold text-slate-200">
                  {products.length}
                </span>{' '}
                product{products.length !== 1 ? 's' : ''}
                {category && (
                  <>
                    {' '}in{' '}
                    <span className="font-semibold text-slate-200">
                      {category}
                    </span>
                  </>
                )}
                {' '}· Page{' '}
                <span className="font-semibold text-slate-200">{page}</span>
              </div>
              <span className="text-[12px] text-slate-600">
                {hasNextPage ? '↓ More pages available' : '✓ Last page'}
              </span>
            </>
          )}
        </div>

        {/* ── Error state ── */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <div className="text-4xl font-bold text-slate-700">!</div>
            <div className="text-base font-semibold text-red-400">
              Could not reach the API
            </div>
            <div className="max-w-sm text-sm text-slate-500">{error}</div>
            <button
              onClick={retry}
              className="mt-2 rounded-lg bg-[#618764] px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-85"
            >
              Try again
            </button>
          </div>
        )}

        {/* ── Product grid ── */}
        {!error && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: skeletonCount }, (_, i) => (
                  <SkeletonCard key={i} />
                ))
              : products.length === 0
                ? (
                  <div className="col-span-full flex flex-col items-center justify-center gap-3 py-24 text-center">
                    <div className="text-4xl font-bold text-slate-700">-</div>
                    <div className="text-base font-medium text-slate-400">
                      No products found
                    </div>
                    <div className="text-sm text-slate-600">
                      Try selecting a different category
                    </div>
                  </div>
                )
                : products.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {!error && (
          <PaginationBar
            page={page}
            hasPrev={cursorStackRef.current.length > 0}
            hasNext={hasNextPage}
            isLoading={isLoading}
            onPrev={goBack}
            onNext={goNext}
          />
        )}
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

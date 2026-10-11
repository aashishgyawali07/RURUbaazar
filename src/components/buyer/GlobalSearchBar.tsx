'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

/**
 * Global search pill. Submitting navigates to /buyer/search?q=… so results are
 * shareable, bookmarkable and server-rendered.
 */
export function GlobalSearchBar({ defaultValue = '', className = '' }: { defaultValue?: string; className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/buyer/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form role="search" onSubmit={handleSubmit}
          className={`flex w-full items-center gap-2 rounded-full bg-white p-1.5 shadow-lift ring-1 ring-surface-border
                      focus-within:ring-2 focus-within:ring-royal-400 ${className}`}>
      <Icon name="search" className="ml-3 h-5 w-5 shrink-0 text-ink-faint" />
      <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} maxLength={80}
             aria-label="Search products and stores" placeholder="Search honey, tea, pashmina…"
             className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-base text-ink outline-none placeholder:text-ink-faint" />
      <button type="submit"
              className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
        Search
      </button>
    </form>
  );
}

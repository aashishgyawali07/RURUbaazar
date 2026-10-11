import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { formatNpr } from '@/lib/format';
import type { Product } from '@/types';
import { GlobalSearchBar } from './GlobalSearchBar';

const POPULAR = ['Honey', 'Tea', 'Pashmina', 'Singing bowl', 'Copper'];

/** Buyer landing hero: headline + large search + popular searches + a featured product card (desktop). */
export function BuyerHero({ featured }: { featured?: Product }) {
  return (
    <section className="relative overflow-hidden bg-hero-gradient text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 h-[28rem] w-[28rem] rounded-full bg-brand-500/30 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl" />

      <div className="container-page relative grid items-center gap-12 pb-28 pt-14 sm:pt-16 lg:grid-cols-[1.3fr_1fr] lg:pb-32 lg:pt-20">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-royal-100 ring-1 ring-inset ring-white/20">
            <Icon name="sparkle" className="h-4 w-4 text-accent-400" /> Handpicked from verified sellers
          </p>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
            Discover authentic products from{' '}
            <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">trusted Nepali sellers</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-royal-100">Crafts, food and everyday essentials, delivered to your door and paid for securely.</p>

          <GlobalSearchBar className="mt-8 max-w-xl" />

          <p className="mt-5 flex flex-wrap items-center gap-2 text-sm text-royal-100">
            <span>Popular:</span>
            {POPULAR.map((term) => (
              <Link key={term} href={`/buyer/search?q=${encodeURIComponent(term)}`}
                    className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/20">
                {term}
              </Link>
            ))}
          </p>
        </div>

        {featured && (
          <Link href={`/buyer/search?q=${encodeURIComponent(featured.title)}`} aria-label={`Featured: ${featured.title}`}
                className="group hidden rotate-2 rounded-3xl bg-white p-3 text-ink shadow-2xl transition-transform duration-300 hover:rotate-0 lg:block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-royal-50">
              <Image src={featured.imageUrl} alt={featured.title} fill sizes="400px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute left-3 top-3"><Badge tone="brand">Top pick</Badge></span>
            </div>
            <div className="flex items-end justify-between gap-3 p-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-royal-700">{featured.vendorName}</p>
                <p className="truncate font-display text-lg font-bold">{featured.title}</p>
              </div>
              <p className="shrink-0 text-lg font-bold text-brand-700">{formatNpr(featured.priceNpr)}</p>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}

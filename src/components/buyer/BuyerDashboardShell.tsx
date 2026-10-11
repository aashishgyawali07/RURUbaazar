import Link from 'next/link';
import { buttonClasses } from '@/components/ui/button-styles';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Product } from '@/types';
import { BuyerHero } from './BuyerHero';
import { MostPurchasedGrid } from './MostPurchasedGrid';
import { ProductGrid } from './ProductGrid';
import { TrustBar } from './TrustBar';

interface Props { mostPurchased: Product[]; products: Product[] }

/** Buyer landing: composition only. Data arrives as props from app/buyer/page.tsx. */
export function BuyerDashboardShell({ mostPurchased, products }: Props) {
  return (
    <main>
      <BuyerHero featured={mostPurchased[0]} />
      <TrustBar />
      <div className="container-page space-y-16 pt-14">
        <MostPurchasedGrid products={mostPurchased} />

        <section aria-labelledby="all-products-heading" className="space-y-6">
          <SectionHeading id="all-products-heading" eyebrow="Fresh from our vendors" title="All products" />
          <ProductGrid products={products} />
        </section>

        <section className="relative overflow-hidden rounded-3xl bg-royal-950 px-6 py-10 text-white sm:px-10">
          <div aria-hidden="true" className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-brand-500/30 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <div className="max-w-lg">
              <h2 className="font-display text-2xl font-bold">Have something to sell?</h2>
              <p className="mt-1 text-royal-100">Open your store on RURUbaazar and reach buyers across Nepal.</p>
            </div>
            <Link href="/seller/onboarding" className={buttonClasses({ size: 'lg', className: 'shrink-0' })}>Become a seller</Link>
          </div>
        </section>
      </div>
    </main>
  );
}

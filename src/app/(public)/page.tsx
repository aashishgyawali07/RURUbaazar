import Link from 'next/link';
import { buttonClasses } from '@/components/ui/button-styles';
import { Icon, type IconName } from '@/components/ui/Icon';

const FEATURES: { icon: IconName; title: string; body: string }[] = [
  { icon: 'shield', title: 'Verified sellers', body: 'Every store is reviewed with PAN and citizenship checks before it can list a single product.' },
  { icon: 'sparkle', title: 'Authentic & local', body: 'Hand-crafted goods and everyday essentials from vendors across Nepal.' },
  { icon: 'wallet', title: 'Pay your way', body: 'Secure checkout with eSewa and Khalti, the wallets you already use.' },
];

// Public landing page: static and SEO-friendly.
export default function HomePage() {
  return (
    <main>
      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden bg-hero-gradient text-white">
        {/* Decorative glows (purely visual) */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl" />

        <div className="container-page relative py-20 sm:py-28 lg:py-32">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-royal-100 ring-1 ring-inset ring-white/20 animate-fade-up">
            <Icon name="sparkle" className="h-4 w-4 text-accent-400" /> Nepal’s multi-vendor marketplace
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.1] sm:text-6xl animate-fade-up">
            Shop the{' '}
            <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">best of Nepal</span>
            , from sellers you can trust.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-royal-100 animate-fade-up">
            Discover authentic products from verified local vendors, and pay securely with eSewa or Khalti.
          </p>
          <div className="mt-9 flex flex-wrap gap-3 animate-fade-up">
            <Link href="/buyer" className={buttonClasses({ size: 'lg' })}>Start shopping <Icon name="arrow-right" className="h-5 w-5" /></Link>
            <Link href="/seller/onboarding" className={buttonClasses({ variant: 'inverse', size: 'lg' })}>Become a seller</Link>
          </div>
        </div>
      </section>

      {/* ───────── Why us ───────── */}
      <section className="container-page py-16 sm:py-20">
        <h2 className="max-w-xl font-display text-3xl font-bold">A marketplace built on trust</h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {FEATURES.map((f) => (
            <li key={f.title} className="rounded-2xl border border-surface-border bg-white p-6 shadow-card transition-shadow hover:shadow-lift">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-royal-50 text-royal-700"><Icon name={f.icon} className="h-6 w-6" /></span>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{f.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────── Seller CTA ───────── */}
      <section className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-royal-950 px-6 py-12 text-white sm:px-12">
          <div aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-bold">Own a business? Open your store.</h2>
              <p className="mt-2 text-royal-100">Reach customers across Nepal. Apply in minutes; we review within 1–2 business days.</p>
            </div>
            <Link href="/seller/onboarding" className={buttonClasses({ size: 'lg', className: 'shrink-0' })}>Apply to sell</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

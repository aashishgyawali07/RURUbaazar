import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { SITE } from '@/lib/site-config';
import { BrandLogo } from './BrandLogo';

// Only link to pages that exist (no dead links).
const COLUMNS = [
  { title: 'Marketplace', links: [{ href: '/buyer', label: 'Shop all products' }, { href: '/buyer/orders', label: 'My orders' }, { href: '/buyer/cart', label: 'Cart' }] },
  { title: 'Sell', links: [{ href: '/seller/onboarding', label: 'Become a seller' }, { href: '/seller/dashboard', label: 'Seller dashboard' }] },
  { title: 'Support', links: [{ href: '/contact', label: 'Contact us' }, { href: '/auth', label: 'Log in / Sign up' }] },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-surface-border bg-white">
      <div className="h-0.5 bg-brand-gradient" aria-hidden="true" />
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <BrandLogo className="h-8" />
          <p className="max-w-xs text-sm text-ink-soft">{SITE.tagline}.</p>
          <p className="flex items-center gap-2 text-sm text-ink-soft">
            <Icon name="shield" className="h-4 w-4 text-royal-600" /> Secure checkout with eSewa &amp; Khalti
          </p>
        </div>
        {COLUMNS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="text-sm font-semibold text-ink">{c.title}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {c.links.map((l) => <li key={l.href}><Link href={l.href} className="text-ink-soft hover:text-brand-600">{l.label}</Link></li>)}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-surface-border py-5 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}

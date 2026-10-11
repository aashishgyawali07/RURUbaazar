'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { buttonClasses } from '@/components/ui/button-styles';
import { Icon } from '@/components/ui/Icon';
import { BrandLogo } from './BrandLogo';

export interface NavItem { href: string; label: string; /** match the path exactly (for "/" or "/buyer") */ exact?: boolean }

interface Props {
  items: NavItem[];
  /** Right-side widget, e.g. <CartLink/>. Visible on every screen size. */
  trailing?: ReactNode;
  /** Primary call-to-action button (hidden on very small screens; repeated in the mobile menu). */
  cta?: { href: string; label: string };
  /** Small pill next to the logo, e.g. "Seller Centre". */
  badge?: string;
}

/**
 * Sticky site header: logo left, links centre/left, actions right.
 * Mobile (<md): links collapse into a hamburger panel. Client component for the active-link
 * highlight (usePathname) and the menu toggle.
 */
export function SiteHeader({ items, trailing, cta, badge }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu on navigation and on Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (i: NavItem) => (i.exact ? pathname === i.href : pathname === i.href || pathname.startsWith(`${i.href}/`));

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="h-0.5 bg-brand-gradient" aria-hidden="true" />
      <div className="container-page flex h-16 items-center gap-4">
        <div className="flex items-center gap-3">
          <BrandLogo priority />
          {badge && <span className="hidden rounded-full bg-royal-50 px-2.5 py-1 text-xs font-semibold text-royal-700 sm:inline">{badge}</span>}
        </div>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 md:flex">
          {items.map((i) => (
            <Link key={i.href} href={i.href} aria-current={isActive(i) ? 'page' : undefined}
                  className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors
                    ${isActive(i) ? 'bg-royal-50 text-royal-700' : 'text-ink-soft hover:bg-surface-muted hover:text-ink'}`}>
              {i.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {trailing}
          {cta && <Link href={cta.href} className={`${buttonClasses({ size: 'sm' })} hidden sm:inline-flex`}>{cta.label}</Link>}
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-nav"
                  aria-label={open ? 'Close menu' : 'Open menu'}
                  className="rounded-ui p-2 text-ink hover:bg-surface-muted md:hidden">
            <Icon name={open ? 'close' : 'menu'} className="h-6 w-6" />
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-surface-border bg-white md:hidden">
          <ul className="container-page space-y-1 py-3">
            {items.map((i) => (
              <li key={i.href}>
                <Link href={i.href} aria-current={isActive(i) ? 'page' : undefined}
                      className={`block rounded-ui px-3 py-3 text-base font-medium ${isActive(i) ? 'bg-royal-50 text-royal-700' : 'text-ink hover:bg-surface-muted'}`}>
                  {i.label}
                </Link>
              </li>
            ))}
            {cta && <li className="pt-2"><Link href={cta.href} className={buttonClasses({ className: 'w-full' })}>{cta.label}</Link></li>}
          </ul>
        </nav>
      )}
    </header>
  );
}

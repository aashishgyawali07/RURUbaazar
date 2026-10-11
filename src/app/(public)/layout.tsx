import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';

// Route group "(public)": parentheses keep it out of the URL, so "/" and "/contact" share this chrome.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        items={[
          { href: '/', label: 'Home', exact: true },
          { href: '/buyer', label: 'Shop' },
          { href: '/contact', label: 'Contact' },
          { href: '/auth', label: 'Log in' },
        ]}
        cta={{ href: '/seller/onboarding', label: 'Sell with us' }}
      />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}

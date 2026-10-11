import { redirect } from 'next/navigation';
import { DevBypassBanner } from '@/components/layout/DevBypassBanner';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { isAuthBypassed } from '@/lib/dev-bypass';
import { createServerSupabase } from '@/lib/supabase/server';

// Seller portal chrome. /seller/onboarding is open to any logged-in user (they're applying to become a seller).
export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const bypass = isAuthBypassed(); // DEV ONLY

  if (!bypass) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth?next=/seller/dashboard');
    // TODO: gate dashboard/products/orders on an APPROVED seller_applications row; keep /seller/onboarding open.
  }

  return (
    <div className="flex min-h-screen flex-col">
      {bypass && <DevBypassBanner />}
      <SiteHeader
        badge="Seller Centre"
        items={[
          { href: '/seller/dashboard', label: 'Dashboard' },
          { href: '/seller/products', label: 'Products' },
          { href: '/seller/orders', label: 'Orders' },
          { href: '/buyer', label: 'View storefront' },
        ]}
      />
      <div className="flex-1 pb-12">{children}</div>
    </div>
  );
}

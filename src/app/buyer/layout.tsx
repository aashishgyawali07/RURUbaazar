import { redirect } from 'next/navigation';
import { CartLink } from '@/components/cart/CartLink';
import { CartProvider } from '@/components/cart/CartProvider';
import { DevBypassBanner } from '@/components/layout/DevBypassBanner';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { isAuthBypassed } from '@/lib/dev-bypass';
import { createServerSupabase } from '@/lib/supabase/server';

// Buyer portal chrome. Middleware already blocks logged-out users; this adds a server-side check.
export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  const bypass = isAuthBypassed(); // DEV ONLY

  if (!bypass) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth?next=/buyer');
    // TODO: once `profiles.role` exists, redirect sellers/admins to their own portal here.
  }

  return (
    // One cart instance shared by the header badge, product cards and /buyer/cart.
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        {bypass && <DevBypassBanner />}
        <SiteHeader
          items={[{ href: '/buyer', label: 'Shop', exact: true }, { href: '/buyer/orders', label: 'My orders' }, { href: '/contact', label: 'Help' }]}
          trailing={<CartLink />}
        />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </div>
    </CartProvider>
  );
}

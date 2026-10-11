import type { Metadata } from 'next';
import { Badge } from '@/components/ui/Badge';
import { SellerOrdersList } from '@/components/seller/SellerOrdersList';
import { SellerPageHeader } from '@/components/seller/SellerPageHeader';
import { SELLER_ORDERS } from '@/lib/mock-seller-data';

export const metadata: Metadata = { title: 'Orders' };

export default function SellerOrdersPage() {
  return (
    <main className="container-page max-w-4xl space-y-6 py-8">
      <SellerPageHeader title="Orders" description="Incoming orders from your customers." actions={<Badge tone="neutral">Sample data</Badge>} />
      <SellerOrdersList initial={SELLER_ORDERS} />
    </main>
  );
}

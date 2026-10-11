import type { Metadata } from 'next';
import Link from 'next/link';
import { buttonClasses } from '@/components/ui/button-styles';
import { Icon } from '@/components/ui/Icon';
import { ProductsTable } from '@/components/seller/ProductsTable';
import { SellerPageHeader } from '@/components/seller/SellerPageHeader';
import { SELLER_PRODUCTS } from '@/lib/mock-seller-data';

export const metadata: Metadata = { title: 'Products' };

export default function SellerProductsPage() {
  return (
    <main className="container-page space-y-6 py-8">
      <SellerPageHeader
        title="Products"
        description="Manage your catalogue and keep an eye on stock."
        actions={<Link href="/seller/products/new" className={buttonClasses()}><Icon name="plus" className="h-4 w-4" /> Add Product</Link>}
      />
      <ProductsTable products={SELLER_PRODUCTS} />
    </main>
  );
}

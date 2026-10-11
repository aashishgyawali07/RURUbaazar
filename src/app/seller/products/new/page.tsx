import type { Metadata } from 'next';
import Link from 'next/link';
import { AddProductForm } from '@/components/seller/AddProductForm';
import { SellerPageHeader } from '@/components/seller/SellerPageHeader';

export const metadata: Metadata = { title: 'Add product' };

export default function NewProductPage() {
  return (
    <main className="container-page max-w-3xl space-y-6 py-8">
      <Link href="/seller/products" className="text-sm font-medium text-royal-700 hover:text-brand-600">← Back to products</Link>
      <SellerPageHeader title="Add product" description="List a new item in your store." />
      <AddProductForm />
    </main>
  );
}

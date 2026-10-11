import type { Metadata } from 'next';
import { SellerOnboardingForm } from '@/components/seller/SellerOnboardingForm';

export const metadata: Metadata = { title: 'Become a seller' };

export default function SellerOnboardingPage() {
  return (
    <main className="container-page max-w-2xl space-y-6 py-10">
      <header>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-royal-700">
          <span aria-hidden="true" className="h-1.5 w-6 rounded-full bg-brand-gradient" />Seller application
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold">Open your store</h1>
        <p className="mt-1 text-sm text-ink-soft">Tell us about your business and verify your identity. Reviews usually take 1–2 business days.</p>
      </header>
      <SellerOnboardingForm />
    </main>
  );
}

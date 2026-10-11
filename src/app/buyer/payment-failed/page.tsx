import type { Metadata } from 'next';
import Link from 'next/link';
import { PaymentResultCard } from '@/components/payment/PaymentResultCard';

export const metadata: Metadata = { title: 'Payment cancelled' };

/** eSewa's failure_url. Static on purpose: shows no data from the URL and changes no order. Your cart is kept. */
export default function PaymentFailedPage() {
  return (
    <main className="px-4 py-12">
      <PaymentResultCard tone="danger" title="Payment cancelled"
        message="Your payment wasn’t completed and you haven’t been charged. Your cart is still saved.">
        <Link href="/buyer/cart" className="mt-6 inline-block rounded-ui bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
          Return to cart
        </Link>
      </PaymentResultCard>
    </main>
  );
}

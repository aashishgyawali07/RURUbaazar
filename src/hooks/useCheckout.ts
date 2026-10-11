'use client';
/**
 * BUSINESS LOGIC for "Proceed to Payment": gateway choice, calling /api/checkout,
 * and handing the browser over to eSewa/Khalti. No markup here.
 */
import { useEffect, useState } from 'react';
import { submitHiddenForm } from '@/lib/dom/submit-form';
import type { CheckoutApiResponse, PaymentGateway } from '@/lib/payments/types';
import type { CartItem } from '@/components/cart/CartProvider';

export function useCheckout() {
  const [gateway, setGateway] = useState<PaymentGateway>('esewa');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If the user hits Back from the gateway, the browser may restore this page from
  // bfcache with `submitting` still true. Reset it.
  useEffect(() => {
    const reset = (e: PageTransitionEvent) => { if (e.persisted) setSubmitting(false); };
    window.addEventListener('pageshow', reset);
    return () => window.removeEventListener('pageshow', reset);
  }, []);

  async function proceedToPayment(items: CartItem[]) {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // ONLY ids + quantities are sent. The server recomputes prices from its own catalogue.
        body: JSON.stringify({
          gateway,
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        }),
      });
      const json = (await res.json()) as CheckoutApiResponse;

      if (!json.ok) { setError(json.error); setSubmitting(false); return; }

      // Leave `submitting` true: the page is navigating away to the gateway.
      if (json.action === 'POST_FORM') submitHiddenForm(json.url, json.fields);
      else window.location.assign(json.url);
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
      setSubmitting(false);
    }
  }

  return { gateway, setGateway, submitting, error, proceedToPayment };
}

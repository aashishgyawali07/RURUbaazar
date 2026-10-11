import { Button } from '@/components/ui/Button';
import { formatNpr } from '@/lib/format';
import type { PaymentGateway } from '@/lib/payments/types';

interface Props {
  itemCount: number;
  subtotalNpr: number;
  gateway: PaymentGateway;
  onGatewayChange: (g: PaymentGateway) => void;
  onProceed: () => void;
  submitting: boolean;
  error: string | null;
}

const GATEWAYS: { id: PaymentGateway; label: string; hint: string }[] = [
  { id: 'esewa', label: 'eSewa', hint: 'Pay with your eSewa wallet' },
  { id: 'khalti', label: 'Khalti', hint: 'Pay with your Khalti wallet' },
];

/** Order totals + payment method + CTA. Presentational. */
export function OrderSummary({ itemCount, subtotalNpr, gateway, onGatewayChange, onProceed, submitting, error }: Props) {
  // Delivery & tax are 0 in Phase 2. When you add them, compute them SERVER-SIDE in
  // checkout.service.ts too, and mirror here for display only.
  const deliveryNpr = 0;
  const totalNpr = subtotalNpr + deliveryNpr;

  return (
    <aside aria-labelledby="summary-heading"
           className="h-fit space-y-5 rounded-2xl border border-surface-border bg-white p-5 shadow-card lg:sticky lg:top-24">
      <h2 id="summary-heading" className="font-display text-lg font-semibold">Order summary</h2>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between"><dt className="text-ink-soft">Subtotal ({itemCount} items)</dt><dd>{formatNpr(subtotalNpr)}</dd></div>
        <div className="flex justify-between"><dt className="text-ink-soft">Delivery</dt><dd>{deliveryNpr === 0 ? 'Free' : formatNpr(deliveryNpr)}</dd></div>
        <div className="flex justify-between border-t border-surface-border pt-3 text-base font-semibold">
          <dt>Total</dt><dd>{formatNpr(totalNpr)}</dd>
        </div>
      </dl>

      <fieldset className="space-y-2">
        <legend className="mb-1 text-sm font-medium">Payment method</legend>
        {GATEWAYS.map((g) => (
          <label key={g.id} className={`flex cursor-pointer items-center gap-3 rounded-ui border p-3 text-sm
            ${gateway === g.id ? 'border-brand-600 bg-brand-50' : 'border-surface-border'}`}>
            <input type="radio" name="gateway" value={g.id} checked={gateway === g.id}
                   onChange={() => onGatewayChange(g.id)} className="accent-brand-600" />
            <span><span className="block font-medium">{g.label}</span><span className="text-xs text-ink-soft">{g.hint}</span></span>
          </label>
        ))}
      </fieldset>

      {error && <p role="alert" className="text-sm text-danger">{error}</p>}

      <Button type="button" className="w-full" loading={submitting} onClick={onProceed}>Proceed to Payment</Button>
      <p className="text-center text-xs text-ink-faint">You'll be redirected to {gateway === 'esewa' ? 'eSewa' : 'Khalti'} to complete payment.</p>
    </aside>
  );
}

import type { ReactNode } from 'react';

export type BadgeTone = 'brand' | 'royal' | 'success' | 'warning' | 'danger' | 'neutral';

const TONES: Record<BadgeTone, string> = {
  brand:   'bg-brand-50 text-brand-700 ring-brand-200',
  royal:   'bg-royal-50 text-royal-700 ring-royal-200',
  success: 'bg-green-50 text-success ring-green-200',
  warning: 'bg-amber-50 text-warning ring-amber-200',
  danger:  'bg-red-50 text-danger ring-red-200',
  neutral: 'bg-surface-muted text-ink-soft ring-surface-border',
};

/** Small status pill. All tones keep ≥4.5:1 text contrast. */
export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${TONES[tone]}`}>
      {children}
    </span>
  );
}

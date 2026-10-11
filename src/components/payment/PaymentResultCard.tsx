import type { ReactNode } from 'react';

type Tone = 'success' | 'warning' | 'danger';
const TONES: Record<Tone, { ring: string; icon: string; glyph: string }> = {
  success: { ring: 'bg-success/10 text-success', icon: 'success', glyph: '✓' },
  warning: { ring: 'bg-warning/10 text-warning', icon: 'warning', glyph: '!' },
  danger:  { ring: 'bg-danger/10 text-danger',   icon: 'danger',  glyph: '✕' },
};

/** Presentational card shared by the success / pending / failed states. */
export function PaymentResultCard({ tone, title, message, children }: {
  tone: Tone; title: string; message: string; children?: ReactNode;
}) {
  const t = TONES[tone];
  return (
    <section role={tone === 'success' ? 'status' : 'alert'}
             className="mx-auto max-w-lg rounded-2xl border border-surface-border bg-white p-8 text-center shadow-card">
      <div aria-hidden="true" className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl font-semibold ${t.ring}`}>{t.glyph}</div>
      <h1 className="mt-4 font-display text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-ink-soft">{message}</p>
      {children}
    </section>
  );
}

import type { ReactNode } from 'react';

/** Title row shared by all seller pages. `actions` sit on the right (wrap below on mobile). */
export function SellerPageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-bold">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

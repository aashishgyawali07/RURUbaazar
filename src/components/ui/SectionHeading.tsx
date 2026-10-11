import type { ReactNode } from 'react';

/** Consistent section title: small eyebrow (with brand dot), serif headline, optional right-side action. */
export function SectionHeading({ id, eyebrow, title, action }: { id?: string; eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-royal-700">
            <span aria-hidden="true" className="h-1.5 w-6 rounded-full bg-brand-gradient" />{eyebrow}
          </p>
        )}
        <h2 id={id} className="mt-1.5 font-display text-2xl font-bold sm:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

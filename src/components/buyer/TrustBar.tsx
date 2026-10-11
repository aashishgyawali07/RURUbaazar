import { Icon, type IconName } from '@/components/ui/Icon';

const ITEMS: { icon: IconName; title: string; body: string }[] = [
  { icon: 'shield', title: 'Verified sellers', body: 'PAN & ID checked' },
  { icon: 'wallet', title: 'Secure checkout', body: 'eSewa & Khalti' },
  { icon: 'truck', title: 'Delivered to you', body: 'Across Nepal' },
  { icon: 'mail', title: 'Real support', body: 'We reply within a day' },
];

/** Reassurance strip that overlaps the bottom of the hero. */
export function TrustBar() {
  return (
    <div className="container-page relative z-10 -mt-12">
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-surface-border bg-surface-border shadow-lift lg:grid-cols-4">
        {ITEMS.map((i) => (
          <li key={i.title} className="flex items-center gap-3 bg-white p-4 sm:p-5">
            <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-royal-50 text-royal-700 sm:flex"><Icon name={i.icon} className="h-6 w-6" /></span>
            <div><p className="text-sm font-semibold">{i.title}</p><p className="text-xs text-ink-soft">{i.body}</p></div>
          </li>
        ))}
      </ul>
    </div>
  );
}

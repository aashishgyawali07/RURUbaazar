import { Badge } from '@/components/ui/Badge';
import { Icon, type IconName } from '@/components/ui/Icon';

/** KPI tile: label, big number, and a % change badge versus the previous period. */
export function StatCard({ label, value, delta, icon }: { label: string; value: string; delta: number; icon: IconName }) {
  const up = delta >= 0;
  return (
    <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-soft">{label}</p>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-royal-50 text-royal-700"><Icon name={icon} className="h-5 w-5" /></span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold">{value}</p>
      <p className="mt-2 flex items-center gap-2 text-xs text-ink-soft">
        <Badge tone={up ? 'success' : 'danger'}>{up ? '▲' : '▼'} {Math.abs(delta)}%</Badge> vs previous 30 days
      </p>
    </div>
  );
}

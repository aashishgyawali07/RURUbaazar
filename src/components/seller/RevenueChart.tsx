import { formatNpr } from '@/lib/format';
import type { DailyRevenue } from '@/lib/mock-seller-data';

/**
 * Dependency-free SVG area chart (server-rendered, scales to its container).
 * Colours come from Tailwind tokens via theme(), so a palette change in tailwind.config.js
 * updates the chart automatically. Hover any point for a native tooltip.
 */
const W = 720, H = 270;
const M = { l: 52, r: 16, t: 16, b: 34 };

export function RevenueChart({ data }: { data: readonly DailyRevenue[] }) {
  const plotW = W - M.l - M.r;
  const plotH = H - M.t - M.b;
  const max = Math.max(...data.map((d) => d.value));
  const top = Math.ceil(max / 10_000) * 10_000;             // round the axis up to a neat number
  const x = (i: number) => M.l + (i / (data.length - 1)) * plotW;
  const y = (v: number) => M.t + plotH - (v / top) * plotH;

  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ');
  const area = `${line} L${x(data.length - 1).toFixed(1)},${(M.t + plotH).toFixed(1)} L${x(0).toFixed(1)},${(M.t + plotH).toFixed(1)} Z`;
  const ticks = [0, 1, 2, 3, 4].map((n) => (top / 4) * n);
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="h-auto w-full"
         aria-label={`Daily revenue for the last ${data.length} days, totalling ${formatNpr(total)}. Peak day ${formatNpr(max)}.`}>
      <defs>
        <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopOpacity="0.28" className="[stop-color:theme(colors.brand.500)]" />
          <stop offset="100%" stopOpacity="0" className="[stop-color:theme(colors.accent.500)]" />
        </linearGradient>
      </defs>

      {ticks.map((t) => (
        <g key={t}>
          <line x1={M.l} x2={W - M.r} y1={y(t)} y2={y(t)} className="stroke-surface-border" strokeDasharray={t === 0 ? undefined : '4 4'} />
          <text x={M.l - 8} y={y(t) + 4} textAnchor="end" className="fill-ink-soft text-[11px]">{t === 0 ? '0' : `${t / 1000}k`}</text>
        </g>
      ))}

      <path d={area} fill="url(#rev-fill)" />
      <path d={line} fill="none" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" className="stroke-brand-600" />

      {data.map((d, i) => (
        <g key={d.label}>
          {(i % 5 === 0 || i === data.length - 1) && (
            <text x={x(i)} y={H - 10} textAnchor="middle" className="fill-ink-soft text-[11px]">{d.label}</text>
          )}
          {/* Invisible hit-target carrying the tooltip */}
          <circle cx={x(i)} cy={y(d.value)} r={9} fill="transparent"><title>{`${d.label}: ${formatNpr(d.value)}`}</title></circle>
        </g>
      ))}
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1].value)} r={4.5} strokeWidth={2} className="fill-white stroke-brand-600" />
    </svg>
  );
}

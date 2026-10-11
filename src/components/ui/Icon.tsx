/**
 * Minimal inline icon set (24×24, stroke-based). Dependency-free; add paths as needed.
 * Decorative by default (aria-hidden): pair with visible text or an aria-label on the parent.
 */
const PATHS = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  pin: <><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  shield: <><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3z" /><path d="m9 12 2 2 4-4" /></>,
  truck: <><path d="M3 6h11v10H3z" /><path d="M14 9h4l3 3v4h-7z" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></>,
  store: <><path d="M4 9 5.5 4h13L20 9" /><path d="M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" /><path d="M5 12v8h14v-8" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  'arrow-right': <path d="M5 12h14m-6-6 6 6-6 6" />,
  check: <path d="m5 12 5 5 9-10" />,
  package: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></>,
  'trending-up': <><path d="m3 17 6-6 4 4 8-8" /><path d="M15 7h6v6" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  wallet: <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M16 12.5h2M3 10h18" /></>,
  cart: <><path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.8L19.5 8H6" /><circle cx="9" cy="19" r="1.5" /><circle cx="17" cy="19" r="1.5" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  sparkle: <path d="m12 3 2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />,
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className = 'h-5 w-5' }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"
         strokeLinejoin="round" aria-hidden="true" className={className}>
      {PATHS[name]}
    </svg>
  );
}

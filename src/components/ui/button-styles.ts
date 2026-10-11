/**
 * Single definition of button looks. Used by <Button> AND by <Link> styled as buttons,
 * so every call-to-action in the app is identical.
 */
export type ButtonVariant = 'primary' | 'royal' | 'secondary' | 'ghost' | 'inverse';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:   'bg-brand-600 text-white shadow-brand hover:bg-brand-700',
  royal:     'bg-royal-600 text-white hover:bg-royal-700',
  secondary: 'border border-surface-border bg-white text-ink hover:border-royal-300 hover:bg-royal-50',
  ghost:     'text-royal-700 hover:bg-royal-50',
  inverse:   'border border-white/30 text-white hover:bg-white/10', // for dark (purple) backgrounds
};
const SIZES: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
};

export function buttonClasses(opts: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}): string {
  const { variant = 'primary', size = 'md', className = '' } = opts;
  return `inline-flex items-center justify-center gap-2 rounded-ui font-semibold transition-all duration-200
    active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
}

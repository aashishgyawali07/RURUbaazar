import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { buttonClasses, type ButtonSize, type ButtonVariant } from './button-styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

/** Presentational only. Disabled while `loading` to block double-submits. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, className = '', children, ...rest }, ref,
) {
  return (
    <button ref={ref} disabled={disabled || loading} aria-busy={loading}
            className={buttonClasses({ variant, size, className })} {...rest}>
      {loading ? 'Please wait…' : children}
    </button>
  );
});

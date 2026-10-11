import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { fieldClasses } from './field-styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

/** Labelled input with accessible error wiring (aria-invalid / aria-describedby). */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className = '', ...rest }, ref,
) {
  const id = useId();
  const descId = `${id}-desc`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink">{label}</label>
      <input ref={ref} id={id} aria-invalid={!!error} aria-describedby={error || hint ? descId : undefined}
             className={fieldClasses(!!error, className)} {...rest} />
      {(error || hint) && <p id={descId} className={`text-xs ${error ? 'text-danger' : 'text-ink-soft'}`}>{error ?? hint}</p>}
    </div>
  );
});

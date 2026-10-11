import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { fieldClasses } from './field-styles';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> { label: string; error?: string; options: readonly string[] }

export const Select = forwardRef<HTMLSelectElement, Props>(function Select({ label, error, options, className = '', ...rest }, ref) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink">{label}</label>
      <select ref={ref} id={id} aria-invalid={!!error} className={fieldClasses(!!error, className)} {...rest}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
});

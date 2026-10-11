import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { fieldClasses } from './field-styles';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> { label: string; error?: string; hint?: string }

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea({ label, error, hint, className = '', ...rest }, ref) {
  const id = useId();
  const descId = `${id}-desc`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink">{label}</label>
      <textarea ref={ref} id={id} rows={5} aria-invalid={!!error} aria-describedby={error || hint ? descId : undefined}
                className={fieldClasses(!!error, `resize-y ${className}`)} {...rest} />
      {(error || hint) && <p id={descId} className={`text-xs ${error ? 'text-danger' : 'text-ink-soft'}`}>{error ?? hint}</p>}
    </div>
  );
});

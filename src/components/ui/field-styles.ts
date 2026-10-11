/** Shared look for Input / Textarea / Select. */
export const fieldClasses = (hasError: boolean, extra = '') =>
  `w-full rounded-ui border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint transition-colors
   focus:outline-none focus:ring-2 focus:ring-royal-200
   ${hasError ? 'border-danger focus:ring-red-100' : 'border-surface-border hover:border-royal-300 focus:border-royal-500'} ${extra}`;

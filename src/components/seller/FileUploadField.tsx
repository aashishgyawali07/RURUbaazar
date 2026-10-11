'use client';
import { useEffect, useId, useState } from 'react';
import { ACCEPTED_FILE_TYPES } from '@/lib/validation/seller';

interface Props {
  label: string;
  file: File | null;
  error?: string;
  onChange: (file: File | null) => void;
}

/** Presentational file input with image preview. Validation is done by the parent hook. */
export function FileUploadField({ label, file, error, onChange }: Props) {
  const id = useId();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Create/revoke object URLs so previews don't leak memory.
  useEffect(() => {
    if (!file) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink">{label}</label>
      <div className={`flex items-center gap-4 rounded-ui border border-dashed bg-surface p-3
        ${error ? 'border-danger' : 'border-surface-border'}`}>
        {previewUrl
          // eslint-disable-next-line @next/next/no-img-element -- local blob preview; next/image can't optimise blob: URLs
          ? <img src={previewUrl} alt={`${label} preview`} className="h-16 w-24 rounded object-cover" />
          : <div className="flex h-16 w-24 items-center justify-center rounded bg-surface-muted text-xs text-ink-faint">No file</div>}
        <input
          id={id} type="file" accept={ACCEPTED_FILE_TYPES.join(',')}
          aria-invalid={!!error}
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          className="min-w-0 flex-1 text-sm text-ink-soft file:mr-3 file:rounded-ui file:border-0
                     file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-700"
        />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

'use client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useSellerOnboarding } from '@/hooks/useSellerOnboarding';
import { FileUploadField } from './FileUploadField';

/** Seller registration form. Markup only; state and rules live in useSellerOnboarding. */
export function SellerOnboardingForm() {
  const s = useSellerOnboarding();

  // Success state replaces the form so users can't double-submit.
  if (s.submittedId) {
    return (
      <div role="status" className="rounded-2xl border border-surface-border bg-white p-8 shadow-card">
        <h2 className="font-display text-xl font-semibold">Application received</h2>
        <p className="mt-2 text-sm text-ink-soft">
          We'll review your documents and email you at {s.values.email} once your store is approved.
          Reference: <span className="font-medium text-ink">{s.submittedId}</span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={s.handleSubmit} noValidate className="space-y-8 rounded-2xl border border-surface-border bg-white p-6 shadow-card sm:p-8">
      <fieldset className="space-y-4">
        <legend className="font-display text-lg font-semibold">Store details</legend>
        <Input label="Store name" name="storeName" value={s.values.storeName}
               onChange={s.handleChange} error={s.errors.storeName} autoComplete="organization" />
        <Input label="PAN number" name="panNumber" inputMode="numeric" maxLength={9} value={s.values.panNumber}
               onChange={s.handleChange} error={s.errors.panNumber} hint="9 digits, as printed on your PAN card." />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Contact number" name="contactNumber" type="tel" inputMode="numeric" maxLength={10}
                 value={s.values.contactNumber} onChange={s.handleChange} error={s.errors.contactNumber} />
          <Input label="Email ID" name="email" type="email" autoComplete="email"
                 value={s.values.email} onChange={s.handleChange} error={s.errors.email} />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-lg font-semibold">Verification documents</legend>
        <p className="text-sm text-ink-soft">JPG, PNG or WebP, up to 5 MB each. Documents are stored privately and used only for verification.</p>
        <FileUploadField label="PAN card image" file={s.files.panImage}
                         error={s.errors.panImage} onChange={(f) => s.handleFile('panImage', f)} />
        <FileUploadField label="Citizenship (front)" file={s.files.citizenshipFront}
                         error={s.errors.citizenshipFront} onChange={(f) => s.handleFile('citizenshipFront', f)} />
        <FileUploadField label="Citizenship (back)" file={s.files.citizenshipBack}
                         error={s.errors.citizenshipBack} onChange={(f) => s.handleFile('citizenshipBack', f)} />
      </fieldset>

      {s.errors.form && <p role="alert" className="text-sm text-danger">{s.errors.form}</p>}
      <Button type="submit" loading={s.submitting} className="w-full sm:w-auto">Submit application</Button>
    </form>
  );
}

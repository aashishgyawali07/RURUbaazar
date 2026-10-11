'use client';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useContactForm } from '@/hooks/useContactForm';
import { CONTACT_TOPICS } from '@/lib/validation/contact';

/** Contact form card. Markup only; logic in useContactForm. */
export function ContactForm() {
  const f = useContactForm();

  if (f.sent) {
    return (
      <div role="status" className="rounded-2xl border border-surface-border bg-white p-8 text-center shadow-card sm:p-12">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-success"><Icon name="check" className="h-7 w-7" /></span>
        <h2 className="mt-4 font-display text-2xl font-bold">Message sent</h2>
        <p className="mt-2 text-sm text-ink-soft">Thanks for reaching out. We usually reply within one business day.</p>
        <Button variant="secondary" className="mt-6" onClick={f.reset}>Send another message</Button>
      </div>
    );
  }

  return (
    <form onSubmit={f.handleSubmit} noValidate className="space-y-5 rounded-2xl border border-surface-border bg-white p-6 shadow-card sm:p-8">
      <div>
        <h2 className="font-display text-2xl font-bold">Send us a message</h2>
        <p className="mt-1 text-sm text-ink-soft">Fill in the form and our team will get back to you.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Full name" name="name" autoComplete="name" value={f.values.name} onChange={f.handleChange} error={f.errors.name} />
        <Input label="Email" name="email" type="email" autoComplete="email" value={f.values.email} onChange={f.handleChange} error={f.errors.email} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Phone (optional)" name="phone" type="tel" autoComplete="tel" value={f.values.phone} onChange={f.handleChange} error={f.errors.phone} placeholder="98XXXXXXXX" />
        <Select label="Topic" name="topic" options={CONTACT_TOPICS} value={f.values.topic} onChange={f.handleChange} />
      </div>
      <Textarea label="Message" name="message" value={f.values.message} onChange={f.handleChange} error={f.errors.message}
                hint={`${f.values.message.length}/1000`} placeholder="How can we help?" />

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" value={f.values.website} onChange={f.handleChange} /></label>
      </div>

      {f.errors.form && <p role="alert" className="text-sm text-danger">{f.errors.form}</p>}
      <Button type="submit" size="lg" loading={f.submitting} className="w-full sm:w-auto">Send message</Button>
    </form>
  );
}

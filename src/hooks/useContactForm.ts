'use client';
/** BUSINESS LOGIC for the contact form: state, validation, submit lifecycle. No markup. */
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { sendContactMessage } from '@/services/contact.service';
import { CONTACT_TOPICS, validateContact, type ContactErrors, type ContactValues } from '@/lib/validation/contact';

const INITIAL: ContactValues = { name: '', email: '', phone: '', topic: CONTACT_TOPICS[0], message: '', website: '' };

export function useContactForm() {
  const [values, setValues] = useState<ContactValues>(INITIAL);
  const [errors, setErrors] = useState<ContactErrors & { form?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setValues((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const v = validateContact(values);
    setErrors(v);
    if (Object.keys(v).length) return;

    // Honeypot tripped: pretend success, send nothing.
    if (values.website) { setSent(true); return; }

    setSubmitting(true);
    const res = await sendContactMessage(values);
    setSubmitting(false);
    if (res.ok) setSent(true);
    else setErrors({ form: res.error });
  }

  function reset() { setValues(INITIAL); setErrors({}); setSent(false); }

  return { values, errors, submitting, sent, handleChange, handleSubmit, reset };
}

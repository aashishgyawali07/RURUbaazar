/** PURE validation for the contact form (no React, no network). */
export const CONTACT_TOPICS = ['Order or delivery', 'Payment issue', 'Selling on RURUbaazar', 'Feedback', 'Something else'] as const;

export interface ContactValues {
  name: string; email: string; phone: string; topic: string; message: string;
  /** Honeypot: real users never see or fill this. Bots usually do. */
  website: string;
}
export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(v: ContactValues): ContactErrors {
  const e: ContactErrors = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!EMAIL_RE.test(v.email)) e.email = 'Enter a valid email address.';
  // Phone is optional; if given it must be a Nepali mobile (97/98…), with optional +977.
  const phone = v.phone.replace(/[\s-]/g, '');
  if (phone && !/^(\+977)?9[78]\d{8}$/.test(phone)) e.phone = 'Enter a valid Nepali mobile number.';
  if (v.message.trim().length < 10) e.message = 'Tell us a little more (at least 10 characters).';
  if (v.message.length > 1000) e.message = 'Please keep your message under 1000 characters.';
  return e;
}

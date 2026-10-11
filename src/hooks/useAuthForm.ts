'use client';
/**
 * BUSINESS LOGIC for the auth page: mode toggle, field state, validation, submission.
 * Returns plain state + handlers so <AuthForm/> stays purely presentational.
 */
import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmail, signInWithProvider, signUpWithEmail } from '@/services/auth.service';
import type { OAuthProvider } from '@/types';

export type AuthMode = 'login' | 'signup';
type Errors = Partial<Record<'email' | 'password' | 'form', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useAuthForm() {
  const router = useRouter();
  const next = useSearchParams().get('next') ?? '/buyer';

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): Errors {
    const e: Errors = {};
    if (!EMAIL_RE.test(email)) e.email = 'Enter a valid email address.';
    if (password.length < 8) e.password = 'Use at least 8 characters.';
    return e;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    setNotice(null);
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    if (mode === 'login') {
      const res = await signInWithEmail(email, password);
      if (res.ok) { router.push(next); router.refresh(); }
      else setErrors({ form: res.error });
    } else {
      const res = await signUpWithEmail(email, password);
      if (!res.ok) setErrors({ form: res.error });
      else if (res.data.needsEmailConfirmation) setNotice('Check your inbox to confirm your email, then log in.');
      else { router.push(next); router.refresh(); }
    }
    setSubmitting(false);
  }

  async function handleProvider(provider: OAuthProvider) {
    setErrors({});
    const res = await signInWithProvider(provider, next);
    if (!res.ok) setErrors({ form: res.error });
  }

  function switchMode(m: AuthMode) { setMode(m); setErrors({}); setNotice(null); }

  return { mode, switchMode, email, setEmail, password, setPassword, errors, notice, submitting, handleSubmit, handleProvider };
}

'use client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthForm } from '@/hooks/useAuthForm';
import { SocialAuthButtons } from './SocialAuthButtons';

/**
 * Centralised auth UI (login + signup in one card).
 * All state/logic comes from useAuthForm; this file is markup only.
 */
export function AuthForm() {
  const a = useAuthForm();
  const isLogin = a.mode === 'login';

  return (
    <div className="w-full max-w-md rounded-2xl border border-surface-border bg-white p-8 shadow-card">
      <h1 className="font-display text-2xl font-semibold">{isLogin ? 'Log in' : 'Create your account'}</h1>

      {/* Mode switch with tab semantics for screen readers */}
      <div role="tablist" className="mt-5 grid grid-cols-2 rounded-ui bg-surface-muted p-1 text-sm">
        {(['login', 'signup'] as const).map((m) => (
          <button
            key={m} role="tab" type="button" aria-selected={a.mode === m}
            onClick={() => a.switchMode(m)}
            className={`rounded-lg py-2 font-medium transition-colors
              ${a.mode === m ? 'bg-surface text-ink shadow-sm' : 'text-ink-soft'}`}
          >
            {m === 'login' ? 'Log in' : 'Sign up'}
          </button>
        ))}
      </div>

      <form onSubmit={a.handleSubmit} noValidate className="mt-6 space-y-4">
        <Input label="Email" type="email" autoComplete="email" value={a.email}
               onChange={(e) => a.setEmail(e.target.value)} error={a.errors.email} />
        <Input label="Password" type="password" value={a.password}
               autoComplete={isLogin ? 'current-password' : 'new-password'}
               onChange={(e) => a.setPassword(e.target.value)} error={a.errors.password}
               hint={isLogin ? undefined : 'At least 8 characters.'} />

        {a.errors.form && <p role="alert" className="text-sm text-danger">{a.errors.form}</p>}
        {a.notice && <p role="status" className="text-sm text-success">{a.notice}</p>}

        <Button type="submit" className="w-full" loading={a.submitting}>
          {isLogin ? 'Log in' : 'Create account'}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-ink-faint">
        <span className="h-px flex-1 bg-surface-border" /> or <span className="h-px flex-1 bg-surface-border" />
      </div>

      <SocialAuthButtons onSelect={a.handleProvider} disabled={a.submitting} />
    </div>
  );
}

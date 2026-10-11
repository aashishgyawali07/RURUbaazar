import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AuthForm } from '@/components/auth/AuthForm';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { Icon, type IconName } from '@/components/ui/Icon';

export const metadata: Metadata = { title: 'Log in or sign up' };

const PERKS: { icon: IconName; text: string }[] = [
  { icon: 'shield', text: 'Secure payments with eSewa & Khalti' },
  { icon: 'store', text: 'Open your own store in minutes' },
  { icon: 'package', text: 'Track every order in one place' },
];

// Split layout: brand panel (desktop only) + form. useSearchParams() in AuthForm needs Suspense.
export default function AuthPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-hero-gradient p-12 text-white lg:flex lg:flex-col lg:justify-end">
        <div aria-hidden="true" className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-24 -left-10 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="relative max-w-md">
          <h1 className="font-display text-4xl font-bold leading-tight">Welcome to Nepal’s <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">marketplace</span></h1>
          <ul className="mt-8 space-y-4">
            {PERKS.map((p) => (
              <li key={p.text} className="flex items-center gap-3 text-royal-100">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10"><Icon name={p.icon} className="h-5 w-5" /></span>{p.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center gap-8 p-4 py-12">
        <BrandLogo className="h-9" priority />
        <Suspense><AuthForm /></Suspense>
      </section>
    </main>
  );
}

import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';
import { Icon, type IconName } from '@/components/ui/Icon';
import { SITE } from '@/lib/site-config';

export const metadata: Metadata = { title: 'Contact us', description: `Get in touch with the ${SITE.name} support team.` };

const DETAILS: { icon: IconName; label: string; value: string; href?: string }[] = [
  { icon: 'mail', label: 'Email', value: SITE.support.email, href: `mailto:${SITE.support.email}` },
  { icon: 'phone', label: 'Phone', value: SITE.support.phone, href: `tel:${SITE.support.phone.replace(/\s/g, '')}` },
  { icon: 'clock', label: 'Support hours', value: SITE.support.hours },
  { icon: 'pin', label: 'Office', value: SITE.support.address },
];

export default function ContactPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-hero-gradient pb-24 pt-14 text-white sm:pt-20">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-500/25 blur-3xl" />
        <div className="container-page relative">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">We’re here to <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">help</span></h1>
          <p className="mt-4 max-w-xl text-lg text-royal-100">Questions about an order, a payment or selling with us? Reach out and a real person will reply.</p>
        </div>
      </section>

      {/* Cards overlap the hero for depth */}
      <div className="container-page -mt-14 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <aside aria-label="Support details" className="space-y-4">
          <ul className="space-y-1 rounded-2xl border border-surface-border bg-white p-3 shadow-card">
            {DETAILS.map((d) => (
              <li key={d.label} className="flex items-start gap-4 rounded-xl p-3 hover:bg-surface-muted">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-royal-50 text-royal-700"><Icon name={d.icon} className="h-5 w-5" /></span>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{d.label}</p>
                  {d.href
                    ? <a href={d.href} className="break-words font-medium text-ink hover:text-brand-600">{d.value}</a>
                    : <p className="font-medium">{d.value}</p>}
                </div>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl bg-royal-950 p-6 text-white">
            <h2 className="font-display text-lg font-bold">Selling with us?</h2>
            <p className="mt-1 text-sm text-royal-100">Choose “Selling on {SITE.name}” in the form and our seller team will respond.</p>
          </div>
        </aside>
        <ContactForm />
      </div>
    </main>
  );
}

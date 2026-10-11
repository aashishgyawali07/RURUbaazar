import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import { SITE } from '@/lib/site-config';
import './globals.css';

// Body: clean geometric sans. Display: Playfair, the same serif family as the logo wordmark.
const sans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' });
const display = Playfair_Display({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-display' });

export const metadata: Metadata = {
  title: { default: `${SITE.name}: ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: 'Shop authentic products from verified Nepali sellers, with secure eSewa and Khalti checkout.',
};

export const viewport: Viewport = { themeColor: '#5E17EB' };

// Root layout: global concerns only. Section chrome lives in each route group's layout.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}

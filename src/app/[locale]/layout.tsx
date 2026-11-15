import type { Metadata } from 'next';
import { Figtree, Fraunces } from 'next/font/google';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { DemoBanner, SiteFooter, SiteHeader } from '@/components/layout/SiteChrome';
import { isDemoDataEnabled } from '@/features/discovery/repository';
import { LOCALES, isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import '../globals.css';

// Provisional brand fonts (self-hosted at build time by next/font; no runtime Google requests).
const sans = Figtree({ subsets: ['latin', 'latin-ext'], variable: '--font-figtree', display: 'swap' });
const display = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'opsz'],
});

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: { default: dict.meta.title, template: '%s · voluyo' },
    description: dict.meta.description,
    // Pre-launch: nothing here is production content. Revisit at launch.
    robots: { index: false, follow: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={locale} className={`${sans.variable} ${display.variable}`}>
      <body className="flex min-h-svh flex-col bg-paper font-sans text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          {dict.nav.skipToContent}
        </a>
        {isDemoDataEnabled() ? <DemoBanner dict={dict} /> : null}
        <SiteHeader locale={locale} dict={dict} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale} dict={dict} />
      </body>
    </html>
  );
}

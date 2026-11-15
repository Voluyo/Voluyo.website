import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ComingSoon } from '@/components/content/ContentParts';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).auth.loginTitle } : {};
}

/** Placeholder only — authentication is out of scope for this slice. */
export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return <ComingSoon locale={locale} dict={dict} title={dict.auth.loginTitle} />;
}

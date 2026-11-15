import Link from 'next/link';
import { locale as rootLocale } from 'next/root-params';
import { Container, buttonStyles } from '@/components/ui/primitives';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';

export default async function NotFound() {
  const value = await rootLocale();
  const locale = isLocale(value) ? value : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return (
    <Container className="py-24 text-center">
      <p className="font-display text-7xl text-sea-700">404</p>
      <h1 className="mt-4 text-3xl">{dict.notFound.title}</h1>
      <p className="mx-auto mt-3 max-w-md text-ink-soft">{dict.notFound.body}</p>
      <Link href={`/${locale}`} className={`${buttonStyles.primary} mt-8`}>
        {dict.notFound.home}
      </Link>
    </Container>
  );
}

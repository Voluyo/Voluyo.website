import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge, Container, Notice, PageHeader, buttonStyles } from '@/components/ui/primitives';
import { HOST_KIND, HOST_TYPES } from '@/domain/taxonomy';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).becomeHost.title } : {};
}

export default async function BecomeHostPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.becomeHost;
  const organizations = HOST_TYPES.filter((type) => HOST_KIND[type] === 'organization');
  const privateHosts = HOST_TYPES.filter((type) => HOST_KIND[type] === 'private');

  return (
    <Container>
      <PageHeader title={t.title} lead={t.lead} />

      <section aria-labelledby="who-heading">
        <h2 id="who-heading" className="text-3xl">
          {t.whoTitle}
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-card border border-line bg-white p-6">
            <h3 className="text-xl">{t.organizationsTitle}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {organizations.map((type) => (
                <li key={type}>
                  <Badge tone="sea" className="px-3 py-1 text-sm">
                    {dict.hostTypes[type]}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card border border-line bg-white p-6">
            <h3 className="text-xl">{t.privateTitle}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {privateHosts.map((type) => (
                <li key={type}>
                  <Badge tone="sun" className="px-3 py-1 text-sm">
                    {dict.hostTypes[type]}
                  </Badge>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">{t.privateNote}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="how-heading" className="mt-16">
        <h2 id="how-heading" className="text-3xl">
          {t.howTitle}
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-2">
          {t.howItems.map((item, index) => (
            <li key={item} className="flex gap-4 rounded-card bg-sand-100 p-5">
              <span aria-hidden="true" className="font-display text-3xl leading-none text-sea-700">
                {index + 1}
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <Notice tone="demo" role="note" title={t.statusTitle} className="mt-16 max-w-3xl">
        <p>{t.statusBody}</p>
        <Link href={`/${locale}/help`} className={`${buttonStyles.secondary} mt-4`}>
          {t.helpCta}
        </Link>
      </Notice>
    </Container>
  );
}

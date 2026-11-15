import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Notice, PageHeader } from '@/components/ui/primitives';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).help.title } : {};
}

export default async function HelpPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale).help;

  return (
    <Container className="max-w-3xl">
      <PageHeader title={t.title} lead={t.lead} />
      <div className="divide-y divide-line rounded-card border border-line bg-white">
        {t.faqs.map((faq) => (
          <details key={faq.question} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-display text-xl">
              {faq.question}
              <span aria-hidden="true" className="mt-1 text-sea-700 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 leading-relaxed text-ink-soft">{faq.answer}</p>
          </details>
        ))}
      </div>
      <Notice tone="placeholder" className="mt-8">
        {t.contactNote}
      </Notice>
    </Container>
  );
}

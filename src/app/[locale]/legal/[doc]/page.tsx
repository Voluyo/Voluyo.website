import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Badge, Container, Notice, PageHeader } from '@/components/ui/primitives';
import { isOneOf } from '@/domain/taxonomy';
import { LEGAL_DOCS } from '@/i18n/dictionaries/shared';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';

type Props = { params: Promise<{ locale: string; doc: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LEGAL_DOCS.map((doc) => ({ doc }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, doc } = await params;
  if (!isLocale(locale) || !isOneOf(LEGAL_DOCS, doc)) return {};
  return { title: getDictionary(locale).legal.docs[doc] };
}

/** Legal placeholders. Real legal text (Impressum, privacy, terms) needs review before launch. */
export default async function LegalPage({ params }: Props) {
  const { locale, doc } = await params;
  if (!isLocale(locale) || !isOneOf(LEGAL_DOCS, doc)) notFound();
  const t = getDictionary(locale).legal;

  return (
    <Container className="max-w-3xl">
      <PageHeader eyebrow={<Badge tone="demo">{t.badge}</Badge>} title={t.docs[doc]} />
      <Notice tone="demo" role="note">
        {t.body}
      </Notice>
    </Container>
  );
}

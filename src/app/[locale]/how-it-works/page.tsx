import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StepList } from '@/components/content/ContentParts';
import { Container, PageHeader } from '@/components/ui/primitives';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).howItWorks.title } : {};
}

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.howItWorks;

  return (
    <Container>
      <PageHeader title={t.title} lead={t.lead} />
      <section aria-labelledby="travelers-heading">
        <h2 id="travelers-heading" className="mb-6 text-3xl">
          {t.travelersTitle}
        </h2>
        <StepList steps={t.travelerSteps} dict={dict} />
      </section>
      <section aria-labelledby="hosts-heading" className="mt-16">
        <h2 id="hosts-heading" className="mb-6 text-3xl">
          {t.hostsTitle}
        </h2>
        <StepList steps={t.hostSteps} dict={dict} />
      </section>
      <section aria-labelledby="rules-heading" className="mt-16 rounded-card bg-sea-900 p-6 text-sea-50 sm:p-10">
        <h2 id="rules-heading" className="text-3xl text-paper">
          {t.rulesTitle}
        </h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {t.rules.map((rule) => (
            <li key={rule} className="rounded-2xl border border-paper/15 p-4 leading-relaxed">
              {rule}
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}

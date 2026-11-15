import Link from 'next/link';
import { Badge, Container, Notice, PageHeader, buttonStyles } from '@/components/ui/primitives';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/en';
import type { Step } from '@/i18n/dictionaries/shared';

export function StepList({ steps, dict }: { steps: readonly Step[]; dict: Dictionary }) {
  return (
    <ol className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li key={step.title} className="flex flex-col gap-3 bg-paper p-6">
          <div className="flex items-center justify-between gap-3">
            <span aria-hidden="true" className="font-display text-4xl text-sea-700">
              {String(index + 1).padStart(2, '0')}
            </span>
            <Badge tone={step.status === 'live' ? 'live' : 'planned'}>{dict.status[step.status]}</Badge>
          </div>
          <h3 className="text-xl leading-tight">{step.title}</h3>
          <p className="text-sm leading-relaxed text-ink-soft">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}

/** Honest "not yet available" page for login/sign-up. Never simulates authentication. */
export function ComingSoon({ locale, dict, title }: { locale: Locale; dict: Dictionary; title: string }) {
  return (
    <Container className="max-w-3xl">
      <PageHeader eyebrow={<Badge tone="demo">{dict.status.notYetAvailable}</Badge>} title={title} lead={dict.auth.body} />
      <Notice tone="placeholder" title={dict.auth.plannedTitle}>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          {dict.auth.planned.map((method) => (
            <li key={method}>{method}</li>
          ))}
        </ul>
      </Notice>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={`/${locale}/explore`} className={buttonStyles.primary}>
          {dict.auth.exploreCta}
        </Link>
        <Link href={`/${locale}/help`} className={buttonStyles.secondary}>
          {dict.nav.help}
        </Link>
      </div>
    </Container>
  );
}

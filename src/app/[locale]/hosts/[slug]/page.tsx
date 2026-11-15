import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CoverArt, DemoBadge } from '@/components/discovery/DiscoveryParts';
import { Badge, Container, Notice } from '@/components/ui/primitives';
import { HOST_KIND, SKILLS } from '@/domain/taxonomy';
import { getPublicHostBySlug } from '@/features/discovery/repository';
import { explorePath } from '@/features/discovery/search-params';
import { isLocale } from '@/i18n/config';
import { countryName, formatDateRange, languageName } from '@/i18n/format';
import { getDictionary } from '@/i18n/get-dictionary';

interface HostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: HostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const found = getPublicHostBySlug(slug);
  if (!found) return {};
  return { title: found.host.name, description: found.host.summary[locale] };
}

export default async function HostPage({ params }: HostPageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const found = getPublicHostBySlug(slug);
  if (!found) notFound();

  const dict = getDictionary(locale);
  const { host, opportunities } = found;
  // Host profiles stay public without opportunities; skills and periods derive from opportunities.
  const hasOpportunities = opportunities.length > 0;
  const city = host.location.city[locale];
  const country = countryName(locale, host.location.countryCode);
  const requested = new Set(opportunities.flatMap((opportunity) => opportunity.requestedSkills));
  const requestedSkills = SKILLS.filter((skill) => requested.has(skill));
  const windows = opportunities
    .flatMap((opportunity) => opportunity.availability.map((window) => ({ window, opportunity })))
    .sort((a, b) => a.window.start.localeCompare(b.window.start));

  return (
    <Container className="pb-8">
      <nav aria-label={dict.host.breadcrumb} className="pt-8 text-sm">
        <ol className="flex flex-wrap items-center gap-2 text-ink-soft">
          <li>
            <Link href={explorePath(locale)} className="underline-offset-4 hover:text-ink hover:underline">
              {dict.nav.explore}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">
            {host.name}
          </li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="sea">{dict.hostTypes[host.hostType]}</Badge>
            <Badge tone="neutral">{dict.hostKinds[HOST_KIND[host.hostType]]}</Badge>
            {host.origin === 'demo' ? <DemoBadge dict={dict} /> : null}
          </div>
          <h1 className="mt-4 text-4xl leading-[1.05] tracking-tight sm:text-6xl">{host.name}</h1>
          <p className="mt-3 text-lg text-ink-soft">
            <span className="sr-only">{dict.host.location}: </span>
            {city}, {country}
          </p>
          <p className="mt-5 max-w-2xl text-xl leading-relaxed">{host.summary[locale]}</p>

          {host.origin === 'demo' ? (
            <Notice tone="demo" role="note" className="mt-6">
              {dict.host.demoNotice}
            </Notice>
          ) : null}

          <figure className="mt-8 overflow-hidden rounded-card border border-line">
            <CoverArt seed={host.slug} place={city} stamp={host.location.countryCode} size="feature" />
            <figcaption className="bg-white px-4 py-3 text-sm text-ink-soft">{dict.host.photosNote}</figcaption>
          </figure>

          <section aria-labelledby="about-heading" className="mt-12">
            <h2 id="about-heading" className="text-3xl">
              {dict.host.about}
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed">{host.description[locale]}</p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-sand-100 p-4">
                <dt className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">{dict.host.languages}</dt>
                <dd className="mt-1 font-medium">{host.languages.map((code) => languageName(locale, code)).join(', ')}</dd>
              </div>
              <div className="rounded-2xl bg-sand-100 p-4">
                <dt className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">{dict.host.location}</dt>
                <dd className="mt-1 font-medium">
                  {city}, {country}
                </dd>
                <dd className="mt-1 text-xs text-ink-soft">{dict.host.locationNote}</dd>
              </div>
            </dl>
          </section>

          {hasOpportunities ? (
            <>
              <section aria-labelledby="skills-heading" className="mt-12">
                <h2 id="skills-heading" className="text-3xl">
                  {dict.host.requestedSkills}
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {requestedSkills.map((skill) => (
                    <li key={skill}>
                      <Badge tone="sun" className="px-3 py-1 text-sm">
                        {dict.skills[skill]}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="availability-heading" className="mt-12">
                <h2 id="availability-heading" className="text-3xl">
                  {dict.host.availability}
                </h2>
                <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-white">
                  {windows.map(({ window, opportunity }) => (
                    <li key={`${opportunity.id}-${window.start}`} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <span className="font-semibold">{formatDateRange(locale, window.start, window.end)}</span>
                      <span className="text-sm text-ink-soft">{opportunity.title[locale]}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          ) : null}

          <section aria-labelledby="opportunities-heading" className="mt-12">
            <h2 id="opportunities-heading" className="text-3xl">
              {dict.host.opportunities}
            </h2>
            {hasOpportunities ? (
              <ul className="mt-4 grid gap-4">
                {opportunities.map((opportunity) => (
                  <li key={opportunity.id} id={opportunity.slug} className="rounded-card border border-line bg-white p-5 shadow-card">
                    <Badge tone="sea">{dict.categories[opportunity.category]}</Badge>
                    <h3 className="mt-3 text-2xl leading-tight">{opportunity.title[locale]}</h3>
                    <p className="mt-2 leading-relaxed text-ink-soft">{opportunity.summary[locale]}</p>
                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="font-semibold">{dict.host.skillsShort}</dt>
                        <dd className="text-ink-soft">{opportunity.requestedSkills.map((skill) => dict.skills[skill]).join(', ')}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">{dict.host.availableShort}</dt>
                        <dd className="text-ink-soft">
                          {opportunity.availability.map((window) => formatDateRange(locale, window.start, window.end)).join('; ')}
                        </dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 rounded-card border border-dashed border-line bg-white/60 p-5 text-ink-soft">
                {dict.explore.noOpportunities}
              </p>
            )}
          </section>
        </div>

        <aside className="lg:pt-2">
          <div className="rounded-card border border-line bg-white p-6 shadow-card lg:sticky lg:top-24">
            <p className="font-display text-2xl">{dict.host.applyTitle}</p>
            <button
              type="button"
              disabled
              aria-describedby="apply-note"
              className="mt-4 inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-sand-200 px-5 font-semibold text-ink-soft"
            >
              {dict.host.applyButton} · {dict.status.notYetAvailable}
            </button>
            <p id="apply-note" className="mt-3 text-sm leading-relaxed text-ink-soft">
              {dict.host.applyNote}
            </p>
            <p className="mt-4 border-t border-dashed border-line pt-4 text-xs leading-relaxed text-ink-soft">
              {dict.host.verificationNote}
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { StepList } from '@/components/content/ContentParts';
import { CoverArt, HostCard } from '@/components/discovery/DiscoveryParts';
import { HeroSearch } from '@/components/search/HeroSearch';
import { Container, EmptyState, buttonStyles } from '@/components/ui/primitives';
import { citySuggestions, countryOptions } from '@/features/discovery/options';
import { getPublicDiscoveryData } from '@/features/discovery/repository';
import { listDestinations, searchHosts } from '@/features/discovery/search';
import { explorePath } from '@/features/discovery/search-params';
import { isLocale } from '@/i18n/config';
import { countryName, plural } from '@/i18n/format';
import { getDictionary } from '@/i18n/get-dictionary';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const data = getPublicDiscoveryData();
  const featured = searchHosts(data, {}).slice(0, 3);
  const destinations = listDestinations(data);

  return (
    <>
      <section aria-labelledby="hero-title" className="hero-backdrop relative isolate overflow-hidden text-paper">
        <Container className="flex min-h-[calc(100svh-4rem)] flex-col justify-between gap-10 py-10 sm:py-14 lg:min-h-[min(54rem,calc(100svh-4rem))] lg:py-16">
          <div className="max-w-4xl">
            <p className="inline-flex animate-rise items-center rounded-full border border-paper/25 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sea-100 motion-reduce:animate-none">
              {dict.home.eyebrow}
            </p>
            <h1
              id="hero-title"
              className="mt-6 animate-rise text-[clamp(2.6rem,7vw,5.75rem)] leading-[0.95] tracking-tight [animation-delay:80ms] motion-reduce:animate-none"
            >
              {dict.home.title}
            </h1>
            <p className="mt-6 max-w-2xl animate-rise text-lg leading-relaxed text-sea-100 [animation-delay:160ms] motion-reduce:animate-none sm:text-xl">
              {dict.home.lead}
            </p>
            <p className="mt-4 animate-rise font-display text-xl italic text-sun-200 [animation-delay:200ms] motion-reduce:animate-none">
              {dict.brand.slogan}
            </p>
          </div>
          <div className="animate-rise [animation-delay:260ms] motion-reduce:animate-none">
            <HeroSearch
              locale={locale}
              labels={dict.search}
              countries={countryOptions(data, locale)}
              cities={citySuggestions(data, locale)}
            />
          </div>
        </Container>
      </section>

      <section aria-labelledby="featured-title" className="py-20 sm:py-24">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 id="featured-title" className="text-4xl tracking-tight sm:text-5xl">
                {dict.home.featured.title}
              </h2>
              <p className="mt-3 text-lg text-ink-soft">{dict.home.featured.lead}</p>
            </div>
            <Link href={explorePath(locale)} className={buttonStyles.secondary}>
              {dict.home.featured.exploreAll} <span aria-hidden="true">→</span>
            </Link>
          </div>
          {featured.length > 0 ? (
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:[&>li:nth-child(2)]:mt-10">
              {featured.map((result) => (
                <li key={result.host.id}>
                  <HostCard result={result} locale={locale} dict={dict} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10">
              <EmptyState title={dict.home.featured.emptyTitle} body={dict.home.featured.emptyBody} />
            </div>
          )}
        </Container>
      </section>

      <section aria-labelledby="destinations-title" className="bg-sand-100 py-20 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_2.2fr]">
          <div>
            <h2 id="destinations-title" className="text-4xl tracking-tight sm:text-5xl">
              {dict.home.destinations.title}
            </h2>
            <p className="mt-3 text-lg text-ink-soft">{dict.home.destinations.lead}</p>
          </div>
          {destinations.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {destinations.map((destination) => {
                const city = destination.city[locale];
                const country = countryName(locale, destination.countryCode);
                return (
                  <li key={`${destination.countryCode}-${destination.city.en}`}>
                    <Link
                      href={explorePath(locale, { country: destination.countryCode, city })}
                      className="group block overflow-hidden rounded-card bg-white ring-1 ring-line transition hover:-translate-y-0.5 hover:ring-ink/30 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                      <CoverArt seed={city} place={city} stamp={destination.countryCode} className="h-32 sm:h-40" />
                      <span className="block px-3 py-2.5 text-sm leading-snug">
                        <span className="sr-only">{city}, </span>
                        <span className="block font-semibold">{country}</span>
                        <span className="block text-ink-soft">
                          {plural(locale, destination.opportunityCount, dict.home.destinations.count)}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="self-center rounded-card border border-dashed border-line bg-white/60 p-6 text-ink-soft">
              {dict.home.destinations.empty}
            </p>
          )}
        </Container>
      </section>

      <section aria-labelledby="how-title" className="py-20 sm:py-24">
        <Container>
          <div className="max-w-2xl">
            <h2 id="how-title" className="text-4xl tracking-tight sm:text-5xl">
              {dict.home.how.title}
            </h2>
            <p className="mt-3 text-lg text-ink-soft">{dict.home.how.lead}</p>
          </div>
          <div className="mt-10">
            <StepList steps={dict.howItWorks.travelerSteps} dict={dict} />
          </div>
          <Link href={`/${locale}/how-it-works`} className="mt-6 inline-flex items-center gap-2 font-semibold text-sea-700 underline-offset-4 hover:underline">
            {dict.home.how.more} <span aria-hidden="true">→</span>
          </Link>
        </Container>
      </section>

      <section aria-labelledby="host-title">
        <Container>
          <div className="hero-backdrop grid items-center gap-10 overflow-hidden rounded-[2rem] px-6 py-12 text-paper sm:px-12 sm:py-16 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 id="host-title" className="text-4xl tracking-tight sm:text-5xl">
                {dict.home.host.title}
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-sea-100">{dict.home.host.lead}</p>
              <Link href={`/${locale}/become-a-host`} className={`${buttonStyles.sun} mt-8`}>
                {dict.home.host.cta} <span aria-hidden="true">→</span>
              </Link>
            </div>
            <ul className="space-y-4">
              {dict.home.host.points.map((point) => (
                <li key={point} className="flex gap-3 rounded-2xl border border-paper/15 bg-paper/5 p-4 text-sea-50">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0 text-sun-400" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}

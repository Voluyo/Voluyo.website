import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ActiveFilters, HostCard, ResultsViewToggle, type FilterChip } from '@/components/discovery/DiscoveryParts';
import { ExploreFilters } from '@/components/search/ExploreFilters';
import { Container, EmptyState, Notice, PageHeader, buttonStyles } from '@/components/ui/primitives';
import { earliestTodayIso } from '@/features/discovery/dates';
import { citySuggestions, countryOptions, taxonomyOptions } from '@/features/discovery/options';
import { getPublicDiscoveryData } from '@/features/discovery/repository';
import { searchHosts } from '@/features/discovery/search';
import {
  countActiveFilters,
  explorePath,
  readSearchState,
  resolveFilters,
  toQueryString,
  withoutKeys,
  type RawSearchParams,
  type SearchState,
} from '@/features/discovery/search-params';
import { isLocale, type Locale } from '@/i18n/config';
import { countryName, formatDateRange, plural } from '@/i18n/format';
import { getDictionary, type Dictionary } from '@/i18n/get-dictionary';

interface ExplorePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<RawSearchParams>;
}

export async function generateMetadata({ params }: ExplorePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).explore.title };
}

function buildChips(
  state: SearchState,
  datesApplied: boolean,
  locale: Locale,
  dict: Dictionary,
): FilterChip[] {
  const chips: FilterChip[] = [];
  const add = (key: string, label: string, remove: Array<keyof SearchState>) =>
    chips.push({ key, label, href: explorePath(locale, withoutKeys(state, remove)) });

  if (state.country) add('country', countryName(locale, state.country), ['country']);
  if (state.city) add('city', state.city, ['city']);
  if (datesApplied && state.checkIn && state.checkOut) {
    add('dates', formatDateRange(locale, state.checkIn, state.checkOut), ['checkIn', 'checkOut']);
  }
  if (state.hostType) add('type', dict.hostTypes[state.hostType], ['hostType']);
  if (state.category) add('category', dict.categories[state.category], ['category']);
  if (state.skill) add('skill', dict.skills[state.skill], ['skill']);
  return chips;
}

export default async function ExplorePage({ params, searchParams }: ExplorePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const state = readSearchState(await searchParams);
  const { filters, dateError } = resolveFilters(state, earliestTodayIso());
  const data = getPublicDiscoveryData();
  const results = searchHosts(data, filters);
  const opportunityCount = results.reduce((total, result) => total + result.opportunities.length, 0);
  const hasData = data.hosts.length > 0;
  const chips = buildChips(state, Boolean(filters.dates), locale, dict);
  const summary = `${plural(locale, results.length, dict.explore.hostsCount)} · ${plural(locale, opportunityCount, dict.explore.opportunitiesCount)}`;

  return (
    <Container>
      <PageHeader title={dict.explore.title} lead={dict.explore.lead} />

      <div className="grid items-start gap-8 lg:grid-cols-[19rem_minmax(0,1fr)]">
        <aside>
          <ExploreFilters
            // Remount when the URL changes so uncontrolled fields reflect the new state.
            key={toQueryString(state)}
            locale={locale}
            labels={dict.search}
            initial={state}
            activeCount={countActiveFilters(state)}
            startOpen={Boolean(dateError)}
            options={{
              countries: countryOptions(data, locale),
              cities: citySuggestions(data, locale),
              ...taxonomyOptions(dict),
            }}
          />
        </aside>

        <section aria-labelledby="results-heading" className="flex min-w-0 flex-col gap-6">
          {dateError ? (
            <Notice tone="danger" role="alert" title={dict.search.errors[dateError]}>
              {dict.explore.dateFilterNotApplied}
            </Notice>
          ) : null}

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <h2 id="results-heading" aria-live="polite" className="font-sans text-lg font-semibold">
              {summary}
            </h2>
            <ResultsViewToggle dict={dict} />
          </div>

          <ActiveFilters chips={chips} dict={dict} />

          {results.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((result) => (
                <li key={result.host.id}>
                  <HostCard result={result} locale={locale} dict={dict} />
                </li>
              ))}
            </ul>
          ) : hasData ? (
            <EmptyState
              title={dict.explore.noMatch.title}
              body={dict.explore.noMatch.body}
              action={
                <Link href={explorePath(locale)} className={buttonStyles.primary}>
                  {dict.search.reset}
                </Link>
              }
            />
          ) : (
            <EmptyState title={dict.explore.noData.title} body={dict.explore.noData.body} />
          )}
        </section>
      </div>
    </Container>
  );
}

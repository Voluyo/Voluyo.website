import Link from 'next/link';
import { Badge, cx } from '@/components/ui/primitives';
import type { HostSearchResult } from '@/domain/discovery';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/en';
import { countryName, formatDateRange, interpolate, plural } from '@/i18n/format';

const COVER_PALETTES = [
  'radial-gradient(120% 90% at 100% 0%, var(--color-sun-400), transparent 55%), linear-gradient(150deg, var(--color-sea-600), var(--color-sea-900))',
  'radial-gradient(100% 80% at 0% 100%, var(--color-sea-200), transparent 60%), linear-gradient(160deg, var(--color-sun-400), var(--color-sun-500) 35%, var(--color-sea-800))',
  'radial-gradient(90% 90% at 85% 15%, var(--color-sand-100), transparent 55%), linear-gradient(140deg, var(--color-sea-500), var(--color-sea-800))',
  'radial-gradient(110% 80% at 10% 0%, var(--color-sun-200), transparent 60%), linear-gradient(170deg, var(--color-sea-700), var(--color-sea-950))',
] as const;

function paletteFor(seed: string): string {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return COVER_PALETTES[hash % COVER_PALETTES.length] ?? COVER_PALETTES[0];
}

/**
 * Typographic cover used instead of photos: no legitimate image assets exist yet,
 * and stock or AI imagery must not imply a real place or host.
 */
export function CoverArt({
  seed,
  place,
  stamp,
  size = 'card',
  className,
}: {
  seed: string;
  place: string;
  stamp: string;
  size?: 'card' | 'feature';
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cx('relative overflow-hidden', size === 'card' ? 'h-40' : 'h-52 sm:h-72', className)}
      style={{ backgroundImage: paletteFor(seed) }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(6_31_27/0.65),transparent_62%)]" />
      <span className="postmark absolute right-4 top-4 grid size-14 -rotate-12 place-items-center text-[0.7rem] font-bold tracking-[0.2em] text-paper/90">
        {stamp}
      </span>
      <span
        className={cx(
          'absolute inset-x-4 bottom-3 font-display leading-none text-paper',
          size === 'card' ? 'text-3xl' : 'text-5xl sm:text-7xl',
        )}
      >
        {place}
      </span>
    </div>
  );
}

export function DemoBadge({ dict }: { dict: Dictionary }) {
  return (
    <Badge tone="demo" title={dict.demo.badgeTitle}>
      {dict.demo.badge}
    </Badge>
  );
}

export function HostCard({ result, locale, dict }: { result: HostSearchResult; locale: Locale; dict: Dictionary }) {
  const { host, opportunities } = result;
  const city = host.location.city[locale];
  const shown = opportunities.slice(0, 2);
  const hiddenCount = opportunities.length - shown.length;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:border-ink/25 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <CoverArt seed={host.slug} place={city} stamp={host.location.countryCode} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="sea">{dict.hostTypes[host.hostType]}</Badge>
          {host.origin === 'demo' ? <DemoBadge dict={dict} /> : null}
        </div>
        <h3 className="text-xl leading-tight">
          <Link href={`/${locale}/hosts/${host.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {host.name}
          </Link>
        </h3>
        <p className="text-sm text-ink-soft">
          {city}, {countryName(locale, host.location.countryCode)}
        </p>
        <p className="text-sm leading-relaxed">{host.summary[locale]}</p>
        <div className="mt-auto border-t border-dashed border-line pt-3">
          {opportunities.length > 0 ? (
            <>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-soft">{dict.explore.matching}</p>
              <ul className="mt-2 space-y-2">
                {shown.map((opportunity) => {
                  const firstWindow = opportunity.availability[0];
                  return (
                    <li key={opportunity.id} className="text-sm leading-snug">
                      <span className="font-semibold">{opportunity.title[locale]}</span>
                      <span className="block text-ink-soft">
                        {dict.categories[opportunity.category]}
                        {firstWindow ? ` · ${formatDateRange(locale, firstWindow.start, firstWindow.end)}` : null}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {hiddenCount > 0 ? <p className="mt-2 text-xs font-semibold text-sea-700">{plural(locale, hiddenCount, dict.explore.more)}</p> : null}
            </>
          ) : (
            <p className="text-sm text-ink-soft">{dict.explore.noOpportunities}</p>
          )}
        </div>
      </div>
    </article>
  );
}

export interface FilterChip {
  key: string;
  label: string;
  href: string;
}

export function ActiveFilters({ chips, dict }: { chips: readonly FilterChip[]; dict: Dictionary }) {
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">{dict.explore.activeFilters}</span>
      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={chip.href}
          aria-label={interpolate(dict.explore.removeFilter, { label: chip.label })}
          className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-sm transition-colors hover:border-ink/40"
        >
          <span className="truncate">{chip.label}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </Link>
      ))}
    </div>
  );
}

/**
 * List/map boundary: the same result set will feed a map view later. Until a map provider and
 * an approximate-area privacy model are approved, the map is shown as unavailable — no fake map.
 */
export function ResultsViewToggle({ dict }: { dict: Dictionary }) {
  return (
    <div className="flex flex-col items-start gap-1.5 sm:items-end">
      <div role="group" aria-label={dict.explore.view.label} className="inline-flex rounded-full border border-line bg-white p-0.5 text-sm font-semibold">
        <span aria-current="true" className="rounded-full bg-ink px-3.5 py-1.5 text-paper">
          {dict.explore.view.list}
        </span>
        <button type="button" disabled aria-describedby="map-planned" className="cursor-not-allowed rounded-full px-3.5 py-1.5 text-ink-soft/70">
          {dict.explore.view.map} · {dict.status.planned}
        </button>
      </div>
      <p id="map-planned" className="max-w-xs text-xs leading-relaxed text-ink-soft sm:text-right">
        {dict.explore.view.mapPlanned}
      </p>
    </div>
  );
}

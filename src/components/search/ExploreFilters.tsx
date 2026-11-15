'use client';

import Link from 'next/link';
import { useState } from 'react';
import { buttonStyles, cx } from '@/components/ui/primitives';
import { SEARCH_PARAM, type SearchState } from '@/features/discovery/search-params';
import type { Locale } from '@/i18n/config';
import { plural } from '@/i18n/format';
import { useSearchSubmit, type Option, type SearchLabels } from './use-search-submit';

const label = 'block text-sm font-semibold text-ink';
const control =
  'mt-1.5 block min-h-11 w-full min-w-0 rounded-xl border border-line bg-white px-3 text-base text-ink shadow-sm outline-none transition-colors focus:border-sea-600 focus:ring-2 focus:ring-sea-200 aria-[invalid=true]:border-danger-700';

function SelectField({
  id,
  name,
  text,
  anyLabel,
  options,
  defaultValue,
}: {
  id: string;
  name: string;
  text: string;
  anyLabel: string;
  options: readonly Option[];
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={label}>
        {text}
      </label>
      <select id={id} name={name} defaultValue={defaultValue ?? ''} className={cx(control, 'cursor-pointer')}>
        <option value="">{anyLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export interface ExploreFilterOptions {
  countries: readonly Option[];
  cities: readonly string[];
  hostTypes: readonly Option[];
  categories: readonly Option[];
  skills: readonly Option[];
}

export function ExploreFilters({
  locale,
  labels,
  initial,
  options,
  activeCount,
  startOpen = false,
}: {
  locale: Locale;
  labels: SearchLabels;
  initial: SearchState;
  options: ExploreFilterOptions;
  activeCount: number;
  startOpen?: boolean;
}) {
  const [open, setOpen] = useState(startOpen);
  const [checkIn, setCheckIn] = useState(initial.checkIn ?? '');
  const { error, isPending, today, onSubmit, clearError } = useSearchSubmit(locale);
  const errorId = 'explore-date-error';
  const dateInvalid = error !== null;
  const countLabel = activeCount > 0 ? plural(locale, activeCount, labels.activeCount) : null;

  return (
    <div className="rounded-card border border-line bg-white p-4 shadow-card lg:sticky lg:top-24 lg:p-5">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="explore-filters"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 text-left lg:hidden"
      >
        <span className="font-display text-xl">{labels.filters}</span>
        <span className="flex items-center gap-2 text-sm text-ink-soft">
          {countLabel}
          <svg aria-hidden="true" viewBox="0 0 24 24" className={cx('size-5 transition-transform', open && 'rotate-180')} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      <p className="hidden items-center justify-between font-display text-xl lg:flex">
        {labels.filters}
        {countLabel ? <span className="font-sans text-sm text-ink-soft">{countLabel}</span> : null}
      </p>

      <form
        id="explore-filters"
        role="search"
        aria-label={labels.formLabel}
        action={`/${locale}/explore`}
        method="get"
        noValidate
        onSubmit={onSubmit}
        className={cx('mt-4 flex-col gap-5 lg:flex', open ? 'flex' : 'hidden')}
      >
        <fieldset className="grid min-w-0 gap-4">
          <legend className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">{labels.destinationLegend}</legend>
          <SelectField id="filter-country" name={SEARCH_PARAM.country} text={labels.country} anyLabel={labels.anyCountry} options={options.countries} defaultValue={initial.country} />
          <div>
            <label htmlFor="filter-city" className={label}>
              {labels.city}
            </label>
            <input
              id="filter-city"
              name={SEARCH_PARAM.city}
              type="text"
              list="filter-city-options"
              autoComplete="off"
              maxLength={80}
              defaultValue={initial.city ?? ''}
              placeholder={labels.cityPlaceholder}
              className={control}
            />
            <datalist id="filter-city-options">
              {options.cities.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </div>
        </fieldset>

        <fieldset className="grid min-w-0 grid-cols-2 gap-3">
          <legend className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">{labels.datesLegend}</legend>
          {(
            [
              ['filter-checkin', SEARCH_PARAM.checkIn, labels.checkIn, initial.checkIn, today],
              ['filter-checkout', SEARCH_PARAM.checkOut, labels.checkOut, initial.checkOut, checkIn || today],
            ] as const
          ).map(([id, name, text, value, min]) => (
            <div key={id} className="min-w-0">
              <label htmlFor={id} className={label}>
                {text}
              </label>
              <input
                id={id}
                name={name}
                type="date"
                min={min}
                defaultValue={value ?? ''}
                aria-invalid={dateInvalid || undefined}
                aria-describedby={dateInvalid ? errorId : undefined}
                onChange={(event) => {
                  if (name === SEARCH_PARAM.checkIn) setCheckIn(event.target.value);
                  clearError();
                }}
                className={cx(control, 'px-2 text-sm')}
              />
            </div>
          ))}
          {error ? (
            <p id={errorId} role="alert" className="col-span-2 rounded-xl bg-danger-50 px-3 py-2 text-sm font-medium text-danger-700">
              {labels.errors[error]}
            </p>
          ) : null}
        </fieldset>

        <SelectField id="filter-type" name={SEARCH_PARAM.hostType} text={labels.hostType} anyLabel={labels.anyHostType} options={options.hostTypes} defaultValue={initial.hostType} />
        <SelectField id="filter-category" name={SEARCH_PARAM.category} text={labels.category} anyLabel={labels.anyCategory} options={options.categories} defaultValue={initial.category} />
        <SelectField id="filter-skill" name={SEARCH_PARAM.skill} text={labels.skill} anyLabel={labels.anySkill} options={options.skills} defaultValue={initial.skill} />

        <div className="flex flex-col gap-2 border-t border-line pt-5">
          <button type="submit" disabled={isPending} className={cx(buttonStyles.primary, 'w-full disabled:opacity-70')}>
            {isPending ? labels.submitting : labels.apply}
          </button>
          <Link href={`/${locale}/explore`} className={cx(buttonStyles.secondary, 'w-full')}>
            {labels.reset}
          </Link>
        </div>
      </form>
    </div>
  );
}

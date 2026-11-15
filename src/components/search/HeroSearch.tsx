'use client';

import { useState } from 'react';
import { cx } from '@/components/ui/primitives';
import { SEARCH_PARAM } from '@/features/discovery/search-params';
import type { Locale } from '@/i18n/config';
import { useSearchSubmit, type Option, type SearchLabels } from './use-search-submit';

const fieldBox =
  'flex min-w-0 flex-col justify-center rounded-2xl px-4 py-2.5 transition-colors hover:bg-sand-100 focus-within:bg-sand-100 focus-within:ring-2 focus-within:ring-sun-500';
const fieldLabel = 'text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink-soft';
const fieldControl = 'mt-0.5 min-h-7 w-full min-w-0 bg-transparent text-base font-medium text-ink outline-none placeholder:text-ink-soft/70';

/**
 * Hero search shaped like a travel ticket: destination stub | perforation | dates + action.
 * Submits to Explore with URL-persisted parameters.
 */
export function HeroSearch({
  locale,
  labels,
  countries,
  cities,
}: {
  locale: Locale;
  labels: SearchLabels;
  countries: readonly Option[];
  cities: readonly string[];
}) {
  const { error, isPending, today, onSubmit, clearError } = useSearchSubmit(locale);
  const [checkIn, setCheckIn] = useState('');
  const errorId = 'hero-search-error';
  const dateInvalid = error !== null;

  return (
    <div className="w-full">
      <form
        role="search"
        aria-label={labels.formLabel}
        action={`/${locale}/explore`}
        method="get"
        noValidate
        onSubmit={onSubmit}
        className="grid drop-shadow-[0_24px_40px_rgb(6_31_27/0.45)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]"
      >
        <fieldset className="ticket-stub grid min-w-0 gap-1 rounded-t-[1.6rem] bg-paper p-2 sm:grid-cols-2 lg:rounded-l-[1.6rem] lg:rounded-tr-none">
          <legend className="sr-only">{labels.destinationLegend}</legend>
          <div className={fieldBox}>
            <label htmlFor="hero-country" className={fieldLabel}>
              {labels.country}
            </label>
            <select id="hero-country" name={SEARCH_PARAM.country} defaultValue="" className={cx(fieldControl, 'cursor-pointer')}>
              <option value="">{labels.anyCountry}</option>
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>
          <div className={fieldBox}>
            <label htmlFor="hero-city" className={fieldLabel}>
              {labels.city}
            </label>
            <input
              id="hero-city"
              name={SEARCH_PARAM.city}
              type="text"
              list="hero-city-options"
              autoComplete="off"
              maxLength={80}
              placeholder={labels.cityPlaceholder}
              className={fieldControl}
            />
            <datalist id="hero-city-options">
              {cities.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </div>
        </fieldset>

        <fieldset className="ticket-main grid min-w-0 gap-1 rounded-b-[1.6rem] border-t-2 border-dashed border-line bg-paper p-2 sm:grid-cols-[1fr_1fr_auto] lg:rounded-r-[1.6rem] lg:rounded-bl-none lg:border-t-0 lg:border-l-2">
          <legend className="sr-only">{labels.datesLegend}</legend>
          <div className={fieldBox}>
            <label htmlFor="hero-checkin" className={fieldLabel}>
              {labels.checkIn}
            </label>
            <input
              id="hero-checkin"
              name={SEARCH_PARAM.checkIn}
              type="date"
              min={today}
              aria-invalid={dateInvalid || undefined}
              aria-describedby={dateInvalid ? errorId : undefined}
              onChange={(event) => {
                setCheckIn(event.target.value);
                clearError();
              }}
              className={fieldControl}
            />
          </div>
          <div className={fieldBox}>
            <label htmlFor="hero-checkout" className={fieldLabel}>
              {labels.checkOut}
            </label>
            <input
              id="hero-checkout"
              name={SEARCH_PARAM.checkOut}
              type="date"
              min={checkIn || today}
              aria-invalid={dateInvalid || undefined}
              aria-describedby={dateInvalid ? errorId : undefined}
              onChange={clearError}
              className={fieldControl}
            />
          </div>
          <div className="flex items-center p-1.5">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-sun-500 px-7 text-base font-semibold text-ink transition-colors hover:bg-sun-400 disabled:opacity-70 sm:w-auto"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16l4.5 4.5" />
              </svg>
              {isPending ? labels.submitting : labels.submit}
            </button>
          </div>
        </fieldset>
      </form>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-3 inline-flex items-start gap-2 rounded-2xl bg-danger-50 px-4 py-2.5 text-sm font-medium text-danger-700"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5v5.5M12 16.5h.01" />
          </svg>
          {labels.errors[error]}
        </p>
      ) : null}
    </div>
  );
}

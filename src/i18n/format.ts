import { INTL_LOCALE, type Locale } from './config';

export interface PluralForms {
  one: string;
  other: string;
}

/** Replaces `{name}` placeholders. Unknown placeholders become empty strings. */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
}

export function plural(locale: Locale, count: number, forms: PluralForms): string {
  const rule = new Intl.PluralRules(INTL_LOCALE[locale]).select(count);
  return interpolate(rule === 'one' ? forms.one : forms.other, { count });
}

function utcDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00Z`);
}

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
};

export function formatDate(locale: Locale, isoDate: string): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], dateFormatOptions).format(utcDate(isoDate));
}

export function formatDateRange(locale: Locale, start: string, end: string): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], dateFormatOptions).formatRange(
    utcDate(start),
    utcDate(end),
  );
}

/** Localized country name from an ISO 3166-1 alpha-2 code (no country dictionary needed). */
export function countryName(locale: Locale, countryCode: string): string {
  try {
    return new Intl.DisplayNames([INTL_LOCALE[locale]], { type: 'region' }).of(countryCode) ?? countryCode;
  } catch {
    return countryCode;
  }
}

/** Localized language name from an ISO 639-1 code. */
export function languageName(locale: Locale, languageCode: string): string {
  try {
    return new Intl.DisplayNames([INTL_LOCALE[locale]], { type: 'language' }).of(languageCode) ?? languageCode;
  } catch {
    return languageCode;
  }
}

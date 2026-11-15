/**
 * Locale configuration. Safe to import from server, client and proxy code.
 * The URL prefix (/en, /de) is the single source of truth for the active locale —
 * no cookies or tracking are used for language selection.
 */
export const LOCALES = ['en', 'de'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Each locale's own name, shown in the language switcher. */
export const LOCALE_NAMES: Readonly<Record<Locale, string>> = { en: 'English', de: 'Deutsch' };

/** BCP 47 tags used for Intl formatting (dates, plurals, region names). */
export const INTL_LOCALE: Readonly<Record<Locale, string>> = { en: 'en-GB', de: 'de-DE' };

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** Picks the best supported locale from an Accept-Language header value. */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const ranked = acceptLanguage
    .split(',')
    .map((part, index) => {
      const [tag = '', ...params] = part.trim().split(';');
      const qParam = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      const quality = qParam ? Number.parseFloat(qParam.slice(2)) : 1;
      return {
        base: tag.trim().toLowerCase().split('-')[0] ?? '',
        quality: Number.isFinite(quality) ? quality : 0,
        index,
      };
    })
    .filter((entry) => entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  for (const entry of ranked) {
    if (isLocale(entry.base)) return entry.base;
  }
  return DEFAULT_LOCALE;
}

/** Replaces (or inserts) the locale prefix of a pathname: ("/en/explore", "de") → "/de/explore". */
export function localizePathname(pathname: string, locale: Locale): string {
  const segments = pathname.split('/');
  if (isLocale(segments[1])) {
    segments[1] = locale;
  } else {
    segments.splice(1, 0, locale);
  }
  const joined = segments.join('/');
  return joined.length > 1 && joined.endsWith('/') ? joined.slice(0, -1) : joined;
}

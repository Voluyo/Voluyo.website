/**
 * Builds select/suggestion options for search forms from the PUBLIC dataset.
 * Countries and cities are derived from what is actually visible, so production (no data)
 * shows no fake destinations.
 */
import { HOST_TYPES, OPPORTUNITY_CATEGORIES, SKILLS } from '@/domain/taxonomy';
import { INTL_LOCALE, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/en';
import { countryName } from '@/i18n/format';
import type { DiscoveryDataset } from './search';

export interface Option {
  value: string;
  label: string;
}

function byLabel(locale: Locale) {
  const collator = new Intl.Collator(INTL_LOCALE[locale]);
  return (a: Option, b: Option) => collator.compare(a.label, b.label);
}

export function countryOptions(data: DiscoveryDataset, locale: Locale): Option[] {
  const codes = new Set(data.hosts.map((host) => host.location.countryCode));
  return [...codes].map((code) => ({ value: code, label: countryName(locale, code) })).sort(byLabel(locale));
}

export function citySuggestions(data: DiscoveryDataset, locale: Locale): string[] {
  const names = new Set(data.hosts.map((host) => host.location.city[locale]));
  return [...names].sort(new Intl.Collator(INTL_LOCALE[locale]).compare);
}

export function taxonomyOptions(dict: Dictionary) {
  return {
    hostTypes: HOST_TYPES.map((value) => ({ value, label: dict.hostTypes[value] })),
    categories: OPPORTUNITY_CATEGORIES.map((value) => ({ value, label: dict.categories[value] })),
    skills: SKILLS.map((value) => ({ value, label: dict.skills[value] })),
  };
}

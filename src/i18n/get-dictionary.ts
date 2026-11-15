import 'server-only';

import type { Locale } from './config';
import { de } from './dictionaries/de';
import { en, type Dictionary } from './dictionaries/en';

const dictionaries: Readonly<Record<Locale, Dictionary>> = { en, de };

/** Server-only: client components receive just the strings they need via props. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };

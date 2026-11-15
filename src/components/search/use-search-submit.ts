'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition, type FormEvent } from 'react';
import { localTodayIso, validateDateRange, type DateRangeError } from '@/features/discovery/dates';
import { SEARCH_PARAM, explorePath, readSearchState } from '@/features/discovery/search-params';
import type { Dictionary } from '@/i18n/dictionaries/en';
import type { Locale } from '@/i18n/config';

export type SearchLabels = Dictionary['search'];
export type { Option } from '@/features/discovery/options';

/**
 * Validates the travel dates in the browser and only navigates to Explore when they are valid.
 * An invalid range shows an error, focuses the offending field and does NOT navigate.
 * Without JavaScript the form still submits via GET; the server then validates again.
 */
export function useSearchSubmit(locale: Locale) {
  const router = useRouter();
  const [error, setError] = useState<DateRangeError | null>(null);
  const [isPending, startTransition] = useTransition();
  // Set after mount so server and client render identical markup.
  const [today, setToday] = useState<string | undefined>(undefined);

  useEffect(() => {
    setToday(localTodayIso());
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const raw: Record<string, string> = {};
    new FormData(form).forEach((value, key) => {
      if (typeof value === 'string') raw[key] = value;
    });

    const state = readSearchState(raw);
    const check = validateDateRange(state.checkIn, state.checkOut, localTodayIso());
    if (check.status === 'error') {
      setError(check.error);
      const focusCheckOut = check.error === 'order' || (check.error === 'incomplete' && Boolean(state.checkIn));
      const field = form.elements.namedItem(focusCheckOut ? SEARCH_PARAM.checkOut : SEARCH_PARAM.checkIn);
      if (field instanceof HTMLElement) field.focus();
      return;
    }

    setError(null);
    startTransition(() => {
      router.push(explorePath(locale, state));
    });
  }

  return { error, isPending, today, onSubmit, clearError: () => setError(null) };
}

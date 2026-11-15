/**
 * Pure date helpers shared by server rendering and client-side form validation.
 * All calendar dates are `YYYY-MM-DD` strings; lexicographic comparison is chronological.
 */
import type { DateWindow, IsoDate, TravelDates } from '@/domain/discovery';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** True only for real calendar dates in `YYYY-MM-DD` form (rejects 2027-02-30). */
export function isIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export type DateRangeError = 'incomplete' | 'invalid' | 'order' | 'past';

export type DateRangeResult =
  | { status: 'empty' }
  | { status: 'valid'; dates: TravelDates }
  | { status: 'error'; error: DateRangeError };

/**
 * Validates a traveler's check-in/check-out pair.
 * Rules: both or neither; real dates; check-out strictly after check-in (≥ 1 night);
 * check-in not before `today`.
 */
export function validateDateRange(
  checkIn: string | undefined,
  checkOut: string | undefined,
  today: IsoDate,
): DateRangeResult {
  const start = checkIn?.trim() ?? '';
  const end = checkOut?.trim() ?? '';

  if (!start && !end) return { status: 'empty' };
  if (!start || !end) return { status: 'error', error: 'incomplete' };
  if (!isIsoDate(start) || !isIsoDate(end)) return { status: 'error', error: 'invalid' };
  if (end <= start) return { status: 'error', error: 'order' };
  if (start < today) return { status: 'error', error: 'past' };
  return { status: 'valid', dates: { checkIn: start, checkOut: end } };
}

function isoFromParts(year: number, monthIndex: number, day: number): IsoDate {
  return `${String(year).padStart(4, '0')}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Today in the browser's local time zone (client-side validation). */
export function localTodayIso(now: Date = new Date()): IsoDate {
  return isoFromParts(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Server-side "today": the calendar date in UTC−12, i.e. the earliest date that is still
 * "today" somewhere on Earth. Avoids rejecting a valid same-day check-in from a traveler
 * whose local date is behind the server's.
 */
export function earliestTodayIso(nowMs: number = Date.now()): IsoDate {
  return new Date(nowMs - 12 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/**
 * Discovery rule (not matching): an availability window fits the trip when they overlap
 * by at least one night. Matching/scoring of coverage is a later slice.
 */
export function windowOverlapsTrip(window: DateWindow, trip: TravelDates): boolean {
  return trip.checkIn <= window.end && trip.checkOut > window.start;
}

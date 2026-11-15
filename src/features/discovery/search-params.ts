/**
 * URL search-parameter contract for discovery. Shared by the server (Explore page) and
 * the client (hero search, filter form) so both parse and serialize identically.
 * Unknown or malformed values are dropped, never trusted.
 */
import type { DiscoveryFilters, IsoDate } from '@/domain/discovery';
import {
  HOST_TYPES,
  OPPORTUNITY_CATEGORIES,
  SKILLS,
  isOneOf,
  type HostType,
  type OpportunityCategory,
  type SkillId,
} from '@/domain/taxonomy';
import { validateDateRange, type DateRangeError } from './dates';

/** Sanitized search state as it appears in the URL. Dates are not yet validated. */
export interface SearchState {
  country?: string;
  city?: string;
  checkIn?: string;
  checkOut?: string;
  hostType?: HostType;
  category?: OpportunityCategory;
  skill?: SkillId;
}

export type SearchKey = keyof SearchState;

/** Public URL parameter names. Changing these breaks shared links. */
export const SEARCH_PARAM: Readonly<Record<SearchKey, string>> = {
  country: 'country',
  city: 'city',
  checkIn: 'checkin',
  checkOut: 'checkout',
  hostType: 'type',
  category: 'category',
  skill: 'skill',
};

const KEY_ORDER: readonly SearchKey[] = ['country', 'city', 'checkIn', 'checkOut', 'hostType', 'category', 'skill'];

export const MAX_CITY_LENGTH = 80;

export type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? '';
}

export function readSearchState(raw: RawSearchParams): SearchState {
  const state: SearchState = {};

  const country = first(raw[SEARCH_PARAM.country]).toUpperCase();
  if (/^[A-Z]{2}$/.test(country)) state.country = country;

  const city = first(raw[SEARCH_PARAM.city]).replace(/\s+/g, ' ').slice(0, MAX_CITY_LENGTH).trim();
  if (city) state.city = city;

  // Kept verbatim (length-capped) so an invalid value can be reported back to the user.
  const checkIn = first(raw[SEARCH_PARAM.checkIn]).slice(0, 10);
  if (checkIn) state.checkIn = checkIn;
  const checkOut = first(raw[SEARCH_PARAM.checkOut]).slice(0, 10);
  if (checkOut) state.checkOut = checkOut;

  const hostType = first(raw[SEARCH_PARAM.hostType]);
  if (isOneOf(HOST_TYPES, hostType)) state.hostType = hostType;

  const category = first(raw[SEARCH_PARAM.category]);
  if (isOneOf(OPPORTUNITY_CATEGORIES, category)) state.category = category;

  const skill = first(raw[SEARCH_PARAM.skill]);
  if (isOneOf(SKILLS, skill)) state.skill = skill;

  return state;
}

/** Serializes in a stable key order and omits empty values. */
export function toQueryString(state: SearchState): string {
  const params = new URLSearchParams();
  for (const key of KEY_ORDER) {
    const value = state[key];
    if (value) params.set(SEARCH_PARAM[key], value);
  }
  return params.toString();
}

export function explorePath(locale: string, state: SearchState = {}): string {
  const query = toQueryString(state);
  return `/${locale}/explore${query ? `?${query}` : ''}`;
}

export function withoutKeys(state: SearchState, keys: readonly SearchKey[]): SearchState {
  const next: SearchState = { ...state };
  for (const key of keys) delete next[key];
  return next;
}

export function countActiveFilters(state: SearchState): number {
  const dates = state.checkIn || state.checkOut ? 1 : 0;
  return dates + (['country', 'city', 'hostType', 'category', 'skill'] as const).filter((key) => state[key]).length;
}

export interface ResolvedFilters {
  filters: DiscoveryFilters;
  /** Set when the URL carried an invalid date range; the date filter is then NOT applied. */
  dateError?: DateRangeError;
}

export function resolveFilters(state: SearchState, today: IsoDate): ResolvedFilters {
  const range = validateDateRange(state.checkIn, state.checkOut, today);
  return {
    filters: {
      countryCode: state.country,
      city: state.city,
      hostType: state.hostType,
      category: state.category,
      skill: state.skill,
      dates: range.status === 'valid' ? range.dates : undefined,
    },
    dateError: range.status === 'error' ? range.error : undefined,
  };
}

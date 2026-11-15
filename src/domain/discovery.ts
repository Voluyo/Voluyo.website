/**
 * Minimal domain types for PUBLIC discovery only.
 * These are read-only public projections — not database schemas and not API contracts.
 * Owner accounts, verification state, applications, trips etc. are documented in
 * docs/architecture.md and intentionally not modelled here yet.
 */
import type { Locale } from '@/i18n/config';
import type { HostType, OpportunityCategory, SkillId } from './taxonomy';

/** Calendar date as `YYYY-MM-DD`. Validated at every boundary (URL, forms, data). */
export type IsoDate = string;

export type LocalizedText = Readonly<Record<Locale, string>>;

/** Inclusive calendar window in which an opportunity can host travelers. */
export interface DateWindow {
  start: IsoDate;
  end: IsoDate;
}

/**
 * Broad public location: country + city/region only.
 * Never a street address, never coordinates, never a live location.
 */
export interface PublicLocation {
  countryCode: string;
  city: LocalizedText;
}

/**
 * Where a record comes from. Only synthetic demo records exist today.
 * Real records will be added once persistence and host approval exist.
 */
export type RecordOrigin = 'demo';

export interface PublicHostProfile {
  id: string;
  slug: string;
  name: string;
  hostType: HostType;
  location: PublicLocation;
  summary: LocalizedText;
  description: LocalizedText;
  /** ISO 639-1 codes. */
  languages: readonly string[];
  origin: RecordOrigin;
}

/** An exchange opportunity offered by a host. A host can publish several. */
export interface PublicOpportunity {
  id: string;
  hostId: string;
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  category: OpportunityCategory;
  requestedSkills: readonly SkillId[];
  availability: readonly DateWindow[];
  origin: RecordOrigin;
}

export interface TravelDates {
  /** Arrival day. */
  checkIn: IsoDate;
  /** Departure day (exclusive night). */
  checkOut: IsoDate;
}

export interface DiscoveryFilters {
  countryCode?: string;
  city?: string;
  dates?: TravelDates;
  hostType?: HostType;
  category?: OpportunityCategory;
  skill?: SkillId;
}

export interface HostSearchResult {
  host: PublicHostProfile;
  /** Only the host's opportunities that match the active filters. */
  opportunities: readonly PublicOpportunity[];
}

/**
 * Pure discovery filtering. Runs against whatever the repository returns (demo or, later,
 * approved public records). This is FILTERING, not matching: no scores, no ranking by fit.
 */
import type {
  DiscoveryFilters,
  HostSearchResult,
  PublicHostProfile,
  PublicOpportunity,
} from '@/domain/discovery';
import { windowOverlapsTrip } from './dates';

export interface DiscoveryDataset {
  hosts: readonly PublicHostProfile[];
  opportunities: readonly PublicOpportunity[];
}

/** Case- and accent-insensitive comparison form ("Lissabon" ~ "lissabon", "Südhang" ~ "sudhang"). */
export function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

function hostMatches(host: PublicHostProfile, filters: DiscoveryFilters, cityQuery: string): boolean {
  if (filters.countryCode && host.location.countryCode !== filters.countryCode) return false;
  if (filters.hostType && host.hostType !== filters.hostType) return false;
  if (cityQuery) {
    // Match any localized city name so "Lisbon" and "Lissabon" both work in either language.
    return Object.values(host.location.city).some((name) => normalizeText(name).includes(cityQuery));
  }
  return true;
}

function opportunityMatches(opportunity: PublicOpportunity, filters: DiscoveryFilters): boolean {
  if (filters.category && opportunity.category !== filters.category) return false;
  if (filters.skill && !opportunity.requestedSkills.includes(filters.skill)) return false;
  const { dates } = filters;
  if (dates && !opportunity.availability.some((window) => windowOverlapsTrip(window, dates))) return false;
  return true;
}

/**
 * Returns hosts that match the host-level filters AND have at least one opportunity matching
 * the opportunity-level filters. Hosts without a matching opportunity are not listed.
 */
export function searchHosts(data: DiscoveryDataset, filters: DiscoveryFilters): HostSearchResult[] {
  const cityQuery = filters.city ? normalizeText(filters.city) : '';
  return data.hosts
    .filter((host) => hostMatches(host, filters, cityQuery))
    .map((host) => ({
      host,
      opportunities: data.opportunities.filter(
        (opportunity) => opportunity.hostId === host.id && opportunityMatches(opportunity, filters),
      ),
    }))
    .filter((result) => result.opportunities.length > 0);
}

export interface Destination {
  countryCode: string;
  city: PublicHostProfile['location']['city'];
  opportunityCount: number;
}

/** Cities that currently have at least one public opportunity, busiest first. */
export function listDestinations(data: DiscoveryDataset): Destination[] {
  const byCity = new Map<string, Destination>();
  for (const { host, opportunities } of searchHosts(data, {})) {
    const key = `${host.location.countryCode}:${host.location.city.en}`;
    const existing = byCity.get(key);
    if (existing) {
      existing.opportunityCount += opportunities.length;
    } else {
      byCity.set(key, {
        countryCode: host.location.countryCode,
        city: host.location.city,
        opportunityCount: opportunities.length,
      });
    }
  }
  return [...byCity.values()].sort(
    (a, b) => b.opportunityCount - a.opportunityCount || a.city.en.localeCompare(b.city.en),
  );
}

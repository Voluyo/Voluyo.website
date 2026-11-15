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

/** Category, skill and travel dates narrow opportunities; country, city and type narrow hosts. */
function hasOpportunityFilters(filters: DiscoveryFilters): boolean {
  return Boolean(filters.category || filters.skill || filters.dates);
}

/**
 * Returns hosts that match the host-level filters, each with its opportunities that match the
 * opportunity-level filters.
 *
 * Host profiles and opportunities are separate objects. Without an opportunity-level filter every
 * matching host is listed — including a host with no current opportunities (empty `opportunities`).
 * With an opportunity-level filter active, a host is listed only if at least one of its
 * opportunities matches, so no host is ever presented as offering an opportunity it does not have.
 */
export function searchHosts(data: DiscoveryDataset, filters: DiscoveryFilters): HostSearchResult[] {
  const cityQuery = filters.city ? normalizeText(filters.city) : '';
  const requireOpportunity = hasOpportunityFilters(filters);
  return data.hosts
    .filter((host) => hostMatches(host, filters, cityQuery))
    .map((host) => ({
      host,
      opportunities: data.opportunities.filter(
        (opportunity) => opportunity.hostId === host.id && opportunityMatches(opportunity, filters),
      ),
    }))
    .filter((result) => !requireOpportunity || result.opportunities.length > 0);
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
    // Hosts without opportunities stay discoverable, but they do not make a city a destination.
    if (opportunities.length === 0) continue;
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

import 'server-only';

/**
 * Public discovery data access — the ONLY place pages read hosts/opportunities from.
 *
 * Visibility rule today:
 *   - development / test → synthetic demo records (clearly labelled in the UI)
 *   - production builds   → nothing. There is no persistence layer and no approved host yet,
 *                           so the UI shows honest empty states.
 *
 * Later this module becomes the boundary to the database: it must only ever return records
 * that are approved by moderation AND published by their owner, projected to public fields.
 */
import type { PublicHostProfile, PublicOpportunity } from '@/domain/discovery';
import { DEMO_HOSTS } from './demo/hosts';
import { DEMO_OPPORTUNITIES } from './demo/opportunities';
import type { DiscoveryDataset } from './search';

export type DatasetOrigin = 'demo' | 'none';

export interface PublicDiscoveryData extends DiscoveryDataset {
  origin: DatasetOrigin;
}

export function isDemoDataEnabled(): boolean {
  return process.env.NODE_ENV !== 'production';
}

export function getPublicDiscoveryData(): PublicDiscoveryData {
  if (isDemoDataEnabled()) {
    return { hosts: DEMO_HOSTS, opportunities: DEMO_OPPORTUNITIES, origin: 'demo' };
  }
  return { hosts: [], opportunities: [], origin: 'none' };
}

export function getPublicHostBySlug(
  slug: string,
): { host: PublicHostProfile; opportunities: readonly PublicOpportunity[] } | null {
  const data = getPublicDiscoveryData();
  const host = data.hosts.find((candidate) => candidate.slug === slug);
  if (!host) return null;
  return { host, opportunities: data.opportunities.filter((opportunity) => opportunity.hostId === host.id) };
}

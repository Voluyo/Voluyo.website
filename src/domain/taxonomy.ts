/**
 * Discovery taxonomies. Host type (WHO hosts) is deliberately separate from
 * opportunity category (WHAT the exchange is about) and from skills (WHAT a traveler brings).
 * Labels live in the i18n dictionaries; these are stable machine identifiers.
 */

export const HOST_TYPES = [
  'ngo',
  'aid_community_project',
  'hotel',
  'hostel',
  'education',
  'other_organization',
  'private_individual',
  'family',
] as const;
export type HostType = (typeof HOST_TYPES)[number];

/**
 * Organizations and private hosts will need different safety and verification flows
 * (see docs/architecture.md → Verification and moderation). Not enforced yet.
 */
export type HostKind = 'organization' | 'private';

export const HOST_KIND: Readonly<Record<HostType, HostKind>> = {
  ngo: 'organization',
  aid_community_project: 'organization',
  hotel: 'organization',
  hostel: 'organization',
  education: 'organization',
  other_organization: 'organization',
  private_individual: 'private',
  family: 'private',
};

export const OPPORTUNITY_CATEGORIES = [
  'education_teaching',
  'community_development',
  'environment_conservation',
  'farming_gardening',
  'cultural_exchange',
  'creative_media',
  'digital_tech',
  'building_repair',
] as const;
export type OpportunityCategory = (typeof OPPORTUNITY_CATEGORIES)[number];

export const SKILLS = [
  'teaching',
  'english',
  'german',
  'spanish',
  'web_development',
  'graphic_design',
  'photography',
  'social_media',
  'carpentry',
  'gardening',
  'cooking',
  'event_hosting',
] as const;
export type SkillId = (typeof SKILLS)[number];

export function isOneOf<T extends string>(list: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (list as readonly string[]).includes(value);
}

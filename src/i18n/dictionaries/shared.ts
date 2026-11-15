/** Structural types shared by every dictionary. */

export type StepStatus = 'live' | 'planned';

export interface Step {
  title: string;
  body: string;
  status: StepStatus;
}

export interface Faq {
  question: string;
  answer: string;
}

export const LEGAL_DOCS = ['imprint', 'privacy', 'terms'] as const;
export type LegalDoc = (typeof LEGAL_DOCS)[number];

/** Identity helper that gives array literals a declared element type inside dictionaries. */
export function list<T>(items: T[]): T[] {
  return items;
}

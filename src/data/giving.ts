/** Donor recognition and giving-use content for the Support Us page. */

export interface RecognitionTier {
  /** Recognition name shown to donors */
  name: string;
  /** Inclusive lower bound of annual giving (USD) */
  min: number;
  /** Inclusive upper bound of annual giving (USD), or null for open-ended top tier */
  max: number | null;
  /** Display range label, e.g. "$15–$49" */
  range: string;
}

/**
 * Informal donor recognition levels based on total annual giving.
 * These confer NO membership rights, voting, or other privileges.
 */
export const recognitionTiers: RecognitionTier[] = [
  { name: 'Friend', min: 5, max: 49, range: '$5–$49' },
  { name: 'Sustaining Friend', min: 50, max: 99, range: '$50–$99' },
  { name: 'Supporting Friend', min: 100, max: 249, range: '$100–$249' },
  { name: 'Conservation Sponsor', min: 250, max: 499, range: '$250–$499' },
  { name: 'Natural Area Champion', min: 500, max: 999, range: '$500–$999' },
  { name: 'Steward', min: 1000, max: null, range: '$1,000+' },
];

/** Flexible, unrestricted ways community gifts are put to work. */
export const givingUses: string[] = [
  'Bridging timing gaps before grant reimbursements arrive',
  'Meeting matching requirements that unlock larger grants',
  'Small projects like trail materials, signage, tools, and native plants',
  'Responding to unanticipated needs—erosion, storm damage, trail hazards, or invasive species',
  'Seizing time-sensitive opportunities that fall outside grant cycles',
];

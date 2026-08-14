export const site = {
  name: 'Friends of Healing Springs Natural Area, Inc.',
  tagline: 'Conservation, education, and stewardship of a spring-fed watershed.',
  description:
    'A community-led Arkansas conservation organization dedicated to protecting and restoring the spring-fed watershed ecosystem of Healing Springs Natural Area and Little Osage Creek. Recognized by the IRS as a 501(c)(3) tax-exempt organization.',
  url: 'https://friendsofhealingsprings.org',
  email: 'info@friendsofhealingsprings.org',
  location: 'Highfill, Arkansas',
  founded: '2025',
  keywords: [
    'Healing Springs Natural Area',
    'Arkansas conservation',
    'watershed restoration',
    'Little Osage Creek',
    'habitat restoration',
    'environmental stewardship',
    'Arkansas Darter',
    'Least Darter',
  ],
} as const;

/** IRS Employer Identification Number — add for public display and receipts */
export const ein = '';

/** Display label for organizational tax status */
export const taxStatusLabel = '501(c)(3) tax-exempt organization';

/** Full status line for footer and contact pages */
export const organizationStatusLine = ein
  ? `Arkansas nonprofit corporation · ${taxStatusLabel} · EIN ${ein}`
  : `Arkansas nonprofit corporation · ${taxStatusLabel}`;

/** Standard tax-deductibility disclosure for donation pages */
export const taxDeductibilityNotice =
  'Contributions to Friends of Healing Springs Natural Area, Inc. are tax-deductible to the extent allowed by law. No goods or services are provided in exchange for donations unless otherwise noted.';

export const mission =
  'Protect and restore a spring-fed watershed ecosystem through conservation, education, and stewardship.';

export const vision =
  'A resilient spring-fed watershed where clean water, native habitat, and sensitive aquatic species are sustained through science-informed stewardship and community partnership.';

export const stewardshipPhilosophy =
  'Lasting conservation is built through patience, science-informed practice, and respectful partnership with public agencies, landowners, and volunteers. Our work prioritizes ecological integrity, transparency, and measurable outcomes in the field.';

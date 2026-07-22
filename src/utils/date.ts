/** US Central — organization locale (Northwest Arkansas) */
export const CONTENT_TIMEZONE = 'America/Chicago';

/** Calendar parts from Astro date-only fields (stored as UTC midnight). */
function calendarPartsFromDate(date: Date): { year: number; month: number; day: number } {
  const iso = date.toISOString().slice(0, 10);
  const [year, month, day] = iso.split('-').map(Number);
  return { year, month, day };
}

/** Format a content date for display in US Central time. */
export function formatContentDate(date: Date): string {
  const { year, month, day } = calendarPartsFromDate(date);
  // Anchor midday Central via UTC to avoid date shifting around DST boundaries.
  const anchor = new Date(Date.UTC(year, month - 1, day, 18, 0, 0));

  return anchor.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: CONTENT_TIMEZONE,
  });
}

/** ISO date string (YYYY-MM-DD) for `<time datetime>` attributes. */
export function contentDateIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Parse YYYY-MM-DD strings as calendar dates. */
export function parseContentDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/** Format YYYY-MM-DD strings for display in US Central time. */
export function formatContentDateString(value: string): string {
  return formatContentDate(parseContentDate(value));
}

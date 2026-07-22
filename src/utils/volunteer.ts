/**
 * Contact forms submit to /api/contact (Cloudflare Pages Function).
 * See functions/api/contact.ts and README.md for Resend setup.
 */
export interface VolunteerSignup {
  name: string;
  email: string;
  availability: string;
  interests: string[];
  experience?: string;
}

export async function submitVolunteerSignup(_data: VolunteerSignup): Promise<void> {
  throw new Error('Use the volunteer contact form on /get-involved/ or /contact/.');
}

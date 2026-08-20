import {
  clip,
  ensureTextFields,
  findOrCreateGroup,
  upsertSubscriber,
} from '../lib/mailerlite';

interface RsvpPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  attending?: string;
  participation?: string;
  interests?: string[];
  equipment?: string[];
  equipmentNotes?: string;
  notes?: string;
  website?: string;
}

interface Env {
  MAILERLITE_API_KEY?: string;
  MAILERLITE_RSVP_GROUP_ID?: string;
}

const GROUP_NAME = 'Fall Cleanup RSVPs';

const ATTENDING = new Set(['Yes', 'Maybe']);
const PARTICIPATION = new Set(['Morning', 'Afternoon', 'Most/all day', 'Not sure yet']);
const INTERESTS = new Set([
  'General cleanup/debris removal',
  'Trail cleanup and stewardship',
  'Vegetation/small-branch trimming',
  'Equipment/mower support',
  'Hauling/debris transport',
  'General “wherever needed”',
  'Other',
]);
const EQUIPMENT = new Set([
  'Riding mower',
  'Utility trailer',
  'Hand tools for vegetation trimming',
  'Other useful equipment',
]);

const RSVP_FIELDS = [
  'attending',
  'participation',
  'volunteer_interests',
  'equipment',
  'equipment_notes',
  'additional_notes',
  'event_name',
];

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function asList(value: unknown, allowed: Set<string>): string[] {
  const raw = Array.isArray(value) ? value : value ? [value] : [];
  return raw
    .map((item) => String(item).trim())
    .filter((item) => allowed.has(item));
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  try {
    return await handleRsvp(context.request, context.env);
  } catch (err) {
    console.error('RSVP uncaught error:', err);
    return json(
      { ok: false, error: 'Unable to send your RSVP right now. Please email us directly.' },
      500
    );
  }
}

async function handleRsvp(request: Request, env: Env): Promise<Response> {
  const apiKey = env.MAILERLITE_API_KEY?.trim();
  if (!apiKey) {
    return json(
      { ok: false, error: 'RSVP form is not configured yet. Please email us directly.' },
      503
    );
  }

  let body: RsvpPayload;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  if (body.website?.trim()) {
    return json({ ok: true });
  }

  const firstName = body.firstName?.trim() ?? '';
  const lastName = body.lastName?.trim() ?? '';
  const email = body.email?.trim() ?? '';
  const attending = body.attending?.trim() ?? '';
  const participation = body.participation?.trim() ?? '';
  const interests = asList(body.interests, INTERESTS);
  const equipment = asList(body.equipment, EQUIPMENT);
  const equipmentNotes = body.equipmentNotes?.trim() ?? '';
  const notes = body.notes?.trim() ?? '';

  if (!firstName || !lastName || !email || !attending || !participation) {
    return json(
      { ok: false, error: 'First name, last name, email, attendance, and participation are required.' },
      400
    );
  }

  if (
    !isValidEmail(email) ||
    !ATTENDING.has(attending) ||
    !PARTICIPATION.has(participation) ||
    firstName.length > 100 ||
    lastName.length > 100 ||
    email.length > 320 ||
    equipmentNotes.length > 1000 ||
    notes.length > 2000
  ) {
    return json({ ok: false, error: 'Please check your entries and try again.' }, 400);
  }

  const groupId = env.MAILERLITE_RSVP_GROUP_ID?.trim() || (await findOrCreateGroup(apiKey, GROUP_NAME));
  await ensureTextFields(apiKey, RSVP_FIELDS);

  const fullFields: Record<string, string> = {
    name: firstName,
    last_name: lastName,
    attending: clip(attending, 40),
    participation: clip(participation, 80),
    volunteer_interests: clip(interests.join('; ') || 'Not specified'),
    equipment: clip(equipment.join('; ') || 'None listed'),
    equipment_notes: clip(equipmentNotes || '(none)'),
    additional_notes: clip(notes || '(none)'),
    event_name: clip('Fall Cleanup & Stewardship Workday — October 3, 2026', 120),
  };

  const groups = groupId ? [groupId] : undefined;
  const attempts = [
    { fields: fullFields, groups },
    { fields: { name: firstName, last_name: lastName }, groups },
    { fields: { name: firstName, last_name: lastName } },
  ];

  for (const attempt of attempts) {
    const result = await upsertSubscriber(apiKey, {
      email,
      fields: attempt.fields,
      groups: attempt.groups,
    });
    if (result.ok) {
      return json({ ok: true });
    }
    console.error('MailerLite RSVP upsert failed:', result.status, result.text);
  }

  return json(
    { ok: false, error: 'Unable to send your RSVP right now. Please email us directly.' },
    502
  );
}

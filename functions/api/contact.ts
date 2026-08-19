interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  formType?: string;
  website?: string;
}

interface Env {
  MAILERLITE_API_KEY?: string;
  /** Optional: add website inquiries to a MailerLite group. Not required. */
  MAILERLITE_CONTACT_GROUP_ID?: string;
  /** Optional extra: also email the inquiry if all three Resend vars are set. */
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

const FORM_LABELS: Record<string, string> = {
  general: 'General Inquiry',
  volunteer: 'Volunteer Inquiry',
  partnership: 'Partnership Inquiry',
};

const MAILERLITE_API = 'https://connect.mailerlite.com/api';
const TEXT_FIELD_MAX = 255;

/** MailerLite custom field names must be lowercase with underscores. */
const INQUIRY_FIELDS = ['form_type', 'inquiry_subject', 'inquiry_message'] as const;

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

function configured(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

function mailerLiteKey(env: Env): string | null {
  const key = env.MAILERLITE_API_KEY?.trim();
  return key || null;
}

function hasResend(env: Env): boolean {
  return (
    configured(env.RESEND_API_KEY) &&
    configured(env.CONTACT_TO_EMAIL) &&
    configured(env.CONTACT_FROM_EMAIL)
  );
}

function mlHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

function clip(value: string, max = TEXT_FIELD_MAX): string {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  try {
    return await handleContact(context.request, context.env);
  } catch (err) {
    console.error('Contact form uncaught error:', err);
    return json(
      {
        ok: false,
        error: 'Unable to send your message right now. Please email us directly.',
      },
      500
    );
  }
}

async function handleContact(request: Request, env: Env): Promise<Response> {
  const apiKey = mailerLiteKey(env);

  if (!apiKey) {
    return json(
      { ok: false, error: 'Contact form is not configured yet. Please email us directly.' },
      503
    );
  }

  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  // Honeypot — bots fill hidden fields; pretend success
  if (body.website?.trim()) {
    return json({ ok: true });
  }

  const name = body.name?.trim() ?? '';
  const email = body.email?.trim() ?? '';
  const message = body.message?.trim() ?? '';
  const subject = body.subject?.trim() ?? '';
  const formType = body.formType?.trim() || 'general';

  if (!name || !email || !message) {
    return json({ ok: false, error: 'Name, email, and message are required.' }, 400);
  }

  if (
    !isValidEmail(email) ||
    name.length > 200 ||
    message.length > 10000 ||
    subject.length > 500
  ) {
    return json({ ok: false, error: 'Please check your entries and try again.' }, 400);
  }

  const label = FORM_LABELS[formType] ?? 'Website Inquiry';
  const stored = await storeViaMailerLite(apiKey, env, {
    name,
    email,
    subject,
    message,
    label,
  });

  if (!stored.ok) {
    return stored.response;
  }

  if (hasResend(env)) {
    const emailSubject = subject
      ? `[Friends of Healing Springs] ${label}: ${subject}`
      : `[Friends of Healing Springs] ${label} from ${name}`;
    const text = [
      `Form: ${label}`,
      `Name: ${name}`,
      `Email: ${email}`,
      subject ? `Subject: ${subject}` : null,
      '',
      message,
    ]
      .filter((line) => line !== null)
      .join('\n');

    try {
      await sendViaResend(env, { fromEmail: email, emailSubject, text });
    } catch (err) {
      console.error('Resend optional delivery failed:', err);
    }
  }

  return json({ ok: true });
}

async function sendViaResend(
  env: Env,
  params: { fromEmail: string; emailSubject: string; text: string }
): Promise<void> {
  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: params.fromEmail,
      subject: params.emailSubject,
      text: params.text,
    }),
  });

  if (!resendResponse.ok) {
    console.error('Resend API error:', await resendResponse.text());
  }
}

async function storeViaMailerLite(
  apiKey: string,
  env: Env,
  params: {
    name: string;
    email: string;
    subject: string;
    message: string;
    label: string;
  }
): Promise<{ ok: true } | { ok: false; response: Response }> {
  const receivedAt = new Date().toISOString();
  const groupId = env.MAILERLITE_CONTACT_GROUP_ID?.trim();

  await ensureInquiryFields(apiKey);

  const customFields: Record<string, string> = {
    name: params.name,
    form_type: clip(params.label, 80),
    inquiry_subject: clip(params.subject || '(none)'),
    inquiry_message: clip(`Received: ${receivedAt}\n\n${params.message}`),
  };

  const nameOnly: Record<string, string> = { name: params.name };
  const groups = groupId ? [groupId] : undefined;

  const attempts: Array<{ fields: Record<string, string>; groups?: string[] }> = [
    { fields: customFields, groups },
    { fields: nameOnly, groups },
    { fields: nameOnly },
  ];

  let lastError = '';

  for (const attempt of attempts) {
    const result = await upsertSubscriber(apiKey, {
      email: params.email,
      fields: attempt.fields,
      groups: attempt.groups,
    });

    if (result.ok) {
      return { ok: true };
    }

    lastError = `${result.status} ${result.text}`;
    console.error('MailerLite subscriber upsert failed:', lastError);
  }

  console.error('MailerLite API error: all upsert attempts failed.', lastError);
  return {
    ok: false,
    response: json(
      {
        ok: false,
        error: 'Unable to send your message right now. Please email us directly.',
      },
      502
    ),
  };
}

async function ensureInquiryFields(apiKey: string): Promise<void> {
  const existing = new Set<string>();

  try {
    const listRes = await fetch(`${MAILERLITE_API}/fields?limit=100`, {
      headers: mlHeaders(apiKey),
    });
    if (listRes.ok) {
      const payload = (await listRes.json()) as { data?: Array<{ key?: string; name?: string }> };
      for (const field of payload.data ?? []) {
        if (field.key) existing.add(field.key);
        if (field.name) existing.add(field.name);
      }
    } else {
      console.error('MailerLite list fields error:', listRes.status, await listRes.text());
    }
  } catch (err) {
    console.error('MailerLite list fields error:', err);
  }

  for (const name of INQUIRY_FIELDS) {
    if (existing.has(name)) continue;

    try {
      const createRes = await fetch(`${MAILERLITE_API}/fields`, {
        method: 'POST',
        headers: mlHeaders(apiKey),
        body: JSON.stringify({ name, type: 'text' }),
      });

      if (!createRes.ok && createRes.status !== 422) {
        console.error(
          'MailerLite create field error:',
          name,
          createRes.status,
          await createRes.text()
        );
      }
    } catch (err) {
      console.error('MailerLite create field error:', name, err);
    }
  }
}

async function upsertSubscriber(
  apiKey: string,
  body: {
    email: string;
    fields: Record<string, string>;
    groups?: string[];
  }
): Promise<{ ok: boolean; status: number; text: string }> {
  const payload: Record<string, unknown> = {
    email: body.email,
    fields: body.fields,
  };
  if (body.groups?.length) {
    payload.groups = body.groups;
  }

  try {
    const res = await fetch(`${MAILERLITE_API}/subscribers`, {
      method: 'POST',
      headers: mlHeaders(apiKey),
      body: JSON.stringify(payload),
    });

    return { ok: res.ok, status: res.status, text: await res.text() };
  } catch (err) {
    console.error('MailerLite subscribers fetch error:', err);
    return { ok: false, status: 0, text: String(err) };
  }
}

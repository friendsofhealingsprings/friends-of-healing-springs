interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  formType?: string;
  website?: string;
}

interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL: string;
  CONTACT_FROM_EMAIL: string;
}

const FORM_LABELS: Record<string, string> = {
  general: 'General Inquiry',
  volunteer: 'Volunteer Inquiry',
  partnership: 'Partnership Inquiry',
};

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

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
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

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: email,
      subject: emailSubject,
      text,
    }),
  });

  if (!resendResponse.ok) {
    console.error('Resend API error:', await resendResponse.text());
    return json(
      {
        ok: false,
        error: 'Unable to send your message right now. Please email us directly.',
      },
      502
    );
  }

  return json({ ok: true });
}

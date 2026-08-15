interface SubscribePayload {
  name?: string;
  email?: string;
  website?: string;
}

interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL: string;
  CONTACT_FROM_EMAIL: string;
}

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
      { ok: false, error: 'Newsletter signup is not configured yet. Please email us directly.' },
      503
    );
  }

  let body: SubscribePayload;
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

  if (!name || !email) {
    return json({ ok: false, error: 'Name and email are required.' }, 400);
  }

  if (!isValidEmail(email) || name.length > 200 || email.length > 320) {
    return json({ ok: false, error: 'Please check your entries and try again.' }, 400);
  }

  const text = [
    'New newsletter subscriber',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Submitted: ${new Date().toISOString()}`,
  ].join('\n');

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
      subject: `[Friends of Healing Springs] Newsletter signup: ${name}`,
      text,
    }),
  });

  if (!resendResponse.ok) {
    console.error('Resend API error:', await resendResponse.text());
    return json(
      {
        ok: false,
        error: 'Unable to complete your signup right now. Please email us directly.',
      },
      502
    );
  }

  return json({ ok: true });
}

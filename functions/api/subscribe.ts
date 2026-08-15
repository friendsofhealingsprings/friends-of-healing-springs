interface SubscribePayload {
  name?: string;
  email?: string;
  website?: string;
}

interface Env {
  MAILERLITE_API_KEY: string;
  // Optional: restrict signups to a specific MailerLite group/audience.
  MAILERLITE_GROUP_ID?: string;
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

  if (!env.MAILERLITE_API_KEY) {
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

  const subscriber: Record<string, unknown> = {
    email,
    fields: { name },
  };

  const groupId = env.MAILERLITE_GROUP_ID?.trim();
  if (groupId) {
    subscriber.groups = [groupId];
  }

  // MailerLite "Connect" API upserts the subscriber (create or update).
  const mlResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.MAILERLITE_API_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(subscriber),
  });

  if (!mlResponse.ok) {
    console.error('MailerLite API error:', mlResponse.status, await mlResponse.text());
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

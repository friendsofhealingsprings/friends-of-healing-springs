interface CheckoutPayload {
  amount?: number;
  frequency?: string;
}

interface Env {
  STRIPE_SECRET_KEY: string;
  SITE_URL?: string;
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

function siteBaseUrl(env: Env, request: Request): string {
  const configured = env.SITE_URL?.replace(/\/$/, '');
  if (configured) return configured;

  const origin = new URL(request.url).origin;
  if (origin.startsWith('http://') || origin.startsWith('https://')) {
    return origin;
  }

  return 'https://healingsprings.org';
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;

  if (!env.STRIPE_SECRET_KEY) {
    return json(
      {
        ok: false,
        error:
          'Online checkout is not configured yet. Please email info@healingsprings.org to donate by check.',
      },
      503
    );
  }

  let body: CheckoutPayload;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  const amount = Number(body.amount);
  const frequency = body.frequency === 'monthly' ? 'monthly' : 'once';

  if (!Number.isFinite(amount) || amount < 5 || amount > 100_000) {
    return json({ ok: false, error: 'Please enter a donation between $5 and $100,000.' }, 400);
  }

  const amountCents = Math.round(amount * 100);
  const baseUrl = siteBaseUrl(env, request);
  const successUrl = `${baseUrl}/donate/?success=1`;
  const cancelUrl = `${baseUrl}/donate/?canceled=1`;
  const productName = 'Donation to Friends of Healing Springs Natural Area, Inc.';

  const params = new URLSearchParams();
  params.set('mode', frequency === 'monthly' ? 'subscription' : 'payment');
  params.set('success_url', successUrl);
  params.set('cancel_url', cancelUrl);
  params.set('line_items[0][quantity]', '1');
  params.set('line_items[0][price_data][currency]', 'usd');
  params.set('line_items[0][price_data][unit_amount]', String(amountCents));
  params.set('line_items[0][price_data][product_data][name]', productName);

  if (frequency === 'monthly') {
    params.set('line_items[0][price_data][recurring][interval]', 'month');
  }

  const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  const session = (await stripeResponse.json()) as { url?: string; error?: { message?: string } };

  if (!stripeResponse.ok || !session.url) {
    console.error('Stripe Checkout error:', session);
    return json({ ok: false, error: 'Unable to start checkout. Please try again or email us directly.' }, 502);
  }

  return json({ ok: true, url: session.url });
}

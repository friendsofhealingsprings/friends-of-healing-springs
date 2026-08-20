const MAILERLITE_API = 'https://connect.mailerlite.com/api';
export const TEXT_FIELD_MAX = 255;

export function mlHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

export function clip(value: string, max = TEXT_FIELD_MAX): string {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

export async function findOrCreateGroup(apiKey: string, name: string): Promise<string | undefined> {
  const existing = await findGroupByName(apiKey, name);
  if (existing) return existing;

  const createRes = await fetch(`${MAILERLITE_API}/groups`, {
    method: 'POST',
    headers: mlHeaders(apiKey),
    body: JSON.stringify({ name }),
  });

  if (createRes.ok) {
    const payload = (await createRes.json()) as { data?: { id?: string | number } };
    if (payload.data?.id != null) return String(payload.data.id);
  } else {
    console.error('MailerLite create group error:', name, createRes.status, await createRes.text());
  }

  return findGroupByName(apiKey, name);
}

async function findGroupByName(apiKey: string, name: string): Promise<string | undefined> {
  const params = new URLSearchParams({
    'filter[name]': name,
    limit: '100',
  });

  let page = 1;
  let lastPage = 1;

  do {
    params.set('page', String(page));
    const res = await fetch(`${MAILERLITE_API}/groups?${params.toString()}`, {
      headers: mlHeaders(apiKey),
    });

    if (!res.ok) {
      console.error('MailerLite list groups error:', res.status, await res.text());
      return undefined;
    }

    const payload = (await res.json()) as {
      data?: Array<{ id?: string | number; name?: string }>;
      meta?: { last_page?: number };
    };

    const match = (payload.data ?? []).find((group) => group.name === name && group.id != null);
    if (match?.id != null) return String(match.id);

    lastPage = payload.meta?.last_page ?? page;
    page += 1;
  } while (page <= lastPage);

  return undefined;
}

export async function ensureTextFields(apiKey: string, names: string[]): Promise<void> {
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
    }
  } catch (err) {
    console.error('MailerLite list fields error:', err);
  }

  for (const name of names) {
    if (existing.has(name)) continue;
    try {
      const createRes = await fetch(`${MAILERLITE_API}/fields`, {
        method: 'POST',
        headers: mlHeaders(apiKey),
        body: JSON.stringify({ name, type: 'text' }),
      });
      if (!createRes.ok && createRes.status !== 422) {
        console.error('MailerLite create field error:', name, createRes.status, await createRes.text());
      }
    } catch (err) {
      console.error('MailerLite create field error:', name, err);
    }
  }
}

export async function upsertSubscriber(
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

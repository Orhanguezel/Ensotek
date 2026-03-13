import { NextResponse } from 'next/server';

type SeoIssuePayload = {
  type?: '404' | 'soft-404';
  pathname?: string;
  reason?: string;
  timestamp?: string;
  userAgent?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as SeoIssuePayload;

  if (!payload.type || !payload.pathname) {
    return NextResponse.json({ ok: false, error: 'invalid payload' }, { status: 400 });
  }

  const message = {
    source: 'karbonkompozit',
    type: payload.type,
    pathname: payload.pathname,
    reason: payload.reason ?? '',
    timestamp: payload.timestamp ?? new Date().toISOString(),
    userAgent: payload.userAgent ?? '',
  };

  console.warn('[seo-monitoring]', JSON.stringify(message));

  const webhookUrl = process.env.SEO_MONITORING_WEBHOOK_URL;
  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(message),
      cache: 'no-store',
    }).catch(() => undefined);
  }

  return NextResponse.json({ ok: true });
}

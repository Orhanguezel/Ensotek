import type { FastifyReply, FastifyRequest } from 'fastify';
import { createHash, randomBytes } from 'node:crypto';
import { handleRouteError } from '../_shared';
import { SITE_NAME, escapeMailHtml } from '../mail';
import { telegramNotify } from '../telegram';
import { createCatalogRequestSchema } from './validation';
import {
  repoCreateCatalogRequest,
  repoGetCatalogRequestByVerificationHash,
  repoMarkCatalogEmailVerified,
  repoMarkCatalogEmailFailed,
  repoMarkCatalogEmailSent,
  repoMarkCatalogVerificationMailSent,
  resolveCatalogUrl,
} from './repository';
import { sendCatalogRequestMail, sendCatalogRequestAdminMail, sendCatalogVerificationMail } from './mailer';

function requestMeta(req: FastifyRequest) {
  return {
    ip: req.ip || null,
    user_agent: typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'] : null,
  };
}

export function requestOrigin(_req: FastifyRequest): string {
  const configured = process.env.FRONTEND_URL || process.env.PUBLIC_SITE_URL;
  if (!configured) throw new Error('catalog_public_origin_not_configured');
  const url = new URL(configured);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('catalog_public_origin_invalid');
  return url.origin;
}

function tokenHash(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function failureReason(prefix: string, err: unknown): string {
  const e = err as { code?: unknown; responseCode?: unknown; message?: unknown };
  return [prefix, e?.code, e?.responseCode, e?.message]
    .filter((part) => part !== undefined && part !== null && String(part).trim())
    .map(String)
    .join(': ')
    .slice(0, 4000);
}

export async function assertCatalogUrlAvailable(url: string): Promise<void> {
  const response = await fetch(url, {
    method: 'GET',
    headers: { Range: 'bytes=0-1023', 'User-Agent': 'Ensotek-Catalog-Delivery/1.0' },
    signal: AbortSignal.timeout(10_000),
  });
  try {
    const contentType = response.headers.get('content-type') || '';
    if (!response.ok) throw new Error(`catalog_url_http_${response.status}`);
    if (!contentType.toLowerCase().includes('application/pdf')) throw new Error('catalog_url_invalid_content_type');
    const reader = response.body?.getReader();
    if (!reader) throw new Error('catalog_empty_response');
    try {
      const first = await reader.read();
      if (!first.value || new TextDecoder().decode(first.value.slice(0, 5)) !== '%PDF-') throw new Error('catalog_invalid_pdf_signature');
    } finally { await reader.cancel(); }
  } finally { if (!response.body?.locked) await response.body?.cancel().catch(() => {}); }
}

const verificationCopy = {
  tr: { invalid: ['Geçersiz bağlantı', 'Doğrulama bağlantısı geçersiz veya eksik.'], expired: ['Bağlantının süresi doldu', 'Yeni bir katalog talebi oluşturarak tekrar deneyebilirsiniz.'], success: ['E-posta doğrulandı', 'Katalog bağlantısı e-posta adresinize gönderildi.'], failed: ['Katalog gönderilemedi', 'Talebiniz kaydedildi. Teknik ekibimiz hata kaydını inceleyecektir.'], home: 'Ana sayfa' },
  en: { invalid: ['Invalid link', 'The verification link is invalid or missing.'], expired: ['Link expired', 'Please submit a new catalog request.'], success: ['Email verified', 'The catalog link was sent to your email address.'], failed: ['Catalog could not be sent', 'Your request is saved. Our team will investigate the delivery error.'], home: 'Home' },
  de: { invalid: ['Ungültiger Link', 'Der Bestätigungslink ist ungültig oder fehlt.'], expired: ['Link abgelaufen', 'Bitte stellen Sie eine neue Kataloganfrage.'], success: ['E-Mail bestätigt', 'Der Kataloglink wurde an Ihre E-Mail-Adresse gesendet.'], failed: ['Katalog konnte nicht gesendet werden', 'Ihre Anfrage wurde gespeichert. Unser Team prüft den Zustellfehler.'], home: 'Startseite' },
};
export function verificationResultHtml(kind: 'invalid' | 'expired' | 'success' | 'failed', locale: string, req: FastifyRequest): string {
  const lang = locale.toLowerCase().slice(0, 2);
  const key = lang === 'de' || lang === 'en' ? lang : 'tr';
  const t = verificationCopy[key], [title, message] = t[kind];
  const url = `${requestOrigin(req)}/${key}`;
  return `<!doctype html><html lang="${key}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — ${escapeMailHtml(SITE_NAME)}</title></head><body style="margin:0;background:#f3f6f8;font-family:Arial,sans-serif;color:#172638"><main style="max-width:620px;margin:64px auto;padding:36px;background:#fff;border-top:6px solid #00a8c5"><h1>${title}</h1><p>${message}</p><a href="${escapeMailHtml(url)}">${escapeMailHtml(SITE_NAME)} · ${t.home}</a></main></body></html>`;
}

export async function createCatalogRequestPublic(req: FastifyRequest, reply: FastifyReply) {
  try {
    const parsed = createCatalogRequestSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return reply.code(400).send({ error: 'INVALID_BODY', details: parsed.error.flatten() });
    }
    if (parsed.data.website && parsed.data.website.trim()) {
      return reply.code(200).send({ ok: true });
    }

    // Product datasheet URLs previously pointed to a non-existent endpoint.
    // Until a real per-product PDF exists, deliver the verified bilingual catalog.
    const catalogUrl = await resolveCatalogUrl(parsed.data.locale);
    await assertCatalogUrlAvailable(catalogUrl);
    const verificationToken = randomBytes(32).toString('hex');
    const row = await repoCreateCatalogRequest({
      ...parsed.data,
      ...requestMeta(req),
      catalog_url: catalogUrl,
      verification_token_hash: tokenHash(verificationToken),
      verification_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    let updated = row;
    try {
      const origin = requestOrigin(req);
      const verificationUrl = `${origin}/api/catalog-requests/verify?token=${verificationToken}&locale=${encodeURIComponent(parsed.data.locale || 'tr')}`;
      await sendCatalogVerificationMail(row, verificationUrl);
      updated = (await repoMarkCatalogVerificationMailSent(row.id)) ?? row;
    } catch (err) {
      const reason = failureReason('verification_mail_send_failed', err);
      req.log.warn({ err, id: row.id, reason }, 'catalog_verification_email_failed');
      updated = (await repoMarkCatalogEmailFailed(row.id, reason)) ?? row;
    }

    try {
      await sendCatalogRequestAdminMail(row);
    } catch (err) {
      req.log.warn({ err, id: row.id }, 'catalog_admin_email_failed');
    }

    try {
      await telegramNotify({
        title: 'Yeni katalog talebi',
        message: `${row.customer_name} (${row.email}) katalog istedi.${row.company_name ? `\nFirma: ${row.company_name}` : ''}`,
        type: 'catalog_request_created',
        createdAt: new Date(),
      });
    } catch (err) {
      req.log.warn({ err, id: row.id }, 'catalog_telegram_failed');
    }

    return reply.code(201).send(updated);
  } catch (e) {
    return handleRouteError(reply, req, e, 'create_catalog_request');
  }
}

export async function verifyCatalogRequestPublic(req: FastifyRequest, reply: FastifyReply) {
  const queryLocale = String((req.query as { locale?: unknown })?.locale || req.headers['accept-language'] || 'tr');
  const token = typeof (req.query as { token?: unknown })?.token === 'string'
    ? String((req.query as { token: string }).token).trim()
    : '';
  if (!/^[a-f0-9]{64}$/i.test(token)) {
    return reply.type('text/html; charset=utf-8').code(400).send(
      verificationResultHtml('invalid', queryLocale, req),
    );
  }

  const row = await repoGetCatalogRequestByVerificationHash(tokenHash(token));
  if (!row || !row.verification_expires_at || row.verification_expires_at.getTime() < Date.now()) {
    return reply.type('text/html; charset=utf-8').code(410).send(
      verificationResultHtml('expired', queryLocale, req),
    );
  }

  try {
    await assertCatalogUrlAvailable(String(row.catalog_url || ''));
    if (!await repoMarkCatalogEmailVerified(row.id, tokenHash(token))) return reply.type("text/html; charset=utf-8").code(410).send(verificationResultHtml("expired", row.locale || queryLocale, req));
    await sendCatalogRequestMail(row);
    await repoMarkCatalogEmailSent(row.id);
    return reply.type('text/html; charset=utf-8').send(
      verificationResultHtml('success', row.locale || queryLocale, req),
    );
  } catch (err) {
    const reason = failureReason('catalog_delivery_failed', err);
    req.log.error({ err, id: row.id, reason }, 'catalog_verified_delivery_failed');
    await repoMarkCatalogEmailFailed(row.id, reason);
    return reply.type('text/html; charset=utf-8').code(502).send(
      verificationResultHtml('failed', row.locale || queryLocale, req),
    );
  }
}

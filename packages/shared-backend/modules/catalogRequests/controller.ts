import type { FastifyReply, FastifyRequest } from 'fastify';
import { createHash, randomBytes } from 'node:crypto';
import { handleRouteError } from '../_shared';
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

function requestOrigin(req: FastifyRequest): string {
  const proto = typeof req.headers['x-forwarded-proto'] === 'string' ? req.headers['x-forwarded-proto'].split(',')[0] : 'https';
  const host = typeof req.headers['x-forwarded-host'] === 'string'
    ? req.headers['x-forwarded-host'].split(',')[0]
    : typeof req.headers.host === 'string'
      ? req.headers.host
      : '';
  return host ? `${proto}://${host}` : '';
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

async function assertCatalogUrlAvailable(url: string): Promise<void> {
  const response = await fetch(url, {
    method: 'GET',
    headers: { Range: 'bytes=0-1023', 'User-Agent': 'Ensotek-Catalog-Delivery/1.0' },
    signal: AbortSignal.timeout(10_000),
  });
  const contentType = response.headers.get('content-type') || '';
  if (!response.ok) throw new Error(`catalog_url_http_${response.status}`);
  if (!contentType.toLowerCase().includes('application/pdf')) {
    throw new Error(`catalog_url_invalid_content_type_${contentType || 'missing'}`);
  }
}

function verificationResultHtml(title: string, message: string, ok: boolean): string {
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body style="margin:0;background:#f3f6f8;font-family:Arial,sans-serif;color:#172638"><main style="max-width:620px;margin:64px auto;padding:36px;background:#fff;border-top:6px solid ${ok ? '#00a8c5' : '#c62828'};box-shadow:0 8px 30px rgba(7,54,93,.12)"><h1 style="color:#07365d">${title}</h1><p style="font-size:16px;line-height:1.6">${message}</p><a href="https://www.ensotek.com.tr" style="color:#007f9a">Ensotek ana sayfasına dön</a></main></body></html>`;
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
      const origin = requestOrigin(req) || 'https://www.ensotek.com.tr';
      const verificationUrl = `${origin}/api/catalog-requests/verify?token=${verificationToken}`;
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
  const token = typeof (req.query as { token?: unknown })?.token === 'string'
    ? String((req.query as { token: string }).token).trim()
    : '';
  if (!/^[a-f0-9]{64}$/i.test(token)) {
    return reply.type('text/html; charset=utf-8').code(400).send(
      verificationResultHtml('Geçersiz bağlantı', 'Doğrulama bağlantısı geçersiz veya eksik.', false),
    );
  }

  const row = await repoGetCatalogRequestByVerificationHash(tokenHash(token));
  if (!row || !row.verification_expires_at || row.verification_expires_at.getTime() < Date.now()) {
    return reply.type('text/html; charset=utf-8').code(410).send(
      verificationResultHtml('Bağlantının süresi doldu', 'Yeni bir katalog talebi oluşturarak tekrar deneyebilirsiniz.', false),
    );
  }

  try {
    await assertCatalogUrlAvailable(String(row.catalog_url || ''));
    await repoMarkCatalogEmailVerified(row.id);
    await sendCatalogRequestMail(row);
    await repoMarkCatalogEmailSent(row.id);
    return reply.type('text/html; charset=utf-8').send(
      verificationResultHtml('E-posta doğrulandı', 'Katalog bağlantısı e-posta adresinize gönderildi.', true),
    );
  } catch (err) {
    const reason = failureReason('catalog_delivery_failed', err);
    req.log.error({ err, id: row.id, reason }, 'catalog_verified_delivery_failed');
    await repoMarkCatalogEmailFailed(row.id, reason);
    return reply.type('text/html; charset=utf-8').code(502).send(
      verificationResultHtml('Katalog gönderilemedi', 'Talebiniz kaydedildi. Teknik ekibimiz hata kaydını inceleyecektir.', false),
    );
  }
}

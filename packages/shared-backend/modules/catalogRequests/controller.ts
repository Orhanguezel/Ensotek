import type { FastifyReply, FastifyRequest } from 'fastify';
import { handleRouteError } from '../_shared';
import { telegramNotify } from '../telegram';
import { createCatalogRequestSchema } from './validation';
import {
  repoCreateCatalogRequest,
  repoMarkCatalogEmailFailed,
  repoMarkCatalogEmailSent,
  resolveCatalogUrl,
} from './repository';
import { sendCatalogRequestMail } from './mailer';

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

function resolveRequestedCatalogUrl(req: FastifyRequest, value?: string | null): string | null {
  const raw = String(value ?? '').trim();
  if (!raw) return null;
  if (!raw.startsWith('/api/datasheets/')) return null;
  const origin = requestOrigin(req);
  return origin ? `${origin}${raw}` : raw;
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

    const catalogUrl = resolveRequestedCatalogUrl(req, parsed.data.catalog_url) ?? await resolveCatalogUrl(parsed.data.locale);
    const row = await repoCreateCatalogRequest({ ...parsed.data, ...requestMeta(req), catalog_url: catalogUrl });

    let updated = row;
    try {
      await sendCatalogRequestMail(row);
      updated = (await repoMarkCatalogEmailSent(row.id)) ?? row;
    } catch (err) {
      req.log.warn({ err, id: row.id }, 'catalog_email_send_failed');
      updated = (await repoMarkCatalogEmailFailed(row.id)) ?? row;
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

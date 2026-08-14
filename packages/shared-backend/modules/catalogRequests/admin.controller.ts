import type { FastifyReply, FastifyRequest } from 'fastify';
import { handleRouteError, sendNotFound } from '../_shared';
import { sendCatalogRequestMail } from './mailer';
import {
  repoDeleteCatalogRequest,
  repoGetCatalogRequest,
  repoListCatalogRequests,
  repoMarkCatalogEmailFailed,
  repoMarkCatalogEmailSent,
  repoPatchCatalogRequest,
} from './repository';
import { listCatalogRequestsSchema, patchCatalogRequestSchema } from './validation';

function errorReason(err: unknown): string {
  const e = err as { code?: unknown; responseCode?: unknown; message?: unknown };
  return ['catalog_manual_send_failed', e?.code, e?.responseCode, e?.message]
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

export async function listCatalogRequestsAdmin(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = listCatalogRequestsSchema.parse(req.query ?? {});
    return reply.send(await repoListCatalogRequests(params));
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_list');
  }
}

export async function getCatalogRequestAdmin(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const row = await repoGetCatalogRequest(id);
    if (!row) return sendNotFound(reply);
    return reply.send(row);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_get');
  }
}

export async function patchCatalogRequestAdmin(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const body = patchCatalogRequestSchema.parse(req.body ?? {});
    const row = await repoPatchCatalogRequest(id, body);
    if (!row) return sendNotFound(reply);
    return reply.send(row);
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_patch');
  }
}

export async function deleteCatalogRequestAdmin(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    await repoDeleteCatalogRequest(id);
    return reply.code(204).send();
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_delete');
  }
}

export async function resendCatalogRequestAdmin(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const row = await repoGetCatalogRequest(id);
    if (!row) return sendNotFound(reply);
    if (!row.email_verified_at) {
      return reply.code(409).send({
        error: {
          message: 'catalog_email_verification_required',
          detail: 'Catalog delivery is blocked until the customer verifies the email address.',
        },
      });
    }
    try {
      await assertCatalogUrlAvailable(String(row.catalog_url || ''));
      await sendCatalogRequestMail(row);
      return reply.send(await repoMarkCatalogEmailSent(id));
    } catch (err) {
      const reason = errorReason(err);
      req.log.warn({ err, id, reason }, 'catalog_resend_failed');
      await repoMarkCatalogEmailFailed(id, reason);
      return reply.code(502).send({ error: { message: 'catalog_send_failed', detail: reason } });
    }
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_resend');
  }
}

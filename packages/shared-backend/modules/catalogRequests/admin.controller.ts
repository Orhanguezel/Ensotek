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
    try {
      await sendCatalogRequestMail(row);
      return reply.send(await repoMarkCatalogEmailSent(id));
    } catch (err) {
      req.log.warn({ err, id }, 'catalog_resend_failed');
      return reply.send(await repoMarkCatalogEmailFailed(id));
    }
  } catch (e) {
    return handleRouteError(reply, req, e, 'admin_catalog_resend');
  }
}

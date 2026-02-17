// =============================================================
// FILE: src/modules/audit/router.ts
// Audit Module Router
//   - requestLoggerPlugin artık app.ts'de /api scope'unda kayıtlı
//   - Bu dosya sadece admin endpoints + SSE stream'i mount eder
// =============================================================

import type { FastifyInstance } from 'fastify';

import { registerAuditAdmin } from './admin.routes';
import { registerAuditStream } from './stream.routes';

export async function registerAudit(api: FastifyInstance, _opts?: unknown) {
  // mount admin endpoints under /api/admin/audit/*
  await api.register(registerAuditAdmin, {});
  await api.register(registerAuditStream, {});
}

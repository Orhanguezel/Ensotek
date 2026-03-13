// src/core/error.ts
// Fastify v5 ile bazı projelerde TS çözümlemesi şaşabiliyor.
// Burada 'any' verip üretimi engelleyen tip sürtünmesini kesiyoruz.
import { emitAppEvent } from '@/common/events/bus';

export function registerErrorHandlers(app: any) {
  // 404
  app.setNotFoundHandler((req: any, reply: any) => {
    req.auditError = { message: 'Not Found', code: 'NOT_FOUND' };

    reply.code(404).send({
      error: { code: 'NOT_FOUND', message: 'Not Found', path: req.url },
    });
  });

  // Genel hata yakalayıcı
  app.setErrorHandler((err: any, req: any, reply: any) => {
    const status = err?.statusCode ?? err?.status ?? (err?.validation ? 400 : 500);

    const errorCode = err?.validation
      ? 'VALIDATION_ERROR'
      : err?.code ?? (status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST');

    // Audit: hata detaylarını request'e bağla (onResponse hook'unda okunacak)
    req.auditError = {
      message: err?.message ?? 'Server Error',
      code: errorCode,
      stack: status >= 500 ? (err?.stack ?? null) : null,
    };

    const payload: Record<string, any> = {
      error: {
        code: errorCode,
        message: err?.message ?? 'Server Error',
      },
    };

    if (err?.validation) payload.error.details = err.validation;
    if (err?.errors) payload.error.details = err.errors;

    if (process.env.NODE_ENV !== 'production' && err?.stack) {
      payload.error.stack = err.stack;
    }

    req.log?.error?.(err, 'request_failed');

    // Audit: real-time error event (SSE + audit_events persist)
    emitAppEvent({
      level: status >= 500 ? 'error' : 'warn',
      topic: 'audit.error.caught',
      message: err?.message ?? 'Server Error',
      actor_user_id: req?.user?.id ?? null,
      ip: req?.ip ?? null,
      entity: null,
      meta: {
        status_code: status,
        error_code: errorCode,
        method: req?.method,
        url: req?.url,
        stack: status >= 500 ? err?.stack : undefined,
      },
    });

    reply.code(status).send(payload);
  });
}

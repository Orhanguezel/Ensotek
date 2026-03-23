import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type MaybeMessage = { message?: unknown };
type MaybeError = { error?: unknown };
type MaybeStatus = { status?: unknown };
type MaybeData = { data?: unknown };

export function normalizeError(err: unknown): { message: string; status?: number } {
  // RTK FetchBaseQueryError şekli: { status, data? }
  if (isObject(err) && "status" in err) {
    const statusRaw = (err as MaybeStatus).status;
    const status = typeof statusRaw === "number" ? statusRaw : undefined;

    const data = (err as MaybeData).data;

    // data string ise (Fastify/plain) → direkt göster
    if (typeof data === "string" && data.trim()) {
      return { message: trimMsg(data), status };
    }

    // data object ise yaygın alanları sırayla dene
    if (isObject(data)) {
      const cand =
        pickStr(data, "message") ??
        pickStr(data, "error") ??
        pickStr(data, "detail") ??
        pickStr(data, "hint") ??
        pickStr(data, "description") ??
        pickStr(data, "msg");
      if (cand) return { message: trimMsg(cand), status };

      // mesaj alanı yoksa objeyi kısaltıp döndür
      try {
        return { message: trimMsg(JSON.stringify(data)), status };
      } catch {
        /* noop */
      }
    }

    // RTK bazen `error` alanına string koyabilir
    const e = (err as MaybeError).error;
    if (typeof e === "string" && e.trim()) {
      return { message: trimMsg(e), status };
    }

    return { message: status ? `request_failed_${status}` : "request_failed", status };
  }

  // SerializedError: { message?, name?, stack? }
  if (isObject(err) && "message" in err) {
    const m = (err as MaybeMessage).message;
    if (typeof m === "string") return { message: trimMsg(m) };
  }

  if (err instanceof Error) return { message: trimMsg(err.message) };
  return { message: "unknown_error" };
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function pickStr(obj: Record<string, unknown>, key: string): string | null {
  const v = obj[key];
  return typeof v === "string" && v.trim() ? v : null;
}

function trimMsg(s: string, max = 280): string {
  return s.length > max ? `${s.slice(0, max)}…` : s;
}

// 🔹 RTK helper'larının beklediği ortak sonuç tipi
export type FetchResult<T> = {
  data: T | null;
  error: { message: string; status?: number } | null;
};

// RTK union tipi (gerekirse)
export type RTKError = FetchBaseQueryError | SerializedError | Record<string, unknown>;

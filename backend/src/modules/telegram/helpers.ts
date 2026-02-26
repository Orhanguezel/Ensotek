import { safeTrim, to01 } from '@/modules/_shared';

export const DEFAULT_AUTOREPLY_TEMPLATE =
  'Vielen Dank für Ihre Nachricht! Wir werden uns schnellstmöglich bei Ihnen melden.\n\nMesajınız için teşekkür ederiz. En kısa sürede size dönüş yapacağız.\n\n- Ensotek Team';

export function toTelegramChatId(v: unknown): string {
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  return safeTrim(v);
}

export function toTelegramBoolInt(v: unknown): 0 | 1 {
  return to01(v) ?? 0;
}

/** Cursor = base64("created_at_iso|id") */
export function encodeDateIdCursor(createdAtIso: string, id: string): string {
  return Buffer.from(`${createdAtIso}|${id}`, 'utf8').toString('base64');
}

export function decodeDateIdCursor(cursor: string): { createdAtIso: string; id: string } | null {
  try {
    const raw = Buffer.from(cursor, 'base64').toString('utf8');
    const [createdAtIso, id] = raw.split('|');
    if (!createdAtIso || !id) return null;

    const d = new Date(createdAtIso);
    if (Number.isNaN(d.getTime())) return null;

    return { createdAtIso: d.toISOString(), id };
  } catch {
    return null;
  }
}

export function isZodValidationError(err: unknown): err is { name: 'ZodError'; issues?: unknown } {
  return !!err && typeof err === 'object' && (err as { name?: string }).name === 'ZodError';
}

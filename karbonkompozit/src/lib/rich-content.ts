type RichContentPayload = {
  html?: unknown;
  content?: unknown;
};

function pickRichHtml(value: unknown): string | null {
  if (!value || typeof value !== 'object') return null;

  const payload = value as RichContentPayload;
  if (typeof payload.html === 'string' && payload.html.trim()) return payload.html;
  if (typeof payload.content === 'string' && payload.content.trim()) return payload.content;

  return null;
}

export function normalizeRichContent(value: unknown): string {
  if (typeof value !== 'string') return '';

  const trimmed = value.trim();
  if (!trimmed) return '';

  const directHtml = pickRichHtml(value);
  if (directHtml) return directHtml;

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      return pickRichHtml(parsed) ?? trimmed;
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}

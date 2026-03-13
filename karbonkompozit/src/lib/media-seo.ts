type MediaKind = 'product' | 'gallery' | 'gallery-cover' | 'blog';

type MediaTextParams = {
  locale?: string;
  kind: MediaKind;
  title?: string | null;
  alt?: string | null;
  caption?: string | null;
  description?: string | null;
};

type MediaDimensionsParams = {
  width?: number | string | null;
  height?: number | string | null;
  fallbackWidth: number;
  fallbackHeight: number;
};

const GENERIC_TERMS = new Set([
  'image',
  'photo',
  'picture',
  'visual',
  'gorsel',
  'gorseli',
  'fotograf',
  'resim',
]);

const KIND_LABELS: Record<'tr' | 'en', Record<MediaKind, string>> = {
  tr: {
    product: 'kompozit urun gorseli',
    gallery: 'uygulama galerisi gorseli',
    'gallery-cover': 'galeri kapak gorseli',
    blog: 'blog kapak gorseli',
  },
  en: {
    product: 'composite product visual',
    gallery: 'project gallery visual',
    'gallery-cover': 'gallery cover visual',
    blog: 'blog cover visual',
  },
};

function normalizeText(value?: string | null) {
  return (value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeKey(value?: string | null) {
  return normalizeText(value).toLocaleLowerCase();
}

function truncate(value: string, max = 140) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}

function isGeneric(value?: string | null) {
  const normalized = normalizeKey(value);
  return GENERIC_TERMS.has(normalized);
}

function isWeakAlt(value?: string | null, title?: string | null) {
  const normalized = normalizeText(value);
  if (!normalized) return true;
  if (normalized.length < 6) return true;
  if (isGeneric(normalized)) return true;
  if (normalizeKey(normalized) === normalizeKey(title)) return true;
  return false;
}

function pickLocale(locale?: string): 'tr' | 'en' {
  return locale?.startsWith('en') ? 'en' : 'tr';
}

export function buildMediaAlt({
  locale,
  kind,
  title,
  alt,
  caption,
  description,
}: MediaTextParams) {
  const rawAlt = normalizeText(alt);
  if (!isWeakAlt(rawAlt, title)) return truncate(rawAlt, 120);

  const safeTitle = normalizeText(title);
  const supportText = [caption, description]
    .map((value) => normalizeText(value))
    .find((value) => value && normalizeKey(value) !== normalizeKey(title));
  const kindLabel = KIND_LABELS[pickLocale(locale)][kind];

  if (safeTitle && supportText) {
    return truncate(`${safeTitle} - ${supportText}`, 140);
  }

  if (safeTitle) {
    return truncate(`${safeTitle} - ${kindLabel}`, 120);
  }

  return truncate(supportText || kindLabel, 120);
}

export function buildMediaCaption({
  title,
  caption,
  description,
}: Pick<MediaTextParams, 'title' | 'caption' | 'description'>) {
  const rawCaption = normalizeText(caption);
  if (rawCaption && normalizeKey(rawCaption) !== normalizeKey(title)) {
    return truncate(rawCaption, 180);
  }

  const rawDescription = normalizeText(description);
  if (rawDescription && normalizeKey(rawDescription) !== normalizeKey(title)) {
    return truncate(rawDescription, 180);
  }

  return null;
}

export function buildMediaSchemaText(params: MediaTextParams) {
  return {
    alt: buildMediaAlt(params),
    caption: buildMediaCaption(params),
  };
}

function parseDimension(value?: number | string | null) {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value;
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return null;
}

export function resolveMediaDimensions({
  width,
  height,
  fallbackWidth,
  fallbackHeight,
}: MediaDimensionsParams) {
  const safeWidth = parseDimension(width);
  const safeHeight = parseDimension(height);
  const fallbackRatio = fallbackWidth / fallbackHeight;

  if (safeWidth && safeHeight) {
    return { width: safeWidth, height: safeHeight };
  }

  if (safeWidth) {
    return {
      width: safeWidth,
      height: Math.round(safeWidth / fallbackRatio),
    };
  }

  if (safeHeight) {
    return {
      width: Math.round(safeHeight * fallbackRatio),
      height: safeHeight,
    };
  }

  return { width: fallbackWidth, height: fallbackHeight };
}

export function isMeaningfulMediaDate(value?: string | null) {
  if (!value) return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed);
}

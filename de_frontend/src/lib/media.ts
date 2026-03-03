export const safeStr = (v: unknown) => String(v ?? "").trim();

export function isHttpUrl(s: string): boolean {
  return /^https?:\/\//i.test(s);
}

export function stripTrailingSlash(s: string): string {
  return String(s || "").replace(/\/+$/, "");
}

export function originFromUrl(u: string): string | null {
  try {
    const x = new URL(u);
    return `${x.protocol}//${x.host}`;
  } catch {
    return null;
  }
}

export function getFileBase(): string {
  // 1. Explicit file base URL (highest priority)
  const envFileBase = stripTrailingSlash(safeStr(process.env.NEXT_PUBLIC_FILE_BASE_URL || ""));
  if (envFileBase) return envFileBase;

  // 2. Try to derive from API URL
  const envApiUrl = safeStr(process.env.NEXT_PUBLIC_API_URL || "");
  if (envApiUrl) {
    const origin = originFromUrl(envApiUrl);
    if (origin) return stripTrailingSlash(origin);
  }

  // 3. Client-side fallbacks based on window location
  if (typeof window !== "undefined") {
    const host = safeStr(window.location.hostname);
    const origin = stripTrailingSlash(safeStr(window.location.origin));

    // If we are developing locally, backend is usually on 8086
    if (host === "localhost" || host === "127.0.0.1") {
      // Use the same IP/host as the current window for consistency
      return `http://${host}:8086`;
    }
    
    // Default to current origin in prod if nothing else matches
    if (origin) return origin;
  }
  
  // 4. Ultimate fallback (Production domain)
  return "https://www.ensotek.de";
}

export function normalizeMediaPath(url: string): string {
  const s = safeStr(url);
  if (!s) return "";

  // If it's a full URL to ensotek.de, but we are developing locally, 
  // we might want to treat it as a relative path to the local backend.
  if (isHttpUrl(s) && (s.includes("ensotek.de") || s.includes("ensotek.com.tr"))) {
    const [pathOnly, suffix = ""] = s.split(/(?=[?#])/);
    const cleaned = String(pathOnly).replace(/^https?:\/\/[^/]+/i, "");
    return normalizeMediaPath(cleaned + suffix);
  }

  if (isHttpUrl(s)) return s;

  const [pathOnly, suffix = ""] = s.split(/(?=[?#])/);
  let p = pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;

  while (p.startsWith("/api/api/")) p = p.replace("/api/api/", "/api/");

  if (p === "/api/uploads") return `/uploads${suffix}`;
  if (p.startsWith("/api/uploads/")) return `${p.replace(/^\/api/, "")}${suffix}`;
  if (p === "/uploads" || p.startsWith("/uploads/")) return `${p}${suffix}`;

  const idx = p.indexOf("/uploads/");
  if (idx >= 0) return `${p.substring(idx)}${suffix}`;

  // Default fallback for ambiguous paths
  return `/uploads/${p.replace(/^\/+/, "")}${suffix}`.replace(
    /^\/uploads\/uploads(\/|$)/,
    "/uploads$1",
  );
}

export function resolveMediaUrl(url: string | null | undefined): string {
  const raw = safeStr(url);
  if (!raw) return "";

  if (isHttpUrl(raw)) {
    // If it's already an absolute URL and NOT to our own domain, return as is.
    // If it's to ensotek.de, normalize it to handle localhost development.
    if (!raw.includes("ensotek.de") && !raw.includes("ensotek.com.tr")) {
      return raw;
    }
  }

  const fileBase = getFileBase();
  const normalized = normalizeMediaPath(raw);
  
  if (isHttpUrl(normalized)) return normalized;

  const base = stripTrailingSlash(fileBase);
  return `${base}${normalized.startsWith("/") ? "" : "/"}${normalized}`;
}

/**
 * Theme Tokens → CSS Variables
 * - Backend'den gelen serbest şema -> düzleştir + kebab-case + --prefix-... olarak yaz
 * - SCSS içinde: color: var(--gwd-colors-primary);
 */

export type ThemeTokens = Record<string, any>;

export type TokensToCssOptions = {
  /** CSS değişken prefix'i (varsayılan: "gwd") → --gwd-... */
  prefix?: string;
  /** CSS'i hangi selector'a yazalım (varsayılan: ":root") */
  selector?: string;
  /** Sayısal değerleri px'e çevirirken hangi anahtarları px yapalım */
  pxKeys?: RegExp;
  /** Bu anahtar setini görmezden gel (ör: private alanlar) */
  excludeKeys?: RegExp;
};

/** basit kebab-case */
function kebab(s: string) {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

function isPlainObject(v: unknown): v is Record<string, any> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

/** nested token'ları path ile düzleştir */
function flattenTokens(
  obj: Record<string, any>,
  path: string[] = [],
  out: Record<string, any> = {}
) {
  for (const [k, v] of Object.entries(obj || {})) {
    const p = [...path, k];
    if (isPlainObject(v)) {
      flattenTokens(v, p, out);
    } else if (Array.isArray(v)) {
      // array'leri indexleyerek yaz (colors.palette[0] -> colors-palette-0)
      v.forEach((item, i) => {
        if (isPlainObject(item) || Array.isArray(item)) {
          flattenTokens({ [String(i)]: item }, p, out);
        } else {
          out[[...p, String(i)].join(".")] = item;
        }
      });
    } else {
      out[p.join(".")] = v;
    }
  }
  return out;
}

/** sayısal değerleri uygun yerlerde px'e çevir */
function normalizeValue(keyPath: string, value: unknown, pxKeys: RegExp): string {
  if (value == null) return "";
  if (typeof value === "number") {
    // line-height gibi birimler istemeyen anahtarlar hariç
    if (/lineheight|opacity|zindex/i.test(keyPath)) return String(value);
    if (pxKeys.test(keyPath)) return `${value}px`;
    return String(value);
  }
  return String(value);
}

/**
 * Token'ları CSS değişkenlerine çevir
 * Örn: { colors: { primary: "#0f0" } } -> --gwd-colors-primary: #0f0;
 */
export function tokensToCssVars(
  tokens: ThemeTokens,
  opts: TokensToCssOptions = {}
): { vars: Record<string, string>; cssText: string } {
  const {
    prefix = "gwd",
    selector = ":root",
    pxKeys = /(size|radius|radii|gap|spacing|space|padding|margin|width|height|fontSize|border)/i,
    excludeKeys = /^(_|__)/, // _private alanları atla
  } = opts;

  const flat = flattenTokens(tokens);
  const vars: Record<string, string> = {};

  for (const [path, rawVal] of Object.entries(flat)) {
    if (excludeKeys.test(path)) continue;
    const varName = `--${prefix}-${kebab(path.replace(/\./g, "-"))}`;
    vars[varName] = normalizeValue(path, rawVal, pxKeys);
  }

  const lines = Object.entries(vars)
    .filter(([, v]) => v !== "")
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");

  const cssText = `${selector} {\n${lines}\n}`;
  return { vars, cssText };
}

/** Client: CSS değişkenlerini doğrudan documentElement'e uygula */
export function applyThemeTokens(tokens: ThemeTokens, opts?: Omit<TokensToCssOptions, "selector">) {
  if (typeof document === "undefined") return;
  const { vars } = tokensToCssVars(tokens, opts);
  const root = document.documentElement;
  for (const [k, v] of Object.entries(vars)) {
    root.style.setProperty(k, v);
  }
}

/** SSR: <style id="gwd-theme">...</style> string'i üret */
export function buildThemeStyleTag(tokens: ThemeTokens, opts?: TokensToCssOptions): string {
  const { cssText } = tokensToCssVars(tokens, opts);
  return `<style id="gwd-theme">\n${cssText}\n</style>`;
}

/* ---------------------------------------------------------------
 * Örnek kullanım:
 *
 * // 1) SSR: app/layout.tsx veya _document.tsx içinde
 * const themeHtml = buildThemeStyleTag(serverTokens, { prefix: "gwd" });
 * return (
 *   <html>
 *     <head dangerouslySetInnerHTML={{ __html: themeHtml }} />
 *     ...
 *   </html>
 * )
 *
 * // 2) Client: herhangi bir yerde (örn. useEffect ile)
 * applyThemeTokens(clientTokens, { prefix: "gwd" });
 *
 * // 3) SCSS: değişkenleri kullan
 * .btn-primary {
 *   background: var(--gwd-colors-primary);
 *   border-radius: var(--gwd-radii-sm);
 *   padding: var(--gwd-spacing-2);
 * }
 * --------------------------------------------------------------*/

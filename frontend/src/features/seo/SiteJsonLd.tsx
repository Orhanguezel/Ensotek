// src/features/seo/SiteJsonLd.tsx
import React from "react";
import type { SupportedLocale } from "@/types/common";
import { siteUrlBase, absoluteUrl, compact } from "./utils";
import { getServerApiBaseAbsolute } from "@/lib/server/http";
import { resolveTenant } from "@/lib/server/tenant";
import { normalizeLocale } from "@/lib/server/locale";
import { buildCommonHeaders } from "@/lib/http";

/* ---------- helpers ---------- */
type SettingDoc = { key: string; value: any };
type CompanyDoc = {
  companyName?: Partial<Record<SupportedLocale, string>>;
  companyDesc?: Partial<Record<SupportedLocale, string>>;
  phone?: string;
  images?: Array<{ url?: string; webp?: string; thumbnail?: string }>;
  socialLinks?: Partial<Record<"facebook" | "instagram" | "twitter" | "linkedin" | "youtube", string>>;
};

function readLocalizedLabel(value: any, locale: SupportedLocale): string {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  // yaygın kalıplar
  const candidates = [
    value?.[locale],
    value?.label?.[locale],
    value?.title?.label?.[locale],
    value?.description?.label?.[locale],
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }
  // derin arama
  if (typeof value === "object") {
    if (value.label && typeof value.label === "object") {
      const c = value.label?.[locale];
      if (typeof c === "string" && c.trim()) return c.trim();
    }
    for (const k of Object.keys(value)) {
      const out = readLocalizedLabel(value[k], locale);
      if (out) return out;
    }
  }
  return "";
}

async function fetchJSON<T>(path: string, locale: SupportedLocale): Promise<T> {
  const base = await getServerApiBaseAbsolute(); // ".../api"
  const url = base.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "");
  const tenant = await resolveTenant();
  const l = normalizeLocale(locale);
  const r = await fetch(url, {
    headers: buildCommonHeaders(l, tenant),
    cache: "force-cache",
    next: { revalidate: 300 },
  });
  if (!r.ok) throw new Error(`${path} failed: ${r.status}`);
  return r.json() as Promise<T>;
}

/* ---------- component ---------- */
export default async function SiteJsonLd({ locale }: { locale: SupportedLocale }) {
  const base = siteUrlBase();

  // SETTINGS + COMPANY
  let settings: SettingDoc[] = [];
  let company: CompanyDoc | null = null;

  try {
    const s = await fetchJSON<SettingDoc[] | { data: SettingDoc[] }>("settings", locale);
    settings = Array.isArray(s) ? s : (s?.data ?? []);
  } catch { /* ignore, fallback devreye girecek */ }

  try {
    const c = await fetchJSON<CompanyDoc | { data: CompanyDoc }>("company", locale);
    company = ("data" in (c as any)) ? (c as any).data : (c as CompanyDoc);
  } catch { /* ignore */ }

  // --- name (brand) ---
  const brandFromCompany = readLocalizedLabel(company?.companyName, locale);
  const name = (brandFromCompany || process.env.NEXT_PUBLIC_SITE_NAME || "guezelwebdesign.de").trim();

  // --- description ---
  const descFromCompany = readLocalizedLabel(company?.companyDesc, locale);
  const descFromSettings = readLocalizedLabel(
    settings.find(s => s.key === "seo_default_description")?.value,
    locale
  );
  const orgDescription =
    descFromCompany ||
    descFromSettings ||
    (process.env.NEXT_PUBLIC_ORG_DESCRIPTION || "guezelwebdesign – Industrial solutions & services.").trim();

  // --- logo ---
  const firstImg = (company?.images ?? []).find((i) => i.webp || i.url);
  const logoRaw = (firstImg?.webp || firstImg?.url || "").trim();
  const logo = logoRaw ? logoRaw : absoluteUrl("/logo.png"); // company yoksa public/logo.png

  // --- sameAs (company + settings + env) ---
  const fromCompany = Object.values(company?.socialLinks ?? {}).filter(Boolean) as string[];
  const settingSameAs = (() => {
    const v = settings.find(s => s.key === "org_sameas")?.value;
    if (!v) return [] as string[];
    if (Array.isArray(v)) return v.filter((x) => typeof x === "string") as string[];
    if (typeof v === "string") return [v];
    // record içinden string değerleri topla
    return Object.values(v).filter((x) => typeof x === "string") as string[];
  })();
  const envSameAs = (process.env.NEXT_PUBLIC_ORG_SAMEAS || "")
    .split(",").map(s => s.trim()).filter(Boolean);

  const sameAs = [...fromCompany, ...settingSameAs, ...envSameAs]
    .filter((u, i, arr) => /^https?:\/\//i.test(u) && arr.indexOf(u) === i);

  // --- contactPoint ---
  const telephone = (company?.phone || process.env.NEXT_PUBLIC_ORG_CONTACT_TELEPHONE || "").trim();
  const contactPoint = compact({
    "@type": "ContactPoint",
    telephone: telephone || undefined,
    contactType: (process.env.NEXT_PUBLIC_ORG_CONTACT_TYPE || "customer support").trim(),
    areaServed: (process.env.NEXT_PUBLIC_ORG_CONTACT_AREA || "").trim() || undefined,
    availableLanguage: (process.env.NEXT_PUBLIC_ORG_CONTACT_LANGS || locale)
      .split(",").map(s => s.trim()),
  });
  if (!contactPoint.telephone) delete (contactPoint as any).telephone;

  const data = [
    compact({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${base}#website`,
      url: `${base}/`,
      name,
      inLanguage: locale,
      publisher: { "@id": `${base}#organization` },
      potentialAction: compact({
        "@type": "SearchAction",
        target: `${base}/${locale}?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      }),
    }),
    compact({
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${base}#organization`,
      url: `${base}/`,
      name,
      description: orgDescription,
      logo: { "@type": "ImageObject", url: logo.startsWith("http") ? logo : absoluteUrl(logo) },
      ...(sameAs.length ? { sameAs } : {}),
      ...(Object.keys(contactPoint).length ? { contactPoint: [contactPoint] } : {}),
    }),
  ];

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

import type { SupportedLocale } from "@/types/common";
import type { ICompany } from "@/lib/company/types";

export type CompanyBrand = {
  name: string;
  email: string;
  phone: string;
  website?: string;
  socials?: {
    facebook?: string; instagram?: string; twitter?: string;
    linkedin?: string; youtube?: string;
  };
  logoSrc?: string; // Cloudinary ya da düz URL
};

const SUPPORTED = (process.env.NEXT_PUBLIC_SUPPORTED_LOCALES || "tr,en,de,fr,es,pl")
  .split(",").map(s => s.trim());
const DEFAULT_LOCALE = (process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "tr").trim();

export function normalizeLocale(l?: string): SupportedLocale {
  const x = (l || "").toLowerCase();
  return (SUPPORTED as string[]).includes(x) ? (x as SupportedLocale) : (DEFAULT_LOCALE as SupportedLocale);
}

function pick(tf: any, l: string): string {
  if (!tf) return "";
  if (typeof tf === "string") return tf;
  const v = tf?.[l];
  if (typeof v === "string" && v.trim()) return v.trim();
  for (const x of Object.values(tf)) if (typeof x === "string" && x.trim()) return x.trim();
  return "";
}

function chooseLogoUrl(images?: Array<{ url?: string; thumbnail?: string; webp?: string }>) {
  if (!Array.isArray(images) || !images.length) return "";
  const byName = images.find(i => /logo/i.test(i.webp || i.url || i.thumbnail || "")) || images[0]!;
  return (byName.webp || byName.url || byName.thumbnail || "").trim();
}

function toCloudinaryFit(url: string, w = 160, h = 60) {
  if (!url) return "";
  if (url.startsWith("https://res.cloudinary.com/")) {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}f_auto,q_auto:eco,w=${w},h=${h},c_fit`;
  }
  return url;
}

export function companyToBrand(
  company: ICompany | null | undefined,
  locale?: string
): CompanyBrand {
  const l = normalizeLocale(locale);
  const name = pick(company?.companyName, l) || "ENSOTEK";
  const logoRaw = chooseLogoUrl(company?.images);
  const logoSrc = toCloudinaryFit(logoRaw, 160, 60);

  return {
    name,
    email: company?.email || "ensotek@ensotek.com.tr",
    phone: company?.phone || "+90 531 880 31 51",
    website: company?.website || "https://ensotek.de",
    socials: company?.socialLinks || {},
    ...(logoSrc ? { logoSrc } : {}),
  };
}

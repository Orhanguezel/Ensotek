import type { NextApiRequest, NextApiResponse } from "next";
import { fetchCompanyServer } from "@/lib/company/api.server";
import { companyToBrand } from "@/lib/company/brand.shared";
import { normalizeLocale } from "@/lib/company/brand.shared";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const localeHeader = String(req.headers["accept-language"] || "").split(",")[0] || "tr";
    const locale = normalizeLocale(localeHeader);

    // Admin panelden "anlık" görmek için ?nocache=1 izinli
    const noCache = req.query?.nocache === "1";

    // Company → Brand map
    const company = await fetchCompanyServer(locale as any, req.headers.cookie, {
      cache: noCache ? "no-store" : "force-cache",
    });
    const brand = companyToBrand(company, locale);

    // Tek JSON payload
    const body = { brand, logoSrc: brand.logoSrc };

    // Edge cache: 600 sn, SWR 1 gün
    if (!noCache) {
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=600, stale-while-revalidate=86400"
      );
    } else {
      res.setHeader("Cache-Control", "no-store");
    }

    // Çokkirilim varyansları (tenant + dil + auth etkisi varsa)
    res.setHeader("Vary", "Accept-Language, Cookie, X-Tenant");

    res.status(200).json(body);
  } catch (e: any) {
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ brand: undefined, logoSrc: undefined, error: true });
  }
}

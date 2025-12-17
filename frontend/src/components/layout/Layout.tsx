// src/components/layout/Layout.tsx
"use client";

import React, { Fragment, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Header from "./header/Header";
import Footer from "./footer/Footer";
import ScrollProgress from "./ScrollProgress";

import type { StaticImageData } from "next/image";

import { useResolvedLocale } from "@/i18n/locale";
import { useGetSiteSettingByKeyQuery } from "@/integrations/rtk/hooks";

import { buildMeta, type MetaInput } from "@/seo/meta";

// HeaderOffcanvas ile aynı mantıkta
type SimpleBrand = {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  socials?: Record<string, string>;
};

type LayoutProps = {
  children: React.ReactNode;

  /**
   * Sayfa override alanları (opsiyonel).
   * Verilmezse DB site_seo (ve fallback) kullanılır.
   */
  title?: string;
  description?: string;
  keywords?: string;

  /** Opsiyonel override brand */
  brand?: SimpleBrand;
  /** Opsiyonel override logo */
  logoSrc?: StaticImageData | string;

  /**
   * Eğer bazı sayfalarda noindex istiyorsan (admin, preview vs.)
   */
  noindex?: boolean;

  /**
   * OG image override (opsiyonel) — yoksa site_seo.open_graph.image/images
   */
  ogImage?: string;
};

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

function absUrl(pathOrUrl: string): string {
  const v = String(pathOrUrl || "").trim();
  if (!v) return BASE_URL;
  if (/^https?:\/\//i.test(v)) return v;
  return `${BASE_URL}${v.startsWith("/") ? v : `/${v}`}`;
}

function stripHashQuery(asPath: string): string {
  // canonical için query/hash istemiyorsan:
  const [pathOnly] = asPath.split("#");
  const [pathname] = pathOnly.split("?");
  return pathname || "/";
}

export default function Layout({
  children,
  title,
  description,
  keywords,
  brand,
  logoSrc,
  noindex,
  ogImage,
}: LayoutProps) {
  const router = useRouter();
  const locale = useResolvedLocale();

  // 1) SEO kaydı (DB) — site_seo / seo fallback mantığını serverMetadata zaten yapıyordu.
  // Client tarafında da aynı fallback’i uygulayalım:
  const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({ key: "seo", locale });
  const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({ key: "site_seo", locale });

  const seo = useMemo(() => {
    // Öncelik: seo -> site_seo
    const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
    return raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
  }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

  // 2) Varsayılan meta alanları (DB’den)
  const seoTitleDefault = String(seo?.title_default ?? "").trim();
  const seoDescription = String(seo?.description ?? "").trim();
  const seoSiteName = String(seo?.site_name ?? "").trim();

  const og = (seo?.open_graph && typeof seo.open_graph === "object") ? seo.open_graph : {};
  const ogImage1 =
    (typeof ogImage === "string" && ogImage.trim())
      ? ogImage.trim()
      : (typeof og?.image === "string" && og.image.trim())
        ? og.image.trim()
        : Array.isArray(og?.images) && og.images[0]
          ? String(og.images[0]).trim()
          : "";

  const tw = (seo?.twitter && typeof seo.twitter === "object") ? seo.twitter : {};
  const twitterCard = String(tw?.card ?? "").trim() || "summary_large_image";
  const twitterSite = typeof tw?.site === "string" ? tw.site.trim() : "";
  const twitterCreator = typeof tw?.creator === "string" ? tw.creator.trim() : "";

  // 3) Sayfa override > DB fallback
  const finalTitle = (title && title.trim()) || seoTitleDefault || "Ensotek";
  const finalDescription = (description && description.trim()) || seoDescription || "";
  const finalKeywords = (keywords && keywords.trim()) || String(seo?.keywords ?? "").trim() || "";

  // 4) Canonical + OG url
  const canonicalPath = stripHashQuery(router.asPath || "/");
  const canonical = absUrl(canonicalPath);

  // 5) Brand + logo (Header için)
  const { data: contactInfoSetting } = useGetSiteSettingByKeyQuery({ key: "contact_info", locale });
  const { data: companyBrandSetting } = useGetSiteSettingByKeyQuery({ key: "company_brand", locale });

  const { normalizedBrand, logoHrefFromSettings } = useMemo(() => {
    const contact = (contactInfoSetting?.value ?? {}) as any;
    const brandVal = (companyBrandSetting?.value ?? {}) as any;

    const name =
      (brandVal.name as string) ||
      (contact.companyName as string) ||
      "Ensotek";

    const website =
      (brandVal.website as string) ||
      (contact.website as string) ||
      "https://ensotek.de";

    const phones = Array.isArray(contact.phones) ? contact.phones : [];
    const phoneVal =
      (brandVal.phone as string | undefined) ||
      (phones[0] as string | undefined) ||
      (contact.whatsappNumber as string | undefined) ||
      "+90 212 000 00 00";

    const emailVal =
      (brandVal.email as string | undefined) ||
      (contact.email as string | undefined) ||
      "info@ensotek.com";

    const socials: Record<string, string> = {
      ...(brandVal.socials as Record<string, string> | undefined),
    };

    const logoObj =
      (brandVal.logo ||
        (Array.isArray(brandVal.images) ? brandVal.images[0] : null) ||
        {}) as { url?: string; width?: number; height?: number };

    const logoHref =
      (logoObj.url && String(logoObj.url).trim()) ||
      "https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp";

    return {
      normalizedBrand: {
        name,
        website: website?.trim() || "",
        phone: phoneVal?.trim() || "",
        email: emailVal?.trim() || "",
        socials,
      } as SimpleBrand,
      logoHrefFromSettings: logoHref,
    };
  }, [contactInfoSetting?.value, companyBrandSetting?.value]);

  const effectiveBrand: SimpleBrand = brand ?? normalizedBrand;

  const headerLogoSrc: StaticImageData | string | undefined =
    logoSrc || logoHrefFromSettings || undefined;

  const preloadLogoHref =
    typeof headerLogoSrc === "string" ? headerLogoSrc : logoHrefFromSettings;

  // 6) Head tag’lerini seo/meta.ts ile üret
  const headMetaSpecs = useMemo(() => {
    const meta: MetaInput = {
      title: finalTitle,
      description: finalDescription,
      canonical,
      url: canonical,
      image: ogImage1 ? absUrl(ogImage1) : undefined,
      siteName: seoSiteName || effectiveBrand.name || "Ensotek",
      // OG locale burada istersen tr_TR gibi basabilirsin (opsiyonel)
      // locale: "tr_TR",
      noindex: !!noindex,

      twitterCard,
      twitterSite: twitterSite || undefined,
      twitterCreator: twitterCreator || undefined,
    };

    return buildMeta(meta);
  }, [
    finalTitle,
    finalDescription,
    canonical,
    ogImage1,
    seoSiteName,
    effectiveBrand.name,
    noindex,
    twitterCard,
    twitterSite,
    twitterCreator,
  ]);

  return (
    <Fragment>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />

        <title>{finalTitle}</title>

        {/* Eski keywords alanın varsa tutuyoruz (isteğe bağlı) */}
        {finalKeywords ? <meta name="keywords" content={finalKeywords} /> : null}

        {/* meta.ts çıktıları */}
        {headMetaSpecs.map((spec, idx) => {
          if (spec.kind === "link") {
            return <link key={`l:${spec.rel}:${idx}`} rel={spec.rel} href={spec.href} />;
          }
          if (spec.kind === "meta-name") {
            return <meta key={`n:${spec.key}:${idx}`} name={spec.key} content={spec.value} />;
          }
          return <meta key={`p:${spec.key}:${idx}`} property={spec.key} content={spec.value} />;
        })}

        {/* Logo preload */}
        {preloadLogoHref ? <link rel="preload" as="image" href={preloadLogoHref} /> : null}
      </Head>

      <div className="my-app">
        <Header brand={effectiveBrand} logoSrc={headerLogoSrc} />
        <main>{children}</main>
        <Footer />
        <ScrollProgress />
      </div>
    </Fragment>
  );
}

// src/components/layout/Layout.tsx
"use client";

import React, { Fragment, useMemo } from "react";
import Head from "next/head";

import Header from "./header/Header";
import Footer from "./footer/Footer";
import ScrollProgress from "./ScrollProgress";

import type { CompanyBrand } from "@/lib/company/brand.shared";
import type { StaticImageData } from "next/image";

import { useResolvedLocale } from "@/lib/i18n/locale";
import { useGetSiteSettingByKeyQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";

type LayoutProps = {
  children: React.ReactNode;
  /** Sayfa özel title – verilmezse site_settings.site_meta_default'tan gelir */
  title?: string;
  /** Sayfa özel description – verilmezse site_settings.site_meta_default'tan gelir */
  description?: string;
  /** Sayfa özel keywords – verilmezse site_settings.site_meta_default'tan gelir */
  keywords?: string;
  brand?: CompanyBrand;
  logoSrc?: StaticImageData | string;
};

const Layout = ({
  children,
  title,
  description,
  keywords,
  brand,
  logoSrc,
}: LayoutProps) => {
  const locale = useResolvedLocale();

  // 1) Varsayılan meta bilgileri (title/description/keywords) DB'den
  // site_settings:
  //   key: "site_meta_default"
  //   locale: "tr" | "en" | "de"
  //   value: { "title": "...", "description": "...", "keywords": "..." }
  const { data: metaSetting } = useGetSiteSettingByKeyQuery({
    key: "site_meta_default",
    locale,
  });

  const metaFromSettings = useMemo(() => {
    const raw = metaSetting?.value;
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      const obj = raw as {
        title?: string;
        description?: string;
        keywords?: string;
      };
      return {
        title: (obj.title || "").trim(),
        description: (obj.description || "").trim(),
        keywords: (obj.keywords || "").trim(),
      };
    }
    return {
      title: "",
      description: "",
      keywords: "",
    };
  }, [metaSetting]);

  const finalTitle = title || metaFromSettings.title || "Ensotek";
  const finalDescription = description || metaFromSettings.description || "";
  const finalKeywords = keywords || metaFromSettings.keywords || "";

  // 2) Logo preload için company_brand'tan logo.url oku (eğer logoSrc string değilse)
  const { data: brandSetting } = useGetSiteSettingByKeyQuery({
    key: "company_brand",
    locale,
  });

  const logoHref = useMemo(() => {
    // Eğer dışarıdan string logo gelmişse onu kullan
    if (typeof logoSrc === "string" && logoSrc.trim()) {
      return logoSrc.trim();
    }

    const raw = brandSetting?.value;
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      const obj = raw as {
        logo?: { url?: string; width?: number; height?: number };
        images?: Array<{ type?: string; url?: string }>;
      };

      const fromLogo = obj.logo?.url;
      if (fromLogo && fromLogo.trim()) return fromLogo.trim();

      if (Array.isArray(obj.images) && obj.images.length) {
        const logoImg =
          obj.images.find((img) => img.type === "logo") || obj.images[0];
        if (logoImg?.url && logoImg.url.trim()) return logoImg.url.trim();
      }
    }

    return undefined;
  }, [logoSrc, brandSetting]);

  // Header'a geçecek logoSrc: prop > DB logo > (yoksa undefined)
  const headerLogoSrc: StaticImageData | string | undefined =
    logoSrc || logoHref;

  return (
    <Fragment>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <title>{finalTitle}</title>
        {finalKeywords && (
          <meta name="keywords" content={finalKeywords} />
        )}
        {finalDescription && (
          <meta name="description" content={finalDescription} />
        )}

        {/* Ana logo biliniyorsa preload et */}
        {logoHref ? <link rel="preload" as="image" href={logoHref} /> : null}
      </Head>

      <div className="my-app">
        <Header brand={brand} logoSrc={headerLogoSrc} />
        <main>{children}</main>
        <Footer />
        <ScrollProgress />
      </div>
    </Fragment>
  );
};

export default Layout;

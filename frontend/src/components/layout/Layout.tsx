// src/components/layout/Layout.tsx
"use client";

import React, { Fragment, useMemo } from "react";
import Head from "next/head";

import Header from "./header/Header";
import Footer from "./footer/Footer";
import ScrollProgress from "./ScrollProgress";

import type { StaticImageData } from "next/image";

import { useResolvedLocale } from "@/i18n/locale";
import { useGetSiteSettingByKeyQuery } from "@/integrations/rtk/endpoints/site_settings.endpoints";

// HeaderOffcanvas'taki SimpleBrand ile aynı mantıkta basit tip
type SimpleBrand = {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  socials?: Record<string, string>;
};

type LayoutProps = {
  children: React.ReactNode;
  /** Sayfa özel title – verilmezse site_settings.site_meta_default'tan gelir */
  title?: string;
  /** Sayfa özel description – verilmezse site_settings.site_meta_default'tan gelir */
  description?: string;
  /** Sayfa özel keywords – verilmezse site_settings.site_meta_default'tan gelir */
  keywords?: string;
  /** Opsiyonel override brand; gelmezse site_settings.company_brand + contact_info'dan hesaplanır */
  brand?: SimpleBrand;
  /** Opsiyonel override logo; gelmezse company_brand.logo / images'tan gelir */
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

  // 2) site_settings → company_brand + contact_info’dan marka + logo çıkar
  const { data: contactInfoSetting } = useGetSiteSettingByKeyQuery({
    key: "contact_info",
    locale,
  });

  const { data: companyBrandSetting } = useGetSiteSettingByKeyQuery({
    key: "company_brand",
    locale,
  });

  const {
    normalizedBrand,
    logoHrefFromSettings,
  } = useMemo(() => {
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
      // hard fallback – Cloudinary logo
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
  }, [contactInfoSetting, companyBrandSetting]);

  // Dışarıdan brand geldiyse override, yoksa DB'den normalize edilen
  const effectiveBrand: SimpleBrand = brand ?? normalizedBrand;

  // Header'a geçecek logoSrc: prop > DB logo > (yoksa undefined)
  const headerLogoSrc: StaticImageData | string | undefined =
    logoSrc || logoHrefFromSettings || undefined;

  // Preload için kullanılacak logo HREF (sadece string olması önemli)
  const preloadLogoHref =
    typeof headerLogoSrc === "string" ? headerLogoSrc : logoHrefFromSettings;

  return (
    <Fragment>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <title>{finalTitle}</title>
        {finalKeywords && <meta name="keywords" content={finalKeywords} />}
        {finalDescription && (
          <meta name="description" content={finalDescription} />
        )}

        {/* Ana logo biliniyorsa preload et */}
        {preloadLogoHref ? (
          <link rel="preload" as="image" href={preloadLogoHref} />
        ) : null}
      </Head>

      <div className="my-app">
        <Header brand={effectiveBrand} logoSrc={headerLogoSrc} />
        <main>{children}</main>
        <Footer />
        <ScrollProgress />
      </div>
    </Fragment>
  );
};

export default Layout;

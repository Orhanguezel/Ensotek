// =============================================================
// FILE: src/pages/faqs.tsx
// Ensotek – Faqs Page (full list) + SEO
//   - Route: /faqs
//   - Layout: Banner + FaqsPageContent + Feedback
//   - i18n UI: site_settings.ui_faqs
//   - SEO: seo -> site_seo fallback + canonical + OG/Twitter
// =============================================================

"use client";

import React, { useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Banner from "@/components/layout/banner/Breadcrum";
import FaqsPageContent from "@/components/containers/faqs/FaqsPageContent";
import Feedback from "@/components/containers/feedback/Feedback";

// i18n
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";
import { localizePath } from "@/i18n/url";

// SEO
import { buildMeta } from "@/seo/meta";
import {
    asObj,
    absUrl,
    pickFirstImageFromSeo,
    buildCanonical,
} from "@/seo/pageSeo";

// data
import { useGetSiteSettingByKeyQuery } from "@/integrations/rtk/hooks";

const FAQS_PATH = "/faqs";

const FaqsPage: React.FC = () => {
    const router = useRouter();
    const locale = useResolvedLocale();

    // UI section
    const { ui } = useUiSection("ui_faqs", locale);

    // Banner title (UI)
    const bannerTitle = ui(
        "ui_faqs_page_title",
        locale === "tr" ? "Sıkça Sorulan Sorular" : "FAQs",
    );

    // Global SEO settings (seo -> site_seo fallback)
    const { data: seoSettingPrimary } = useGetSiteSettingByKeyQuery({
        key: "seo",
        locale,
    });
    const { data: seoSettingFallback } = useGetSiteSettingByKeyQuery({
        key: "site_seo",
        locale,
    });

    const seo = useMemo(() => {
        const raw = (seoSettingPrimary?.value ?? seoSettingFallback?.value) as any;
        return asObj(raw) ?? {};
    }, [seoSettingPrimary?.value, seoSettingFallback?.value]);

    // --- SEO: Title/Description ---
    const titleFallback = ui(
        "ui_faqs_page_title",
        locale === "tr" ? "Sıkça Sorulan Sorular" : "FAQs",
    );

    const pageTitleRaw = String(titleFallback || "").trim();

    const descFallback =
        locale === "tr"
            ? "Ensotek hakkında sıkça sorulan sorular ve cevapları."
            : "Frequently asked questions and answers about Ensotek.";

    // İstersen ui_faqs içine description key'i ekleyip buradan da besleyebiliriz.
    const pageDescRaw =
        String(ui("ui_faqs_page_description", descFallback) || "").trim() ||
        String(seo?.description ?? "").trim() ||
        "";

    const canonical = useMemo(() => {
        return buildCanonical({
            asPath: router.asPath,
            locale,
            fallbackPathname: FAQS_PATH,
            localizePath,
        });
    }, [router.asPath, locale]);

    const seoSiteName = String(seo?.site_name ?? "").trim() || "Ensotek";
    const titleTemplate =
        String(seo?.title_template ?? "").trim() || "%s | Ensotek";

    const pageTitle = useMemo(() => {
        const t = titleTemplate.includes("%s")
            ? titleTemplate.replace("%s", pageTitleRaw)
            : pageTitleRaw;
        return String(t).trim();
    }, [titleTemplate, pageTitleRaw]);

    const ogImage = useMemo(() => {
        const fallbackSeoImg = pickFirstImageFromSeo(seo);
        const fallback = fallbackSeoImg ? absUrl(fallbackSeoImg) : "";
        return fallback || absUrl("/favicon.ico");
    }, [seo]);

    const headSpecs = useMemo(() => {
        const tw = asObj(seo?.twitter) || {};
        const robots = asObj(seo?.robots) || {};
        const noindex = typeof robots.noindex === "boolean" ? robots.noindex : false;

        return buildMeta({
            title: pageTitle,
            description: pageDescRaw,
            canonical,
            url: canonical,
            image: ogImage || undefined,
            siteName: seoSiteName,
            noindex,

            twitterCard: String(tw.card ?? "").trim() || "summary_large_image",
            twitterSite: typeof tw.site === "string" ? tw.site.trim() : undefined,
            twitterCreator:
                typeof tw.creator === "string" ? tw.creator.trim() : undefined,
        });
    }, [seo, pageTitle, pageDescRaw, canonical, ogImage, seoSiteName]);

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                {headSpecs.map((spec, idx) => {
                    if (spec.kind === "link") {
                        return (
                            <link
                                key={`l:${spec.rel}:${idx}`}
                                rel={spec.rel}
                                href={spec.href}
                            />
                        );
                    }
                    if (spec.kind === "meta-name") {
                        return (
                            <meta
                                key={`n:${spec.key}:${idx}`}
                                name={spec.key}
                                content={spec.value}
                            />
                        );
                    }
                    return (
                        <meta
                            key={`p:${spec.key}:${idx}`}
                            property={spec.key}
                            content={spec.value}
                        />
                    );
                })}
            </Head>

            <Banner title={bannerTitle} />
            <FaqsPageContent />
            <Feedback />
        </>
    );
};

export default FaqsPage;

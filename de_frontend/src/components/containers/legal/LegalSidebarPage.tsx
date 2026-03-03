"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useCustomPages } from "@/features/custom-pages/customPages.action";
import type { CustomPage } from "@/features/custom-pages/customPages.type";

type Props = {
  slug: string;
};

function sortByOrder(a: CustomPage, b: CustomPage): number {
  const orderA = a.order_num ?? a.display_order ?? 0;
  const orderB = b.order_num ?? b.display_order ?? 0;
  if (orderA !== orderB) return orderA - orderB;
  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
}

function extractHtmlFromContent(content: unknown): string {
  if (!content) return "";
  if (typeof content === "object") {
    const html = (content as { html?: unknown }).html;
    return typeof html === "string" ? html.trim() : "";
  }
  if (typeof content !== "string") return "";
  const trimmed = content.trim();
  if (!trimmed) return "";
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed.html === "string") return parsed.html.trim();
  } catch {
    // plain html
  }
  return trimmed;
}

function normalizeLegalHtml(html: string): string {
  if (!html) return "";
  let out = html.trim();
  out = out.replace(/^<section\b[^>]*>/i, "");
  out = out.replace(/<\/section>\s*$/i, "");
  out = out.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, "");
  return out.trim();
}

const LegalSidebarPage = ({ slug }: Props) => {
  const t = useTranslations("ensotek.legalPages");
  const locale = useLocale();

  const { data, isLoading } = useCustomPages({
    module_key: "legal",
    is_published: true,
    limit: 50,
  });

  const allPages = useMemo(
    () => (data?.data ?? []).slice().sort(sortByOrder),
    [data],
  );

  const currentPage = useMemo(
    () => allPages.find((p) => p.slug === slug) ?? null,
    [allPages, slug],
  );

  const html = useMemo(
    () => normalizeLegalHtml(extractHtmlFromContent(currentPage?.content)),
    [currentPage],
  );

  if (isLoading) {
    return (
      <div className="container pt-120 pb-120 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (!currentPage) {
    return (
      <section className="pt-120 pb-120">
        <div className="container text-center">
          <p className="text-muted mb-4">{t("noResults")}</p>
          <Link href={`/${locale}/legal`} className="tp-btn tp-btn-border">
            {t("backToLegal")}
          </Link>
        </div>
      </section>
    );
  }

  const updatedAt = new Date(currentPage.updated_at).toLocaleDateString(
    locale === "de" ? "de-DE" : locale === "tr" ? "tr-TR" : "en-GB",
    { day: "2-digit", month: "long", year: "numeric" },
  );

  return (
    <section className="technical__area pt-60 pb-120">
      <div className="container">
        <div className="row g-5">

          {/* ── Sidebar ── */}
          <div className="col-lg-3">
            <div style={{ position: "sticky", top: 24 }}>
              <p
                className="mb-3 text-uppercase"
                style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#94a3b8" }}
              >
                {t("sectionTitle")}
              </p>
              <nav>
                {allPages.map((p) => {
                  const isActive = p.slug === slug;
                  return (
                    <Link
                      key={p.id}
                      href={`/${locale}/legal/${p.slug}`}
                      className="d-flex align-items-center gap-2 text-decoration-none mb-1 px-3 py-2 rounded-2"
                      style={{
                        fontSize: 14,
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? "#2563eb" : "#475569",
                        background: isActive ? "#eff6ff" : "transparent",
                        transition: "all .2s",
                      }}
                    >
                      {/* File icon */}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={isActive ? "#2563eb" : "#94a3b8"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ flexShrink: 0 }}
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <span style={{ lineHeight: 1.3 }}>{p.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* ── Main content ── */}
          <div className="col-lg-9">
            {/* Updated date */}
            <p className="mb-3" style={{ fontSize: 13, color: "#94a3b8" }}>
              {t("lastUpdated")}: {updatedAt}
            </p>

            <div className="blog__content-wrapper" style={{ border: "none", padding: 0 }}>
              {html ? (
                <>
                  <style>{`
                    .legal-cms .container,
                    .legal-cms .mx-auto {
                      max-width: 100% !important;
                      margin: 0 !important;
                      padding: 0 !important;
                    }
                    .legal-cms h2,
                    .legal-cms h3 {
                      margin: 0 0 14px;
                      color: #0f172a;
                      font-weight: 700;
                    }
                    .legal-cms h2 { font-size: 28px; line-height: 1.25; }
                    .legal-cms h3 { font-size: 22px; line-height: 1.3; }
                    .legal-cms p,
                    .legal-cms li {
                      font-size: 17px;
                      line-height: 1.8;
                      color: #334155;
                    }
                    .legal-cms ul,
                    .legal-cms ol {
                      margin: 0 0 20px;
                      padding-left: 22px;
                    }
                    .legal-cms .grid { display: block !important; }
                    .legal-cms .rounded-2xl,
                    .legal-cms .border {
                      border: 0 !important;
                      border-radius: 0 !important;
                    }
                    .legal-cms .p-6 { padding: 0 !important; }
                    .legal-cms .mb-6,
                    .legal-cms .mb-8,
                    .legal-cms .mb-10 { margin-bottom: 26px !important; }
                    .legal-cms .bg-slate-900,
                    .legal-cms .bg-white,
                    .legal-cms .bg-gradient-to-br { background: transparent !important; }
                  `}</style>
                  <div
                    className="tp-postbox-details legal-cms"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                </>
              ) : (
                <p>{currentPage.summary ?? t("noResults")}</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LegalSidebarPage;

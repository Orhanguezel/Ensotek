"use client";

import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useCustomPages } from "@/features/custom-pages/customPages.action";

function sortByOrder(a: { order_num?: number; display_order?: number; created_at?: string }, b: typeof a): number {
  const orderA = a.order_num ?? a.display_order ?? 0;
  const orderB = b.order_num ?? b.display_order ?? 0;
  if (orderA !== orderB) return orderA - orderB;
  return new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime();
}

const LegalIndexPage = () => {
  const t = useTranslations("ensotek.legalPages");
  const locale = useLocale();

  const { data, isLoading } = useCustomPages({
    module_key: "legal",
    is_published: true,
    limit: 50,
  });

  const pages = (data?.data ?? []).slice().sort(sortByOrder);

  if (isLoading) {
    return (
      <div className="container pt-120 pb-120 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <section className="pt-120 pb-120">
        <div className="container text-center">
          <p className="text-muted">{t("noResults")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="technical__area pt-80 pb-120">
      <div className="container">
        <div className="row g-4">
          {pages.map((page) => (
            <div key={page.id} className="col-md-6 col-lg-4">
              <Link
                href={`/${locale}/legal/${page.slug}`}
                className="d-block h-100 text-decoration-none"
                style={{ color: "inherit" }}
              >
                <div
                  className="h-100 p-4 rounded-3"
                  style={{
                    border: "1px solid #e2e8f0",
                    transition: "all .25s",
                    background: "#fff",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#2563eb";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(37,99,235,.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  {/* Icon */}
                  <div
                    className="mb-3 d-flex align-items-center justify-content-center rounded-3"
                    style={{ width: 44, height: 44, background: "#eff6ff" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>

                  {/* Title */}
                  <h3
                    className="mb-2"
                    style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", lineHeight: 1.35 }}
                  >
                    {page.title}
                  </h3>

                  {/* Summary */}
                  {page.summary && (
                    <p
                      className="mb-3"
                      style={{
                        fontSize: 14,
                        color: "#64748b",
                        lineHeight: 1.6,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {page.summary}
                    </p>
                  )}

                  {/* CTA */}
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#2563eb" }}>
                    {t("readDoc")} →
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LegalIndexPage;

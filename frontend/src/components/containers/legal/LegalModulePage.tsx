"use client";

import React, { useMemo } from "react";
import { useCustomPages } from "@/features/custom-pages/customPages.action";
import type { CustomPage } from "@/features/custom-pages/customPages.type";
import { useTranslations } from "next-intl";

type LegalModulePageProps = {
  moduleKey: string;
};

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
    if (parsed && typeof parsed.html === "string") {
      return parsed.html.trim();
    }
  } catch {
    // content is plain html/text
  }

  return trimmed;
}

function normalizeLegalHtml(html: string): string {
  if (!html) return "";
  let out = html.trim();

  // CMS content often ships with full section/container wrappers. We render inside our own layout.
  out = out.replace(/^<section\b[^>]*>/i, "");
  out = out.replace(/<\/section>\s*$/i, "");
  // Keep only one title source (breadcrumb/title), remove first h1 from body.
  out = out.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, "");

  return out.trim();
}

function sortByPriority(a: CustomPage, b: CustomPage): number {
  const orderA = a.order_num ?? a.display_order ?? 0;
  const orderB = b.order_num ?? b.display_order ?? 0;
  if (orderA !== orderB) return orderA - orderB;

  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
}

const LegalModulePage = ({ moduleKey }: LegalModulePageProps) => {
  const t = useTranslations("ensotek.customPage");
  const { data, isLoading } = useCustomPages({
    module_key: moduleKey,
    is_published: true,
  });

  const page = useMemo(() => {
    const items = (data?.data || []).slice().sort(sortByPriority);
    return items[0] || null;
  }, [data]);

  const html = useMemo(
    () => normalizeLegalHtml(extractHtmlFromContent(page?.content)),
    [page],
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

  if (!page) {
    return (
      <section className="pt-120 pb-120">
        <div className="container text-center">
          <p>{t("noItems")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="technical__area pt-80 pb-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-11">
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
                    .legal-cms h2 {
                      font-size: 34px;
                      line-height: 1.25;
                    }
                    .legal-cms h3 {
                      font-size: 26px;
                      line-height: 1.3;
                    }
                    .legal-cms p,
                    .legal-cms li {
                      font-size: 18px;
                      line-height: 1.8;
                      color: #334155;
                    }
                    .legal-cms ul,
                    .legal-cms ol {
                      margin: 0 0 20px;
                      padding-left: 22px;
                    }
                    .legal-cms .grid {
                      display: block !important;
                    }
                    .legal-cms .rounded-2xl,
                    .legal-cms .border {
                      border: 0 !important;
                      border-radius: 0 !important;
                    }
                    .legal-cms .p-6 {
                      padding: 0 !important;
                    }
                    .legal-cms .mb-6,
                    .legal-cms .mb-8,
                    .legal-cms .mb-10 {
                      margin-bottom: 26px !important;
                    }
                    .legal-cms .bg-slate-900,
                    .legal-cms .bg-white,
                    .legal-cms .bg-gradient-to-br {
                      background: transparent !important;
                    }
                  `}</style>
                  <div
                    className="tp-postbox-details legal-cms"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                </>
              ) : (
                <p>{page.summary || t("summaryFallback")}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegalModulePage;

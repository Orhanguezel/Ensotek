// =============================================================
// FILE: src/components/containers/service/ServiceMore.tsx
// "More services" section for Service Detail
// =============================================================

"use client";

import React, { useMemo } from "react";
import Link from "next/link";

import { useListServicesPublicQuery } from "@/integrations/rtk/hooks";
import type { ServiceDto } from "@/integrations/types/services.types";

import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";


import { toCdnSrc } from "@/shared/media";
import { excerpt } from "@/shared/text";
import { localizePath } from "@/i18n/url";

import { FiArrowRight } from "react-icons/fi";

const FALLBACK_IMG = "/img/project/project-thumb.jpg";

interface ServiceMoreProps {
  currentSlug?: string;
}

const ServiceMore: React.FC<ServiceMoreProps> = ({ currentSlug }) => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_services", locale);

  // ✅ locale & default_locale backend'e gönderiyoruz
  const { data, isLoading } = useListServicesPublicQuery({
    limit: 6,
    order: "display_order.asc,created_at.desc",
    locale,
    default_locale: "tr",
  });

  const items: ServiceDto[] = useMemo(() => {
    if (!data?.items) return [];

    const filtered = data.items.filter((s) => {
      if (!s.slug) return true;
      if (!currentSlug) return true;
      return s.slug !== currentSlug;
    });

    return filtered.slice(0, 3);
  }, [data, currentSlug]);

  if (!items.length && !isLoading) {
    return null;
  }

  return (
    <div className="service__area pt-60 pb-90 service__bg-2">
      <div className="container">
        <div className="row tik">
          <div className="col-12">
            <div className="section__title-wrapper text-center mb-50">
              <span className="section__subtitle">
                {ui(
                  "ui_services_more_subtitle",
                  "Discover our other services",
                )}
              </span>
              <h2 className="section__title">
                {ui(
                  "ui_services_more_title",
                  "You may also be interested in",
                )}
              </h2>
            </div>
          </div>
        </div>

        <div className="row tik">
          {items.map((s) => {
            const imgBase =
              (s.featured_image_url ||
                s.image_url ||
                s.featured_image ||
                "")?.trim() || "";
            const src =
              toCdnSrc(imgBase, 640, 420, "fill") || FALLBACK_IMG;

            const title =
              s.name ||
              ui("ui_services_placeholder_title", "Our service");

            const summaryRaw = s.description || s.includes || "";
            const summary = summaryRaw
              ? excerpt(String(summaryRaw), 140)
              : ui(
                "ui_services_placeholder_summary",
                "Service description is coming soon.",
              );

            const href = s.slug
              ? localizePath(
                locale,
                `/service/${encodeURIComponent(s.slug)}`,
              )
              : localizePath(locale, "/service");

            return (
              <div
                className="col-xl-4 col-lg-6 col-md-6"
                key={s.id}
              >
                <div className="service__item mb-30">
                  <div
                    className="service__thumb include__bg service-two-cmn"
                    style={{
                      backgroundImage: `url('${src}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    aria-hidden="true"
                  />
                  <div className="service__content">
                    <h3>
                      <Link href={href}>{title}</Link>
                    </h3>
                    <p>{summary}</p>
                  </div>
                  <div className="service__link">
                    <Link
                      href={href}
                      aria-label={`${title} — ${ui(
                        "ui_services_details_aria",
                        "view service details",
                      )}`}
                    >
                      <FiArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="col-12 mt-10">
              <div
                className="skeleton-line"
                style={{ height: 8 }}
                aria-hidden
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceMore;

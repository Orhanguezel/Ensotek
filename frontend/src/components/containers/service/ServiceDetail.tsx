// =============================================================
// FILE: src/components/containers/service/ServiceDetail.tsx
// Public Service Detail Container
// =============================================================

"use client";

import React, { useMemo } from "react";

import {
  useGetServiceBySlugPublicQuery,
  useListServiceImagesPublicQuery,
} from "@/integrations/rtk/endpoints/services.public.endpoints";

import type { ServiceImageDto } from "@/integrations/types/services.types";

import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";


import { toCdnSrc } from "@/shared/media";
import { excerpt } from "@/shared/text";

import { localizePath } from "@/i18n/url";
import Link from "next/link";
import Image from "next/image";

const FALLBACK_IMG = "/img/project/project-thumb.jpg";

interface ServiceDetailProps {
  slug: string;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ slug }) => {
  const locale = useResolvedLocale();
  const { ui } = useUiSection("ui_services", locale);

  // ✅ RTK endpoint argümanı: { slug, locale?, default_locale? }
  const {
    data: service,
    isLoading,
    isError,
  } = useGetServiceBySlugPublicQuery(
    { slug, locale },
    {
      skip: !slug,
    },
  );

  // ✅ RTK endpoint argümanı: { serviceId, locale?, default_locale? }
  const {
    data: images,
    isLoading: isImagesLoading,
  } = useListServiceImagesPublicQuery(
    service?.id
      ? { serviceId: service.id, locale }
      : // skip true iken bu argüman kullanılmayacak
      { serviceId: "", locale },
    {
      skip: !service?.id,
    },
  );

  const mainImageSrc = useMemo(() => {
    const base =
      (service?.featured_image_url ||
        service?.image_url ||
        service?.featured_image ||
        "")?.trim() || "";

    if (!base) return FALLBACK_IMG;
    return toCdnSrc(base, 960, 540, "fill") || FALLBACK_IMG;
  }, [service]);

  const gallery: ServiceImageDto[] = useMemo(() => {
    if (!Array.isArray(images)) return [];
    return images.filter((img) => img.is_active);
  }, [images]);

  const title = service?.name || ui("ui_services_detail_title", "Service");
  const summary =
    service?.description ||
    service?.includes ||
    ui(
      "ui_services_placeholder_summary",
      "Service description is coming soon.",
    );

  const backHref = localizePath(locale, "/service");

  if (isLoading) {
    return (
      <div className="service__area pt-120 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-8">
              <div className="skeleton-line" style={{ height: 32 }} />
              <div className="skeleton-line mt-10" style={{ height: 20 }} />
              <div className="skeleton-line mt-10" style={{ height: 20 }} />
              <div className="skeleton-line mt-10" style={{ height: 220 }} />
            </div>
            <div className="col-xl-4 col-lg-4 mt-30 mt-lg-0">
              <div className="skeleton-line" style={{ height: 140 }} />
              <div className="skeleton-line mt-10" style={{ height: 80 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="service__area pt-120 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="section__title mb-15">
                {ui("ui_services_not_found_title", "Service not found")}
              </h2>
              <p className="mb-20">
                {ui(
                  "ui_services_not_found_desc",
                  "The service you are looking for could not be found or is no longer available.",
                )}
              </p>
              <Link href={backHref} className="tp-btn">
                {ui("ui_services_back_to_list", "Back to services")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const shortSummary = excerpt(String(summary), 250);

  const hasGardeningMeta =
    service.area ||
    service.duration ||
    service.maintenance ||
    service.season;

  const hasSoilMeta =
    service.soil_type || service.thickness || service.equipment;

  return (
    <div className="service__area pt-120 pb-90">
      <div className="container">
        <div className="row">
          {/* LEFT: main content */}
          <div className="col-xl-8 col-lg-8">
            <div className="service__details-wrapper mb-40">
              {/* Back link */}
              <div className="mb-25">
                <Link href={backHref} className="back-link d-inline-flex">
                  <span className="me-2">←</span>
                  {ui("ui_services_back_to_list", "Back to services")}
                </Link>
              </div>

              {/* Title & meta */}
              <div className="service__details-title-wrapper mb-25">
                <span className="service__details-tag">
                  {service.type || "service"}
                </span>
                <h2 className="service__details-title">{title}</h2>
                {service.price && (
                  <p className="service__price mt-10">
                    <strong>
                      {ui("ui_services_price_label", "Price")}:
                    </strong>{" "}
                    {service.price}
                  </p>
                )}
              </div>

              {/* Main image */}
              <div className="service__details-thumb mb-30">
                <Image
                  src={mainImageSrc}
                  alt={service.image_alt || String(title)}
                  width={640}
                  height={420}
                  className="img-fluid w-100"
                />
              </div>

              {/* Summary / description */}
              <div className="service__details-content">
                <p>{shortSummary}</p>

                {/* Includes / warranty / material */}
                <div className="service__meta mt-25">
                  <ul>
                    {service.includes && (
                      <li>
                        <span>
                          {ui(
                            "ui_services_includes_label",
                            "Service includes",
                          )}
                          :
                        </span>{" "}
                        {service.includes}
                      </li>
                    )}
                    {service.material && (
                      <li>
                        <span>
                          {ui(
                            "ui_services_material_label",
                            "Material",
                          )}
                          :
                        </span>{" "}
                        {service.material}
                      </li>
                    )}
                    {service.warranty && (
                      <li>
                        <span>
                          {ui("ui_services_warranty_label", "Warranty")}:
                        </span>{" "}
                        {service.warranty}
                      </li>
                    )}
                  </ul>
                </div>

                {/* Type specific meta */}
                {(hasGardeningMeta || hasSoilMeta) && (
                  <div className="service__meta-box mt-30">
                    <h4 className="service__meta-title">
                      {ui(
                        "ui_services_specs_title",
                        "Service specifications",
                      )}
                    </h4>
                    <div className="row">
                      {hasGardeningMeta && (
                        <div className="col-sm-6">
                          <ul className="service__spec-list">
                            {service.area && (
                              <li>
                                <span>
                                  {ui(
                                    "ui_services_area_label",
                                    "Area",
                                  )}
                                  :
                                </span>{" "}
                                {service.area}
                              </li>
                            )}
                            {service.duration && (
                              <li>
                                <span>
                                  {ui(
                                    "ui_services_duration_label",
                                    "Duration",
                                  )}
                                  :
                                </span>{" "}
                                {service.duration}
                              </li>
                            )}
                            {service.maintenance && (
                              <li>
                                <span>
                                  {ui(
                                    "ui_services_maintenance_label",
                                    "Maintenance",
                                  )}
                                  :
                                </span>{" "}
                                {service.maintenance}
                              </li>
                            )}
                            {service.season && (
                              <li>
                                <span>
                                  {ui(
                                    "ui_services_season_label",
                                    "Season",
                                  )}
                                  :
                                </span>{" "}
                                {service.season}
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {hasSoilMeta && (
                        <div className="col-sm-6">
                          <ul className="service__spec-list">
                            {service.soil_type && (
                              <li>
                                <span>
                                  {ui(
                                    "ui_services_soil_type_label",
                                    "Soil type",
                                  )}
                                  :
                                </span>{" "}
                                {service.soil_type}
                              </li>
                            )}
                            {service.thickness && (
                              <li>
                                <span>
                                  {ui(
                                    "ui_services_thickness_label",
                                    "Thickness",
                                  )}
                                  :
                                </span>{" "}
                                {service.thickness}
                              </li>
                            )}
                            {service.equipment && (
                              <li>
                                <span>
                                  {ui(
                                    "ui_services_equipment_label",
                                    "Equipment",
                                  )}
                                  :
                                </span>{" "}
                                {service.equipment}
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Gallery */}
                {gallery.length > 0 && (
                  <div className="service__gallery mt-40">
                    <h4 className="service__gallery-title">
                      {ui(
                        "ui_services_gallery_title",
                        "Service gallery",
                      )}
                    </h4>
                    <div className="row">
                      {gallery.map((img) => {
                        const base =
                          (img.image_url || "")?.trim() || "";
                        const src =
                          toCdnSrc(base, 400, 280, "fill") ||
                          FALLBACK_IMG;

                        return (
                          <div
                            className="col-md-6 col-lg-4 mb-20"
                            key={img.id}
                          >
                            <div className="service__gallery-item">
                              <Image
                                src={src}
                                alt={img.alt || img.title || ""}
                                className="img-fluid w-100"
                                width={400}
                                height={280}
                              />
                              {(img.title || img.caption) && (
                                <div className="service__gallery-caption">
                                  {img.title && (
                                    <strong>{img.title}</strong>
                                  )}
                                  {img.caption && (
                                    <p className="mb-0">
                                      {img.caption}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {isImagesLoading && (
                        <div className="col-12 mt-10">
                          <div
                            className="skeleton-line"
                            style={{ height: 8 }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: sidebar */}
          <div className="col-xl-4 col-lg-4">
            <aside className="service__sidebar">
              <div className="service__widget mb-30">
                <h4 className="service__widget-title">
                  {ui(
                    "ui_services_sidebar_info_title",
                    "Service info",
                  )}
                </h4>
                <ul>
                  <li>
                    <span>
                      {ui(
                        "ui_services_sidebar_type",
                        "Service type",
                      )}
                      :
                    </span>{" "}
                    {service.type}
                  </li>
                  {service.category_id && (
                    <li>
                      <span>
                        {ui(
                          "ui_services_sidebar_category",
                          "Category",
                        )}
                        :
                      </span>{" "}
                      {service.category_id}
                    </li>
                  )}
                  <li>
                    <span>
                      {ui(
                        "ui_services_sidebar_status",
                        "Status",
                      )}
                      :
                    </span>{" "}
                    {service.is_active
                      ? ui("ui_common_active", "Active")
                      : ui("ui_common_passive", "Inactive")}
                  </li>
                </ul>
              </div>

              <div className="service__widget service__cta-widget">
                <h4 className="service__widget-title">
                  {ui(
                    "ui_services_sidebar_cta_title",
                    "Need more information?",
                  )}
                </h4>
                <p>
                  {ui(
                    "ui_services_sidebar_cta_desc",
                    "Contact us to get a custom offer or detailed information about this service.",
                  )}
                </p>
                <Link
                  href={localizePath(locale, "/contact")}
                  className="tp-btn w-100 text-center"
                >
                  {ui("ui_services_sidebar_cta_button", "Contact us")}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;

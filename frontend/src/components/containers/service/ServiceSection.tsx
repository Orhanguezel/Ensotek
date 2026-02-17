"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useServices } from "@/features/services/services.action";

const ServiceSection: React.FC = () => {
  const t = useTranslations("ensotek.features");
  const c = useTranslations("common");
  const { data, isLoading } = useServices({ limit: 3 });

  const services = useMemo(() => {
    const arr = Array.isArray(data) ? data : [];
    return arr.slice(0, 3);
  }, [data]);

  return (
    <section className="service__area service__bg z-index-1 pt-120 pb-90">
      <div className="container">
        <div className="row tik">
          <div className="col-12">
            <div className="section__title-wrapper text-center mb-65">
              <span className="section__subtitle">
                <span>Ensotek</span> {t("subtitle")}
              </span>
              <h2 className="section__title">{t("title")}</h2>
            </div>
          </div>
        </div>

        <div className="row tik" data-aos="fade-left" data-aos-delay="300">
          {services.map((item) => (
            <div className="col-xl-4 col-lg-6 col-md-6" key={item.id}>
              <div className="service__item mb-30">
                <div className="service__thumb include__bg service-two-cmn">
                  <Image
                    src={item.image_url || item.featured_image || "/img/project/project-thumb.jpg"}
                    alt={item.image_alt || item.name}
                    width={640}
                    height={420}
                  />
                </div>

                <div className="service__icon transition-3">
                  <i className="fa-light fa-gears"></i>
                </div>

                <div className="service__content">
                  <h3>
                    <Link href={`/service/${item.slug}`}>{item.name}</Link>
                  </h3>
                  <p>{(item.description || "").replace(/<[^>]*>/g, " ").slice(0, 150)}</p>
                </div>

                <div className="service__link">
                  <Link href={`/service/${item.slug}`} aria-label={item.name}>
                    <i className="fa-regular fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {!isLoading && services.length === 0 ? (
            <div className="col-12 text-center">
              <p>{c("no_data")}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;

"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useCustomPages } from "@/features/custom-pages/customPages.action";
import type { CustomPage } from "@/features/custom-pages/customPages.type";

const NewsSection = () => {
  const t = useTranslations("ensotek.news");

  const { data: newsData, isLoading } = useCustomPages({
    module_key: "news",
    limit: 2,
    is_published: true,
  });

  const items = useMemo(() => {
    const arr = Array.isArray(newsData?.data) ? (newsData.data as CustomPage[]) : [];
    return arr.slice(0, 2);
  }, [newsData]);

  return (
    <section className="blog__area pt-120 pb-90">
      <div className="container">
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          <div className="col-12">
            <div className="section__title-wrapper text-center mb-65">
              <span className="section__subtitle">
                <span>Ensotek</span> {t("subtitle")}
              </span>
              <h2 className="section__title">{t("title")}</h2>
            </div>
          </div>
        </div>

        <div className="row" data-aos="fade-up" data-aos-delay="300">
          {items.map((item) => (
            <div key={item.id} className="col-xl-6 col-lg-6">
              <div className="blog__item-3 mb-30">
                <div className="blog__thumb-3 w-img">
                  <Link href={`/news/${item.slug}`}>
                    <Image
                      src={item.image_url || item.featured_image || "/img/blog/3/1.jpg"}
                      alt={item.featured_image_alt || item.title}
                      width={700}
                      height={420}
                    />
                  </Link>
                </div>

                <div className="blog__content-3">
                  <h3>
                    <Link href={`/news/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p>{(item.summary || "").replace(/<[^>]*>/g, " ").slice(0, 170)}</p>
                  <Link className="link-more" href={`/news/${item.slug}`}>
                    {t("readMore")}
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {!isLoading && items.length === 0 ? (
            <div className="col-12 text-center">
              <p>{t("empty")}</p>
            </div>
          ) : null}
        </div>

        <div className="row">
          <div className="col-12 text-center mt-20">
            <Link href="/news" className="solid__btn">
              {t("title")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;

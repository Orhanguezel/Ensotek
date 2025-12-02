// src/components/containers/banner/Banner.tsx (ya da senin yolun neyse)
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import One from "public/img/shape/breadcrum-1.png.png"; // tasarım dosyası; aynı bırakıldı

// Yeni i18n helper’lar
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";
import { localizePath } from "@/i18n/url";

type Props = { title: string };

const Banner: React.FC<Props> = ({ title }) => {
  // ✅ Ortak locale hook’u (router + app_locales logic içinde)
  const locale = useResolvedLocale();

  // ✅ UI yazıları: DB (ui_banner JSON) + eski i18n + hard fallback
  //   ui_banner site_setting değerinde "ui_breadcrumb_home" key'ini bekliyoruz.
  const { ui } = useUiSection("ui_banner", locale);

  // Ana sayfa linki – locale-aware
  const homeHref = localizePath(locale, "/");

  return (
    <div className="breadcrumb__area">
      {/* Dekoratif, stil aynı; erişilebilirlik için boş alt */}
      <Image className="breadcrumb__shape-2" src={One} alt="" priority />
      <Image className="breadcrumb__shape-1" src={One} alt="" priority />

      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="breadcrumb__wrapper text-center">
              <div className="breadcrumb__title">
                <h2>{title}</h2>
              </div>

              <div className="breadcrumb__menu">
                <nav
                  aria-label="Breadcrumbs"
                  className="breadcrumb-trail breadcrumbs"
                >
                  <ul className="trail-items">
                    <li className="trail-item trail-begin">
                      <span>
                        <Link href={homeHref}>
                          {ui("ui_breadcrumb_home", "Home")}
                        </Link>
                      </span>
                    </li>
                    <span className="trail-separator">/</span>
                    <li className="trail-item trail-end">
                      <span>{title}</span>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;

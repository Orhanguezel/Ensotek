// =============================================================
// FILE: src/components/containers/about/AboutCounter.tsx
// Ensotek – Hakkımızda Sayaçları
//   - Data: statik + site_settings.ui_about_stats
//   - TR/EN çoklu dil
//   - 3 kart: Referanslar, Projeler, Yıllık tecrübe
// =============================================================

"use client";

import React, { useMemo } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

// i18n
import { useResolvedLocale } from "@/i18n/locale";
import { useUiSection } from "@/i18n/uiDb";

const AboutCounter: React.FC = () => {
  // Haber / FAQ patterni gibi kısa locale
  const resolved = useResolvedLocale();
  const locale = (resolved || "tr").split("-")[0];

  const { ui } = useUiSection("ui_about_stats", locale);

  const { ref, inView } = useInView({
    threshold: 0.4,
    triggerOnce: true,
  });

  const stats = useMemo(
    () => [
      {
        id: "refs",
        value: Number(ui("ui_about_stats_refs_value", "120")),
        title: ui(
          "ui_about_stats_refs_title",
          locale === "tr" ? "Sanayi referansımız" : "Industrial references",
        ),
        label: ui(
          "ui_about_stats_refs_label",
          locale === "tr"
            ? "Referans müşteri & tesis"
            : "Reference customers & plants",
        ),
      },
      {
        id: "projects",
        value: Number(ui("ui_about_stats_projects_value", "250")),
        title: ui(
          "ui_about_stats_projects_title",
          locale === "tr" ? "Tamamlanan proje" : "Completed projects",
        ),
        label: ui(
          "ui_about_stats_projects_label",
          locale === "tr"
            ? "Yurtiçi ve yurtdışı projeler"
            : "Domestic and international projects",
        ),
      },
      {
        id: "years",
        value: Number(ui("ui_about_stats_years_value", "20")),
        title: ui(
          "ui_about_stats_years_title",
          locale === "tr" ? "Yıllık tecrübe" : "Years of experience",
        ),
        label: ui(
          "ui_about_stats_years_label",
          locale === "tr"
            ? "Su soğutma ve proses soğutma"
            : "Cooling tower & process cooling",
        ),
      },
    ],
    [ui, locale],
  );

  const suffixLetter = ui("ui_about_stats_suffix_letter", "");
  const suffixPlus = ui("ui_about_stats_suffix_plus", "+");

  return (
    <section className="fact__area pt-120 pb-90 bg-white">
      <div className="container">
        <div
          className="row"
          data-aos="fade-up"
          data-aos-delay="300"
          ref={ref}
        >
          {stats.map((s) => (
            <div className="col-xl-4" key={s.id}>
              <div className="fact__item mb-30">
                <div className="fact__count">
                  <div className="fact__number">
                    <span className="counter">
                      {inView && (
                        <CountUp
                          start={0}
                          end={Number.isFinite(s.value) ? s.value : 0}
                          duration={2.5}
                        />
                      )}
                    </span>
                  </div>
                  <div className="fact__letter">
                    {/* İstersen "k" ya da boş bırak – site_settings’ten geliyor */}
                    <span>{suffixLetter}</span>
                    <span className="plus">{suffixPlus}</span>
                  </div>
                </div>
                <div className="fact__content">
                  <h3>{s.title}</h3>
                  <p>{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutCounter;

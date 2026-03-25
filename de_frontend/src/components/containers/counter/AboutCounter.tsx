"use client";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import { siteSettingsService } from "@/features/site-settings/siteSettings.service";

function useCountUp(end: number, duration: number, inView: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration * 60);
    let raf: number;

    const animate = () => {
      start += step;
      if (start >= end) {
        setValue(end);
        return;
      }
      setValue(Math.floor(start));
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, inView]);

  return value;
}

const AboutCounter = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  const { data: siteSettings } = useQuery({
    queryKey: queryKeys.siteSettings.list(),
    queryFn: siteSettingsService.getAll,
    staleTime: 10 * 60 * 1000,
  });

  const stats = React.useMemo(() => {
    if (!siteSettings) return null;
    const setting = siteSettings.find((s: any) => s.key === "ui_about_stats");
    if (!setting?.value) return null;
    const v = typeof setting.value === "string" ? JSON.parse(setting.value) : setting.value;
    // Strip "ui_about_stats_" prefix if present
    const out: Record<string, string> = {};
    for (const [k, val] of Object.entries(v)) {
      const short = k.startsWith("ui_about_stats_") ? k.slice("ui_about_stats_".length) : k;
      out[short] = String(val ?? "");
    }
    return out;
  }, [siteSettings]);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const yearsNum = parseInt(stats?.years_value || "40", 10) || 40;
  const projectsNum = parseInt(stats?.projects_value || "5000", 10) || 5000;
  const refsNum = parseInt(stats?.refs_value || "1500", 10) || 1500;

  const suffixPlus = stats?.suffix_plus || "+";
  const suffixLetter = stats?.suffix_letter || "";

  const count1 = useCountUp(yearsNum, 3, inView);
  const count2 = useCountUp(projectsNum, 3, inView);
  const count3 = useCountUp(refsNum, 3, inView);

  const items = [
    { count: count1, title: stats?.years_title || "Jahre Erfahrung", label: stats?.years_label || "Wasserkühlung und Prozesskühlung" },
    { count: count2, title: stats?.projects_title || "Abgeschlossene Projekte", label: stats?.projects_label || "Nationale und internationale Projekte" },
    { count: count3, title: stats?.refs_title || "Industrie-Referenzen", label: stats?.refs_label || "Referenzkunden & Anlagen" },
  ];

  return (
    <section className="fact__area pt-120 pb-90 bg-white">
      <div className="container">
        <div className="row" data-aos="fade-up" data-aos-delay="300" ref={ref}>
          {items.map((item, i) => (
            <div key={i} className="col-xl-4">
              <div className="fact__item mb-30">
                <div className="fact__count">
                  <div className="fact__number">
                    <span className="counter">{item.count}</span>
                  </div>
                  <div className="fact__letter">
                    {suffixLetter && <span>{suffixLetter}</span>}
                    {suffixPlus && <span className="plus">{suffixPlus}</span>}
                  </div>
                </div>
                <div className="fact__content">
                  <p>{item.title}</p>
                  <p>{item.label}</p>
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

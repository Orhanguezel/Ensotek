// =============================================================
// FILE: src/components/containers/about/AboutCounter.tsx
// Ensotek – Hakkımızda Sayaçları (FINAL)
// - Locale: useLocaleShort() with fallback 'tr'
// - UI: ui_about_stats (per-locale) BUT: ui() may return the KEY when missing
//       => sanitize UI strings (prevents "ui_about_stats_..." showing on screen)
// - 3 cards: Referanslar, Projeler, Yıllık tecrübe
// =============================================================

'use client';

import React, { useMemo } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';

type StatItem = {
  id: 'refs' | 'projects' | 'years';
  value: number;
  title: string;
  label: string;
};

const toNumber = (v: unknown, fallback: number): number => {
  const n = Number(String(v ?? '').trim());
  return Number.isFinite(n) ? n : fallback;
};

/**
 * ui() bazı ortamlarda değer yoksa "key" string'ini döndürüyor.
 * Bu helper bunu yakalayıp fallback'e düşürür.
 */
const safeUiText = (
  ui: (k: string, f?: any) => any,
  key: string,
  fallback: string,
  opts?: { maxLen?: number },
): string => {
  const fb = String(fallback ?? '').trim();

  const raw = ui(key, fb);
  const s = String(raw ?? '').trim();

  // boşsa
  if (!s) return fb;

  // ui() key döndürmüşse
  if (s === key) return fb;
  if (s.startsWith(key)) return fb;

  // bazı implementasyonlar "ui.key" gibi döndürür
  if (s.includes('ui_') && s.includes(key)) return fb;

  // uzunluk koruması (örn: "+" gibi alanlar)
  if (opts?.maxLen && s.length > opts.maxLen) return fb;

  return s;
};

const AboutCounter: React.FC = () => {
  const locale = useLocaleShort() || 'tr';
  const { ui } = useUiSection('ui_about_stats', locale as any);

  const { ref, inView } = useInView({
    threshold: 0.4,
    triggerOnce: true,
  });

  // Suffix’ler: özellikle burada key-string basılması tüm görünümü bozuyor.
  const suffixLetter = useMemo(
    () => safeUiText(ui as any, 'ui_about_stats_suffix_letter', '', { maxLen: 3 }),
    [ui],
  );

  const suffixPlus = useMemo(
    () => safeUiText(ui as any, 'ui_about_stats_suffix_plus', '+', { maxLen: 2 }) || '+',
    [ui],
  );

  const stats = useMemo<StatItem[]>(
    () => [
      {
        id: 'refs',
        value: toNumber(ui('ui_about_stats_refs_value', '120'), 120),
        title: safeUiText(ui as any, 'ui_about_stats_refs_title', 'Sanayi Referansımız', {
          maxLen: 80,
        }),
        label: safeUiText(ui as any, 'ui_about_stats_refs_label', 'Referans müşteri & tesis', {
          maxLen: 120,
        }),
      },
      {
        id: 'projects',
        value: toNumber(ui('ui_about_stats_projects_value', '250'), 250),
        title: safeUiText(ui as any, 'ui_about_stats_projects_title', 'Tamamlanan Proje', {
          maxLen: 80,
        }),
        label: safeUiText(
          ui as any,
          'ui_about_stats_projects_label',
          'Yurtiçi ve yurtdışı projeler',
          { maxLen: 120 },
        ),
      },
      {
        id: 'years',
        value: toNumber(ui('ui_about_stats_years_value', '20'), 20),
        title: safeUiText(ui as any, 'ui_about_stats_years_title', 'Yıllık Tecrübe', {
          maxLen: 80,
        }),
        label: safeUiText(ui as any, 'ui_about_stats_years_label', 'Su soğutma ve proses soğutma', {
          maxLen: 120,
        }),
      },
    ],
    [ui],
  );

  return (
    <section className="fact__area pt-120 pb-90 bg-white">
      <div className="container">
        <div className="row" data-aos="fade-up" data-aos-delay="300" ref={ref}>
          {stats.map((s) => (
            <div className="col-xl-4" key={s.id}>
              <div className="fact__item mb-30">
                <div className="fact__count">
                  <div className="fact__number">
                    <span className="counter" aria-label={`${s.value}${suffixPlus}`}>
                      {inView ? <CountUp start={0} end={s.value} duration={2.5} /> : s.value}
                    </span>
                  </div>

                  <div className="fact__letter" aria-hidden>
                    {suffixLetter ? <span>{suffixLetter}</span> : null}
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

// =============================================================
// FILE: src/components/containers/about/MissionVisionPageContent.tsx
// Ensotek – Mission & Vision Combined Page (I18N + BRAND SAFE) [FINAL]
// Styles: uses existing theme SCSS + custom ens-mv helpers (about.scss)
// - NO styled-jsx / NO inline styles
// - H1 forbidden: CMS html <h1> -> <h2>
// - Sidebar CTA: uses InfoContactCard (same pattern/frame as Quality page)
// =============================================================

'use client';

import React, { useMemo } from 'react';

import { useListCustomPagesPublicQuery } from '@/integrations/rtk/hooks';
import type { CustomPageDto } from '@/integrations/types/custom_pages.types';

import { useLocaleShort } from '@/i18n/useLocaleShort';
import { useUiSection } from '@/i18n/uiDb';

import InfoContactCard from '@/components/common/public/InfoContactCard';

const downgradeH1ToH2 = (rawHtml: string) =>
  String(rawHtml || '')
    .replace(/<h1(\s|>)/gi, '<h2$1')
    .replace(/<\/h1>/gi, '</h2>');

function pickFirstPublished(items: any): CustomPageDto | null {
  const arr: CustomPageDto[] = Array.isArray(items) ? (items as any) : [];
  const published = arr.filter((p) => !!p?.is_published);
  return published[0] ?? null;
}

function safeHtml(v: unknown): string {
  const s = String(v ?? '').trim();
  if (!s) return '';
  return downgradeH1ToH2(s);
}

type MiniCard = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
};

type Principle = {
  title: string;
  desc: string;
};

const MissionVisionPageContent: React.FC = () => {
  const locale = useLocaleShort();

  const { ui: uiMV } = useUiSection('ui_mission_vision', locale as any);
  const { ui: uiMission } = useUiSection('ui_mission', locale as any);
  const { ui: uiVision } = useUiSection('ui_vision', locale as any);

  const qCommon = useMemo(
    () => ({
      locale,
      limit: 1,
      sort: 'created_at' as const,
      orderDir: 'asc' as const,
    }),
    [locale],
  );

  const missionQ = useListCustomPagesPublicQuery({ ...qCommon, module_key: 'mission' });
  const visionQ = useListCustomPagesPublicQuery({ ...qCommon, module_key: 'vision' });

  const isLoading = missionQ.isLoading || visionQ.isLoading;
  const isError = !!missionQ.isError || !!visionQ.isError;

  const missionPage = useMemo(
    () => pickFirstPublished((missionQ.data as any)?.items),
    [missionQ.data],
  );
  const visionPage = useMemo(
    () => pickFirstPublished((visionQ.data as any)?.items),
    [visionQ.data],
  );

  // Header copy
  const subprefix = useMemo(
    () => String(uiMV('ui_mission_vision_subprefix', 'Ensotek') || '').trim() || 'Ensotek',
    [uiMV],
  );
  const sublabel = useMemo(
    () =>
      String(uiMV('ui_mission_vision_sublabel', 'Misyon & Vizyon') || '').trim() ||
      'Misyon & Vizyon',
    [uiMV],
  );

  const pageTitle = useMemo(() => {
    return (
      String(uiMV('ui_mission_vision_page_title', 'Misyonumuz - Vizyonumuz') || '').trim() ||
      'Misyonumuz - Vizyonumuz'
    );
  }, [uiMV]);

  const pageLead = useMemo(() => {
    return String(
      uiMV(
        'ui_mission_vision_page_lead',
        'Ensotek olarak süreçleri daha anlaşılır, daha güvenli ve daha verimli hale getirmek için çalışıyoruz.',
      ) || '',
    ).trim();
  }, [uiMV]);

  const missionTitle = useMemo(() => {
    const t = String(missionPage?.title ?? '').trim();
    return (
      t || String(uiMission('ui_mission_fallback_title', 'Misyonumuz') || '').trim() || 'Misyonumuz'
    );
  }, [missionPage?.title, uiMission]);

  const visionTitle = useMemo(() => {
    const t = String(visionPage?.title ?? '').trim();
    return (
      t || String(uiVision('ui_vision_fallback_title', 'Vizyonumuz') || '').trim() || 'Vizyonumuz'
    );
  }, [visionPage?.title, uiVision]);

  const missionSub = useMemo(
    () =>
      String(
        uiMV(
          'ui_mission_vision_mission_sub',
          'Süreç yönetimi, şeffaf iletişim ve ölçülebilir kalite.',
        ) || '',
      ).trim(),
    [uiMV],
  );

  const visionSub = useMemo(
    () =>
      String(
        uiMV(
          'ui_mission_vision_vision_sub',
          'Sürdürülebilirlik, güven ve uzun vadeli değer üretimi.',
        ) || '',
      ).trim(),
    [uiMV],
  );

  const missionHtml = useMemo(() => safeHtml((missionPage as any)?.content_html), [missionPage]);
  const visionHtml = useMemo(() => safeHtml((visionPage as any)?.content_html), [visionPage]);

  const valueCards: MiniCard[] = useMemo(
    () => [
      {
        id: 'trust',
        icon: String(uiMV('ui_mission_vision_value_trust_icon', '🛡️') || '🛡️'),
        title: String(uiMV('ui_mission_vision_value_trust_title', 'GÜVEN') || 'GÜVEN'),
        subtitle: String(
          uiMV('ui_mission_vision_value_trust_sub', 'Şeffaf süreç') || 'Şeffaf süreç',
        ),
      },
      {
        id: 'speed',
        icon: String(uiMV('ui_mission_vision_value_speed_icon', '⚡') || '⚡'),
        title: String(uiMV('ui_mission_vision_value_speed_title', 'HIZ') || 'HIZ'),
        subtitle: String(uiMV('ui_mission_vision_value_speed_sub', 'Hızlı dönüş') || 'Hızlı dönüş'),
      },
      {
        id: 'expertise',
        icon: String(uiMV('ui_mission_vision_value_expertise_icon', '🧭') || '🧭'),
        title: String(uiMV('ui_mission_vision_value_expertise_title', 'UZMANLIK') || 'UZMANLIK'),
        subtitle: String(
          uiMV('ui_mission_vision_value_expertise_sub', 'Doğru yönlendirme') || 'Doğru yönlendirme',
        ),
      },
      {
        id: 'support',
        icon: String(uiMV('ui_mission_vision_value_support_icon', '🤝') || '🤝'),
        title: String(uiMV('ui_mission_vision_value_support_title', 'DESTEK') || 'DESTEK'),
        subtitle: String(
          uiMV('ui_mission_vision_value_support_sub', 'Süreç boyunca') || 'Süreç boyunca',
        ),
      },
    ],
    [uiMV],
  );

  const principles: Principle[] = useMemo(
    () => [
      {
        title: String(uiMV('ui_mission_vision_principle_1_title', 'Şeffaflık') || 'Şeffaflık'),
        desc: String(
          uiMV('ui_mission_vision_principle_1_desc', 'Net bilgi, net süreç.') ||
            'Net bilgi, net süreç.',
        ),
      },
      {
        title: String(uiMV('ui_mission_vision_principle_2_title', 'Doğruluk') || 'Doğruluk'),
        desc: String(
          uiMV('ui_mission_vision_principle_2_desc', 'Güncel ve teyitli veriler.') ||
            'Güncel ve teyitli veriler.',
        ),
      },
      {
        title: String(
          uiMV('ui_mission_vision_principle_3_title', 'Hızlı İletişim') || 'Hızlı İletişim',
        ),
        desc: String(
          uiMV('ui_mission_vision_principle_3_desc', 'Kısa sürede geri dönüş.') ||
            'Kısa sürede geri dönüş.',
        ),
      },
      {
        title: String(
          uiMV('ui_mission_vision_principle_4_title', 'Müşteri Odaklılık') || 'Müşteri Odaklılık',
        ),
        desc: String(
          uiMV('ui_mission_vision_principle_4_desc', 'İhtiyaca uygun çözüm.') ||
            'İhtiyaca uygun çözüm.',
        ),
      },
    ],
    [uiMV],
  );

  // Sidebar contact/info texts (UI controlled)
  const infoTitle = useMemo(
    () => String(uiMV('ui_mission_vision_info_title', 'İletişim Bilgileri') || '').trim(),
    [uiMV],
  );

  const infoDesc = useMemo(
    () =>
      String(
        uiMV(
          'ui_mission_vision_info_desc',
          'Proje, teklif veya teknik danışmanlık için hızlıca ulaşın.',
        ) || '',
      ).trim(),
    [uiMV],
  );

  const phoneLabel = useMemo(
    () => String(uiMV('ui_mission_vision_cta_phone', 'Telefon') || 'Telefon').trim(),
    [uiMV],
  );

  const whatsappLabel = useMemo(
    () => String(uiMV('ui_mission_vision_cta_whatsapp', 'WhatsApp') || 'WhatsApp').trim(),
    [uiMV],
  );

  const formLabel = useMemo(
    () => String(uiMV('ui_mission_vision_cta_form', 'İletişim Formu') || 'İletişim Formu').trim(),
    [uiMV],
  );

  return (
    <section className="news__area grey-bg-3 pt-120 pb-90 ens-mv">
      <div className="container">
        {/* Header */}
        <div className="row">
          <div className="col-12">
            <div className="section__title-wrapper text-center mb-65">
              <span className="section__subtitle">
                <span>{subprefix}</span> {sublabel}
              </span>

              <h2 className="section__title">
                <span className="down__mark-line">{pageTitle}</span>
              </h2>

              {pageLead ? <p className="mt-10 mb-0">{pageLead}</p> : null}
            </div>
          </div>
        </div>

        <div className="row g-4" data-aos="fade-up" data-aos-delay="200">
          {/* LEFT */}
          <div className="col-lg-8">
            {isLoading ? (
              <div className="blog__content-wrapper">
                <div className="ens-skel ens-skel--md" />
                <div className="ens-skel ens-skel--md ens-skel--w80 mt-10" />
                <div className="ens-skel ens-skel--md ens-skel--w60 mt-10" />
              </div>
            ) : !isLoading && (isError || (!missionPage && !visionPage)) ? (
              <div className="alert alert-warning">
                {uiMV('ui_mission_vision_empty', 'Mission/Vision content not found.')}
              </div>
            ) : (
              <div className="blog__content-wrapper">
                {/* Mission */}
                <div className="ens-mv__block">
                  <div className="blog__content">
                    <span>{uiMV('ui_mission_vision_badge_mission', 'Misyon') || 'Misyon'}</span>
                    <h3>
                      <a href="#mission">{missionTitle}</a>
                    </h3>
                  </div>

                  {missionSub ? (
                    <div className="postbox__text">
                      <p className="ens-mv__sublead">{missionSub}</p>
                    </div>
                  ) : null}

                  {missionHtml ? (
                    <div
                      className="postbox__text tp-post-content tp-postbox-details ens-mv__html"
                      id="mission"
                    >
                      <div dangerouslySetInnerHTML={{ __html: missionHtml }} />
                    </div>
                  ) : (
                    <div className="postbox__text" id="mission">
                      <p className="mb-0">
                        {uiMission(
                          'ui_mission_empty_text',
                          'Misyon içeriği yakında burada yayınlanacaktır.',
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {/* Vision */}
                <div className="ens-mv__block">
                  <div className="blog__content">
                    <span>{uiMV('ui_mission_vision_badge_vision', 'Vizyon') || 'Vizyon'}</span>
                    <h3>
                      <a href="#vision">{visionTitle}</a>
                    </h3>
                  </div>

                  {visionSub ? (
                    <div className="postbox__text">
                      <p className="ens-mv__sublead">{visionSub}</p>
                    </div>
                  ) : null}

                  {visionHtml ? (
                    <div
                      className="postbox__text tp-post-content tp-postbox-details ens-mv__html"
                      id="vision"
                    >
                      <div dangerouslySetInnerHTML={{ __html: visionHtml }} />
                    </div>
                  ) : (
                    <div className="postbox__text" id="vision">
                      <p className="mb-0">
                        {uiVision(
                          'ui_vision_empty_text',
                          'Vizyon içeriği yakında burada yayınlanacaktır.',
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="col-lg-4">
            <aside className="blog__thumb-wrapper">
              {/* Value cards */}
              <div className="blog__content-wrapper ens-mv__panel">
                <div className="blog__content">
                  <span>{uiMV('ui_mission_vision_values_kicker', 'Değerler') || 'Değerler'}</span>
                  <h3>
                    <a href="#">
                      {uiMV('ui_mission_vision_values_title', 'Yaklaşımımız') || 'Yaklaşımımız'}
                    </a>
                  </h3>
                </div>

                <div className="row g-3">
                  {valueCards.map((c) => (
                    <div className="col-6" key={c.id}>
                      <div className="ens-mv__miniCard">
                        <div className="ens-mv__miniIcon" aria-hidden>
                          {c.icon}
                        </div>
                        <div className="ens-mv__miniTitle">{c.title}</div>
                        <div className="ens-mv__miniSub">{c.subtitle}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Principles */}
              <div className="blog__content-wrapper ens-mv__panel">
                <div className="blog__content">
                  <span>{uiMV('ui_mission_vision_principles_kicker', 'İlkeler') || 'İlkeler'}</span>
                  <h3>
                    <a href="#">
                      {uiMV('ui_mission_vision_principles_title', 'Temel İlkelerimiz') ||
                        'Temel İlkelerimiz'}
                    </a>
                  </h3>
                </div>

                <ul
                  className="ens-mv__list"
                  aria-label={
                    uiMV('ui_mission_vision_principles_title', 'Temel İlkelerimiz') ||
                    'Temel İlkelerimiz'
                  }
                >
                  {principles.map((p, idx) => (
                    <li className="ens-mv__listItem" key={idx}>
                      <span className="ens-mv__dot" aria-hidden />
                      <span className="ens-mv__listText">
                        <span className="ens-mv__listTitle">{p.title}</span>
                        <span className="ens-mv__listDesc">{p.desc}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact (same pattern/frame as Quality page) */}
              <InfoContactCard
                locale={String(locale || '')}
                fallbackLocale="en"
                title={infoTitle}
                description={infoDesc}
                phoneLabel={phoneLabel}
                whatsappLabel={whatsappLabel}
                formLabel={formLabel}
                contactHref="/contact"
                showEmail
                showAddress
                showWebsite={false}
                showWhatsapp
              />
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionPageContent;

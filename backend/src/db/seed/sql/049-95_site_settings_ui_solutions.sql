-- =============================================================
-- FILE: 049-95_site_settings_ui_solutions.sql  [FINAL / UPDATED]
-- ui_solutions (Solutions landing + detail + SEO + cards + sidebar)
--  - Key: ui_solutions
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Upsert: ON DUPLICATE KEY UPDATE
--  - NO ALTER / NO PATCH
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
VALUES
(
  UUID(),
  'ui_solutions',
  'tr',
  CAST(
    JSON_OBJECT(
      -- =========================================================
      -- Generic / states
      -- =========================================================
      'ui_solutions_loading',                  'Çözümler yükleniyor...',
      'ui_solutions_not_found',                'Çözümler bulunamadı.',
      'ui_solutions_empty',                    'Çözümler içeriği yakında eklenecektir.',
      'ui_solutions_untitled',                 'Başlıksız içerik',

      -- =========================================================
      -- Navigation
      -- =========================================================
      'ui_solutions_back_to_list',             'Çözümlere dön',

      -- =========================================================
      -- Page titles (Banner)
      -- - index: ui_solutions_page_title
      -- - detail: bannerTitle DB page.title fallback
      -- =========================================================
      'ui_solutions_page_title',               'Çözümler',

      -- =========================================================
      -- Landing header (SolutionsPage)
      -- =========================================================
      'ui_solutions_kicker',                   'SOĞUTMA KULESİ ÇÖZÜMLERİ',
      'ui_solutions_page_h1',                  'Çözümler',
      'ui_solutions_page_lead',                'İhtiyacınıza özel soğutma kulesi çözümleri.',
      'ui_solutions_page_lead_fallback',       'İhtiyacınıza özel soğutma kulesi çözümleri.',
      'ui_solutions_page_description',
        'Ensotek çözümleri: endüstriyel, HVAC ve proses uygulamalarına yönelik soğutma kulesi çözümleri.',

      -- =========================================================
      -- CTA buttons
      -- =========================================================
      'ui_solutions_cta_offer',                'Teklif Al',
      'ui_solutions_cta_services',             'Hizmetleri İncele',

      -- =========================================================
      -- Sections / sidebar
      -- =========================================================
      'ui_solutions_other_title',              'Diğer çözümler',
      'ui_solutions_share_title',              'Paylaş',
      'ui_solutions_write_comment',            'Yorum yaz',
      'ui_solutions_gallery_title',            'Galeri',
      'ui_solutions_sidebar_contact_title',    'İletişim Bilgileri',

      -- =========================================================
      -- Cards (fallback titles/descs)
      -- =========================================================
      'ui_solutions_card_more',                'Detayları Gör',

      'ui_solutions_card_1_title',             'Endüstriyel Soğutma Çözümleri',
      'ui_solutions_card_1_desc',
        'Tesisler, enerji üretimi ve zorlu çevre koşulları için yüksek verimli kule çözümleri.',

      'ui_solutions_card_2_title',             'HVAC Soğutma Çözümleri',
      'ui_solutions_card_2_desc',
        'Ticari HVAC sistemlerinde stabil yaklaşım sıcaklığı ve enerji optimizasyonu.',

      'ui_solutions_card_3_title',             'Proses Soğutma Çözümleri',
      'ui_solutions_card_3_desc',
        'Proses kritik su kalitesi için açık/kapalı devre seçimi ve yardımcı ekipmanlar.',

      -- =========================================================
      -- SEO (index page uses these first)
      -- =========================================================
      'ui_solutions_meta_title',               'Çözümler | Ensotek',
      'ui_solutions_meta_description',
        'Ensotek çözümleri: endüstriyel, HVAC ve proses uygulamalarına yönelik soğutma kulesi çözümleri.',

      -- =========================================================
      -- SEO (detail page fallback for meta description)
      -- Used in src/pages/solutions/[slug].tsx
      -- =========================================================
      'ui_solutions_detail_meta_description',
        'Çözüm detaylarını inceleyin ve ihtiyacınıza özel destek ve danışmanlık için bizimle iletişime geçin.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_solutions',
  'en',
  CAST(
    JSON_OBJECT(
      -- =========================================================
      -- Generic / states
      -- =========================================================
      'ui_solutions_loading',                  'Loading solutions...',
      'ui_solutions_not_found',                'Solutions not found.',
      'ui_solutions_empty',                    'Solutions content will be available soon.',
      'ui_solutions_untitled',                 'Untitled content',

      -- =========================================================
      -- Navigation
      -- =========================================================
      'ui_solutions_back_to_list',             'Back to solutions',

      -- =========================================================
      -- Page titles (Banner)
      -- =========================================================
      'ui_solutions_page_title',               'Solutions',

      -- =========================================================
      -- Landing header (SolutionsPage)
      -- =========================================================
      'ui_solutions_kicker',                   'COOLING TOWER SOLUTIONS',
      'ui_solutions_page_h1',                  'Solutions',
      'ui_solutions_page_lead',                'Cooling tower solutions tailored to your needs.',
      'ui_solutions_page_lead_fallback',       'Cooling tower solutions tailored to your needs.',
      'ui_solutions_page_description',
        'Ensotek solutions: cooling tower solutions for industrial, HVAC, and process applications.',

      -- =========================================================
      -- CTA buttons
      -- =========================================================
      'ui_solutions_cta_offer',                'Get a Quote',
      'ui_solutions_cta_services',             'Explore Services',

      -- =========================================================
      -- Sections / sidebar
      -- =========================================================
      'ui_solutions_other_title',              'Other solutions',
      'ui_solutions_share_title',              'Share',
      'ui_solutions_write_comment',            'Write a review',
      'ui_solutions_gallery_title',            'Gallery',
      'ui_solutions_sidebar_contact_title',    'Contact Info',

      -- =========================================================
      -- Cards (fallback titles/descs)
      -- =========================================================
      'ui_solutions_card_more',                'View Details',

      'ui_solutions_card_1_title',             'Industrial Cooling Solutions',
      'ui_solutions_card_1_desc',
        'High-efficiency tower solutions for plants, power generation and demanding environments.',

      'ui_solutions_card_2_title',             'HVAC Cooling Solutions',
      'ui_solutions_card_2_desc',
        'Stable approach temperature and energy optimization for commercial HVAC systems.',

      'ui_solutions_card_3_title',             'Process Cooling Solutions',
      'ui_solutions_card_3_desc',
        'Open/closed circuit selection and auxiliary components for process-critical water quality.',

      -- =========================================================
      -- SEO (index page)
      -- =========================================================
      'ui_solutions_meta_title',               'Solutions | Ensotek',
      'ui_solutions_meta_description',
        'Ensotek solutions: cooling tower solutions for industrial, HVAC and process applications.',

      -- =========================================================
      -- SEO (detail page fallback)
      -- =========================================================
      'ui_solutions_detail_meta_description',
        'Explore the solution details and contact us for tailored support and consultation.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_solutions',
  'de',
  CAST(
    JSON_OBJECT(
      -- =========================================================
      -- Generic / states
      -- =========================================================
      'ui_solutions_loading',                  'Lösungen werden geladen...',
      'ui_solutions_not_found',                'Lösungen nicht gefunden.',
      'ui_solutions_empty',                    'Inhalte zu Lösungen sind bald verfügbar.',
      'ui_solutions_untitled',                 'Ohne Titel',

      -- =========================================================
      -- Navigation
      -- =========================================================
      'ui_solutions_back_to_list',             'Zurück zu den Lösungen',

      -- =========================================================
      -- Page titles (Banner)
      -- =========================================================
      'ui_solutions_page_title',               'Lösungen',

      -- =========================================================
      -- Landing header (SolutionsPage)
      -- =========================================================
      'ui_solutions_kicker',                   'KÜHLTURM-LÖSUNGEN',
      'ui_solutions_page_h1',                  'Lösungen',
      'ui_solutions_page_lead',                'Kühlturm-Lösungen, die auf Ihre Anforderungen zugeschnitten sind.',
      'ui_solutions_page_lead_fallback',       'Kühlturm-Lösungen, die auf Ihre Anforderungen zugeschnitten sind.',
      'ui_solutions_page_description',
        'Ensotek Lösungen: Kühlturm-Lösungen für Industrie-, HVAC- und Prozessanwendungen.',

      -- =========================================================
      -- CTA buttons
      -- =========================================================
      'ui_solutions_cta_offer',                'Angebot anfordern',
      'ui_solutions_cta_services',             'Services entdecken',

      -- =========================================================
      -- Sections / sidebar
      -- =========================================================
      'ui_solutions_other_title',              'Weitere Lösungen',
      'ui_solutions_share_title',              'Teilen',
      'ui_solutions_write_comment',            'Bewertung schreiben',
      'ui_solutions_gallery_title',            'Galerie',
      'ui_solutions_sidebar_contact_title',    'Kontaktinformationen',

      -- =========================================================
      -- Cards (fallback titles/descs)
      -- =========================================================
      'ui_solutions_card_more',                'Details ansehen',

      'ui_solutions_card_1_title',             'Industrielle Kühllösungen',
      'ui_solutions_card_1_desc',
        'Hocheffiziente Turmlösungen für Anlagen, Energieerzeugung und anspruchsvolle Umgebungen.',

      'ui_solutions_card_2_title',             'HVAC Kühllösungen',
      'ui_solutions_card_2_desc',
        'Stabile Annäherungstemperatur und Energieoptimierung für kommerzielle HVAC-Systeme.',

      'ui_solutions_card_3_title',             'Prozesskühllösungen',
      'ui_solutions_card_3_desc',
        'Auswahl von offen/geschlossenem Kreislauf und Zusatzkomponenten für prozesskritische Wasserqualität.',

      -- =========================================================
      -- SEO (index page)
      -- =========================================================
      'ui_solutions_meta_title',               'Lösungen | Ensotek',
      'ui_solutions_meta_description',
        'Ensotek Lösungen: Kühlturm-Lösungen für Industrie-, HVAC- und Prozessanwendungen.',

      -- =========================================================
      -- SEO (detail page fallback)
      -- =========================================================
      'ui_solutions_detail_meta_description',
        'Sehen Sie sich die Lösungsdetails an und kontaktieren Sie uns für maßgeschneiderte Unterstützung und Beratung.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

COMMIT;

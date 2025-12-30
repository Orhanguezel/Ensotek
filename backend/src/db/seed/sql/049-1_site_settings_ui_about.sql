-- =============================================================
-- FILE: 049-1_site_settings_ui_about.sql  (About + UI strings) [FINAL / FIXED]
-- site_settings.key IN ('ui_about')
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Upsert: ON DUPLICATE KEY UPDATE (assumes UNIQUE(key, locale))
--  - NO ALTER / NO PATCH
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =============================================================
-- ui_about (TR/EN/DE)
-- =============================================================
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
VALUES
(
  UUID(),
  'ui_about',
  'tr',
  CAST(
    JSON_OBJECT(
      -- Header / Banner / Titles
      'ui_about_page_title',        'Hakkımızda',
      'ui_about_subprefix',         'Ensotek',
      'ui_about_sublabel',          'Hakkımızda',

      -- AboutPageContent header (lead)
      'ui_about_page_lead',
        'Deneyim, üretim gücü ve kalite standartlarımızla projelerinize güvenilir çözümler sunuyoruz.',

      -- SEO (pages/about.tsx uses these first)
      'ui_about_page_description',
        'Ensotek hakkında bilgi, kurumsal yaklaşımımız ve faaliyet alanlarımız.',
      'ui_about_meta_title',        'Hakkımızda | Ensotek',
      'ui_about_meta_description',
        'Ensotek hakkında bilgi, kurumsal yaklaşımımız ve faaliyet alanlarımız.',

      -- Content fallbacks / states
      'ui_about_fallback_title',    'Ensotek',
      'ui_about_empty',             'Hakkımızda içeriği bulunamadı.',
      'ui_about_error',             'İçerik yüklenemedi.',
      'ui_about_empty_text',
        'Ensotek’in kurumsal yaklaşımı ve üretim gücü burada yayınlanacaktır.',

      -- AboutSection CTA / labels
      'ui_about_view_all',          'Tümünü Gör',
      'ui_about_read_more',         'Devamı',

      -- AboutSection bullets (fallback)
      'ui_about_bullet_1_title',    'Üretim & Kalite',
      'ui_about_bullet_1_text',     'Kalite standartlarımız ve üretim gücümüz.',
      'ui_about_bullet_2_title',    'Süreç & Destek',
      'ui_about_bullet_2_text',     'Proje süreci boyunca hızlı ve şeffaf iletişim.',

      -- AboutPageContent panels
      'ui_about_what_title',        'Ne Yapıyoruz?',
      'ui_about_what_items',
        JSON_ARRAY(
          'Proje analizi ve doğru ürün seçimi',
          'Üretim, sevkiyat ve montaj koordinasyonu',
          'Devreye alma ve performans takibi',
          'Satış sonrası bakım ve teknik destek'
        ),

      'ui_about_why_title',         'Neden Ensotek?',
      'ui_about_why_items',
        JSON_ARRAY(
          '40+ yıllık deneyim ve kurumsal üretim altyapısı',
          'Kalite standartları ve dokümantasyon disiplini',
          'Hızlı geri dönüş ve süreç şeffaflığı',
          'Uzun vadeli iş ortaklığı yaklaşımı'
        ),

      'ui_about_goal_title',        'Hedefimiz',
      'ui_about_goal_text',
        'Müşterilerimiz için verimli, sürdürülebilir ve güvenilir soğutma çözümleri sunarken; kaliteyi ölçülebilir hale getirip süreçleri sürekli iyileştirmektir.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_about',
  'en',
  CAST(
    JSON_OBJECT(
      -- Header / Banner / Titles
      'ui_about_page_title',        'About Us',
      'ui_about_subprefix',         'Ensotek',
      'ui_about_sublabel',          'About',

      -- AboutPageContent header (lead)
      'ui_about_page_lead',
        'With experience, manufacturing strength, and quality standards, we deliver reliable solutions for your projects.',

      -- SEO
      'ui_about_page_description',
        'Information about Ensotek, our corporate approach and capabilities.',
      'ui_about_meta_title',        'About Us | Ensotek',
      'ui_about_meta_description',
        'Information about Ensotek, our corporate approach and capabilities.',

      -- Content fallbacks / states
      'ui_about_fallback_title',    'Ensotek',
      'ui_about_empty',             'About content not found.',
      'ui_about_error',             'Failed to load content.',
      'ui_about_empty_text',
        'Ensotek’s corporate approach and manufacturing capabilities will be published here.',

      -- AboutSection CTA / labels
      'ui_about_view_all',          'View all',
      'ui_about_read_more',         'Read more',

      -- AboutSection bullets (fallback)
      'ui_about_bullet_1_title',    'Manufacturing & Quality',
      'ui_about_bullet_1_text',     'Our quality standards and production capability.',
      'ui_about_bullet_2_title',    'Process & Support',
      'ui_about_bullet_2_text',     'Fast and transparent communication throughout the project.',

      -- AboutPageContent panels
      'ui_about_what_title',        'What do we do?',
      'ui_about_what_items',
        JSON_ARRAY(
          'Project analysis and correct product selection',
          'Production, shipment and installation coordination',
          'Commissioning and performance monitoring',
          'After-sales maintenance and technical support'
        ),

      'ui_about_why_title',         'Why Ensotek?',
      'ui_about_why_items',
        JSON_ARRAY(
          '40+ years of experience and robust manufacturing infrastructure',
          'Quality standards and disciplined documentation',
          'Fast response and transparent processes',
          'Long-term partnership approach'
        ),

      'ui_about_goal_title',        'Our Goal',
      'ui_about_goal_text',
        'To deliver efficient, sustainable and reliable cooling solutions; while making quality measurable and continuously improving processes.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_about',
  'de',
  CAST(
    JSON_OBJECT(
      -- Header / Banner / Titles
      'ui_about_page_title',        'Über uns',
      'ui_about_subprefix',         'Ensotek',
      'ui_about_sublabel',          'Über uns',

      -- AboutPageContent header (lead)
      'ui_about_page_lead',
        'Mit Erfahrung, Fertigungsstärke und Qualitätsstandards liefern wir zuverlässige Lösungen für Ihre Projekte.',

      -- SEO
      'ui_about_page_description',
        'Informationen über Ensotek, unseren Unternehmensansatz und unsere Kompetenzen.',
      'ui_about_meta_title',        'Über uns | Ensotek',
      'ui_about_meta_description',
        'Informationen über Ensotek, unseren Unternehmensansatz und unsere Kompetenzen.',

      -- Content fallbacks / states
      'ui_about_fallback_title',    'Ensotek',
      'ui_about_empty',             'Über-uns-Inhalt nicht gefunden.',
      'ui_about_error',             'Inhalt konnte nicht geladen werden.',
      'ui_about_empty_text',
        'Der Unternehmensansatz und die Fertigungskompetenz von Ensotek werden hier veröffentlicht.',

      -- AboutSection CTA / labels
      'ui_about_view_all',          'Alle anzeigen',
      'ui_about_read_more',         'Mehr lesen',

      -- AboutSection bullets (fallback)
      'ui_about_bullet_1_title',    'Fertigung & Qualität',
      'ui_about_bullet_1_text',     'Unsere Qualitätsstandards und Fertigungsstärke.',
      'ui_about_bullet_2_title',    'Prozess & Support',
      'ui_about_bullet_2_text',     'Schnelle und transparente Kommunikation während des Projekts.',

      -- AboutPageContent panels
      'ui_about_what_title',        'Was machen wir?',
      'ui_about_what_items',
        JSON_ARRAY(
          'Projektanalyse und passende Produktauswahl',
          'Koordination von Produktion, Versand und Montage',
          'Inbetriebnahme und Performance-Überwachung',
          'After-Sales-Wartung und technischer Support'
        ),

      'ui_about_why_title',         'Warum Ensotek?',
      'ui_about_why_items',
        JSON_ARRAY(
          '40+ Jahre Erfahrung und starke Fertigungsinfrastruktur',
          'Qualitätsstandards und konsequente Dokumentation',
          'Schnelle Rückmeldung und transparente Prozesse',
          'Langfristiger Partnerschaftsansatz'
        ),

      'ui_about_goal_title',        'Unser Ziel',
      'ui_about_goal_text',
        'Effiziente, nachhaltige und zuverlässige Kühllösungen zu liefern; Qualität messbar zu machen und Prozesse kontinuierlich zu verbessern.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = CURRENT_TIMESTAMP(3);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================
-- FILE: 049-1_site_settings_ui_about.sql  (About + UI strings) [FINAL / FULL / NO ARRAYS]
-- site_settings.key = 'ui_about'
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Upsert: ON DUPLICATE KEY UPDATE (assumes UNIQUE(key, locale))
--  - NO ALTER / NO PATCH
--  - ✅ FIX: "what/why items" are stored as flat keys (no JSON_ARRAY)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
VALUES
-- =============================================================
-- TR
-- =============================================================
(
  UUID(),
  'ui_about',
  'tr',
  CAST(
    JSON_OBJECT(
      -- Page / Banner / Titles
      'ui_about_page_title',        'Hakkımızda',
      'ui_about_subprefix',         'Ensotek',
      'ui_about_sublabel',          'Hakkımızda',
      'ui_about_page_lead',
        'Deneyim, üretim gücü ve kalite standartlarımızla projelerinize güvenilir çözümler sunuyoruz.',

      -- SEO (pages/about.tsx uses these first)
      'ui_about_page_description',
        'Ensotek hakkında bilgi, kurumsal yaklaşımımız ve faaliyet alanlarımız.',
      'ui_about_meta_title',        'Hakkımızda | Ensotek',
      'ui_about_meta_description',
        'Ensotek hakkında bilgi, kurumsal yaklaşımımız ve faaliyet alanlarımız.',

      -- Content fallbacks / states (AboutPageContent.tsx)
      'ui_about_fallback_title',    'Ensotek',
      'ui_about_empty',             'Hakkımızda içeriği bulunamadı.',
      'ui_about_error',             'İçerik yüklenemedi.',
      'ui_about_empty_text',
        'Ensotek’in kurumsal yaklaşımı ve üretim gücü burada yayınlanacaktır.',

      -- CTA / labels (genel)
      'ui_about_view_all',          'Tümünü Gör',
      'ui_about_read_more',         'Devamı',

      -- AboutSection bullets (fallback / summary cards)
      'ui_about_bullet_1_title',    'Üretim & Kalite',
      'ui_about_bullet_1_text',     'Kalite standartlarımız ve üretim gücümüz.',
      'ui_about_bullet_2_title',    'Süreç & Destek',
      'ui_about_bullet_2_text',     'Proje süreci boyunca hızlı ve şeffaf iletişim.',
      'ui_about_bullet_3_title',    'Ar-Ge & Gelişim',
      'ui_about_bullet_3_text',     'Sürekli iyileştirme yaklaşımıyla ürün geliştirme.',
      'ui_about_bullet_4_title',    'Global Referanslar',
      'ui_about_bullet_4_text',     'Yurt içi ve yurt dışında binlerce proje tecrübesi.',

      -- AboutPageContent panels (RIGHT blocks)
      'ui_about_what_title',        'Ne Yapıyoruz?',
      'ui_about_what_item_count',   '4',
      'ui_about_what_item_1',       'Proje analizi ve doğru ürün seçimi',
      'ui_about_what_item_2',       'Üretim, sevkiyat ve montaj koordinasyonu',
      'ui_about_what_item_3',       'Devreye alma ve performans takibi',
      'ui_about_what_item_4',       'Satış sonrası bakım ve teknik destek',

      'ui_about_why_title',         'Neden Ensotek?',
      'ui_about_why_item_count',    '4',
      'ui_about_why_item_1',        '40+ yıllık deneyim ve kurumsal üretim altyapısı',
      'ui_about_why_item_2',        'Kalite standartları ve dokümantasyon disiplini',
      'ui_about_why_item_3',        'Hızlı geri dönüş ve süreç şeffaflığı',
      'ui_about_why_item_4',        'Uzun vadeli iş ortaklığı yaklaşımı',

      'ui_about_goal_title',        'Hedefimiz',
      'ui_about_goal_text',
        'Müşterilerimiz için verimli, sürdürülebilir ve güvenilir soğutma çözümleri sunarken; kaliteyi ölçülebilir hale getirip süreçleri sürekli iyileştirmektir.',

      -- Optional helpers
      'ui_about_breadcrumb_home',   'Anasayfa',
      'ui_about_breadcrumb_about',  'Hakkımızda',
      'ui_about_section_content',   'Kurumsal İçerik',
      'ui_about_section_panels',    'Öne Çıkanlar'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),

-- =============================================================
-- EN
-- =============================================================
(
  UUID(),
  'ui_about',
  'en',
  CAST(
    JSON_OBJECT(
      -- Page / Banner / Titles
      'ui_about_page_title',        'About Us',
      'ui_about_subprefix',         'Ensotek',
      'ui_about_sublabel',          'About',
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

      -- CTA / labels
      'ui_about_view_all',          'View all',
      'ui_about_read_more',         'Read more',

      -- AboutSection bullets
      'ui_about_bullet_1_title',    'Manufacturing & Quality',
      'ui_about_bullet_1_text',     'Our quality standards and production capability.',
      'ui_about_bullet_2_title',    'Process & Support',
      'ui_about_bullet_2_text',     'Fast and transparent communication throughout the project.',
      'ui_about_bullet_3_title',    'R&D & Improvement',
      'ui_about_bullet_3_text',     'Continuous product improvement driven by feedback.',
      'ui_about_bullet_4_title',    'Global References',
      'ui_about_bullet_4_text',     'Experience across thousands of projects worldwide.',

      -- AboutPageContent panels
      'ui_about_what_title',        'What do we do?',
      'ui_about_what_item_count',   '4',
      'ui_about_what_item_1',       'Project analysis and correct product selection',
      'ui_about_what_item_2',       'Production, shipment and installation coordination',
      'ui_about_what_item_3',       'Commissioning and performance monitoring',
      'ui_about_what_item_4',       'After-sales maintenance and technical support',

      'ui_about_why_title',         'Why Ensotek?',
      'ui_about_why_item_count',    '4',
      'ui_about_why_item_1',        '40+ years of experience and robust manufacturing infrastructure',
      'ui_about_why_item_2',        'Quality standards and disciplined documentation',
      'ui_about_why_item_3',        'Fast response and transparent processes',
      'ui_about_why_item_4',        'Long-term partnership approach',

      'ui_about_goal_title',        'Our Goal',
      'ui_about_goal_text',
        'To deliver efficient, sustainable and reliable cooling solutions; while making quality measurable and continuously improving processes.',

      -- Optional helpers
      'ui_about_breadcrumb_home',   'Home',
      'ui_about_breadcrumb_about',  'About',
      'ui_about_section_content',   'Corporate Content',
      'ui_about_section_panels',    'Highlights'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),

-- =============================================================
-- DE
-- =============================================================
(
  UUID(),
  'ui_about',
  'de',
  CAST(
    JSON_OBJECT(
      -- Page / Banner / Titles
      'ui_about_page_title',        'Über uns',
      'ui_about_subprefix',         'Ensotek',
      'ui_about_sublabel',          'Über uns',
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

      -- CTA / labels
      'ui_about_view_all',          'Alle anzeigen',
      'ui_about_read_more',         'Mehr lesen',

      -- AboutSection bullets
      'ui_about_bullet_1_title',    'Fertigung & Qualität',
      'ui_about_bullet_1_text',     'Unsere Qualitätsstandards und Fertigungsstärke.',
      'ui_about_bullet_2_title',    'Prozess & Support',
      'ui_about_bullet_2_text',     'Schnelle und transparente Kommunikation während des Projekts.',
      'ui_about_bullet_3_title',    'F&E & Weiterentwicklung',
      'ui_about_bullet_3_text',     'Kontinuierliche Verbesserung durch Feedback und Forschung.',
      'ui_about_bullet_4_title',    'Globale Referenzen',
      'ui_about_bullet_4_text',     'Erfahrung aus tausenden Projekten national und international.',

      -- AboutPageContent panels
      'ui_about_what_title',        'Was machen wir?',
      'ui_about_what_item_count',   '4',
      'ui_about_what_item_1',       'Projektanalyse und passende Produktauswahl',
      'ui_about_what_item_2',       'Koordination von Produktion, Versand und Montage',
      'ui_about_what_item_3',       'Inbetriebnahme und Performance-Überwachung',
      'ui_about_what_item_4',       'After-Sales-Wartung und technischer Support',

      'ui_about_why_title',         'Warum Ensotek?',
      'ui_about_why_item_count',    '4',
      'ui_about_why_item_1',        '40+ Jahre Erfahrung und starke Fertigungsinfrastruktur',
      'ui_about_why_item_2',        'Qualitätsstandards und konsequente Dokumentation',
      'ui_about_why_item_3',        'Schnelle Rückmeldung und transparente Prozesse',
      'ui_about_why_item_4',        'Langfristiger Partnerschaftsansatz',

      'ui_about_goal_title',        'Unser Ziel',
      'ui_about_goal_text',
        'Effiziente, nachhaltige und zuverlässige Kühllösungen zu liefern; Qualität messbar zu machen und Prozesse kontinuierlich zu verbessern.',

      -- Optional helpers
      'ui_about_breadcrumb_home',   'Startseite',
      'ui_about_breadcrumb_about',  'Über uns',
      'ui_about_section_content',   'Unternehmensinhalt',
      'ui_about_section_panels',    'Highlights'
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

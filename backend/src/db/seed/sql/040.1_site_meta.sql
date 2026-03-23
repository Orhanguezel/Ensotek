-- =============================================================
-- 040.1_site_meta.sql  (FINAL / DRY OG IMAGE)
-- Ensotek – Default Meta + Global SEO (NEW STANDARD)
--
-- Fix: MySQL 1093 (ER_UPDATE_TABLE_USED)
-- - Do not SELECT from `site_settings` inside INSERT/UPSERT statements.
-- - Use UUID() for INSERT ids; rely on UNIQUE(key, locale) for UPSERT.
-- - Build JSON payloads once in variables and reuse for seo/site_seo.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- -------------------------------------------------------------
-- TABLE GUARD
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id`         CHAR(36)      NOT NULL,
  `key`        VARCHAR(100)  NOT NULL,
  `locale`     VARCHAR(8)    NOT NULL,
  `value`      TEXT          NOT NULL,
  `created_at` DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_settings_key_locale_uq` (`key`, `locale`),
  KEY `site_settings_key_idx` (`key`),
  KEY `site_settings_locale_idx` (`locale`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Helpers
-- -------------------------------------------------------------
-- OG DEFAULT:
-- 1) First try site_og_default_image (locale='*') JSON -> $.url
-- 2) If not JSON, use value as plain URL
-- 3) If missing/empty, fallback to '/img/og-default.jpg'
-- -------------------------------------------------------------
SET @OG_DEFAULT := COALESCE(
  (
    SELECT COALESCE(
      JSON_UNQUOTE(JSON_EXTRACT(`value`, '$.url')),
      NULLIF(`value`, '')
    )
    FROM `site_settings`
    WHERE `key` = 'site_og_default_image'
      AND `locale` = '*'
    ORDER BY `updated_at` DESC
    LIMIT 1
  ),
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1767249482/site-media/2.jpg'
);

-- -------------------------------------------------------------
-- Title policies:
-- - Avoid: | & " ' < > etc.
-- - Use: "–" as separator, and "and/und/ve" instead of "&"
-- -------------------------------------------------------------

-- Brand / default titles (ASCII-safe)
SET @BRAND_TR := 'Ensotek – Endustriyel Su Sogutma Kuleleri ve Muhendislik';
SET @BRAND_EN := 'Ensotek – Industrial Cooling Towers and Engineering';
SET @BRAND_DE := 'Ensotek – Industrielle Kuehltuerme und Engineering';

-- Site name (shorter, neutral)
SET @SITE_NAME_GLOBAL := 'Ensotek Industrial Cooling Towers';

-- Global default title
SET @TITLE_GLOBAL := 'Ensotek Industrial Cooling Towers and Engineering';

-- Concise descriptions
SET @DESC_TR := 'CTP malzemeden acik ve kapali tip su sogutma kuleleri. Imaalat ve montaj. Bakim, onarim, modernizasyon, test ve yedek parca.';
SET @DESC_EN := 'Open and closed-circuit FRP cooling towers. Manufacturing and installation. Maintenance, repair, modernization, performance testing and spare parts.';
SET @DESC_DE := 'Offene und geschlossene GFK Kuehltuerme. Herstellung und Montage. Wartung, Reparatur, Modernisierung, Leistungstests und Ersatzteile.';

-- Global concise description
SET @DESC_GLOBAL := 'Industrial cooling towers, engineering, installation and service solutions for efficient process cooling.';

-- Global keywords (neutral)
SET @KW_GLOBAL := 'ensotek, cooling tower, industrial cooling, FRP, engineering, installation, service';

-- -------------------------------------------------------------
-- Build JSON payloads once (DRY)
-- -------------------------------------------------------------

-- GLOBAL seo/site_seo payload (locale='*')
SET @SEO_GLOBAL := CAST(
  JSON_OBJECT(
    'site_name',      @SITE_NAME_GLOBAL,
    'title_default',  @TITLE_GLOBAL,
    'title_template', '%s – Ensotek',
    'description',    @DESC_GLOBAL,
    'open_graph', JSON_OBJECT(
      'type',   'website',
      'images', JSON_ARRAY(@OG_DEFAULT)
    ),
    'twitter', JSON_OBJECT(
      'card',    'summary_large_image',
      'site',    '@ensotek',
      'creator', '@ensotek'
    ),
    'robots', JSON_OBJECT(
      'noindex', false,
      'index',   true,
      'follow',  true
    )
  ) AS CHAR CHARACTER SET utf8mb4
);

-- TR/EN/DE seo/site_seo payloads
SET @SEO_TR := CAST(
  JSON_OBJECT(
    'site_name',      @BRAND_TR,
    'title_default',  @BRAND_TR,
    'title_template', '%s – Ensotek',
    'description',    @DESC_TR,
    'open_graph', JSON_OBJECT(
      'type',   'website',
      'images', JSON_ARRAY(@OG_DEFAULT)
    ),
    'twitter', JSON_OBJECT(
      'card',    'summary_large_image',
      'site',    '@ensotek',
      'creator', '@ensotek'
    ),
    'robots', JSON_OBJECT(
      'noindex', false,
      'index',   true,
      'follow',  true
    )
  ) AS CHAR CHARACTER SET utf8mb4
);

SET @SEO_EN := CAST(
  JSON_OBJECT(
    'site_name',      @BRAND_EN,
    'title_default',  @BRAND_EN,
    'title_template', '%s – Ensotek',
    'description',    @DESC_EN,
    'open_graph', JSON_OBJECT(
      'type',   'website',
      'images', JSON_ARRAY(@OG_DEFAULT)
    ),
    'twitter', JSON_OBJECT(
      'card',    'summary_large_image',
      'site',    '@ensotek',
      'creator', '@ensotek'
    ),
    'robots', JSON_OBJECT(
      'noindex', false,
      'index',   true,
      'follow',  true
    )
  ) AS CHAR CHARACTER SET utf8mb4
);

SET @SEO_DE := CAST(
  JSON_OBJECT(
    'site_name',      @BRAND_DE,
    'title_default',  @BRAND_DE,
    'title_template', '%s – Ensotek',
    'description',    @DESC_DE,
    'open_graph', JSON_OBJECT(
      'type',   'website',
      'images', JSON_ARRAY(@OG_DEFAULT)
    ),
    'twitter', JSON_OBJECT(
      'card',    'summary_large_image',
      'site',    '@ensotek',
      'creator', '@ensotek'
    ),
    'robots', JSON_OBJECT(
      'noindex', false,
      'index',   true,
      'follow',  true
    )
  ) AS CHAR CHARACTER SET utf8mb4
);

-- site_meta_default payloads
SET @META_GLOBAL := CAST(
  JSON_OBJECT(
    'title',       @TITLE_GLOBAL,
    'description', @DESC_GLOBAL,
    'keywords',    @KW_GLOBAL
  ) AS CHAR CHARACTER SET utf8mb4
);

SET @META_TR := CAST(
  JSON_OBJECT(
    'title',       @BRAND_TR,
    'description', @DESC_TR,
    'keywords',    'ensotek, su sogutma kulesi, sogutma kulesi, ctp, camelyaf takviyeli polyester, acik tip, kapali tip, modernizasyon, bakim onarim, test, yedek parca'
  ) AS CHAR CHARACTER SET utf8mb4
);

SET @META_EN := CAST(
  JSON_OBJECT(
    'title',       @BRAND_EN,
    'description', @DESC_EN,
    'keywords',    'ensotek, cooling tower, FRP, fiber reinforced plastic, open circuit, closed circuit, modernization, maintenance, repair, performance testing, spare parts'
  ) AS CHAR CHARACTER SET utf8mb4
);

SET @META_DE := CAST(
  JSON_OBJECT(
    'title',       @BRAND_DE,
    'description', @DESC_DE,
    'keywords',    'ensotek, kuehlturm, GFK, glasfaserverstaerkter kunststoff, offen, geschlossen, modernisierung, wartung, reparatur, leistungstest, ersatzteile'
  ) AS CHAR CHARACTER SET utf8mb4
);

-- =============================================================
-- GLOBAL SEO DEFAULTS (locale='*')  --> neutral fallback
-- =============================================================

-- PRIMARY: seo (GLOBAL DEFAULT)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  UUID(),
  'seo',
  '*',
  @SEO_GLOBAL,
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- FALLBACK: site_seo (GLOBAL DEFAULT)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  UUID(),
  'site_seo',
  '*',
  @SEO_GLOBAL,
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- LOCALIZED SEO OVERRIDES (tr/en/de)
-- =============================================================

-- seo overrides
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'seo', 'tr', @SEO_TR, NOW(3), NOW(3)),
(UUID(), 'seo', 'en', @SEO_EN, NOW(3), NOW(3)),
(UUID(), 'seo', 'de', @SEO_DE, NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- site_seo overrides (copy identical payload)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'site_seo', 'tr', @SEO_TR, NOW(3), NOW(3)),
(UUID(), 'site_seo', 'en', @SEO_EN, NOW(3), NOW(3)),
(UUID(), 'site_seo', 'de', @SEO_DE, NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- site_meta_default
-- - Add '*' fallback so new locales won't break
-- - Keep per-locale overrides for tr/en/de
-- =============================================================

-- '*' fallback (neutral EN)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'site_meta_default', '*',  @META_GLOBAL, NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- tr/en/de overrides
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'site_meta_default', 'tr', @META_TR, NOW(3), NOW(3)),
(UUID(), 'site_meta_default', 'en', @META_EN, NOW(3), NOW(3)),
(UUID(), 'site_meta_default', 'de', @META_DE, NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- seo_pages — Sayfa bazli SEO ayarlari (admin panelden duzenlenebilir)
-- =============================================================

SET @SEO_PAGES_DE := CAST(JSON_OBJECT(
  'home', JSON_OBJECT('title', 'Ensotek - Industrielle Kuehl- und Klimatechnik', 'description', 'Fuehrender Anbieter fuer industrielle Kuehltuerme, Verdunstungskuehler und HVAC-Loesungen. Massgeschneiderte Technik fuer Industrie und Gewerbe.', 'og_image', '', 'no_index', false),
  'product', JSON_OBJECT('title', 'Produkte - Kuehltuerme und HVAC Komponenten', 'description', 'Unser Produktprogramm: Offene und geschlossene Kuehltuerme, Verdunstungskuehler, Hybridkuehler und Zubehoer fuer industrielle Kuehlanwendungen.', 'og_image', '', 'no_index', false),
  'sparepart', JSON_OBJECT('title', 'Ersatzteile - Kuehlturm Ersatzteile', 'description', 'Original-Ersatzteile fuer Kuehltuerme: Fuellkoerper, Duesen, Ventilatoren, Antriebe und weitere Komponenten.', 'og_image', '', 'no_index', false),
  'service', JSON_OBJECT('title', 'Dienstleistungen - Engineering, Montage und Service', 'description', 'Umfassende Dienstleistungen: Planung, Fertigung, Montage, Modernisierung, Wartung, Leistungstests und Ersatzteilversorgung.', 'og_image', '', 'no_index', false),
  'solutions', JSON_OBJECT('title', 'Loesungen - Industrielle Kuehlloesungen', 'description', 'Massgeschneiderte Kuehlloesungen fuer verschiedene Industriezweige. Energieeffiziente und nachhaltige Technologien.', 'og_image', '', 'no_index', false),
  'about', JSON_OBJECT('title', 'Ueber uns - Ensotek GmbH', 'description', 'Erfahren Sie mehr ueber Ensotek: Unsere Geschichte, unser Team und unsere Mission in der industriellen Kuehl- und Klimatechnik.', 'og_image', '', 'no_index', false),
  'team', JSON_OBJECT('title', 'Unser Team', 'description', 'Lernen Sie unser erfahrenes Team aus Ingenieuren, Technikern und Fachkraeften kennen.', 'og_image', '', 'no_index', false),
  'mission_vision', JSON_OBJECT('title', 'Mission und Vision', 'description', 'Unsere Mission und Vision: Nachhaltige und effiziente Kuehlloesungen fuer die Industrie von morgen.', 'og_image', '', 'no_index', false),
  'quality', JSON_OBJECT('title', 'Qualitaet und Zertifizierungen', 'description', 'Unsere Qualitaetsstandards, Zertifizierungen und Pruefverfahren fuer hoechste Produktqualitaet.', 'og_image', '', 'no_index', false),
  'news', JSON_OBJECT('title', 'Neuigkeiten - Aktuelles von Ensotek', 'description', 'Neuigkeiten, Fachartikel und Updates aus der Welt der industriellen Kuehltechnik und HVAC.', 'og_image', '', 'no_index', false),
  'blog', JSON_OBJECT('title', 'Blog - Fachartikel und Wissen', 'description', 'Technische Fachartikel, Branchenwissen und Einblicke in die industrielle Kuehltechnik.', 'og_image', '', 'no_index', false),
  'library', JSON_OBJECT('title', 'Bibliothek - Dokumente und Downloads', 'description', 'Technische Dokumentation, Datenblaetter, Kataloge und Downloads rund um unsere Produkte.', 'og_image', '', 'no_index', false),
  'faqs', JSON_OBJECT('title', 'Haeufig gestellte Fragen', 'description', 'Antworten auf die haeufigsten Fragen zu unseren Kuehltuermen, Dienstleistungen und Produkten.', 'og_image', '', 'no_index', false),
  'contact', JSON_OBJECT('title', 'Kontakt - Ensotek erreichen', 'description', 'Nehmen Sie Kontakt mit uns auf. Wir beraten Sie gerne zu unseren Kuehltuermen, HVAC-Loesungen und Serviceangeboten.', 'og_image', '', 'no_index', false),
  'offer', JSON_OBJECT('title', 'Angebot anfordern', 'description', 'Fordern Sie ein unverbindliches Angebot fuer Kuehltuerme, HVAC-Systeme oder Serviceleistungen an.', 'og_image', '', 'no_index', false),
  'legal', JSON_OBJECT('title', 'Rechtliches - Datenschutz, AGB und Impressum', 'description', 'Rechtliche Informationen: Datenschutzerklaerung, Allgemeine Geschaeftsbedingungen und Impressum.', 'og_image', '', 'no_index', true)
) AS CHAR CHARACTER SET utf8mb4);

SET @SEO_PAGES_EN := CAST(JSON_OBJECT(
  'home', JSON_OBJECT('title', 'Ensotek - Industrial Cooling and HVAC Solutions', 'description', 'Leading provider of industrial cooling towers, evaporative coolers and HVAC solutions. Custom engineered technology for industry.', 'og_image', '', 'no_index', false),
  'product', JSON_OBJECT('title', 'Products - Cooling Towers and HVAC Components', 'description', 'Our product range: Open and closed circuit cooling towers, evaporative coolers, hybrid coolers and accessories for industrial cooling.', 'og_image', '', 'no_index', false),
  'sparepart', JSON_OBJECT('title', 'Spare Parts - Cooling Tower Components', 'description', 'Original spare parts for cooling towers: Fill media, nozzles, fans, drives and other components.', 'og_image', '', 'no_index', false),
  'service', JSON_OBJECT('title', 'Services - Engineering, Installation and Maintenance', 'description', 'Comprehensive services: Engineering, manufacturing, installation, modernization, maintenance, performance testing and spare parts.', 'og_image', '', 'no_index', false),
  'solutions', JSON_OBJECT('title', 'Solutions - Industrial Cooling Solutions', 'description', 'Custom cooling solutions for various industries. Energy-efficient and sustainable technologies.', 'og_image', '', 'no_index', false),
  'about', JSON_OBJECT('title', 'About Us - Ensotek', 'description', 'Learn more about Ensotek: Our history, team and mission in industrial cooling and HVAC technology.', 'og_image', '', 'no_index', false),
  'team', JSON_OBJECT('title', 'Our Team', 'description', 'Meet our experienced team of engineers, technicians and specialists.', 'og_image', '', 'no_index', false),
  'mission_vision', JSON_OBJECT('title', 'Mission and Vision', 'description', 'Our mission and vision: Sustainable and efficient cooling solutions for the industry of tomorrow.', 'og_image', '', 'no_index', false),
  'quality', JSON_OBJECT('title', 'Quality and Certifications', 'description', 'Our quality standards, certifications and testing procedures for the highest product quality.', 'og_image', '', 'no_index', false),
  'news', JSON_OBJECT('title', 'News - Updates from Ensotek', 'description', 'News, technical articles and updates from the world of industrial cooling and HVAC.', 'og_image', '', 'no_index', false),
  'blog', JSON_OBJECT('title', 'Blog - Technical Articles and Knowledge', 'description', 'Technical articles, industry knowledge and insights into industrial cooling technology.', 'og_image', '', 'no_index', false),
  'library', JSON_OBJECT('title', 'Library - Documents and Downloads', 'description', 'Technical documentation, datasheets, catalogs and downloads for our products.', 'og_image', '', 'no_index', false),
  'faqs', JSON_OBJECT('title', 'Frequently Asked Questions', 'description', 'Answers to the most common questions about our cooling towers, services and products.', 'og_image', '', 'no_index', false),
  'contact', JSON_OBJECT('title', 'Contact - Get in Touch', 'description', 'Contact us for consultation on cooling towers, HVAC solutions and service offerings.', 'og_image', '', 'no_index', false),
  'offer', JSON_OBJECT('title', 'Request a Quote', 'description', 'Request a non-binding quote for cooling towers, HVAC systems or service solutions.', 'og_image', '', 'no_index', false),
  'legal', JSON_OBJECT('title', 'Legal - Privacy, Terms and Imprint', 'description', 'Legal information: Privacy policy, terms and conditions and imprint.', 'og_image', '', 'no_index', true)
) AS CHAR CHARACTER SET utf8mb4);

SET @SEO_PAGES_TR := CAST(JSON_OBJECT(
  'home', JSON_OBJECT('title', 'Ensotek - Endustriyel Sogutma ve Iklimlendirme', 'description', 'Endustriyel sogutma kulesi, evaporatif sogutma ve HVAC cozumlerinde lider. Sanayi ve ticaret icin ozel muhendislik cozumleri.', 'og_image', '', 'no_index', false),
  'product', JSON_OBJECT('title', 'Urunler - Sogutma Kuleleri ve HVAC Bilesenleri', 'description', 'Urun yelpazemiz: Acik ve kapali devre sogutma kuleleri, evaporatif sogutucular, hibrit sogutucular ve endustriyel sogutma aksesuarlari.', 'og_image', '', 'no_index', false),
  'sparepart', JSON_OBJECT('title', 'Yedek Parcalar - Sogutma Kulesi Bilesenleri', 'description', 'Sogutma kuleleri icin orijinal yedek parcalar: Dolgu gövdeleri, nozullar, fanlar, tahrikler ve diger bilesenler.', 'og_image', '', 'no_index', false),
  'service', JSON_OBJECT('title', 'Hizmetler - Muhendislik, Montaj ve Servis', 'description', 'Kapsamli hizmetler: Tasarim, uretim, montaj, modernizasyon, bakim, performans testi ve yedek parca temini.', 'og_image', '', 'no_index', false),
  'solutions', JSON_OBJECT('title', 'Cozumler - Endustriyel Sogutma Cozumleri', 'description', 'Farkli sektorler icin ozel sogutma cozumleri. Enerji verimli ve surdurulebilir teknolojiler.', 'og_image', '', 'no_index', false),
  'about', JSON_OBJECT('title', 'Hakkimizda - Ensotek', 'description', 'Ensotek hakkinda: Tarihimiz, ekibimiz ve endustriyel sogutma ve iklimlendirme teknolojisindeki misyonumuz.', 'og_image', '', 'no_index', false),
  'team', JSON_OBJECT('title', 'Ekibimiz', 'description', 'Deneyimli muhendis, teknisyen ve uzmanlardan olusan ekibimizle tanisin.', 'og_image', '', 'no_index', false),
  'mission_vision', JSON_OBJECT('title', 'Misyon ve Vizyon', 'description', 'Misyonumuz ve vizyonumuz: Yarinin sanayisi icin surdurulebilir ve verimli sogutma cozumleri.', 'og_image', '', 'no_index', false),
  'quality', JSON_OBJECT('title', 'Kalite ve Sertifikalar', 'description', 'Kalite standartlarimiz, sertifikalarimiz ve en yuksek urun kalitesi icin test prosedurlerimiz.', 'og_image', '', 'no_index', false),
  'news', JSON_OBJECT('title', 'Haberler - Ensotek Guncel', 'description', 'Endustriyel sogutma ve HVAC dunyasindan haberler, teknik makaleler ve guncellemeler.', 'og_image', '', 'no_index', false),
  'blog', JSON_OBJECT('title', 'Blog - Teknik Yazilar ve Bilgi', 'description', 'Teknik makaleler, sektor bilgisi ve endustriyel sogutma teknolojisine dair icgoruler.', 'og_image', '', 'no_index', false),
  'library', JSON_OBJECT('title', 'Kutuphane - Dokumanlar ve Indirmeler', 'description', 'Teknik dokumantasyon, veri sayfalari, kataloglar ve urunlerimize ait indirmeler.', 'og_image', '', 'no_index', false),
  'faqs', JSON_OBJECT('title', 'Sikca Sorulan Sorular', 'description', 'Sogutma kuleleri, hizmetlerimiz ve urunlerimiz hakkinda en sik sorulan sorularin yanitlari.', 'og_image', '', 'no_index', false),
  'contact', JSON_OBJECT('title', 'Iletisim - Bize Ulasin', 'description', 'Sogutma kuleleri, HVAC cozumleri ve servis tekliflerimiz icin bizimle iletisime gecin.', 'og_image', '', 'no_index', false),
  'offer', JSON_OBJECT('title', 'Teklif Isteyin', 'description', 'Sogutma kuleleri, HVAC sistemleri veya servis cozumleri icin baglayici olmayan teklif isteyin.', 'og_image', '', 'no_index', false),
  'legal', JSON_OBJECT('title', 'Yasal - Gizlilik, Kosullar ve Kunye', 'description', 'Yasal bilgiler: Gizlilik politikasi, kullanim kosullari ve kunye.', 'og_image', '', 'no_index', true)
) AS CHAR CHARACTER SET utf8mb4);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'seo_pages', 'de', @SEO_PAGES_DE, NOW(3), NOW(3)),
(UUID(), 'seo_pages', 'en', @SEO_PAGES_EN, NOW(3), NOW(3)),
(UUID(), 'seo_pages', 'tr', @SEO_PAGES_TR, NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;

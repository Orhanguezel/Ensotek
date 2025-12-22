-- =============================================================
-- 100_library_de.sql  (parent seeds + DE tags + DE i18n for seed docs)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- =========================================================
-- KATEGORİ / ALT KATEGORİ
-- =========================================================
SET @LIB_CATEGORY_ID := (
  SELECT c.id
  FROM categories c
  WHERE c.module_key = 'library'
  LIMIT 1
);

SET @LIB_SUBCATEGORY_PDF := (
  SELECT sc.id
  FROM sub_categories sc
  JOIN sub_category_i18n sci
    ON sci.sub_category_id = sc.id
   AND sci.locale = 'tr'
   AND sci.slug   = 'pdf-dokumanlar'
  WHERE sc.category_id = @LIB_CATEGORY_ID
  LIMIT 1
);

-- =========================================================
-- 1) Kurumsal Tanıtım Broşürü (parent + DE i18n)
-- =========================================================
SET @LIB_BROCHURE_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'kurumsal-brosur'
  LIMIT 1
);
SET @LIB_BROCHURE_ID := COALESCE(@LIB_BROCHURE_ID, UUID());

INSERT INTO library
(id, is_published, is_active, display_order,
 tags_json,
 category_id, sub_category_id,
 author, views, download_count,
 published_at, created_at, updated_at)
VALUES
(@LIB_BROCHURE_ID,
  1, 1, 10,
  '{"tr":["broşür","pdf","ensotek","kurumsal"],"en":["brochure","pdf","ensotek","corporate"],"de":["broschuere","pdf","ensotek","unternehmen"]}',
  @LIB_CATEGORY_ID, @LIB_SUBCATEGORY_PDF,
  'Ensotek', 0, 0,
  NOW(3), NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
 is_published    = VALUES(is_published),
 is_active       = VALUES(is_active),
 display_order   = VALUES(display_order),
 tags_json       = VALUES(tags_json),
 category_id     = VALUES(category_id),
 sub_category_id = VALUES(sub_category_id),
 author          = VALUES(author),
 published_at    = VALUES(published_at),
 updated_at      = VALUES(updated_at);

-- DE i18n
INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_BROCHURE_ID, 'de',
  'Unternehmensbroschüre',
  'unternehmensbroschuere',
  'Kurzvorstellung von Ensotek, Leistungsumfang und Produkt-/Serviceübersicht als PDF.',
  CONCAT(
    '<h2>Unternehmensbroschüre</h2>',
    '<p>',
      'In dieser Broschüre finden Sie eine kompakte Übersicht über Ensotek, unsere Kompetenzen im Bereich ',
      'Kühlturmlösungen sowie unsere Service- und Produktpalette. Die PDF-Version kann als Download bereitgestellt werden.',
    '</p>',
    '<ul>',
      '<li>Unternehmensprofil</li>',
      '<li>Produkte und Anwendungen</li>',
      '<li>Serviceleistungen</li>',
      '<li>Kontakt und Projektanfrage</li>',
    '</ul>'
  ),
  'Unternehmensbroschüre | Ensotek',
  'Unternehmensbroschüre von Ensotek als PDF: Profil, Leistungen, Anwendungen und Kontakt.',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
 title            = VALUES(title),
 slug             = VALUES(slug),
 summary          = VALUES(summary),
 content          = VALUES(content),
 meta_title       = VALUES(meta_title),
 meta_description = VALUES(meta_description),
 updated_at       = VALUES(updated_at);

-- =========================================================
-- 2) Hizmet Rehberi (parent + DE i18n)
-- =========================================================
SET @LIB_GUIDE_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'hizmet-rehberi'
  LIMIT 1
);
SET @LIB_GUIDE_ID := COALESCE(@LIB_GUIDE_ID, UUID());

INSERT INTO library
(id, is_published, is_active, display_order,
 tags_json,
 category_id, sub_category_id,
 author, views, download_count,
 published_at, created_at, updated_at)
VALUES
(@LIB_GUIDE_ID,
  1, 1, 20,
  '{"tr":["rehber","pdf","hizmetler","ensotek"],"en":["guide","pdf","services","ensotek"],"de":["leitfaden","pdf","services","ensotek"]}',
  @LIB_CATEGORY_ID, @LIB_SUBCATEGORY_PDF,
  'Ensotek', 0, 0,
  NOW(3), NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
 is_published    = VALUES(is_published),
 is_active       = VALUES(is_active),
 display_order   = VALUES(display_order),
 tags_json       = VALUES(tags_json),
 category_id     = VALUES(category_id),
 sub_category_id = VALUES(sub_category_id),
 author          = VALUES(author),
 published_at    = VALUES(published_at),
 updated_at      = VALUES(updated_at);

-- DE i18n
INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_GUIDE_ID, 'de',
  'Service-Leitfaden',
  'service-leitfaden',
  'Leitfaden zu Ensotek Serviceleistungen: Wartung, Modernisierung, Engineering Support und Ersatzteile – als PDF.',
  CONCAT(
    '<h2>Service-Leitfaden</h2>',
    '<p>',
      'Dieser Leitfaden fasst die typischen Serviceleistungen von Ensotek strukturiert zusammen – von Wartung und ',
      'Störungsbehebung über Modernisierung bis hin zu Engineering Support und Ersatzteilversorgung. ',
      'Die PDF-Version kann als Download bereitgestellt werden.',
    '</p>',
    '<ul>',
      '<li>Wartung und Reparatur</li>',
      '<li>Modernisierung / Retrofit</li>',
      '<li>Ersatzteile und Komponenten</li>',
      '<li>Engineering Support und Beratung</li>',
    '</ul>'
  ),
  'Service-Leitfaden | Ensotek',
  'PDF-Leitfaden zu Ensotek Serviceleistungen: Wartung, Modernisierung, Ersatzteile und Engineering Support.',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
 title            = VALUES(title),
 slug             = VALUES(slug),
 summary          = VALUES(summary),
 content          = VALUES(content),
 meta_title       = VALUES(meta_title),
 meta_description = VALUES(meta_description),
 updated_at       = VALUES(updated_at);

-- =========================================================
-- 3) Yaz kuru / yaş termometre tasarım değerleri (parent + DE i18n)
-- =========================================================
SET @LIB_SUMMER_TW_ID := (
  SELECT l.id
  FROM library l
  JOIN library_i18n i ON i.library_id = l.id AND i.locale = 'tr'
  WHERE i.slug = 'yaz-kuru-yas-termometre-tasarim-degerleri'
  LIMIT 1
);
SET @LIB_SUMMER_TW_ID := COALESCE(@LIB_SUMMER_TW_ID, UUID());

INSERT INTO library
(id, is_published, is_active, display_order,
 tags_json,
 category_id, sub_category_id,
 author, views, download_count,
 published_at, created_at, updated_at)
VALUES
(@LIB_SUMMER_TW_ID,
  1, 1, 30,
  '{
    "tr":["yaz tasarım sıcaklığı","kuru termometre","yaş termometre","soğutma kulesi","iklim verisi","tasarım verisi"],
    "en":["summer design temperature","dry-bulb","wet-bulb","cooling tower","climate data","design data"],
    "de":["sommer-auslegung","trockentemperatur","feuchttemperatur","kuehlturm","klimadaten","auslegungsdaten"]
  }',
  @LIB_CATEGORY_ID, @LIB_SUBCATEGORY_PDF,
  'Ensotek', 0, 0,
  NOW(3), NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
 is_published    = VALUES(is_published),
 is_active       = VALUES(is_active),
 display_order   = VALUES(display_order),
 tags_json       = VALUES(tags_json),
 category_id     = VALUES(category_id),
 sub_category_id = VALUES(sub_category_id),
 author          = VALUES(author),
 published_at    = VALUES(published_at),
 updated_at      = VALUES(updated_at);

-- DE i18n
INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(
  UUID(), @LIB_SUMMER_TW_ID, 'de',
  'Sommer-Auslegungswerte: Trocken- und Feuchttemperatur',
  'sommer-auslegungswerte-trocken-feucht',
  'Auslegungsübersicht zu Sommer-Klimadaten (Trocken-/Feuchttemperatur) als Grundlage für Kühlturmauslegung und -auswahl.',
  CONCAT(
    '<h2>Sommer-Auslegungswerte: Trocken- und Feuchttemperatur</h2>',
    '<p>',
      'Für die Auslegung von Verdunstungskühltürmen ist die <strong>Sommer-Feuchttemperatur (Wet-Bulb)</strong> ',
      'eine der wichtigsten Klimagrößen. Ergänzend wird häufig die <strong>Trockenlufttemperatur (Dry-Bulb)</strong> ',
      'herangezogen, um Randbedingungen, Leistungsreserven und Betriebsszenarien sauber zu bewerten.',
    '</p>',
    '<p>',
      'Dieses Dokument kann als Tabelle/Anlage (PDF) gepflegt werden, z. B. nach Stadt/Region, mit typischen ',
      'Sommer-Auslegungswerten. Damit werden Anfragen, Vorbemessung und Angebotsphase deutlich robuster.',
    '</p>'
  ),
  'Sommer-Auslegungswerte Trocken-/Feuchttemperatur | Ensotek',
  'Sommer-Klimadaten (Dry-Bulb/Wet-Bulb) als Auslegungsgrundlage für Kühltürme: Übersicht und Einsatz im Auswahlprozess.',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
 title            = VALUES(title),
 slug             = VALUES(slug),
 summary          = VALUES(summary),
 content          = VALUES(content),
 meta_title       = VALUES(meta_title),
 meta_description = VALUES(meta_description),
 updated_at       = VALUES(updated_at);

COMMIT;

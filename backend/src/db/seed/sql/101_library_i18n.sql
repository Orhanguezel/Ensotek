-- =============================================================
-- 101_library_i18n.sql (only seeds)
-- =============================================================

/* ================= SEED: TR ================= */

-- Kurumsal Tanıtım Broşürü (TR)
INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(UUID(), @LIB_BROCHURE_ID, 'tr',
 'Kurumsal Tanıtım Broşürü', 'kurumsal-brosur',
 'Ensotek\'in endüstriyel soğutma kuleleri, hizmetleri ve referans projelerini özetleyen PDF broşür.',
 '<p>Bu kurumsal broşür, Ensotek\'in endüstriyel su soğutma kuleleri, bakım ve modernizasyon hizmetleri ile farklı sektörlerde gerçekleştirdiği projeleri özetler.</p>',
 'Ensotek Kurumsal Tanıtım Broşürü',
 'Ensotek çözümlerini ve referans projelerini içeren kurumsal PDF broşür.',
 NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
 title            = VALUES(title),
 slug             = VALUES(slug),
 summary          = VALUES(summary),
 content          = VALUES(content),
 meta_title       = VALUES(meta_title),
 meta_description = VALUES(meta_description),
 updated_at       = VALUES(updated_at);

-- Hizmet Rehberi (TR)
INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(UUID(), @LIB_GUIDE_ID, 'tr',
 'Hizmet Rehberi', 'hizmet-rehberi',
 'Ensotek\'in üretim, bakım-onarım, modernizasyon, yedek parça ve mühendislik hizmetlerini özetleyen PDF rehberi.',
 '<p>Bu hizmet rehberi; üretim, bakım ve onarım, modernizasyon, yedek parçalar, uygulamalar ve mühendislik desteği dahil olmak üzere Ensotek\'in sunduğu hizmetleri ayrıntılı olarak açıklar.</p>',
 'Ensotek Hizmet Rehberi',
 'Ensotek\'in soğutma kuleleri ve ilgili mühendislik hizmetlerini anlatan PDF rehber.',
 NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
 title            = VALUES(title),
 slug             = VALUES(slug),
 summary          = VALUES(summary),
 content          = VALUES(content),
 meta_title       = VALUES(meta_title),
 meta_description = VALUES(meta_description),
 updated_at       = VALUES(updated_at);


/* ================= SEED: EN ================= */

-- Company Brochure (EN)
INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(UUID(), @LIB_BROCHURE_ID, 'en',
 'Company Brochure', 'company-brochure',
 'PDF brochure that summarizes Ensotek\'s cooling tower solutions, services and reference projects.',
 '<p>This company brochure presents Ensotek\'s industrial cooling tower solutions, maintenance and modernization services, as well as selected reference projects in English.</p>',
 'Ensotek Company Brochure',
 'Corporate PDF brochure about Ensotek\'s solutions and services.',
 NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
 title            = VALUES(title),
 slug             = VALUES(slug),
 summary          = VALUES(summary),
 content          = VALUES(content),
 meta_title       = VALUES(meta_title),
 meta_description = VALUES(meta_description),
 updated_at       = VALUES(updated_at);

-- Service Guide (EN)
INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
VALUES
(UUID(), @LIB_GUIDE_ID, 'en',
 'Service Guide', 'service-guide',
 'PDF guide that describes Ensotek\'s main services such as production, maintenance, modernization, spare parts and engineering support.',
 '<p>A compact guide that explains Ensotek\'s production, maintenance & repair, modernization, spare parts and engineering support services for industrial cooling towers.</p>',
 'Ensotek Service Guide',
 'PDF guide that presents Ensotek\'s cooling tower services.',
 NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
 title            = VALUES(title),
 slug             = VALUES(slug),
 summary          = VALUES(summary),
 content          = VALUES(content),
 meta_title       = VALUES(meta_title),
 meta_description = VALUES(meta_description),
 updated_at       = VALUES(updated_at);


/* Eksik EN çevirileri için TR’den kopya (slug TR’den gelir) */
INSERT INTO library_i18n
(id, library_id, locale, title, slug, summary, content,
 meta_title, meta_description, created_at, updated_at)
SELECT
  UUID(), s.library_id, 'en',
  s.title, s.slug, s.summary, s.content,
  s.meta_title, s.meta_description,
  NOW(3), NOW(3)
FROM library_i18n s
WHERE s.locale = 'tr'
  AND NOT EXISTS (
    SELECT 1 FROM library_i18n t
    WHERE t.library_id = s.library_id
      AND t.locale = 'en'
  );

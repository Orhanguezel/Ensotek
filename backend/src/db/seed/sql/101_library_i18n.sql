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
 'Ajansın sunduğu hizmetleri ve referansları özetleyen PDF broşür.',
 JSON_OBJECT('html','<p>Ajansımızın hizmetlerini, süreçlerini ve öne çıkan projelerini içeren kurumsal tanıtım broşürüdür.</p>'),
 'Kurumsal Tanıtım Broşürü',
 'Ajans ve hizmet tanıtımını içeren kurumsal PDF broşür.',
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
 'Ajansın sunduğu dijital ve kreatif hizmetlerin kısa özeti.',
 JSON_OBJECT('html','<p>Tasarım, yazılım geliştirme, e-ticaret, performans optimizasyonu ve danışmanlık hizmetlerini içeren kapsamlı hizmet rehberi.</p>'),
 'Hizmet Rehberi',
 'Dijital ajans hizmetlerini anlatan PDF rehber.',
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
 'PDF brochure that summarizes our agency, services and selected projects.',
 JSON_OBJECT('html','<p>This company brochure presents our digital services, workflow and selected case studies in English.</p>'),
 'Company Brochure',
 'Corporate PDF brochure about our agency and services.',
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
 'PDF guide that describes our main digital and creative services.',
 JSON_OBJECT('html','<p>A compact guide that explains our design, development, e-commerce and consulting services in English.</p>'),
 'Service Guide',
 'PDF guide that presents our digital services.',
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

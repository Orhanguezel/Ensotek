-- =============================================================
-- 048_site_settings_ui_feedback.sql  (Feedback / Reviews UI metinleri)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
VALUES
-- -------------------------------------------------------------
-- TR
-- -------------------------------------------------------------
(
  UUID(),
  'ui_feedback',
  'tr',
  JSON_OBJECT(
    -- Section header
    'ui_feedback_subprefix',      'Ensotek',
    'ui_feedback_sublabel',       'Müşteri Yorumları',
    'ui_feedback_title',          'Müşterilerimizin bizim hakkımızda söyledikleri',
    'ui_feedback_paragraph',      'Müşteri geri bildirimleri, mühendislik ve hizmet kalitemizi sürekli geliştirmemize yardımcı oluyor.',

    -- Role / meta
    'ui_feedback_role_customer',  'Müşteri',

    -- Navigation
    'ui_feedback_prev',           'Önceki yorum',
    'ui_feedback_next',           'Sonraki yorum',

    -- Placeholder slide texts (backend’ten veri yoksa)
    'ui_feedback_placeholder_1',  'B2B SaaS müşterimizin web sitesi trafiğini yalnızca 3 ayda %300''ün üzerinde artırdık.',
    'ui_feedback_placeholder_2',  'Hedefli içerik ve teknik SEO, tüm kanallarda düzenli ve bileşik bir büyüme sağladı.',
    'ui_feedback_placeholder_3',  'Net raporlama ve öngörülebilir teslimat — ölçeklemek için tam olarak ihtiyacımız olan şey buydu.'
  ),
  NOW(3),
  NOW(3)
),
-- -------------------------------------------------------------
-- EN
-- -------------------------------------------------------------
(
  UUID(),
  'ui_feedback',
  'en',
  JSON_OBJECT(
    -- Section header
    'ui_feedback_subprefix',      'Ensotek',
    'ui_feedback_sublabel',       'Customers',
    'ui_feedback_title',          'What our customers say about us',
    'ui_feedback_paragraph',      'Customer feedback helps us continuously improve our engineering and service quality.',

    -- Role / meta
    'ui_feedback_role_customer',  'Customer',

    -- Navigation
    'ui_feedback_prev',           'Previous testimonial',
    'ui_feedback_next',           'Next testimonial',

    -- Placeholder slide texts (used when no backend data yet)
    'ui_feedback_placeholder_1',  'We increased our B2B SaaS client''s website traffic by over 300% in just 3 months.',
    'ui_feedback_placeholder_2',  'Targeted content + technical SEO gave us consistent, compounding growth across all funnels.',
    'ui_feedback_placeholder_3',  'Clear reporting and predictable delivery — exactly what we needed to scale.'
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`    = VALUES(`value`),
  updated_at = VALUES(updated_at);

-- -------------------------------------------------------------
-- TR → DE otomatik kopya (Almanca özel çeviri gelene kadar)
-- -------------------------------------------------------------
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
SELECT UUID(), s.`key`, 'de', s.`value`, NOW(3), NOW(3)
FROM site_settings s
WHERE s.locale = 'tr'
  AND s.`key` = 'ui_feedback'
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE t.`key` = s.`key`
      AND t.locale = 'de'
  );

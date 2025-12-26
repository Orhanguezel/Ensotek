-- =============================================================
-- 045_site_settings_ui_newsletter.sql  (Newsletter UI strings)
--  - Key: ui_newsletter
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Extendable: clone from tr as bootstrap (collation-safe)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_newsletter',
  'de',
  CAST(JSON_OBJECT(
    'ui_newsletter_section_aria', 'Bülten aboneliği alanı',
    'ui_newsletter_title',        'Güncel kalın',
    'ui_newsletter_desc',         'Projelerimiz ve çözümlerimiz hakkında haberleri e-posta ile alın.',
    'ui_newsletter_placeholder',  'E-posta adresiniz',
    'ui_newsletter_email_aria',   'E-posta adresiniz',
    'ui_newsletter_cta',          'Bültene abone ol',
    'ui_newsletter_ok',           'Başarıyla abone oldunuz, teşekkürler!',
    'ui_newsletter_fail',         'Abonelik işlemi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_newsletter',
  'en',
  CAST(JSON_OBJECT(
    'ui_newsletter_section_aria', 'Newsletter subscription section',
    'ui_newsletter_title',        'Stay updated',
    'ui_newsletter_desc',         'Receive news about our projects and solutions by email.',
    'ui_newsletter_placeholder',  'Your email address',
    'ui_newsletter_email_aria',   'Your email address',
    'ui_newsletter_cta',          'Subscribe to newsletter',
    'ui_newsletter_ok',           'You have been subscribed. Thank you!',
    'ui_newsletter_fail',         'An error occurred while subscribing. Please try again later.'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_newsletter',
  'de',
  CAST(JSON_OBJECT(
    'ui_newsletter_section_aria', 'Bereich für Newsletter-Anmeldung',
    'ui_newsletter_title',        'Bleiben Sie auf dem Laufenden',
    'ui_newsletter_desc',         'Erhalten Sie Neuigkeiten zu unseren Projekten und Lösungen per E-Mail.',
    'ui_newsletter_placeholder',  'Ihre E-Mail-Adresse',
    'ui_newsletter_email_aria',   'Ihre E-Mail-Adresse',
    'ui_newsletter_cta',          'Newsletter abonnieren',
    'ui_newsletter_ok',           'Sie wurden erfolgreich abonniert. Vielen Dank!',
    'ui_newsletter_fail',         'Beim Abonnieren ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
  ) AS CHAR),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- -------------------------------------------------------------
-- OPTIONAL BOOTSTRAP CLONE (COLLATION-SAFE): TR → TARGET
-- (DE seed var; yeni dil ekleyince @TARGET_LOCALE değiştir.)
-- -------------------------------------------------------------
SET @TARGET_LOCALE := 'de';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
SELECT
  UUID(),
  s.`key`,
  CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci,
  s.`value`,
  NOW(3),
  NOW(3)
FROM site_settings s
WHERE (s.locale COLLATE utf8mb4_unicode_ci) = ('de' COLLATE utf8mb4_unicode_ci)
  AND (s.`key`  COLLATE utf8mb4_unicode_ci) = ('ui_newsletter' COLLATE utf8mb4_unicode_ci)
  AND (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci) <> ('de' COLLATE utf8mb4_unicode_ci)
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE (t.`key`  COLLATE utf8mb4_unicode_ci) = (s.`key` COLLATE utf8mb4_unicode_ci)
      AND (t.locale COLLATE utf8mb4_unicode_ci) = (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci)
  );

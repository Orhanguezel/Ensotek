-- =============================================================
-- 171_footer_sections_seed.sql
-- Seed for footer_sections + footer_sections_i18n (tr, en, de)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- ============================================================
-- 1) PARENT KAYITLAR (footer_sections)
-- ============================================================

INSERT INTO `footer_sections`
(`id`, `is_active`, `display_order`, `created_at`, `updated_at`)
VALUES
-- Hızlı Erişim
('59583ef1-0ba1-4c7c-b806-84fd204b52b9', 1, 0, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),

-- Kurumsal
('f942a930-6743-4ecc-b4b3-1fd6b77f9d77', 1, 1, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000')
ON DUPLICATE KEY UPDATE
  `is_active`     = VALUES(`is_active`),
  `display_order` = VALUES(`display_order`),
  `updated_at`    = CURRENT_TIMESTAMP(3);

-- ============================================================
-- 2) I18N KAYITLAR (footer_sections_i18n) – locale: 'tr'
-- ============================================================

INSERT INTO `footer_sections_i18n`
(`id`, `section_id`, `locale`, `title`, `slug`, `description`, `created_at`, `updated_at`)
VALUES
-- Hızlı Erişim (tr)
('69583ef1-0ba1-4c7c-b806-84fd204b52b9',
 '59583ef1-0ba1-4c7c-b806-84fd204b52b9',
 'tr',
 'Hızlı Erişim',
 'hizli-erisim',
 'Sık kullanılan sayfalara hızlı erişim bağlantıları.',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

-- Kurumsal (tr)
('f942a930-6743-4ecc-b4b3-1fd6b77f9d78',
 'f942a930-6743-4ecc-b4b3-1fd6b77f9d77',
 'tr',
 'Kurumsal',
 'kurumsal',
 'Şirket ve yasal bilgilere ait bağlantılar.',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000')
ON DUPLICATE KEY UPDATE
  `title`       = VALUES(`title`),
  `slug`        = VALUES(`slug`),
  `description` = VALUES(`description`),
  `updated_at`  = CURRENT_TIMESTAMP(3);

-- ============================================================
-- 3) I18N KAYITLAR (footer_sections_i18n) – locale: 'en'
-- ============================================================

INSERT INTO `footer_sections_i18n`
(`id`, `section_id`, `locale`, `title`, `slug`, `description`, `created_at`, `updated_at`)
VALUES
-- Quick Access (en)
('09583ef1-0ba1-4c7c-b806-84fd204b52b9',
 '59583ef1-0ba1-4c7c-b806-84fd204b52b9',
 'en',
 'Quick Access',
 'quick-access',
 'Quick links to the most frequently used pages.',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

-- Corporate (en)
('e942a930-6743-4ecc-b4b3-1fd6b77f9d77',
 'f942a930-6743-4ecc-b4b3-1fd6b77f9d77',
 'en',
 'Corporate',
 'corporate',
 'Links about the company, legal pages and corporate information.',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000')
ON DUPLICATE KEY UPDATE
  `title`       = VALUES(`title`),
  `slug`        = VALUES(`slug`),
  `description` = VALUES(`description`),
  `updated_at`  = CURRENT_TIMESTAMP(3);

-- ============================================================
-- 4) I18N KAYITLAR (footer_sections_i18n) – locale: 'de'
-- ============================================================

INSERT INTO `footer_sections_i18n`
(`id`, `section_id`, `locale`, `title`, `slug`, `description`, `created_at`, `updated_at`)
VALUES
-- Schnellzugriff (de)
('2cdd0c4b-6c31-4a5b-9d92-9b1a9d2fe0a1',
 '59583ef1-0ba1-4c7c-b806-84fd204b52b9',
 'de',
 'Schnellzugriff',
 'schnellzugriff',
 'Schnelllinks zu den am häufigsten verwendeten Seiten.',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

-- Unternehmen (de)
('9e68f2b1-36f7-4c7a-9c79-3b8a51f9d7d1',
 'f942a930-6743-4ecc-b4b3-1fd6b77f9d77',
 'de',
 'Unternehmen',
 'unternehmen',
 'Links zum Unternehmen, rechtlichen Seiten und Unternehmensinformationen.',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000')
ON DUPLICATE KEY UPDATE
  `title`       = VALUES(`title`),
  `slug`        = VALUES(`slug`),
  `description` = VALUES(`description`),
  `updated_at`  = CURRENT_TIMESTAMP(3);

COMMIT;

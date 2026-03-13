-- =============================================================
-- FILE: 161_footer_sections_seed.sql
-- Seed for footer_sections + footer_sections_i18n (tr, en, de)
-- Ensotek – Expanded + B2B-aligned (FINAL, no inactive)
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
-- Quick Access
('59583ef1-0ba1-4c7c-b806-84fd204b52b9', 1, 0, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),

-- Services
('a0e2b2a9-7f0d-4f30-9a64-3ed7bd1d3c10', 1, 1, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),

-- Corporate / Legal
('f942a930-6743-4ecc-b4b3-1fd6b77f9d77', 1, 2, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000'),

-- Social
('b3b7e7b2-7d75-4c5f-9b9d-8f0d3c1a0d77', 1, 3, '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000')
ON DUPLICATE KEY UPDATE
  `is_active`     = VALUES(`is_active`),
  `display_order` = VALUES(`display_order`),
  `updated_at`    = CURRENT_TIMESTAMP(3);

-- ============================================================
-- 2) I18N – tr
-- ============================================================

INSERT INTO `footer_sections_i18n`
(`id`, `section_id`, `locale`, `title`, `slug`, `description`, `created_at`, `updated_at`)
VALUES
('69583ef1-0ba1-4c7c-b806-84fd204b52b9',
 '59583ef1-0ba1-4c7c-b806-84fd204b52b9',
 'tr',
 'Hızlı Erişim',
 'hizli-erisim',
 'Kurumsal sayfalara ve sık kullanılan bağlantılara hızlı erişim.',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('b7d2d4c0-0e2b-4d7c-8a6f-6b1d6c2f1a21',
 'a0e2b2a9-7f0d-4f30-9a64-3ed7bd1d3c10',
 'tr',
 'Hizmetler',
 'hizmetler',
 'Bakım, retrofit, mühendislik ve proje hizmetlerimiz.',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('f942a930-6743-4ecc-b4b3-1fd6b77f9d78',
 'f942a930-6743-4ecc-b4b3-1fd6b77f9d77',
 'tr',
 'Kurumsal',
 'kurumsal',
 'Şirket ve yasal bilgilere ait bağlantılar.',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('9c6b19d1-7f3a-4c0b-8fb6-5d0d1e0c7a11',
 'b3b7e7b2-7d75-4c5f-9b9d-8f0d3c1a0d77',
 'tr',
 'Sosyal',
 'sosyal',
 'Sosyal medya hesaplarımız.',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000')
ON DUPLICATE KEY UPDATE
  `title`       = VALUES(`title`),
  `slug`        = VALUES(`slug`),
  `description` = VALUES(`description`),
  `updated_at`  = CURRENT_TIMESTAMP(3);

-- ============================================================
-- 3) I18N – en
-- ============================================================

INSERT INTO `footer_sections_i18n`
(`id`, `section_id`, `locale`, `title`, `slug`, `description`, `created_at`, `updated_at`)
VALUES
('09583ef1-0ba1-4c7c-b806-84fd204b52b9',
 '59583ef1-0ba1-4c7c-b806-84fd204b52b9',
 'en',
 'Quick Access',
 'quick-access',
 'Quick links to corporate pages and frequently used resources.',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('c1a9c1a2-6c6b-4a88-9c5a-0c4cf0a2f7b1',
 'a0e2b2a9-7f0d-4f30-9a64-3ed7bd1d3c10',
 'en',
 'Services',
 'services',
 'Maintenance, retrofit, engineering and project services.',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('e942a930-6743-4ecc-b4b3-1fd6b77f9d77',
 'f942a930-6743-4ecc-b4b3-1fd6b77f9d77',
 'en',
 'Legal',
 'legal',
 'Legal pages and compliance information.',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('1a6a2c0b-0fd1-4e3b-98c8-6d2c7c1d7a21',
 'b3b7e7b2-7d75-4c5f-9b9d-8f0d3c1a0d77',
 'en',
 'Social',
 'social',
 'Our social media channels.',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000')
ON DUPLICATE KEY UPDATE
  `title`       = VALUES(`title`),
  `slug`        = VALUES(`slug`),
  `description` = VALUES(`description`),
  `updated_at`  = CURRENT_TIMESTAMP(3);

-- ============================================================
-- 4) I18N – de
-- ============================================================

INSERT INTO `footer_sections_i18n`
(`id`, `section_id`, `locale`, `title`, `slug`, `description`, `created_at`, `updated_at`)
VALUES
('2cdd0c4b-6c31-4a5b-9d92-9b1a9d2fe0a1',
 '59583ef1-0ba1-4c7c-b806-84fd204b52b9',
 'de',
 'Schnellzugriff',
 'schnellzugriff',
 'Schnelllinks zu Unternehmensseiten und häufig genutzten Ressourcen.',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('d7b2fb1e-2ef5-4a73-9f31-6f1a0f4d9a10',
 'a0e2b2a9-7f0d-4f30-9a64-3ed7bd1d3c10',
 'de',
 'Leistungen',
 'leistungen',
 'Wartung, Retrofit, Engineering und Projektleistungen.',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('9e68f2b1-36f7-4c7a-9c79-3b8a51f9d7d1',
 'f942a930-6743-4ecc-b4b3-1fd6b77f9d77',
 'de',
 'Rechtliches',
 'rechtliches',
 'Rechtliche Seiten und Compliance-Informationen.',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000'),

('7d2f1b3a-4d7a-4f8f-9b11-2a0c6d7a1f33',
 'b3b7e7b2-7d75-4c5f-9b9d-8f0d3c1a0d77',
 'de',
 'Social Media',
 'social-media',
 'Unsere Social-Media-Kanäle.',
 '2024-01-01 00:00:00.000',
 '2024-01-01 00:00:00.000')
ON DUPLICATE KEY UPDATE
  `title`       = VALUES(`title`),
  `slug`        = VALUES(`slug`),
  `description` = VALUES(`description`),
  `updated_at`  = CURRENT_TIMESTAMP(3);

COMMIT;

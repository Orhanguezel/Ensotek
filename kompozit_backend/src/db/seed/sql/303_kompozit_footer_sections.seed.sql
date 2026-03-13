-- =============================================================
-- FILE: 303_kompozit_footer_sections.seed.sql
-- MOE Kompozit — footer sections (TR/EN)
-- site_id = 'kompozit'
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =============================================================
-- 1) PARENT (footer_sections)
-- =============================================================
INSERT INTO `footer_sections`
(`id`, `site_id`, `is_active`, `display_order`, `created_at`, `updated_at`)
VALUES
-- Hızlı Erişim
('ee010001-4001-4001-8001-ee0000000001', 'kompozit', 1, 0, NOW(3), NOW(3)),
-- Yasal
('ee010002-4002-4002-8002-ee0000000002', 'kompozit', 1, 1, NOW(3), NOW(3)),
-- Sosyal
('ee010003-4003-4003-8003-ee0000000003', 'kompozit', 1, 2, NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `site_id`       = VALUES(`site_id`),
  `is_active`     = VALUES(`is_active`),
  `display_order` = VALUES(`display_order`),
  `updated_at`    = CURRENT_TIMESTAMP(3);

-- =============================================================
-- 2) I18N — TR
-- =============================================================
INSERT INTO `footer_sections_i18n`
(`id`, `section_id`, `locale`, `title`, `slug`, `description`, `created_at`, `updated_at`)
VALUES
('ff010001-4001-4001-8001-ff0000000001',
 'ee010001-4001-4001-8001-ee0000000001',
 'tr',
 'Hızlı Erişim',
 'hizli-erisim',
 'Sık kullanılan sayfalara hızlı erişim.',
 NOW(3), NOW(3)),

('ff010002-4002-4002-8002-ff0000000002',
 'ee010002-4002-4002-8002-ee0000000002',
 'tr',
 'Yasal',
 'yasal',
 'Yasal bilgilendirme ve politikalar.',
 NOW(3), NOW(3)),

('ff010003-4003-4003-8003-ff0000000003',
 'ee010003-4003-4003-8003-ee0000000003',
 'tr',
 'Sosyal Medya',
 'sosyal-medya',
 'Sosyal medya hesaplarımız.',
 NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `title`       = VALUES(`title`),
  `slug`        = VALUES(`slug`),
  `description` = VALUES(`description`),
  `updated_at`  = CURRENT_TIMESTAMP(3);

-- =============================================================
-- 3) I18N — EN
-- =============================================================
INSERT INTO `footer_sections_i18n`
(`id`, `section_id`, `locale`, `title`, `slug`, `description`, `created_at`, `updated_at`)
VALUES
('ff020001-4001-4001-8001-ff0000000001',
 'ee010001-4001-4001-8001-ee0000000001',
 'en',
 'Quick Access',
 'quick-access',
 'Quick links to frequently used pages.',
 NOW(3), NOW(3)),

('ff020002-4002-4002-8002-ff0000000002',
 'ee010002-4002-4002-8002-ee0000000002',
 'en',
 'Legal',
 'legal',
 'Legal information and policies.',
 NOW(3), NOW(3)),

('ff020003-4003-4003-8003-ff0000000003',
 'ee010003-4003-4003-8003-ee0000000003',
 'en',
 'Social Media',
 'social-media',
 'Our social media channels.',
 NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `title`       = VALUES(`title`),
  `slug`        = VALUES(`slug`),
  `description` = VALUES(`description`),
  `updated_at`  = CURRENT_TIMESTAMP(3);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;

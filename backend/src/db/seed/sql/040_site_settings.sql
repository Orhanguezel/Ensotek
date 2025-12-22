-- =============================================================
-- 040_site_settings.sql (Ensotek) – MULTI-LOCALE (Dynamic) [SAFE]
--  - app_locales + default_locale global => locale='*'
--  - localized settings => locale='tr','en','de',...
--  - No JSON_TABLE enforcement in seed (do it in app/admin)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

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

-- GLOBAL: app_locales (locale='*')
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'app_locales',
  '*',
  JSON_ARRAY(
    JSON_OBJECT('code','tr','label','Türkçe','is_default',true, 'is_active',true),
    JSON_OBJECT('code','en','label','English','is_default',false,'is_active',true),
    JSON_OBJECT('code','de','label','Deutsch','is_default',false,'is_active',true)
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- GLOBAL: default_locale (locale='*')
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (UUID(), 'default_locale', '*', 'tr', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- LOCALIZED: TR
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`) VALUES
(UUID(), 'contact_info', 'tr', JSON_OBJECT(
  'companyName','Ensotek Enerji Sistemleri',
  'phones',JSON_ARRAY('+90 212 000 00 00', '+49 152 000 0000'),
  'email','info@ensotek.com',
  'address','Ensotek Plaza, Büyükdere Cd. No:10, Şişli / İstanbul',
  'addressSecondary','Ofis: Musterstr. 10, 10115 Berlin, Almanya',
  'whatsappNumber','+49 152 000 0000',
  'taxOffice','Şişli VD',
  'taxNumber','1234567890',
  'website','https://ensotek.de'
), NOW(3), NOW(3)),
(UUID(), 'catalog_pdf_url',      'tr', 'https://example.com/path/to/ensotek_catalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_pdf_filename', 'tr', 'ensotek-catalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_admin_email',  'tr', 'admin@ensotek.de', NOW(3), NOW(3)),
(UUID(), 'site_title',           'tr', 'Ensotek', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `value`=VALUES(`value`), `updated_at`=VALUES(`updated_at`);

-- LOCALIZED: EN
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`) VALUES
(UUID(), 'catalog_pdf_url',      'en', 'https://example.com/path/to/ensotek_catalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_pdf_filename', 'en', 'ensotek-catalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_admin_email',  'en', 'admin@ensotek.de', NOW(3), NOW(3)),
(UUID(), 'site_title',           'en', 'Ensotek', NOW(3), NOW(3)),
(UUID(), 'contact_info', 'en', JSON_OBJECT(
  'companyName','Ensotek Energy Systems',
  'phones',JSON_ARRAY('+49 152 000 0000', '+90 212 000 00 00'),
  'email','hello@ensotek.com',
  'address','Ensotek Office, Musterstr. 10, 10115 Berlin, Germany',
  'addressSecondary','HQ: Ensotek Plaza, Büyükdere Ave. No:10, Sisli / Istanbul',
  'whatsappNumber','+49 152 000 0000',
  'taxOffice','Sisli Tax Office',
  'taxNumber','1234567890',
  'website','https://ensotek.de'
), NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `value`=VALUES(`value`), `updated_at`=VALUES(`updated_at`);

-- LOCALIZED: DE
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`) VALUES
(UUID(), 'catalog_pdf_url',      'de', 'https://example.com/path/to/ensotek_catalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_pdf_filename', 'de', 'ensotek-catalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_admin_email',  'de', 'admin@ensotek.de', NOW(3), NOW(3)),
(UUID(), 'site_title',           'de', 'Ensotek', NOW(3), NOW(3)),
(UUID(), 'contact_info', 'de', JSON_OBJECT(
  'companyName','Ensotek Energiesysteme',
  'phones',JSON_ARRAY('+49 152 000 0000'),
  'email','hallo@ensotek.com',
  'address','Musterstr. 10, 10115 Berlin, Deutschland',
  'addressSecondary','Zentrale: Ensotek Plaza, Büyükdere Cd. No:10, Şişli / Istanbul',
  'whatsappNumber','+49 152 000 0000',
  'taxOffice','Finanzamt (Beispiel)',
  'taxNumber','1234567890',
  'website','https://ensotek.de'
), NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `value`=VALUES(`value`), `updated_at`=VALUES(`updated_at`);

-- GLOBAL: Storage / Public / SMTP / OAuth (locale='*') – sende kalabilir
-- (senin mevcut bloklarını aynen bırakabilirsin)

SET FOREIGN_KEY_CHECKS = 1;

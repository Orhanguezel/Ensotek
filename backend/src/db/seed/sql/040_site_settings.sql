-- =============================================================
-- 040_site_settings.sql (Ensotek) – MULTI-LOCALE (Dynamic) [SAFE]
--  - app_locales + default_locale => locale='*'
--  - localized settings => locale in ('tr','en','de',...)
--  - TEXT value stores JSON as string
--  - Upsert everywhere: ON DUPLICATE KEY UPDATE
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;

-- =============================================================
-- TABLE
-- =============================================================
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

-- =============================================================
-- GLOBAL: app_locales (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  UUID(),
  'app_locales',
  '*',
  CAST(
    JSON_ARRAY(
      JSON_OBJECT('code','tr','label','Türkçe','is_default', TRUE,  'is_active', TRUE),
      JSON_OBJECT('code','en','label','English','is_default', FALSE, 'is_active', TRUE),
      JSON_OBJECT('code','de','label','Deutsch','is_default', FALSE, 'is_active', TRUE)
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- GLOBAL: default_locale (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'default_locale', '*', 'tr', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- LOCALIZED: TR içerik ayarları
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  UUID(),
  'contact_info',
  'tr',
  CAST(JSON_OBJECT(
    'companyName','Ensotek Enerji Sistemleri',
    'phones',JSON_ARRAY('+90 212 000 00 00', '+49 152 000 0000'),
    'email','info@ensotek.com',
    'address','Ensotek Plaza, Büyükdere Cd. No:10, Şişli / İstanbul',
    'addressSecondary','Ofis: Musterstr. 10, 10115 Berlin, Almanya',
    'whatsappNumber','+49 152 000 0000',
    'taxOffice','Şişli VD',
    'taxNumber','1234567890',
    'website','https://ensotek.de'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(UUID(), 'catalog_pdf_url',        'tr', 'https://example.com/path/to/ensotek_catalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_pdf_filename',   'tr', 'ensotek-catalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_admin_email',    'tr', 'admin@ensotek.de', NOW(3), NOW(3)),
(UUID(), 'site_title',             'tr', 'Ensotek', NOW(3), NOW(3)),
(
  UUID(),
  'socials',
  'tr',
  CAST(JSON_OBJECT(
    'instagram','https://instagram.com/ensotek',
    'facebook','https://facebook.com/ensotek',
    'youtube','https://youtube.com/@ensotek',
    'linkedin','https://linkedin.com/company/ensotek',
    'x','https://x.com/ensotek',
    'tiktok','https://www.tiktok.com/@ensotek'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'company_profile',
  'tr',
  CAST(JSON_OBJECT(
    'headline','Ensotek ile Akıllı Enerji ve Otomasyon Çözümleri',
    'subline','Endüstriyel tesisler, restoranlar ve ticari işletmeler için uçtan uca otomasyon ve enerji verimliliği çözümleri sunuyoruz.',
    'body','Ensotek Enerji Sistemleri; proje tasarımı, saha keşfi, kurulum, devreye alma ve bakım süreçlerinin tamamını tek çatı altında toplayan entegre bir teknoloji partneridir. IoT tabanlı uzaktan izleme, enerji tüketim analizi ve özel raporlama panelleriyle işletmenizin operasyonlarını dijitalleştirmenize yardımcı olur.'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'company_brand',
  'tr',
  CAST(JSON_OBJECT(
    'name','Ensotek Enerji Sistemleri',
    'shortName','ENSOTEK',
    'website','https://ensotek.de',
    'logo',JSON_OBJECT(
      'url','https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp',
      'width',160,
      'height',60
    ),
    'images',JSON_ARRAY(
      JSON_OBJECT(
        'type','logo',
        'url','https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp'
      )
    )
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'catalog_admin_user_ids',
  'tr',
  CAST(JSON_ARRAY() AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- LOCALIZED: EN içerik ayarları
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'catalog_pdf_url',        'en', 'https://example.com/path/to/ensotek_catalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_pdf_filename',   'en', 'ensotek-catalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_admin_email',    'en', 'admin@ensotek.de', NOW(3), NOW(3)),
(UUID(), 'site_title',             'en', 'Ensotek', NOW(3), NOW(3)),
(
  UUID(),
  'contact_info',
  'en',
  CAST(JSON_OBJECT(
    'companyName','Ensotek Energy Systems',
    'phones',JSON_ARRAY('+49 152 000 0000', '+90 212 000 00 00'),
    'email','hello@ensotek.com',
    'address','Ensotek Office, Musterstr. 10, 10115 Berlin, Germany',
    'addressSecondary','HQ: Ensotek Plaza, Büyükdere Ave. No:10, Sisli / Istanbul',
    'whatsappNumber','+49 152 000 0000',
    'taxOffice','Sisli Tax Office',
    'taxNumber','1234567890',
    'website','https://ensotek.de'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'socials',
  'en',
  CAST(JSON_OBJECT(
    'instagram','https://instagram.com/ensotek',
    'facebook','https://facebook.com/ensotek',
    'youtube','https://youtube.com/@ensotek',
    'linkedin','https://linkedin.com/company/ensotek',
    'x','https://x.com/ensotek',
    'tiktok','https://www.tiktok.com/@ensotek'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'company_brand',
  'en',
  CAST(JSON_OBJECT(
    'name','Ensotek Energy Systems',
    'shortName','ENSOTEK',
    'website','https://ensotek.de',
    'logo',JSON_OBJECT(
      'url','https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp',
      'width',160,
      'height',60
    ),
    'images',JSON_ARRAY(
      JSON_OBJECT(
        'type','logo',
        'url','https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp'
      )
    )
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- LOCALIZED: DE içerik ayarları
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'catalog_pdf_url',        'de', 'https://example.com/path/to/ensotek_catalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_pdf_filename',   'de', 'ensotek-catalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_admin_email',    'de', 'admin@ensotek.de', NOW(3), NOW(3)),
(UUID(), 'site_title',             'de', 'Ensotek', NOW(3), NOW(3)),
(
  UUID(),
  'contact_info',
  'de',
  CAST(JSON_OBJECT(
    'companyName','Ensotek Energiesysteme',
    'phones',JSON_ARRAY('+49 152 000 0000'),
    'email','hallo@ensotek.com',
    'address','Musterstr. 10, 10115 Berlin, Deutschland',
    'addressSecondary','Zentrale: Ensotek Plaza, Büyükdere Cd. No:10, Şişli / Istanbul',
    'whatsappNumber','+49 152 000 0000',
    'taxOffice','Finanzamt (Beispiel)',
    'taxNumber','1234567890',
    'website','https://ensotek.de'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- GLOBAL: Storage (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'storage_driver',             '*', 'cloudinary',                               NOW(3), NOW(3)),
(UUID(), 'storage_local_root',         '*', '/var/www/Ensotek/uploads',                 NOW(3), NOW(3)),
(UUID(), 'storage_local_base_url',     '*', 'https://ensotek.guezelwebdesign.com/uploads', NOW(3), NOW(3)),
(UUID(), 'cloudinary_cloud_name',      '*', 'your_cloud_name',                          NOW(3), NOW(3)),
(UUID(), 'cloudinary_api_key',         '*', 'your_cloudinary_api_key',                  NOW(3), NOW(3)),
(UUID(), 'cloudinary_api_secret',      '*', 'your_cloudinary_api_secret',               NOW(3), NOW(3)),
(UUID(), 'cloudinary_folder',          '*', 'uploads/ensotek',                          NOW(3), NOW(3)),
(UUID(), 'cloudinary_unsigned_preset', '*', 'your_unsigned_preset',                     NOW(3), NOW(3)),
(UUID(), 'storage_cdn_public_base',    '*', 'https://res.cloudinary.com',               NOW(3), NOW(3)),
(UUID(), 'storage_public_api_base',    '*', 'https://ensotek.guezelwebdesign.com/api',  NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- GLOBAL: Public Base URL (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'public_base_url', '*', 'https://ensotek.guezelwebdesign.com', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- GLOBAL: SMTP (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'smtp_host',       '*', 'smtp.example.com',      NOW(3), NOW(3)),
(UUID(), 'smtp_port',       '*', '465',                   NOW(3), NOW(3)),
(UUID(), 'smtp_username',   '*', 'no-reply@ensotek.de',   NOW(3), NOW(3)),
(UUID(), 'smtp_password',   '*', 'change-me-in-admin',    NOW(3), NOW(3)),
(UUID(), 'smtp_from_email', '*', 'no-reply@ensotek.de',   NOW(3), NOW(3)),
(UUID(), 'smtp_from_name',  '*', 'Ensotek',               NOW(3), NOW(3)),
(UUID(), 'smtp_ssl',        '*', 'true',                  NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- GLOBAL: Google OAuth (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'google_client_id',     '*', 'your-google-client-id.apps.googleusercontent.com', NOW(3), NOW(3)),
(UUID(), 'google_client_secret', '*', 'change-me-in-admin',                               NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- GLOBAL: Google Tag Manager (GTM) Container ID (locale='*') ✅ EKLENDİ
-- Admin panelden değiştir: "GTM-XXXXXXX"
-- Boş bırakırsan frontend GTM basmaz.
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'gtm_container_id', '*', 'GTM-XXXXXXX', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- GLOBAL: GA4 Measurement ID (locale='*') ✅ (opsiyonel fallback)
-- Admin panelden değiştir: "G-XXXXXXXXXX"
-- Not: GTM aktifse GA4 tag'ini GTM içinden yönetmen önerilir.
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'ga4_measurement_id', '*', 'G-XXXXXXXXXX', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- GLOBAL: Cookie Consent Config (locale='*')
-- consent_version: metin/policy değişince artır -> kullanıcıdan tekrar onay al
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  UUID(),
  'cookie_consent',
  '*',
  CAST(
    JSON_OBJECT(
      'consent_version', 1,
      'defaults', JSON_OBJECT(
        'necessary', TRUE,
        'analytics', FALSE,
        'marketing', FALSE
      ),
      'ui', JSON_OBJECT(
        'enabled', TRUE,
        'position', 'bottom',
        'show_reject_all', TRUE
      ),
      'texts', JSON_OBJECT(
        'title', 'Çerez Tercihleri',
        'description', 'Deneyiminizi iyileştirmek için zorunlu ve isteğe bağlı çerezler kullanıyoruz. Tercihlerinizi dilediğiniz zaman değiştirebilirsiniz.'
      )
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;

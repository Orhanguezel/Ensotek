-- =============================================================
-- 040_site_settings.sql (Ensotek) – MULTI-LOCALE (Dynamic) [FIXED]
--  - app_locales + default_locale => locale='*'
--  - localized settings => locale in ('tr','en','de')
--  - cookie_consent => LOCALIZED (tr/en/de)  ✅ (requested)
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
-- GLOBAL: app_locales (locale='*')  ✅ FIX: tr/en/de, uniq
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  UUID(),
  'app_locales',
  '*',
  CAST(
    JSON_ARRAY(
      JSON_OBJECT('code','tr','label','Türkçe','is_default', FALSE, 'is_active', TRUE),
      JSON_OBJECT('code','en','label','English','is_default', FALSE, 'is_active', TRUE),
      JSON_OBJECT('code','de','label','Deutsch','is_default', TRUE,  'is_active', TRUE)
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
(UUID(), 'default_locale', '*', 'de', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- LOCALIZED: TR içerik ayarları  ✅ FIX: locale='tr'
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  UUID(),
  'contact_info',
  'tr',
  CAST(JSON_OBJECT(
    'companyName','ENSOTEK Su Soğutma Kuleleri ve Teknolojileri Mühendislik San.Tic. Ltd. Şti',
    'phones',JSON_ARRAY('+90 212 613 33 01'),
    'email','ensotek@ensotek.com.tr',
    'address','Oruçreis Mah. Tekstilkent Sit. A17 Blok No:41 34235 Esenler / İstanbul, Türkiye',
    'addressSecondary','Fabrika: Saray Mah. Gimat Cad. No:6A 06980 Kahramankazan / Ankara, Türkiye',
    'whatsappNumber','+90 531 880 31 51',
    'taxOffice','',
    'taxNumber','',
    'website','https://www.ensotek.de'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(UUID(), 'catalog_pdf_url',        'tr', 'https://www.ensotek.de/uploads/ensotek/catalog/ensotek-katalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_pdf_filename',   'tr', 'ensotek-katalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_admin_email',    'tr', 'info@ensotek.com.tr', NOW(3), NOW(3)),
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
    'headline','CTP Su Soğutma Kuleleri: Açık Tip ve Kapalı Tip İmalat & Montaj',
    'subline','Camelyaf Takviyeli Polyester (CTP) malzemeden su soğutma kuleleri üretiyor; bakım, onarım, modernizasyon ve performans testleriyle tesislerinize uzun ömürlü çözümler sunuyoruz.',
    'body','ENSOTEK Su Soğutma Kuleleri ve Teknolojileri Mühendislik San.Tic. Ltd. Şti; CTP malzemeden Açık Tip Su Soğutma Kuleleri ve Kapalı Tip Su Soğutma Kuleleri imalatı ve montajını ana faaliyet alanı olarak yürütür. Ayrıca mevcut su soğutma kulelerinin bakım ve onarımları, yeni teknolojilere göre modernize edilmesi, performans testlerinin yapılması ve yedek parça temini hizmetleri sunar. Kaliteli ürün ve hizmet ile uzun ömürlü çözümler üretmek Ensotek''in birinci önceliğidir.'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'company_brand',
  'tr',
  CAST(JSON_OBJECT(
    'name','ENSOTEK Su Soğutma Kuleleri ve Teknolojileri Mühendislik San.Tic. Ltd. Şti',
    'shortName','ENSOTEK',
    'website','https://www.ensotek.de'
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
(UUID(), 'catalog_pdf_url',        'en', 'https://www.ensotek.de/uploads/ensotek/catalog/ensotek-catalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_pdf_filename',   'en', 'ensotek-catalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_admin_email',    'en', 'info@ensotek.com.tr', NOW(3), NOW(3)),
(UUID(), 'site_title',             'en', 'Ensotek', NOW(3), NOW(3)),
(
  UUID(),
  'contact_info',
  'en',
  CAST(JSON_OBJECT(
    'companyName','ENSOTEK Cooling Towers & Technologies Engineering Ltd.',
    'phones',JSON_ARRAY('+90 212 613 33 01'),
    'email','ensotek@ensotek.com.tr',
    'address','Oruçreis District, Tekstilkent Site, A17 Block No:41, 34235 Esenler / Istanbul, Türkiye',
    'addressSecondary','Factory: Saray District, Gimat St. No:6A, 06980 Kahramankazan / Ankara, Türkiye',
    'whatsappNumber','+90 531 880 31 51',
    'taxOffice','',
    'taxNumber','',
    'website','https://www.ensotek.de'
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
    'tiktok',''
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'company_brand',
  'en',
  CAST(JSON_OBJECT(
    'name','ENSOTEK Cooling Towers & Technologies Engineering Ltd.',
    'shortName','ENSOTEK',
    'website','https://www.ensotek.de'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'company_profile',
  'en',
  CAST(JSON_OBJECT(
    'headline','FRP (CTP) Cooling Towers: Open Circuit & Closed Circuit Manufacturing',
    'subline','We manufacture and install FRP (CTP) cooling towers and provide maintenance, retrofit, performance testing and spare parts supply.',
    'body','ENSOTEK designs, manufactures and installs open circuit and closed circuit cooling towers manufactured from FRP (CTP). We also provide maintenance and repair services, modernization/retrofit to new technologies, performance testing and spare parts supply. Our priority is delivering long-lasting solutions with high product and service quality.'
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
(UUID(), 'catalog_pdf_url',        'de', 'https://www.ensotek.de/uploads/ensotek/catalog/ensotek-katalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_pdf_filename',   'de', 'ensotek-katalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_admin_email',    'de', 'info@ensotek.com.tr', NOW(3), NOW(3)),
(UUID(), 'site_title',             'de', 'Ensotek', NOW(3), NOW(3)),
(
  UUID(),
  'contact_info',
  'de',
  CAST(JSON_OBJECT(
    'companyName','ENSOTEK Kühltürme & Technologien Engineering GmbH (Ltd.)',
    'phones',JSON_ARRAY('+90 212 613 33 01'),
    'email','ensotek@ensotek.com.tr',
    'address','Oruçreis Mah., Tekstilkent Sit., A17 Blok No:41, 34235 Esenler / Istanbul, Türkei',
    'addressSecondary','Werk: Saray Mah., Gimat Cad. No:6A, 06980 Kahramankazan / Ankara, Türkei',
    'whatsappNumber','+90 531 880 31 51',
    'taxOffice','',
    'taxNumber','',
    'website','https://www.ensotek.de'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'socials',
  'de',
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
  'de',
  CAST(JSON_OBJECT(
    'name','ENSOTEK Kühltürme & Technologien',
    'shortName','ENSOTEK',
    'website','https://www.ensotek.de'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'company_profile',
  'de',
  CAST(JSON_OBJECT(
    'headline','GFK (CTP) Kühltürme: Offene & Geschlossene Bauart – Herstellung & Montage',
    'subline','Herstellung und Montage von GFK (CTP) Kühltürmen sowie Wartung, Instandsetzung, Modernisierung, Leistungstests und Ersatzteilversorgung.',
    'body','ENSOTEK stellt offene und geschlossene Kühltürme aus GFK (CTP) her und übernimmt die Montage. Zusätzlich bieten wir Wartung und Reparatur, Modernisierung nach neuen Technologien, Leistungstests sowie die Versorgung mit Ersatzteilen an. Unser Ziel sind langlebige Lösungen durch hohe Produkt- und Servicequalität.'
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
(UUID(), 'storage_driver',             '*', 'cloudinary',                                  NOW(3), NOW(3)),
(UUID(), 'storage_local_root',         '*', '/var/www/Ensotek/uploads',                    NOW(3), NOW(3)),
(UUID(), 'storage_local_base_url',     '*', '/uploads',                                    NOW(3), NOW(3)),
(UUID(), 'cloudinary_cloud_name',      '*', 'dbozv7wqd',                                   NOW(3), NOW(3)),
(UUID(), 'cloudinary_api_key',         '*', '644676135993432',                             NOW(3), NOW(3)),
(UUID(), 'cloudinary_api_secret',      '*', 'C2VWxsJ5j0jZpcxOhvuTOTKhaMo',                 NOW(3), NOW(3)),
(UUID(), 'cloudinary_folder',          '*', 'uploads/ensotek',                             NOW(3), NOW(3)),
(UUID(), 'cloudinary_unsigned_preset', '*', 'ensotek_unsigned',                            NOW(3), NOW(3)),
(UUID(), 'storage_cdn_public_base',    '*', 'https://res.cloudinary.com',                  NOW(3), NOW(3)),
(UUID(), 'storage_public_api_base',    '*', 'https://www.ensotek.de/api',     NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- GLOBAL: Public Base URL (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'public_base_url', '*', 'https://www.ensotek.de', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- GLOBAL: SMTP (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'smtp_host',       '*', 'smtp.example.com',        NOW(3), NOW(3)),
(UUID(), 'smtp_port',       '*', '465',                     NOW(3), NOW(3)),
(UUID(), 'smtp_username',   '*', 'no-reply@ensotek.com.tr', NOW(3), NOW(3)),
(UUID(), 'smtp_password',   '*', 'change-me-in-admin',      NOW(3), NOW(3)),
(UUID(), 'smtp_from_email', '*', 'no-reply@ensotek.com.tr', NOW(3), NOW(3)),
(UUID(), 'smtp_from_name',  '*', 'Ensotek',                 NOW(3), NOW(3)),
(UUID(), 'smtp_ssl',        '*', 'true',                    NOW(3), NOW(3))
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
-- GLOBAL: GTM + GA4 (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'gtm_container_id',   '*', 'GTM-WV5FRN93', NOW(3), NOW(3)),
(UUID(), 'ga4_measurement_id', '*', 'G-7S6TW9CNRJ', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);


-- =============================================================
-- GLOBAL: Site Media (locale='*')  ✅ UPDATED
-- Keys:
--  - site_logo
--  - site_logo_dark
--  - site_logo_light
--  - site_favicon
--  - site_apple_touch_icon   (180x180)
--  - site_app_icon_512       (512x512 manifest/icon)
--  - site_og_default_image   (1200x630 OG default)
--
-- Value format:
--  - simplest: URL string
--  - optional: JSON_OBJECT('url',..., 'width',..., 'height',..., 'asset_id',..., 'alt',...)
-- Service layer parseMediaUrl() supports both.
-- =============================================================

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  UUID(),
  'site_logo',
  '*',
  CAST(
    JSON_OBJECT(
      'url','https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587346/site-media/logo.png',
      'width',160,
      'height',60,
      'alt','Ensotek Logo'
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'site_logo_dark',
  '*',
  CAST(
    JSON_OBJECT(
      'url','https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587346/site-media/logo.png',
      'width',160,
      'height',60,
      'alt','Ensotek Logo (Dark)'
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'site_logo_light',
  '*',
  CAST(
    JSON_OBJECT(
      'url','https://res.cloudinary.com/dbozv7wqd/image/upload/v1770587346/site-media/logo.png',
      'width',160,
      'height',60,
      'alt','Ensotek Logo (Light)'
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'site_favicon',
  '*',
  CAST(
    JSON_OBJECT(
      'url','https://res.cloudinary.com/dbozv7wqd/raw/upload/v1767244774/site-media/favicon',
      'alt','Ensotek Favicon'
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'site_apple_touch_icon',
  '*',
  CAST(
    JSON_OBJECT(
      'url','https://res.cloudinary.com/dbozv7wqd/image/upload/v1767249207/site-media/apple-touch-icon.png',
      'alt','Ensotek Apple Touch Icon (180x180)'
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'site_app_icon_512',
  '*',
  CAST(
    JSON_OBJECT(
      'url','https://res.cloudinary.com/dbozv7wqd/image/upload/v1767249213/site-media/ensotek-apple-icon-512.png',
      'alt','Ensotek App Icon (512x512)'
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'site_og_default_image',
  '*',
  CAST(
    JSON_OBJECT(
      'url','https://res.cloudinary.com/dbozv7wqd/image/upload/v1767249482/site-media/2.jpg',
      'width',1200,
      'height',630,
      'alt','Ensotek – Industrial Cooling Solutions – Default Open Graph Image'
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- LOCALIZED: Cookie Consent Config (tr/en/de) ✅ FIX: NOT GLOBAL
-- consent_version değişince tekrar onay al
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  UUID(),
  'cookie_consent',
  'tr',
  CAST(
    JSON_OBJECT(
      'consent_version', 1,
      'defaults', JSON_OBJECT('necessary', TRUE, 'analytics', FALSE, 'marketing', FALSE),
      'ui', JSON_OBJECT('enabled', TRUE, 'position', 'bottom', 'show_reject_all', TRUE),
      'texts', JSON_OBJECT(
        'title', 'Çerez Tercihleri',
        'description', 'Sitemizin doğru çalışmasını sağlamak ve isteğe bağlı analiz yapmak için çerezler kullanıyoruz. Tercihlerinizi yönetebilirsiniz.'
      )
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'cookie_consent',
  'en',
  CAST(
    JSON_OBJECT(
      'consent_version', 1,
      'defaults', JSON_OBJECT('necessary', TRUE, 'analytics', FALSE, 'marketing', FALSE),
      'ui', JSON_OBJECT('enabled', TRUE, 'position', 'bottom', 'show_reject_all', TRUE),
      'texts', JSON_OBJECT(
        'title', 'Cookie Preferences',
        'description', 'We use cookies to ensure the site works properly and to optionally analyze traffic. You can manage your preferences.'
      )
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'cookie_consent',
  'de',
  CAST(
    JSON_OBJECT(
      'consent_version', 1,
      'defaults', JSON_OBJECT('necessary', TRUE, 'analytics', FALSE, 'marketing', FALSE),
      'ui', JSON_OBJECT('enabled', TRUE, 'position', 'bottom', 'show_reject_all', TRUE),
      'texts', JSON_OBJECT(
        'title', 'Cookie-Einstellungen',
        'description', 'Wir verwenden Cookies, um die Website korrekt zu betreiben und optional den Traffic zu analysieren. Sie können Ihre Einstellungen verwalten.'
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

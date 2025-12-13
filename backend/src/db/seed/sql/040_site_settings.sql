-- =============================================================
-- 040_site_settings.sql  (çok dilli site ayarları - Ensotek)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

/* =============================================================
   TABLO
   id (CHAR(36)), key (VARCHAR(100)), locale (VARCHAR(8)), value (TEXT),
   created_at/updated_at, UNIQUE(key,locale)
   ============================================================= */
CREATE TABLE IF NOT EXISTS site_settings (
  id          CHAR(36)      NOT NULL,
  `key`       VARCHAR(100)  NOT NULL,
  locale      VARCHAR(8)    NOT NULL,
  `value`     TEXT          NOT NULL,
  created_at  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                             ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY site_settings_key_locale_uq (`key`, locale),
  KEY site_settings_key_idx (`key`),
  KEY site_settings_locale_idx (locale)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- GENEL: Uygulama dilleri (app_locales)
-- FE/BE tarafı LOCALES'i buradan okuyabilir
-- =============================================================
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'app_locales',
  'tr',
  JSON_ARRAY('tr', 'en'),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`    = VALUES(`value`),
  updated_at = VALUES(updated_at);

/* =============================================================
   SEED: TR (default)
   ============================================================= */

-- İletişim bilgileri (TR)
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'contact_info',
  'tr',
  JSON_OBJECT(
    'companyName',      'Ensotek Enerji Sistemleri',
    'phones',           JSON_ARRAY('+90 212 000 00 00', '+49 152 000 0000'),
    'email',            'info@ensotek.com',
    'address',          'Ensotek Plaza, Büyükdere Cd. No:10, Şişli / İstanbul',
    'addressSecondary', 'Ofis: Musterstr. 10, 10115 Berlin, Almanya',
    'whatsappNumber',   '+49 152 000 0000',
    'taxOffice',        'Şişli VD',
    'taxNumber',        '1234567890',
    'website',          'https://ensotek.de'
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`    = VALUES(`value`),
  updated_at = VALUES(updated_at);

-- Sosyal medya (TR)
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'socials',
  'tr',
  JSON_OBJECT(
    'instagram', 'https://instagram.com/ensotek',
    'facebook',  'https://facebook.com/ensotek',
    'youtube',   'https://youtube.com/@ensotek',
    'linkedin',  'https://linkedin.com/company/ensotek',
    'x',         'https://x.com/ensotek',
    'tiktok',    'https://www.tiktok.com/@ensotek'
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`    = VALUES(`value`),
  updated_at = VALUES(updated_at);

-- Şirket / marka açıklaması (TR)
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'company_profile',
  'tr',
  JSON_OBJECT(
    'headline', 'Ensotek ile Akıllı Enerji ve Otomasyon Çözümleri',
    'subline',  'Endüstriyel tesisler, restoranlar ve ticari işletmeler için uçtan uca otomasyon ve enerji verimliliği çözümleri sunuyoruz.',
    'body',     'Ensotek Enerji Sistemleri; proje tasarımı, saha keşfi, kurulum, devreye alma ve bakım süreçlerinin tamamını tek çatı altında toplayan entegre bir teknoloji partneridir. IoT tabanlı uzaktan izleme, enerji tüketim analizi ve özel raporlama panelleriyle işletmenizin operasyonlarını dijitalleştirmenize yardımcı olur.'
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`    = VALUES(`value`),
  updated_at = VALUES(updated_at);

-- Marka / logo bilgileri (TR)
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'company_brand',
  'tr',
  JSON_OBJECT(
    'name',      'Ensotek Enerji Sistemleri',
    'shortName', 'ENSOTEK',
    'website',   'https://ensotek.de',
    'logo', JSON_OBJECT(
      'url',    'https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp',
      'width',  160,
      'height', 60
    ),
    'images', JSON_ARRAY(
      JSON_OBJECT(
        'type', 'logo',
        'url',  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp'
      )
    )
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`    = VALUES(`value`),
  updated_at = VALUES(updated_at);

/* =============================================================
   SEED: EN
   ============================================================= */

-- Contact info (EN)
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'contact_info',
  'en',
  JSON_OBJECT(
    'companyName',      'Ensotek Energy Systems',
    'phones',           JSON_ARRAY('+49 152 000 0000', '+90 212 000 00 00'),
    'email',            'hello@ensotek.com',
    'address',          'Ensotek Office, Musterstr. 10, 10115 Berlin, Germany',
    'addressSecondary', 'HQ: Ensotek Plaza, Büyükdere Ave. No:10, Sisli / Istanbul',
    'whatsappNumber',   '+49 152 000 0000',
    'taxOffice',        'Sisli Tax Office',
    'taxNumber',        '1234567890',
    'website',          'https://ensotek.de'
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`    = VALUES(`value`),
  updated_at = VALUES(updated_at);

-- Social media (EN)
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'socials',
  'en',
  JSON_OBJECT(
    'instagram', 'https://instagram.com/ensotek',
    'facebook',  'https://facebook.com/ensotek',
    'youtube',   'https://youtube.com/@ensotek',
    'linkedin',  'https://linkedin.com/company/ensotek',
    'x',         'https://x.com/ensotek',
    'tiktok',    'https://www.tiktok.com/@ensotek'
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`    = VALUES(`value`),
  updated_at = VALUES(updated_at);

-- Brand / logo info (EN)
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'company_brand',
  'en',
  JSON_OBJECT(
    'name',      'Ensotek Energy Systems',
    'shortName', 'ENSOTEK',
    'website',   'https://ensotek.de',
    'logo', JSON_OBJECT(
      'url',    'https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp',
      'width',  160,
      'height', 60
    ),
    'images', JSON_ARRAY(
      JSON_OBJECT(
        'type', 'logo',
        'url',  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp'
      )
    )
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`    = VALUES(`value`),
  updated_at = VALUES(updated_at);

/* =============================================================
   OPSİYONEL: DE örnek
   ============================================================= */

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'contact_info',
  'de',
  JSON_OBJECT(
    'companyName',     'Ensotek Energiesysteme',
    'phones',          JSON_ARRAY('+49 152 000 0000'),
    'email',           'hallo@ensotek.com',
    'address',         'Musterstr. 10, 10115 Berlin, Deutschland',
    'whatsappNumber',  '+49 152 000 0000',
    'website',         'https://ensotek.de'
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`    = VALUES(`value`),
  updated_at = VALUES(updated_at);

/* =============================================================
   TEKNİK: Storage ayarları
   ============================================================= */

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'storage_driver',
  'tr',
  'cloudinary',
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'storage_local_root',
  'tr',
  '',
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'storage_local_base_url',
  'tr',
  '/uploads',
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'cloudinary_cloud_name',
  'tr',
  '',
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'cloudinary_api_key',
  'tr',
  '',
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'cloudinary_api_secret',
  'tr',
  '',
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'cloudinary_folder',
  'tr',
  'uploads',
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'cloudinary_unsigned_preset',
  'tr',
  '',
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'storage_cdn_public_base',
  'tr',
  '',
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'storage_public_api_base',
  'tr',
  '',
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`    = VALUES(`value`),
  updated_at = VALUES(updated_at);

/* =============================================================
   TEKNİK: SMTP / Mail ayarları
   ============================================================= */

-- Not:
--  - smtp_* ayarları TR için seed edilir, dosyanın sonunda TR → EN / TR → DE
--    kopyası ile EN ve DE için de birebir aynı değerler oluşturulur.
--  - Bu değerler backend'de sadece site_settings üzerinden okunur,
--    ENV / process.env fallback YOKTUR.
--  - Üretimde gerçek SMTP bilgilerini admin paneli üzerinden güncellemen gerekir.

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'smtp_host',
  'tr',
  '',
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'smtp_port',
  'tr',
  '465',
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'smtp_username',
  'tr',
  '',
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'smtp_password',
  'tr',
  '',
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'smtp_from_email',
  'tr',
  '',
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'smtp_from_name',
  'tr',
  'Ensotek',
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'smtp_ssl',
  'tr',
  'true',
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`    = VALUES(`value`),
  updated_at = VALUES(updated_at);

/* =============================================================
   TEKNİK: Google OAuth ayarları
   ============================================================= */

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'google_client_id',
  'tr',
  '',
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'google_client_secret',
  'tr',
  '',
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`    = VALUES(`value`),
  updated_at = VALUES(updated_at);

/* =============================================================
   OTOMATİK KOPYA: TR → EN / TR → DE
   ============================================================= */

-- TR → EN (EN tarafında olmayan tüm key'ler TR'den kopyalanır)
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
SELECT UUID(), s.`key`, 'en', s.`value`, NOW(3), NOW(3)
FROM site_settings s
WHERE s.locale = 'tr'
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE t.`key` = s.`key`
      AND t.locale = 'en'
  );

-- TR → DE (DE tarafında olmayan tüm key'ler TR'den kopyalanır)
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
SELECT UUID(), s.`key`, 'de', s.`value`, NOW(3), NOW(3)
FROM site_settings s
WHERE s.locale = 'tr'
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE t.`key` = s.`key`
      AND t.locale = 'de'
  );

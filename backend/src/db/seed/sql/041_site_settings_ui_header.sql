-- =============================================================
-- 041_site_settings_ui_header.sql  (Header UI strings)
--  - Key: ui_header
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Extendable: new locales can be cloned from tr as bootstrap
--  - FIX: collation-safe comparisons (ER_CANT_AGGREGATE_2COLLATIONS)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- -------------------------------------------------------------
-- SEED: ui_header (TR / EN / DE)
-- -------------------------------------------------------------
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_header',
  'tr',
  CAST(JSON_OBJECT(
    'language_label',      'Dil',
    'login',               'Giriş Yap',
    'register',            'Kayıt Ol',
    'search_placeholder',  'Arama...',
    'search_aria',         'Ara',
    'contact_info_title',  'İletişim Bilgileri',
    'call_aria',           'Ara',
    'email_aria',          'E-posta',
    'close_aria',          'Kapat',
    'open_menu_aria',      'Menüyü Aç',
    'open_sidebar_aria',   'Yan Menüyü Aç'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_header',
  'en',
  CAST(JSON_OBJECT(
    'language_label',      'Language',
    'login',               'Login',
    'register',            'Register',
    'search_placeholder',  'Search...',
    'search_aria',         'Search',
    'contact_info_title',  'Contact Info',
    'call_aria',           'Call',
    'email_aria',          'Email',
    'close_aria',          'Close',
    'open_menu_aria',      'Open Menu',
    'open_sidebar_aria',   'Open Sidebar'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_header',
  'de',
  CAST(JSON_OBJECT(
    'language_label',      'Sprache',
    'login',               'Anmelden',
    'register',            'Registrieren',
    'search_placeholder',  'Suchen...',
    'search_aria',         'Suchen',
    'contact_info_title',  'Kontaktinformationen',
    'call_aria',           'Anrufen',
    'email_aria',          'E-Mail',
    'close_aria',          'Schließen',
    'open_menu_aria',      'Menü öffnen',
    'open_sidebar_aria',   'Seitenleiste öffnen'
  ) AS CHAR),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- -------------------------------------------------------------
-- OPTIONAL BOOTSTRAP CLONE (COLLATION-SAFE):
-- TR → TARGET LOCALE (başlangıç doldurma)
-- -------------------------------------------------------------

-- Hedef dil (değiştirilebilir)
SET @TARGET_LOCALE := 'de';

-- Karşılaştırmalarda collation fix:
-- - @TARGET_LOCALE'ı tablo collation’ına zorla
-- - sabit stringleri de aynı collation ile karşılaştır
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
SELECT
  UUID(),
  s.`key`,
  CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci,
  s.`value`,
  NOW(3),
  NOW(3)
FROM site_settings s
WHERE (s.locale COLLATE utf8mb4_unicode_ci) = ('tr' COLLATE utf8mb4_unicode_ci)
  AND (s.`key`  COLLATE utf8mb4_unicode_ci) = ('ui_header' COLLATE utf8mb4_unicode_ci)
  AND (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci) <> ('tr' COLLATE utf8mb4_unicode_ci)
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE (t.`key`   COLLATE utf8mb4_unicode_ci) = (s.`key` COLLATE utf8mb4_unicode_ci)
      AND (t.locale  COLLATE utf8mb4_unicode_ci) = (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci)
  );

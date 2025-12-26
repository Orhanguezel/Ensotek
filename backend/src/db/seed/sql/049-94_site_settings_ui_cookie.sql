-- =============================================================
-- 049-93_site_settings_ui_cookie.sql
-- Ensotek – UI Cookie (site_settings.ui_cookie)
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_cookie',
  'tr',
  CAST(JSON_OBJECT(
    'ui_cookie_title',                 'Çerez Tercihleri',
    'ui_cookie_desc',                  'Sitemizin doğru çalışmasını sağlamak ve isteğe bağlı analiz yapmak için çerezler kullanıyoruz. Tercihlerinizi yönetebilirsiniz.',
    'ui_cookie_link_policy',           'Çerez Politikası',

    'ui_cookie_btn_settings',          'Çerez Ayarları',
    'ui_cookie_btn_reject',            'Tümünü Reddet',
    'ui_cookie_btn_accept',            'Tümünü Kabul Et',
    'ui_cookie_btn_close_aria',        'Kapat',

    'ui_cookie_settings_title',        'Çerez Ayarları',
    'ui_cookie_settings_desc',         'Hangi çerez kategorilerine izin verdiğinizi seçebilirsiniz. Gerekli çerezler her zaman açıktır.',

    'ui_cookie_cat_necessary',         'Gerekli',
    'ui_cookie_cat_necessary_desc',    'Sitenin temel işlevleri için zorunludur.',
    'ui_cookie_cat_analytics',         'Analitik',
    'ui_cookie_cat_analytics_desc',    'Site trafiğini ve performansı anlamamıza yardımcı olur.',
    'ui_cookie_pill_on',               'Açık',

    'ui_cookie_btn_cancel',            'Vazgeç',
    'ui_cookie_btn_save',              'Kaydet'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_cookie',
  'en',
  CAST(JSON_OBJECT(
    'ui_cookie_title',                 'Cookie Preferences',
    'ui_cookie_desc',                  'We use cookies to ensure the site works properly and to optionally analyze traffic. You can manage your preferences.',
    'ui_cookie_link_policy',           'Cookie Policy',

    'ui_cookie_btn_settings',          'Cookie Settings',
    'ui_cookie_btn_reject',            'Reject All',
    'ui_cookie_btn_accept',            'Accept All',
    'ui_cookie_btn_close_aria',        'Close',

    'ui_cookie_settings_title',        'Cookie Settings',
    'ui_cookie_settings_desc',         'Select which cookie categories you allow. Necessary cookies are always enabled.',

    'ui_cookie_cat_necessary',         'Necessary',
    'ui_cookie_cat_necessary_desc',    'Required for basic site functionality.',
    'ui_cookie_cat_analytics',         'Analytics',
    'ui_cookie_cat_analytics_desc',    'Helps us understand traffic and performance.',
    'ui_cookie_pill_on',               'On',

    'ui_cookie_btn_cancel',            'Cancel',
    'ui_cookie_btn_save',              'Save'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_cookie',
  'de',
  CAST(JSON_OBJECT(
    'ui_cookie_title',                 'Cookie-Einstellungen',
    'ui_cookie_desc',                  'Wir verwenden Cookies, um die Website korrekt zu betreiben und optional den Traffic zu analysieren. Sie können Ihre Einstellungen verwalten.',
    'ui_cookie_link_policy',           'Cookie-Richtlinie',

    'ui_cookie_btn_settings',          'Cookie-Einstellungen',
    'ui_cookie_btn_reject',            'Alle ablehnen',
    'ui_cookie_btn_accept',            'Alle akzeptieren',
    'ui_cookie_btn_close_aria',        'Schließen',

    'ui_cookie_settings_title',        'Cookie-Einstellungen',
    'ui_cookie_settings_desc',         'Wählen Sie aus, welche Cookie-Kategorien Sie zulassen. Notwendige Cookies sind immer aktiv.',

    'ui_cookie_cat_necessary',         'Notwendig',
    'ui_cookie_cat_necessary_desc',    'Für die grundlegende Funktionalität der Website erforderlich.',
    'ui_cookie_cat_analytics',         'Analyse',
    'ui_cookie_cat_analytics_desc',    'Hilft uns, Traffic und Performance zu verstehen.',
    'ui_cookie_pill_on',               'An',

    'ui_cookie_btn_cancel',            'Abbrechen',
    'ui_cookie_btn_save',              'Speichern'
  ) AS CHAR),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- 049-7_site_settings_ui_team.sql
-- Ensotek – UI Team (site_settings.ui_team)
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Extendable: clone from tr as bootstrap (collation-safe)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_team',
  'de',
  CAST(JSON_OBJECT(
    'ui_team_subprefix',          'Ensotek',
    'ui_team_sublabel',           'Uzman ekibimiz',
    'ui_team_title',              'Mühendislik ekibimizle tanışın',
    'ui_team_read_more',          'Detayları görüntüle',
    'ui_team_read_more_aria',     'ekip üyesi detayını görüntüle',
    'ui_team_empty',
      'Şu anda görüntülenecek ekip üyesi bulunmamaktadır.',
    'ui_team_untitled',           'İsimsiz ekip üyesi',
    'ui_team_role_fallback',      'Uzman mühendis',

    'ui_team_page_title',         'Ekibimiz',

    'ui_team_detail_page_title',  'Ekip Üyesi',
    'ui_team_detail_back',        'Ekibe geri dön',
    'ui_team_detail_back_aria',   'ekip listesine geri dön',
    'ui_team_detail_empty',       'Ekip üyesi bulunamadı.',
    'ui_team_detail_subprefix',   'Ensotek',
    'ui_team_detail_sublabel',    'Yönetim ekibimiz',
    'ui_team_detail_no_content',
      'Bu ekip üyesi için henüz ek bilgi girilmemiştir.'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_team',
  'en',
  CAST(JSON_OBJECT(
    'ui_team_subprefix',          'Ensotek',
    'ui_team_sublabel',           'Our expert team',
    'ui_team_title',              'Meet our engineering team',
    'ui_team_read_more',          'View details',
    'ui_team_read_more_aria',     'view team member details',
    'ui_team_empty',
      'There are no team members to display at the moment.',
    'ui_team_untitled',           'Unnamed team member',
    'ui_team_role_fallback',      'Expert engineer',

    'ui_team_page_title',         'Our Team',

    'ui_team_detail_page_title',  'Team Member',
    'ui_team_detail_back',        'Back to team',
    'ui_team_detail_back_aria',   'back to team list',
    'ui_team_detail_empty',       'Team member could not be found.',
    'ui_team_detail_subprefix',   'Ensotek',
    'ui_team_detail_sublabel',    'Management team',
    'ui_team_detail_no_content',
      'No additional information has been provided yet.'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_team',
  'de',
  CAST(JSON_OBJECT(
    'ui_team_subprefix',          'Ensotek',
    'ui_team_sublabel',           'Unser Expertenteam',
    'ui_team_title',              'Lernen Sie unser Ingenieurteam kennen',
    'ui_team_read_more',          'Details anzeigen',
    'ui_team_read_more_aria',     'Details zum Teammitglied anzeigen',
    'ui_team_empty',
      'Derzeit sind keine Teammitglieder verfügbar.',
    'ui_team_untitled',           'Teammitglied ohne Namen',
    'ui_team_role_fallback',      'Fachingenieur',

    'ui_team_page_title',         'Unser Team',

    'ui_team_detail_page_title',  'Teammitglied',
    'ui_team_detail_back',        'Zurück zum Team',
    'ui_team_detail_back_aria',   'zurück zur Teamliste',
    'ui_team_detail_empty',       'Teammitglied wurde nicht gefunden.',
    'ui_team_detail_subprefix',   'Ensotek',
    'ui_team_detail_sublabel',    'Management-Team',
    'ui_team_detail_no_content',
      'Es wurden noch keine zusätzlichen Informationen hinterlegt.'
  ) AS CHAR),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- OPTIONAL BOOTSTRAP CLONE (COLLATION-SAFE): TR → TARGET
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
  AND (s.`key`  COLLATE utf8mb4_unicode_ci) = ('ui_team' COLLATE utf8mb4_unicode_ci)
  AND (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci) <> ('de' COLLATE utf8mb4_unicode_ci)
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE (t.`key`  COLLATE utf8mb4_unicode_ci) = (s.`key` COLLATE utf8mb4_unicode_ci)
      AND (t.locale COLLATE utf8mb4_unicode_ci) = (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci)
  );

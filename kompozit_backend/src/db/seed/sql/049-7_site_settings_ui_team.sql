-- =============================================================
-- 049-7_site_settings_ui_team.sql  (FINAL)
-- Ensotek – UI Team (site_settings.ui_team)
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Extendable
--  - UPSERT safe: ON DUPLICATE KEY UPDATE
--  - Requires UNIQUE KEY (key, locale) on site_settings
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_team',
  'tr',
  CAST(JSON_OBJECT(
    -- Common / section
    'ui_team_subprefix',              'Ensotek',
    'ui_team_sublabel',               'Uzman ekibimiz',
    'ui_team_title',                  'Mühendislik ekibimizle tanışın',
    'ui_team_read_more',              'Detayları görüntüle',
    'ui_team_read_more_aria',         'ekip üyesi detayını görüntüle',
    'ui_team_empty',                  'Şu anda görüntülenecek ekip üyesi bulunmamaktadır.',
    'ui_team_untitled',               'İsimsiz ekip üyesi',
    'ui_team_role_fallback',          'Uzman mühendis',

    -- Team list page
    'ui_team_page_title',             'Ekibimiz',

    -- Team detail page
    'ui_team_detail_page_title',      'Ekip Üyesi',
    'ui_team_detail_back',            'Ekibe geri dön',
    'ui_team_detail_back_aria',       'ekip listesine geri dön',
    'ui_team_detail_empty',           'Ekip üyesi bulunamadı.',
    'ui_team_detail_subprefix',       'Ensotek',
    'ui_team_detail_sublabel',        'Yönetim ekibimiz',
    'ui_team_detail_no_content',      'Bu ekip üyesi için henüz ek bilgi girilmemiştir.',

    -- Home (Team slider component)
    'ui_team_home_subtitle',          'Uzman ekibimiz',
    'ui_team_home_title',             'Uzman ekibimizle iş birliği yapalım',
    'ui_team_home_view_all',          'Tümünü Gör',

    -- TeamPageContent group titles
    'ui_team_group_mgmt_title',       'Yönetim ve Kurucu Ortaklar',
    'ui_team_group_eng_title',        'Mühendislik Ekibi',
    'ui_team_group_service_title',    'Saha ve Servis Ekibi',
    'ui_team_group_ft_title',         'Dış Ticaret',

    -- Carousel nav (optional but recommended)
    'ui_team_nav_prev',               'Önceki',
    'ui_team_nav_next',               'Sonraki'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_team',
  'en',
  CAST(JSON_OBJECT(
    -- Common / section
    'ui_team_subprefix',              'Ensotek',
    'ui_team_sublabel',               'Our expert team',
    'ui_team_title',                  'Meet our engineering team',
    'ui_team_read_more',              'View details',
    'ui_team_read_more_aria',         'view team member details',
    'ui_team_empty',                  'There are no team members to display at the moment.',
    'ui_team_untitled',               'Unnamed team member',
    'ui_team_role_fallback',          'Expert engineer',

    -- Team list page
    'ui_team_page_title',             'Our Team',

    -- Team detail page
    'ui_team_detail_page_title',      'Team Member',
    'ui_team_detail_back',            'Back to team',
    'ui_team_detail_back_aria',       'back to team list',
    'ui_team_detail_empty',           'Team member could not be found.',
    'ui_team_detail_subprefix',       'Ensotek',
    'ui_team_detail_sublabel',        'Management team',
    'ui_team_detail_no_content',      'No additional information has been provided yet.',

    -- Home (Team slider component)
    'ui_team_home_subtitle',          'Our expert team',
    'ui_team_home_title',             "Let's Collaborate With Our Expert Team",
    'ui_team_home_view_all',          'View All',

    -- TeamPageContent group titles
    'ui_team_group_mgmt_title',       'Management & Founders',
    'ui_team_group_eng_title',        'Engineering Team',
    'ui_team_group_service_title',    'Field & Service Team',
    'ui_team_group_ft_title',         'Foreign Trade',

    -- Carousel nav (optional but recommended)
    'ui_team_nav_prev',               'Previous',
    'ui_team_nav_next',               'Next'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_team',
  'de',
  CAST(JSON_OBJECT(
    -- Common / section
    'ui_team_subprefix',              'Ensotek',
    'ui_team_sublabel',               'Unser Expertenteam',
    'ui_team_title',                  'Lernen Sie unser Ingenieurteam kennen',
    'ui_team_read_more',              'Details anzeigen',
    'ui_team_read_more_aria',         'Details zum Teammitglied anzeigen',
    'ui_team_empty',                  'Derzeit sind keine Teammitglieder verfügbar.',
    'ui_team_untitled',               'Teammitglied ohne Namen',
    'ui_team_role_fallback',          'Fachingenieur',

    -- Team list page
    'ui_team_page_title',             'Unser Team',

    -- Team detail page
    'ui_team_detail_page_title',      'Teammitglied',
    'ui_team_detail_back',            'Zurück zum Team',
    'ui_team_detail_back_aria',       'zurück zur Teamliste',
    'ui_team_detail_empty',           'Teammitglied wurde nicht gefunden.',
    'ui_team_detail_subprefix',       'Ensotek',
    'ui_team_detail_sublabel',        'Management-Team',
    'ui_team_detail_no_content',      'Es wurden noch keine zusätzlichen Informationen hinterlegt.',

    -- Home (Team slider component)
    'ui_team_home_subtitle',          'Unser Expertenteam',
    'ui_team_home_title',             'Lassen Sie uns mit unserem Expertenteam zusammenarbeiten',
    'ui_team_home_view_all',          'Alle ansehen',

    -- TeamPageContent group titles
    'ui_team_group_mgmt_title',       'Management & Gründer',
    'ui_team_group_eng_title',        'Ingenieurteam',
    'ui_team_group_service_title',    'Außendienst & Service',
    'ui_team_group_ft_title',         'Außenhandel',

    -- Carousel nav (optional but recommended)
    'ui_team_nav_prev',               'Zurück',
    'ui_team_nav_next',               'Weiter'
  ) AS CHAR),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

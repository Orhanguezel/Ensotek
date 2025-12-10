-- =============================================================
-- 049-7_site_settings_ui_team.sql
-- Ensotek – UI Team (site_settings.ui_team)
--   - Home Team section (TeamPageContent.tsx)
--   - Full Team page (pages/team.tsx)
--   - Team detail page (TeamDetail.tsx + pages/team/[slug].tsx)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- -------------------------------------------------------------
-- TR
-- -------------------------------------------------------------
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
VALUES
(
  UUID(),
  'ui_team',
  'tr',
  JSON_OBJECT(
    -- HOME SECTION (src/components/containers/team/TeamPageContent.tsx)
    'ui_team_subprefix',          'Ensotek',
    'ui_team_sublabel',           'Uzman ekibimiz',
    'ui_team_title',              'Mühendislik ekibimizle tanışın',
    'ui_team_read_more',          'Detayları görüntüle',
    'ui_team_read_more_aria',     'ekip üyesi detayını görüntüle',
    'ui_team_empty',
      'Şu anda görüntülenecek ekip üyesi bulunmamaktadır.',
    'ui_team_untitled',           'İsimsiz ekip üyesi',
    'ui_team_role_fallback',      'Uzman mühendis',

    -- FULL PAGE HEADER (src/pages/team.tsx)
    'ui_team_page_title',         'Ekibimiz',

    -- DETAIL PAGE (src/components/containers/team/TeamDetail.tsx + pages/team/[slug].tsx)
    'ui_team_detail_page_title',  'Ekip Üyesi',
    'ui_team_detail_back',        'Ekibe geri dön',
    'ui_team_detail_back_aria',   'ekip listesine geri dön',
    'ui_team_detail_empty',       'Ekip üyesi bulunamadı.',
    'ui_team_detail_subprefix',   'Ensotek',
    'ui_team_detail_sublabel',    'Yönetim ekibimiz',
    'ui_team_detail_no_content',
      'Bu ekip üyesi için henüz ek bilgi girilmemiştir.'
  ),
  NOW(3),
  NOW(3)
),
-- -------------------------------------------------------------
-- EN
-- -------------------------------------------------------------
(
  UUID(),
  'ui_team',
  'en',
  JSON_OBJECT(
    -- HOME SECTION (src/components/containers/team/TeamPageContent.tsx)
    'ui_team_subprefix',          'Ensotek',
    'ui_team_sublabel',           'Our expert team',
    'ui_team_title',              'Meet our engineering team',
    'ui_team_read_more',          'View details',
    'ui_team_read_more_aria',     'view team member details',
    'ui_team_empty',
      'There are no team members to display at the moment.',
    'ui_team_untitled',           'Unnamed team member',
    'ui_team_role_fallback',      'Expert engineer',

    -- FULL PAGE HEADER (src/pages/team.tsx)
    'ui_team_page_title',         'Our Team',

    -- DETAIL PAGE (src/components/containers/team/TeamDetail.tsx + pages/team/[slug].tsx)
    'ui_team_detail_page_title',  'Team Member',
    'ui_team_detail_back',        'Back to team',
    'ui_team_detail_back_aria',   'back to team list',
    'ui_team_detail_empty',       'Team member could not be found.',
    'ui_team_detail_subprefix',   'Ensotek',
    'ui_team_detail_sublabel',    'Management team',
    'ui_team_detail_no_content',
      'No additional information has been provided yet.'
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`    = VALUES(`value`),
  updated_at = VALUES(updated_at);

-- -------------------------------------------------------------
-- TR → DE otomatik kopya (Almanca özel çeviri gelene kadar)
-- -------------------------------------------------------------
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
SELECT UUID(), s.`key`, 'de', s.`value`, NOW(3), NOW(3)
FROM site_settings s
WHERE s.locale = 'tr'
  AND s.`key` = 'ui_team'
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE t.`key` = s.`key`
      AND t.locale = 'de'
  );

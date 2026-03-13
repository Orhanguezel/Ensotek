-- =============================================================
-- 049-1.5_site_settings_ui_privacy_notice.sql  [FINAL]
-- ui_privacy_notice (Privacy Notice / Aydınlatma Metni page UI strings)
--  - Key: ui_privacy_notice
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Upsert: ON DUPLICATE KEY UPDATE
--  - NO ALTER / NO PATCH
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- =============================================================
-- ui_privacy_notice (TR/EN/DE)
-- =============================================================
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
VALUES
(
  UUID(),
  'ui_privacy_notice',
  'tr',
  CAST(
    JSON_OBJECT(
      -- Banner / Page titles
      'ui_privacy_notice_page_title',        'Aydınlatma Metni',
      'ui_privacy_notice_fallback_title',    'Aydınlatma Metni',

      -- Empty states
      'ui_privacy_notice_empty',             'Aydınlatma metni içeriği bulunamadı.',
      'ui_privacy_notice_empty_text',        'Aydınlatma metni içeriği yakında yayınlanacaktır.',

      -- SEO (pages/privacy-notice.tsx)
      'ui_privacy_notice_page_description',
        'Ensotek aydınlatma metni: veri sorumlusu, işleme amaçları, hukuki sebepler, aktarım ve ilgili kişi hakları.',
      'ui_privacy_notice_meta_title',        'Aydınlatma Metni | Ensotek',
      'ui_privacy_notice_meta_description',
        'Ensotek aydınlatma metni: veri sorumlusu, işleme amaçları, hukuki sebepler, aktarım ve ilgili kişi hakları.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_privacy_notice',
  'en',
  CAST(
    JSON_OBJECT(
      -- Banner / Page titles
      'ui_privacy_notice_page_title',        'Privacy Notice',
      'ui_privacy_notice_fallback_title',    'Privacy Notice',

      -- Empty states
      'ui_privacy_notice_empty',             'Privacy notice content not found.',
      'ui_privacy_notice_empty_text',        'The privacy notice content will be published here soon.',

      -- SEO
      'ui_privacy_notice_page_description',
        'Ensotek privacy notice: controller, purposes, legal grounds, transfers, retention, and data subject rights.',
      'ui_privacy_notice_meta_title',        'Privacy Notice | Ensotek',
      'ui_privacy_notice_meta_description',
        'Ensotek privacy notice: controller, purposes, legal grounds, transfers, retention, and data subject rights.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_privacy_notice',
  'de',
  CAST(
    JSON_OBJECT(
      -- Banner / Page titles
      'ui_privacy_notice_page_title',        'Datenschutzhinweis',
      'ui_privacy_notice_fallback_title',    'Datenschutzhinweis',

      -- Empty states
      'ui_privacy_notice_empty',             'Datenschutzhinweis nicht gefunden.',
      'ui_privacy_notice_empty_text',        'Der Datenschutzhinweis wird hier in Kürze veröffentlicht.',

      -- SEO
      'ui_privacy_notice_page_description',
        'Ensotek Datenschutzhinweis: Verantwortlicher, Zwecke, Rechtsgrundlagen, Übermittlungen, Aufbewahrung und Betroffenenrechte.',
      'ui_privacy_notice_meta_title',        'Datenschutzhinweis | Ensotek',
      'ui_privacy_notice_meta_description',
        'Ensotek Datenschutzhinweis: Verantwortlicher, Zwecke, Rechtsgrundlagen, Übermittlungen, Aufbewahrung und Betroffenenrechte.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

COMMIT;

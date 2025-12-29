-- =============================================================
-- 049-1.3_site_settings_ui_kvkk.sql  [FINAL]
-- ui_kvkk (KVKK page UI strings)
--  - Key: ui_kvkk
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Upsert: ON DUPLICATE KEY UPDATE
--  - NO ALTER / NO PATCH
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- =============================================================
-- ui_kvkk (TR/EN/DE)
-- =============================================================
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
VALUES
(
  UUID(),
  'ui_kvkk',
  'tr',
  CAST(
    JSON_OBJECT(
      -- Banner / Page title
      'ui_kvkk_page_title',        'KVKK',
      'ui_kvkk_fallback_title',    'KVKK',

      -- Empty / Error states
      'ui_kvkk_empty',             'KVKK içeriği bulunamadı.',
      'ui_kvkk_empty_text',        'KVKK içeriği yakında yayınlanacaktır.',

      -- SEO (pages/kvkk.tsx)
      'ui_kvkk_page_description',
        'Ensotek KVKK bilgilendirmesi: kişisel verilerin işlenmesi, hukuki sebepler, güvenlik önlemleri ve başvuru hakları.',
      'ui_kvkk_meta_title',        'KVKK | Ensotek',
      'ui_kvkk_meta_description',
        'Ensotek KVKK bilgilendirmesi: kişisel verilerin işlenmesi, hukuki sebepler, güvenlik önlemleri ve başvuru hakları.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_kvkk',
  'en',
  CAST(
    JSON_OBJECT(
      -- Banner / Page title
      'ui_kvkk_page_title',        'Privacy (KVKK)',
      'ui_kvkk_fallback_title',    'Privacy (KVKK)',

      -- Empty / Error states
      'ui_kvkk_empty',             'KVKK content not found.',
      'ui_kvkk_empty_text',        'The KVKK content will be published here soon.',

      -- SEO
      'ui_kvkk_page_description',
        'Ensotek privacy notice: processing of personal data, legal bases, security measures, and data subject rights.',
      'ui_kvkk_meta_title',        'Privacy (KVKK) | Ensotek',
      'ui_kvkk_meta_description',
        'Ensotek privacy notice: processing of personal data, legal bases, security measures, and data subject rights.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_kvkk',
  'de',
  CAST(
    JSON_OBJECT(
      -- Banner / Page title
      'ui_kvkk_page_title',        'Datenschutz (KVKK)',
      'ui_kvkk_fallback_title',    'Datenschutz (KVKK)',

      -- Empty / Error states
      'ui_kvkk_empty',             'KVKK-Inhalt nicht gefunden.',
      'ui_kvkk_empty_text',        'Der KVKK-Inhalt wird hier in Kürze veröffentlicht.',

      -- SEO
      'ui_kvkk_page_description',
        'Ensotek Datenschutzhinweis: Verarbeitung personenbezogener Daten, Rechtsgrundlagen, Sicherheitsmaßnahmen und Betroffenenrechte.',
      'ui_kvkk_meta_title',        'Datenschutz (KVKK) | Ensotek',
      'ui_kvkk_meta_description',
        'Ensotek Datenschutzhinweis: Verarbeitung personenbezogener Daten, Rechtsgrundlagen, Sicherheitsmaßnahmen und Betroffenenrechte.'
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

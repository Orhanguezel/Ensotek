-- =============================================================
-- 049_site_settings_ui_hero.sql
-- Ensotek – UI Hero (site_settings.ui_hero)
--  - Key: ui_hero
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Extendable: clone from tr as bootstrap (collation-safe)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_hero',
  'de',
  CAST(JSON_OBJECT(
    'ui_hero_kicker_prefix', 'Ensotek',
    'ui_hero_kicker_brand',  'Mühendislik',

    'ui_hero_title_fallback',
      'Endüstriyel su soğutma kulelerinde uzman çözüm ortağınız',
    'ui_hero_desc_fallback',
      'Enerji santralleri, endüstriyel tesisler ve ticari binalar için yüksek verimli su soğutma kulesi tasarım, imalat, montaj ve devreye alma hizmetleri sunuyoruz.',

    'ui_hero_cta', 'Teklif Al',

    'ui_hero_prev', 'Önceki görsel',
    'ui_hero_next', 'Sonraki görsel'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_hero',
  'en',
  CAST(JSON_OBJECT(
    'ui_hero_kicker_prefix', 'Ensotek',
    'ui_hero_kicker_brand',  'Engineering',

    'ui_hero_title_fallback',
      'Your expert partner in industrial cooling tower solutions',
    'ui_hero_desc_fallback',
      'We design, manufacture, install, and commission high-efficiency cooling tower systems for power plants, industrial facilities, and commercial buildings.',

    'ui_hero_cta', 'Request a quote',

    'ui_hero_prev', 'Previous slide',
    'ui_hero_next', 'Next slide'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_hero',
  'de',
  CAST(JSON_OBJECT(
    'ui_hero_kicker_prefix', 'Ensotek',
    'ui_hero_kicker_brand',  'Engineering',

    'ui_hero_title_fallback',
      'Ihr erfahrener Partner für industrielle Kühlturmlösungen',
    'ui_hero_desc_fallback',
      'Wir planen, fertigen, montieren und nehmen hocheffiziente Kühlturmsysteme für Kraftwerke, Industrieanlagen und Gewerbegebäude in Betrieb.',

    'ui_hero_cta', 'Angebot anfordern',

    'ui_hero_prev', 'Vorherige Folie',
    'ui_hero_next', 'Nächste Folie'
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
  AND (s.`key`  COLLATE utf8mb4_unicode_ci) = ('ui_hero' COLLATE utf8mb4_unicode_ci)
  AND (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci) <> ('de' COLLATE utf8mb4_unicode_ci)
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE (t.`key`  COLLATE utf8mb4_unicode_ci) = (s.`key` COLLATE utf8mb4_unicode_ci)
      AND (t.locale COLLATE utf8mb4_unicode_ci) = (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci)
  );

-- =============================================================
-- 040.1_site_meta.sql  (FINAL)
-- Ensotek – Default Meta + Global SEO (NEW STANDARD)
--
-- Goals:
--   - Fix SEO tool warnings:
--       * Meta title: remove disallowed characters (avoid: | & etc.)
--       * Meta description: keep <= ~160 chars
--   - Future-proof:
--       * seo + site_seo: global fallback => locale='*'
--       * seo + site_seo: localized overrides => locale IN ('tr','en','de')
--       * site_meta_default: add '*' fallback + per-locale overrides
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- -------------------------------------------------------------
-- TABLE GUARD
-- -------------------------------------------------------------
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

-- -------------------------------------------------------------
-- Helpers
-- -------------------------------------------------------------
SET @OG_DEFAULT := '/img/og-default.jpg';

-- Title policies:
-- - Avoid: | & " ' < > etc. (some SEO tools flag these)
-- - Use: "–" as separator, and "and/und/ve" instead of "&"

SET @BRAND_TR := 'Ensotek Su Sogutma Kuleleri ve Teknolojileri';
SET @BRAND_EN := 'Ensotek Cooling Towers and Technologies';
SET @BRAND_DE := 'Ensotek Kuehltuerme und Technologien';

-- Concise descriptions (target: ~150-160 chars)
SET @DESC_TR := 'CTP malzemeden acik ve kapali tip su sogutma kuleleri. Imaalat ve montaj. Bakim, onarim, modernizasyon, test ve yedek parca.';
SET @DESC_EN := 'Open and closed-circuit FRP cooling towers. Manufacturing and installation. Maintenance, repair, modernization, performance testing and spare parts.';
SET @DESC_DE := 'Offene und geschlossene GFK Kuehltuerme. Herstellung und Montage. Wartung, Reparatur, Modernisierung, Leistungstests und Ersatzteile.';

-- =============================================================
-- GLOBAL SEO DEFAULTS (locale='*')  --> NÖTR/GENEL DEFAULT
-- =============================================================

-- PRIMARY: seo (GLOBAL DEFAULT)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  COALESCE(
    (SELECT `id` FROM `site_settings` WHERE `key`='seo' AND `locale`='*' LIMIT 1),
    UUID()
  ),
  'seo',
  '*',
  CAST(
    JSON_OBJECT(
      'site_name',      'Ensotek',
      'title_default',  'Ensotek',
      'title_template', '%s – Ensotek',
      'description',    'Industrial cooling solutions and cooling towers.',
      'open_graph', JSON_OBJECT(
        'type',   'website',
        'images', JSON_ARRAY(@OG_DEFAULT)
      ),
      'twitter', JSON_OBJECT(
        'card',    'summary_large_image',
        'site',    '',
        'creator', ''
      ),
      'robots', JSON_OBJECT(
        'noindex', false,
        'index',   true,
        'follow',  true
      )
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- FALLBACK: site_seo (GLOBAL DEFAULT)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  COALESCE(
    (SELECT `id` FROM `site_settings` WHERE `key`='site_seo' AND `locale`='*' LIMIT 1),
    UUID()
  ),
  'site_seo',
  '*',
  CAST(
    JSON_OBJECT(
      'site_name',      'Ensotek',
      'title_default',  'Ensotek',
      'title_template', '%s – Ensotek',
      'description',    'Industrial cooling solutions and cooling towers.',
      'open_graph', JSON_OBJECT(
        'type',   'website',
        'images', JSON_ARRAY(@OG_DEFAULT)
      ),
      'twitter', JSON_OBJECT(
        'card',    'summary_large_image',
        'site',    '',
        'creator', ''
      ),
      'robots', JSON_OBJECT(
        'noindex', false,
        'index',   true,
        'follow',  true
      )
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- LOCALIZED SEO OVERRIDES (tr/en/de)
-- =============================================================

-- seo overrides
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  COALESCE((SELECT `id` FROM `site_settings` WHERE `key`='seo' AND `locale`='tr' LIMIT 1), UUID()),
  'seo',
  'tr',
  CAST(
    JSON_OBJECT(
      'site_name',      @BRAND_TR,
      'title_default',  @BRAND_TR,
      'title_template', '%s – Ensotek',
      'description',    @DESC_TR,
      'open_graph', JSON_OBJECT(
        'type',   'website',
        'images', JSON_ARRAY(@OG_DEFAULT)
      ),
      'twitter', JSON_OBJECT(
        'card',    'summary_large_image',
        'site',    '',
        'creator', ''
      ),
      'robots', JSON_OBJECT(
        'noindex', false,
        'index',   true,
        'follow',  true
      )
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  COALESCE((SELECT `id` FROM `site_settings` WHERE `key`='seo' AND `locale`='en' LIMIT 1), UUID()),
  'seo',
  'en',
  CAST(
    JSON_OBJECT(
      'site_name',      @BRAND_EN,
      'title_default',  @BRAND_EN,
      'title_template', '%s – Ensotek',
      'description',    @DESC_EN,
      'open_graph', JSON_OBJECT(
        'type',   'website',
        'images', JSON_ARRAY(@OG_DEFAULT)
      ),
      'twitter', JSON_OBJECT(
        'card',    'summary_large_image',
        'site',    '',
        'creator', ''
      ),
      'robots', JSON_OBJECT(
        'noindex', false,
        'index',   true,
        'follow',  true
      )
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  COALESCE((SELECT `id` FROM `site_settings` WHERE `key`='seo' AND `locale`='de' LIMIT 1), UUID()),
  'seo',
  'de',
  CAST(
    JSON_OBJECT(
      'site_name',      @BRAND_DE,
      'title_default',  @BRAND_DE,
      'title_template', '%s – Ensotek',
      'description',    @DESC_DE,
      'open_graph', JSON_OBJECT(
        'type',   'website',
        'images', JSON_ARRAY(@OG_DEFAULT)
      ),
      'twitter', JSON_OBJECT(
        'card',    'summary_large_image',
        'site',    '',
        'creator', ''
      ),
      'robots', JSON_OBJECT(
        'noindex', false,
        'index',   true,
        'follow',  true
      )
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- site_seo overrides (fallback) – seo ile aynı tutulur (kopya)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  COALESCE((SELECT `id` FROM `site_settings` WHERE `key`='site_seo' AND `locale`='tr' LIMIT 1), UUID()),
  'site_seo',
  'tr',
  (SELECT `value` FROM `site_settings` WHERE `key`='seo' AND `locale`='tr' LIMIT 1),
  NOW(3),
  NOW(3)
),
(
  COALESCE((SELECT `id` FROM `site_settings` WHERE `key`='site_seo' AND `locale`='en' LIMIT 1), UUID()),
  'site_seo',
  'en',
  (SELECT `value` FROM `site_settings` WHERE `key`='seo' AND `locale`='en' LIMIT 1),
  NOW(3),
  NOW(3)
),
(
  COALESCE((SELECT `id` FROM `site_settings` WHERE `key`='site_seo' AND `locale`='de' LIMIT 1), UUID()),
  'site_seo',
  'de',
  (SELECT `value` FROM `site_settings` WHERE `key`='seo' AND `locale`='de' LIMIT 1),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- site_meta_default
-- - Add '*' fallback so new locales won't break
-- - Keep per-locale overrides for tr/en/de
-- =============================================================

-- '*' fallback (neutral EN)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  COALESCE((SELECT `id` FROM `site_settings` WHERE `key`='site_meta_default' AND `locale`='*' LIMIT 1), UUID()),
  'site_meta_default',
  '*',
  CAST(
    JSON_OBJECT(
      'title',       'Ensotek',
      'description', 'Industrial cooling solutions and cooling towers.',
      'keywords',    'ensotek, cooling tower, industrial cooling, FRP'
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- tr/en/de overrides
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  COALESCE((SELECT `id` FROM `site_settings` WHERE `key`='site_meta_default' AND `locale`='tr' LIMIT 1), UUID()),
  'site_meta_default',
  'tr',
  CAST(
    JSON_OBJECT(
      'title',       @BRAND_TR,
      'description', @DESC_TR,
      'keywords',    'ensotek, su sogutma kulesi, sogutma kulesi, ctp, camelyaf takviyeli polyester, acik tip, kapali tip, modernizasyon, bakim onarim, test, yedek parca'
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  COALESCE((SELECT `id` FROM `site_settings` WHERE `key`='site_meta_default' AND `locale`='en' LIMIT 1), UUID()),
  'site_meta_default',
  'en',
  CAST(
    JSON_OBJECT(
      'title',       @BRAND_EN,
      'description', @DESC_EN,
      'keywords',    'ensotek, cooling tower, FRP, fiber reinforced plastic, open circuit, closed circuit, modernization, maintenance, repair, performance testing, spare parts'
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  COALESCE((SELECT `id` FROM `site_settings` WHERE `key`='site_meta_default' AND `locale`='de' LIMIT 1), UUID()),
  'site_meta_default',
  'de',
  CAST(
    JSON_OBJECT(
      'title',       @BRAND_DE,
      'description', @DESC_DE,
      'keywords',    'ensotek, kuehlturm, GFK, glasfaserverstaerkter kunststoff, offen, geschlossen, modernisierung, wartung, reparatur, leistungstest, ersatzteile'
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

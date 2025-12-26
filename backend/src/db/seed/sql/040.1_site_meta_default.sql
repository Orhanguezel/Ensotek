-- =============================================================
-- 040.1_site_meta_default.sql
-- (Extended) Default Meta + Global SEO (NEW STANDARD) [FIXED]
--
-- Standard (Future-proof):
--   - GLOBAL defaults => locale='*'  (seo, site_seo)
--   - Localized overrides optional => locale='tr','en','de',...
--   - site_meta_default => localized (per-locale)
--
-- Compatible with:
--   - src/seo/serverMetadata.ts (fetchSeoObject/buildMetadataFromSeo)
--   - src/seo/meta.ts (client buildMeta)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

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
-- Helper: default OG image path (relative OK)
-- serverMetadata.ts absUrl() ile mutlak yapar
-- -------------------------------------------------------------
SET @OG_DEFAULT := '/img/og-default.jpg';

-- =============================================================
-- GLOBAL SEO DEFAULTS (NEW STANDARD)
-- Keys: seo (primary) + site_seo (fallback)
-- locale='*' => tüm diller için default
-- =============================================================

-- PRIMARY: seo (GLOBAL DEFAULT)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  UUID(),
  'seo',
  '*',
  CAST(
    JSON_OBJECT(
      'site_name',      'Ensotek',
      'title_default',  'Ensotek',
      'title_template', '%s | Ensotek',
      'description',    'Ensotek Energy Systems provides industrial solutions and energy efficiency services.',
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
  UUID(),
  'site_seo',
  '*',
  CAST(
    JSON_OBJECT(
      'site_name',      'Ensotek',
      'title_default',  'Ensotek',
      'title_template', '%s | Ensotek',
      'description',    'Ensotek Energy Systems provides industrial solutions and energy efficiency services.',
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
-- OPTIONAL: LOCALE OVERRIDES (3 dil için örnek)
-- =============================================================

-- seo overrides
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  UUID(),
  'seo',
  'tr',
  CAST(
    JSON_OBJECT(
      'site_name',      'Ensotek',
      'title_default',  'Ensotek | Endüstriyel Çözümler',
      'title_template', '%s | Ensotek',
      'description',    'Endüstriyel soğutma kuleleri, modernizasyon ve enerji verimliliği çözümleri sunan Ensotek Enerji Sistemleri.',
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
  UUID(),
  'seo',
  'en',
  CAST(
    JSON_OBJECT(
      'site_name',      'Ensotek',
      'title_default',  'Ensotek | Industrial Solutions',
      'title_template', '%s | Ensotek',
      'description',    'Ensotek Energy Systems provides industrial cooling tower engineering and energy efficiency solutions.',
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
  UUID(),
  'seo',
  'de',
  CAST(
    JSON_OBJECT(
      'site_name',      'Ensotek',
      'title_default',  'Ensotek | Industrielle Lösungen',
      'title_template', '%s | Ensotek',
      'description',    'Ensotek Energiesysteme bietet industrielle Kühlturmtechnik und Energieeffizienzlösungen.',
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

-- site_seo overrides (fallback) – genelde seo ile aynı tutulur
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  UUID(),
  'site_seo',
  'tr',
  CAST(
    JSON_OBJECT(
      'site_name',      'Ensotek',
      'title_default',  'Ensotek | Endüstriyel Çözümler',
      'title_template', '%s | Ensotek',
      'description',    'Endüstriyel soğutma kuleleri, modernizasyon ve enerji verimliliği çözümleri sunan Ensotek Enerji Sistemleri.',
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
  UUID(),
  'site_seo',
  'en',
  CAST(
    JSON_OBJECT(
      'site_name',      'Ensotek',
      'title_default',  'Ensotek | Industrial Solutions',
      'title_template', '%s | Ensotek',
      'description',    'Ensotek Energy Systems provides industrial cooling tower engineering and energy efficiency solutions.',
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
  UUID(),
  'site_seo',
  'de',
  CAST(
    JSON_OBJECT(
      'site_name',      'Ensotek',
      'title_default',  'Ensotek | Industrielle Lösungen',
      'title_template', '%s | Ensotek',
      'description',    'Ensotek Energiesysteme bietet industrielle Kühlturmtechnik und Energieeffizienzlösungen.',
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
-- site_meta_default (localized) – 3 dil
-- =============================================================

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  UUID(),
  'site_meta_default',
  'tr',
  CAST(
    JSON_OBJECT(
      'title',       'Ensotek | Endüstriyel Çözümler',
      'description', 'Endüstriyel soğutma kuleleri, modernizasyon ve enerji verimliliği çözümleri sunan Ensotek Enerji Sistemleri.',
      'keywords',    'ensotek, endüstriyel, soğutma kulesi, enerji verimliliği, b2b'
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'site_meta_default',
  'en',
  CAST(
    JSON_OBJECT(
      'title',       'Ensotek | Industrial Solutions',
      'description', 'Ensotek Energy Systems provides industrial cooling tower engineering and energy efficiency solutions.',
      'keywords',    'ensotek, industrial, cooling towers, energy efficiency, b2b'
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'site_meta_default',
  'de',
  CAST(
    JSON_OBJECT(
      'title',       'Ensotek | Industrielle Lösungen',
      'description', 'Ensotek Energiesysteme bietet industrielle Kühlturmtechnik und Energieeffizienzlösungen.',
      'keywords',    'ensotek, industriell, kühlturm, energieeffizienz, b2b'
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

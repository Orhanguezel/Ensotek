-- =============================================================
-- 040.1_site_meta.sql
-- (Extended) Default Meta + Global SEO (NEW STANDARD) [ENSOTEK - UPDATED]
--
-- Standard (Future-proof):
--   - GLOBAL defaults => locale='*'  (seo, site_seo)
--   - Localized overrides optional => locale='tr','en','de',...
--   - site_meta_default => localized (per-locale)
--
-- Compatible with:
--   - src/seo/serverMetadata.ts (fetchSeoObject/buildMetadataFromSeo)
--   - src/seo/meta.ts (client buildMeta)
--
-- Notes:
--  - Keep keys STRICT-compatible with your seoSchema:
--    site_name, title_default, title_template, description, open_graph{type,images[]}, twitter{...}, robots{...}
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

-- -------------------------------------------------------------
-- Brand helpers (text only; used inside JSON strings)
-- -------------------------------------------------------------
SET @BRAND_SHORT_TR := 'Ensotek Su Soğutma Kuleleri';
SET @BRAND_LEGAL_TR := 'ENSOTEK Su Soğutma Kuleleri ve Teknolojileri Mühendislik San.Tic. Ltd. Şti';

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
      'site_name',      @BRAND_SHORT_TR,
      'title_default',  @BRAND_SHORT_TR,
      'title_template', '%s | Ensotek',
      'description',
        CONCAT(
          @BRAND_LEGAL_TR,
          ' — Camelyaf Takviyeli Polyester (CTP) malzemeden Açık Tip ve Kapalı Tip Su Soğutma Kuleleri imalatı ve montajı. ',
          'Ayrıca mevcut su soğutma kulelerinin bakım-onarım, modernizasyon, performans testleri ve yedek parça temini. ',
          'Kaliteli ürün ve hizmet ile uzun ömürlü çözümler Ensotek’in birinci önceliğidir.'
        ),
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
      'site_name',      @BRAND_SHORT_TR,
      'title_default',  @BRAND_SHORT_TR,
      'title_template', '%s | Ensotek',
      'description',
        CONCAT(
          @BRAND_LEGAL_TR,
          ' — CTP malzemeden Açık Tip ve Kapalı Tip Su Soğutma Kuleleri. ',
          'Bakım-onarım, modernizasyon, performans testleri ve yedek parça hizmetleri.'
        ),
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
-- OPTIONAL: LOCALE OVERRIDES (TR/EN/DE)
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
      'site_name',      @BRAND_SHORT_TR,
      'title_default',  'Ensotek | Su Soğutma Kuleleri',
      'title_template', '%s | Ensotek',
      'description',
        CONCAT(
          @BRAND_LEGAL_TR,
          ' — Camelyaf Takviyeli Polyester (CTP) malzemeden Açık Tip ve Kapalı Tip Su Soğutma Kuleleri imalatı ve montajı. ',
          'Mevcut kuleler için bakım-onarım, modernizasyon, performans testleri ve yedek parça temini. ',
          'Kaliteli ürün ve hizmet ile uzun ömürlü çözümler birinci önceliğimizdir.'
        ),
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
      'site_name',      'Ensotek Cooling Towers',
      'title_default',  'Ensotek | Cooling Towers & Technologies',
      'title_template', '%s | Ensotek',
      'description',
        'ENSOTEK Cooling Towers & Technologies — Manufacturing and installation of open-circuit and closed-circuit cooling towers made of FRP (fiber-reinforced plastic). Maintenance & repair, modernization, performance testing and spare parts supply for existing cooling towers. Quality and long-lasting solutions are our top priority.',
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
      'site_name',      'Ensotek Kühltürme',
      'title_default',  'Ensotek | Kühltürme & Technologien',
      'title_template', '%s | Ensotek',
      'description',
        'ENSOTEK — Herstellung und Montage von offenen und geschlossenen Kühltürmen aus GFK (glasfaserverstärkter Kunststoff). Wartung, Reparatur, Modernisierung, Leistungstests und Ersatzteilversorgung für bestehende Kühltürme. Qualität und langlebige Lösungen haben für uns höchste Priorität.',
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
  (SELECT `value` FROM `site_settings` WHERE `key`='seo' AND `locale`='tr' LIMIT 1),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'site_seo',
  'en',
  (SELECT `value` FROM `site_settings` WHERE `key`='seo' AND `locale`='en' LIMIT 1),
  NOW(3),
  NOW(3)
),
(
  UUID(),
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
-- site_meta_default (localized) – TR/EN/DE
-- =============================================================

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  UUID(),
  'site_meta_default',
  'tr',
  CAST(
    JSON_OBJECT(
      'title',       'Ensotek | Su Soğutma Kuleleri',
      'description', CONCAT(
        @BRAND_LEGAL_TR,
        ' — CTP malzemeden Açık Tip ve Kapalı Tip Su Soğutma Kuleleri. Bakım-onarım, modernizasyon, performans testleri ve yedek parça.'
      ),
      'keywords',    'ensotek, su soğutma kulesi, soğutma kulesi, ctp, camelyaf takviyeli polyester, açık tip, kapalı tip, modernizasyon, bakım onarım, performans testi, yedek parça'
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
      'title',       'Ensotek | Cooling Towers & Technologies',
      'description', 'ENSOTEK — Open-circuit and closed-circuit cooling towers made of FRP. Installation, maintenance & repair, modernization, performance testing and spare parts.',
      'keywords',    'ensotek, cooling tower, FRP, fiber reinforced plastic, open circuit, closed circuit, modernization, maintenance, repair, performance testing, spare parts'
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
      'title',       'Ensotek | Kühltürme & Technologien',
      'description', 'ENSOTEK — Offene und geschlossene Kühltürme aus GFK. Montage, Wartung, Reparatur, Modernisierung, Leistungstests und Ersatzteile.',
      'keywords',    'ensotek, kühlturm, GFK, glasfaserverstärkter kunststoff, offen, geschlossen, modernisierung, wartung, reparatur, leistungstest, ersatzteile'
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

-- =============================================================
-- FILE: 220_sites_schema.sql
-- Multi-site support:
--   - sites        (site registry)
--   - site_locales (per-site active locales + default)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

-- =============================================================
-- SITES
-- =============================================================
DROP TABLE IF EXISTS `site_locales`;
DROP TABLE IF EXISTS `sites`;

CREATE TABLE IF NOT EXISTS `sites` (
  `id`          CHAR(36)      NOT NULL,
  `name`        VARCHAR(100)  NOT NULL,
  `slug`        VARCHAR(64)   NOT NULL,          -- 'kuhlturm' | 'ensotek_de' | 'ensotek_tr' | 'ensotek_com'
  `domain`      VARCHAR(255)  NOT NULL,          -- 'kuhlturm.com'
  `is_active`   TINYINT(1)    NOT NULL DEFAULT 1,

  `created_at`  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                              ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE KEY `sites_slug_uq`   (`slug`),
  UNIQUE KEY `sites_domain_uq` (`domain`),
  KEY `sites_active_idx`       (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- SITE_LOCALES
-- =============================================================
CREATE TABLE IF NOT EXISTS `site_locales` (
  `id`           CHAR(36)    NOT NULL,
  `site_id`      CHAR(36)    NOT NULL,
  `locale_code`  VARCHAR(8)  NOT NULL,   -- 'de' | 'tr' | 'en'
  `is_default`   TINYINT(1)  NOT NULL DEFAULT 0,
  `is_active`    TINYINT(1)  NOT NULL DEFAULT 1,

  `created_at`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                             ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE KEY `site_locales_site_locale_uq` (`site_id`, `locale_code`),
  KEY `site_locales_site_idx`              (`site_id`),
  KEY `site_locales_locale_idx`            (`locale_code`),
  KEY `site_locales_default_idx`           (`is_default`),

  CONSTRAINT `fk_site_locales_site`
    FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

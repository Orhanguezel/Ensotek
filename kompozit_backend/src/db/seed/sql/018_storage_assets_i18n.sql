-- =============================================================
-- 201_storage_assets_i18n.sql
-- Ensotek - Storage Assets i18n (for future multi-language support)
-- ✅ Currently no i18n data needed
-- ✅ Reserved for future use
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- -------------------------------------------------------------
-- TABLE GUARD
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `storage_assets_i18n` (
  id              CHAR(36)      NOT NULL,
  asset_id        CHAR(36)      NOT NULL,
  locale          VARCHAR(8)    NOT NULL,

  name            VARCHAR(255)  DEFAULT NULL,
  alt             VARCHAR(255)  DEFAULT NULL,
  caption         TEXT          DEFAULT NULL,
  description     TEXT          DEFAULT NULL,

  created_at      DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at      DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),
  UNIQUE KEY uniq_asset_locale (asset_id, locale),
  KEY idx_storage_i18n_locale (locale),
  CONSTRAINT fk_storage_i18n_asset
    FOREIGN KEY (asset_id)
    REFERENCES storage_assets(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- NO SEED DATA YET
-- Add i18n translations here when needed
-- -------------------------------------------------------------

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;

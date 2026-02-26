-- =============================================================
-- 032_ip_blocklist_schema.sql
-- Ensotek – IP blocklist table
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS `ip_blocklist` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ip`          VARCHAR(64)     NOT NULL,
  `note`        VARCHAR(255)    DEFAULT NULL,
  `blocked_by`  VARCHAR(64)     DEFAULT NULL COMMENT 'admin user_id',
  `created_at`  DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY `ip_blocklist_ip_unique` (`ip`),
  INDEX `ip_blocklist_created_idx` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed: block the known scanner IP immediately
INSERT IGNORE INTO `ip_blocklist` (`ip`, `note`)
VALUES ('72.61.93.212', 'Auto-blocked: 4000+ scanner requests (Hostinger VPS)');

-- =============================================================
-- 031_audit_schema_v2.sql
-- Ensotek – Audit schema upgrade: error tracking + request body
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Error tracking columns
ALTER TABLE `audit_request_logs`
  ADD COLUMN IF NOT EXISTS `error_message` VARCHAR(512) DEFAULT NULL AFTER `city`,
  ADD COLUMN IF NOT EXISTS `error_code` VARCHAR(64) DEFAULT NULL AFTER `error_message`,
  ADD COLUMN IF NOT EXISTS `request_body` LONGTEXT DEFAULT NULL AFTER `error_code`;

-- Analytics performance indexes
CREATE INDEX `audit_request_logs_status_idx` ON `audit_request_logs` (`status_code`);
CREATE INDEX `audit_request_logs_method_idx` ON `audit_request_logs` (`method`);

-- =============================================================
-- 999_add_i18n_data_to_category_i18n.sql
-- Add i18n_data column to category_i18n table for JSON extra data
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Add i18n_data column
ALTER TABLE `category_i18n`
ADD COLUMN `i18n_data` LONGTEXT NULL AFTER `alt`;

-- Default to NULL for existing rows (no migration needed)

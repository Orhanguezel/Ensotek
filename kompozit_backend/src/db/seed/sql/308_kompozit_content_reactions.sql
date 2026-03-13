-- =============================================================
-- FILE: 308_kompozit_content_reactions.sql
-- Generic content reaction totals (used by kompozit blog likes)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS `content_reaction_totals` (
  `target_type` varchar(50) NOT NULL,
  `target_id` char(36) NOT NULL,
  `likes_count` int NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`target_type`, `target_id`),
  KEY `content_reaction_target_id_idx` (`target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

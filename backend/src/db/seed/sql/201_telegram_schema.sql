-- =============================================================
-- Telegram module schema
-- =============================================================

CREATE TABLE IF NOT EXISTS `telegram_inbound_messages` (
  `id` char(36) NOT NULL,
  `update_id` int NOT NULL,
  `message_id` int DEFAULT NULL,
  `chat_id` varchar(64) NOT NULL,
  `chat_type` varchar(32) DEFAULT NULL,
  `chat_title` varchar(255) DEFAULT NULL,
  `chat_username` varchar(255) DEFAULT NULL,
  `from_id` varchar(64) DEFAULT NULL,
  `from_username` varchar(255) DEFAULT NULL,
  `from_first_name` varchar(255) DEFAULT NULL,
  `from_last_name` varchar(255) DEFAULT NULL,
  `from_is_bot` int NOT NULL DEFAULT 0,
  `text` text,
  `raw` text,
  `telegram_date` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tg_inbound_update_message` (`update_id`,`message_id`),
  KEY `idx_tg_inbound_chat_id` (`chat_id`),
  KEY `idx_tg_inbound_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional defaults for auto-reply settings
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
SELECT UUID(), 'telegram_autoreply_enabled', '*', 'false', NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `site_settings` WHERE `key` = 'telegram_autoreply_enabled' AND `locale` = '*'
);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
SELECT UUID(), 'telegram_autoreply_mode', '*', 'simple', NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `site_settings` WHERE `key` = 'telegram_autoreply_mode' AND `locale` = '*'
);

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
SELECT UUID(), 'telegram_autoreply_template', '*', 'Vielen Dank für Ihre Nachricht! Wir werden uns schnellstmöglich bei Ihnen melden.\n\nMesajınız için teşekkür ederiz. En kısa sürede size dönüş yapacağız.\n\n- Ensotek Team', NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `site_settings` WHERE `key` = 'telegram_autoreply_template' AND `locale` = '*'
);

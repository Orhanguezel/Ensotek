-- =============================================================
-- Chat AI knowledge base (admin managed, locale aware)
-- =============================================================

CREATE TABLE IF NOT EXISTS `chat_ai_knowledge` (
  `id` varchar(36) NOT NULL,
  `locale` varchar(10) NOT NULL,
  `title` varchar(160) NOT NULL,
  `content` text NOT NULL,
  `tags` varchar(500) DEFAULT NULL,
  `is_active` tinyint NOT NULL DEFAULT 1,
  `priority` int NOT NULL DEFAULT 100,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_chat_ai_knowledge_locale_active_priority` (`locale`, `is_active`, `priority`),
  KEY `ix_chat_ai_knowledge_updated` (`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `chat_ai_knowledge`
(`id`, `locale`, `title`, `content`, `tags`, `is_active`, `priority`)
VALUES
(
  'c1000000-0000-0000-0000-000000000001',
  'tr',
  'Fiyat sorularinda sabit cevap politikasi',
  'Fiyat bilgisi bu kanaldan paylasilmaz. Fiyat sorusu gelirse su mesaji ver: "Fiyat bilgisini bu kanaldan paylasamiyorum. Lutfen teklif olusturun. Isterseniz sizi teklif formuna yonlendirebilirim, ister misiniz?"',
  'fiyat,teklif,offer,redirect',
  1,
  1
),
(
  'c1000000-0000-0000-0000-000000000002',
  'tr',
  'Evet sonrasinda link paylas',
  'Asistan teklif yonlendirmesi sorduktan sonra kullanici "evet/olur/tamam" derse teklif formu baglantisini paylas. Onay yoksa link paylasma.',
  'teklif,evet,onay,link',
  1,
  2
),
(
  'c1000000-0000-0000-0000-000000000003',
  'en',
  'Price questions strict response policy',
  'Do not share pricing in this chat channel. For price questions use this template: "I cannot share pricing on this channel. Please create an offer request. If you want, I can direct you to the offer form. Would you like that?"',
  'price,offer,redirect',
  1,
  1
),
(
  'c1000000-0000-0000-0000-000000000004',
  'en',
  'Share offer link only after consent',
  'After asking redirect consent, share offer form link only when the user confirms with yes/ok/sure.',
  'offer,consent,link',
  1,
  2
)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `content` = VALUES(`content`),
  `tags` = VALUES(`tags`),
  `is_active` = VALUES(`is_active`),
  `priority` = VALUES(`priority`),
  `updated_at` = CURRENT_TIMESTAMP;

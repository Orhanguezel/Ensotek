-- =============================================================
-- FILE: 052_custom_pages_news.seed.sql
-- Ensotek – NEWS custom_pages PARENT KAYITLARI (tüm haberler)
-- ⚠  i18n içerik → 052.tr / 052.en / 052.de dosyalarına taşındı
-- =============================================================
-- UUID / display_order tablosu:
--   22220001  101  Web Sitemiz Yenilendi (duyuru)
--   22220003  102  Egypt HVAC-R 2025
--   22220004  103  Aquatherm Bakü 2025
--   22220005  104  Hotel-Tech Antalya 2025
--   22220006  105  ALUEXPO 2025 (İstanbul, Hall 2, E155)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- category / sub-category sabitleri (011 & 012 ile hizalı)
SET @CAT_NEWS_DUYS        := 'aaaa2003-1111-4111-8111-aaaaaaaa2003';
SET @SUB_NEWS_GENERAL_ANN := 'bbbb2001-1111-4111-8111-bbbbbbbb2001';

-- module key
SET @MODULE_KEY_NEWS := 'news';

-- ---- görsel URL sabitleri -----------------------------------------
-- 01 — Web sitesi yenilendi
SET @IMG_NEWS_WEB :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp';

-- 02 — Egypt HVAC-R 2025
SET @IMG_EGYPT_1 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958173/uploads/metahub/news-images/img-20240520-wa0183-1752958172132-879111355.webp';

-- 03 — Aquatherm Bakü 2025
SET @IMG_BAKU_1 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958291/uploads/metahub/news-images/img-20241017-wa0040-1752958289686-74069766.webp';
SET @IMG_BAKU_2 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958291/uploads/metahub/news-images/baku-fuar-1-1752958289688-847911396.webp';
SET @IMG_BAKU_3 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958291/uploads/metahub/news-images/img-20241017-wa0033-1752958290248-519948162.webp';
SET @IMG_BAKU_4 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958291/uploads/metahub/news-images/img-20241017-wa0042-1752958290250-566260910.webp';
SET @IMG_BAKU_5 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958292/uploads/metahub/news-images/img-20241127-wa0007-1752958291068-704255418.webp';

-- 04 — Hotel-Tech Antalya 2025
SET @IMG_HOTEL_1 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958402/uploads/metahub/news-images/img-20250618-wa0024-1752958401251-408905732.webp';
SET @IMG_HOTEL_2 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958400/uploads/metahub/news-images/img-20250618-wa0021-1752958399183-255418708.webp';
SET @IMG_HOTEL_3 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958402/uploads/metahub/news-images/img-20250618-wa0012-1752958400227-284317921.webp';
SET @IMG_HOTEL_4 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958401/uploads/metahub/news-images/img-20250618-wa0023-1752958401249-770223355.webp';

-- 05 — ALUEXPO 2025  (fuar öncesi duyuru görseli)
SET @IMG_ALUEXPO_1 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752945605/uploads/metahub/news-images/ensotek-email-imza-1752945605003-245572109.webp';

-- =============================================================
-- PARENT UPSERT (custom_pages) — tüm haberler
-- =============================================================

INSERT INTO `custom_pages`
  (`id`, `module_key`, `is_published`, `featured`, `display_order`, `order_num`,
   `featured_image`, `featured_image_asset_id`,
   `image_url`, `storage_asset_id`,
   `images`, `storage_image_ids`,
   `category_id`, `sub_category_id`,
   `created_at`, `updated_at`)
VALUES

-- 01 — Web Sitemiz Yenilendi
(
  '22220001-2222-4222-8222-222222220001',
  @MODULE_KEY_NEWS, 1, 0, 101, 101,
  @IMG_NEWS_WEB, NULL, @IMG_NEWS_WEB, NULL,
  JSON_ARRAY(@IMG_NEWS_WEB),
  JSON_ARRAY(),
  @CAT_NEWS_DUYS, @SUB_NEWS_GENERAL_ANN,
  NOW(3), NOW(3)
),

-- 02 — Egypt HVAC-R 2025
(
  '22220003-2222-4222-8222-222222220003',
  @MODULE_KEY_NEWS, 1, 0, 102, 102,
  @IMG_EGYPT_1, NULL, @IMG_EGYPT_1, NULL,
  JSON_ARRAY(@IMG_EGYPT_1),
  JSON_ARRAY(),
  @CAT_NEWS_DUYS, @SUB_NEWS_GENERAL_ANN,
  '2025-07-19 17:20:06.428', '2025-07-19 20:49:51.752'
),

-- 03 — Aquatherm Bakü 2025
(
  '22220004-2222-4222-8222-222222220004',
  @MODULE_KEY_NEWS, 1, 0, 103, 103,
  @IMG_BAKU_1, NULL, @IMG_BAKU_1, NULL,
  JSON_ARRAY(@IMG_BAKU_1, @IMG_BAKU_2, @IMG_BAKU_3, @IMG_BAKU_4, @IMG_BAKU_5),
  JSON_ARRAY(),
  @CAT_NEWS_DUYS, @SUB_NEWS_GENERAL_ANN,
  '2025-07-19 17:20:06.428', '2025-07-19 20:51:33.294'
),

-- 04 — Hotel-Tech Antalya 2025
(
  '22220005-2222-4222-8222-222222220005',
  @MODULE_KEY_NEWS, 1, 0, 104, 104,
  @IMG_HOTEL_1, NULL, @IMG_HOTEL_1, NULL,
  JSON_ARRAY(@IMG_HOTEL_1, @IMG_HOTEL_2, @IMG_HOTEL_3, @IMG_HOTEL_4),
  JSON_ARRAY(),
  @CAT_NEWS_DUYS, @SUB_NEWS_GENERAL_ANN,
  '2025-07-19 17:20:06.428', '2025-07-19 20:53:23.466'
),

-- 05 — ALUEXPO 2025 (İstanbul Fuar Merkezi, Hall 2, Stand E155, 18-20 Eylül 2025)
(
  '22220006-2222-4222-8222-222222220006',
  @MODULE_KEY_NEWS, 1, 0, 105, 105,
  @IMG_ALUEXPO_1, NULL, @IMG_ALUEXPO_1, NULL,
  JSON_ARRAY(@IMG_ALUEXPO_1),
  JSON_ARRAY(),
  @CAT_NEWS_DUYS, @SUB_NEWS_GENERAL_ANN,
  '2025-07-19 17:20:06.428', '2025-07-19 20:46:40.260'
)

ON DUPLICATE KEY UPDATE
  `module_key`     = VALUES(`module_key`),
  `is_published`   = VALUES(`is_published`),
  `featured`       = VALUES(`featured`),
  `display_order`  = VALUES(`display_order`),
  `order_num`      = VALUES(`order_num`),
  `category_id`    = VALUES(`category_id`),
  `sub_category_id`= VALUES(`sub_category_id`),
  `updated_at`     = VALUES(`updated_at`);
  -- NOTE: image fields intentionally omitted — admin changes must not be overwritten

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;

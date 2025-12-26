-- =============================================================
-- FILE: 052.4_custom_pages_news_aluexpo_2025.seed.sql
-- NEWS – custom_pages + custom_pages_i18n
-- Yeni haber: “ALUEXPO 2025 – Uluslararası Alüminyum Fuarına Katılıyoruz!”
-- Diller: TR / EN / DE
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

/* KATEGORİ ID’LERİ (011 & 012 ile hizalı) */
SET @CAT_NEWS_GENERAL  := 'aaaa2001-1111-4111-8111-aaaaaaaa2001'; -- GENEL HABERLER
SET @CAT_NEWS_DUYS     := 'aaaa2003-1111-4111-8111-aaaaaaaa2003'; -- DUYURULAR
SET @CAT_NEWS_PRESS    := 'aaaa2004-1111-4111-8111-aaaaaaaa2004'; -- BASINDA ENSOTEK

/* ALT KATEGORİLER (012_catalog_subcategories.sql) */
SET @SUB_NEWS_GENERAL_ANN  := 'bbbb2001-1111-4111-8111-bbbbbbbb2001'; -- Duyurular (genel)

/* SABİT PAGE ID (deterministik) */
SET @NEWS_ALUEXPO_2025 := '22220006-2222-4222-8222-222222220006';

/* FEATURED IMAGE (Cloudinary) */
SET @IMG_NEWS_ALUEXPO_2025 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752945605/uploads/metahub/news-images/ensotek-email-imza-1752945605003-245572109.webp';

-- -------------------------------------------------------------
-- PARENT UPSERT (custom_pages)
-- -------------------------------------------------------------
INSERT INTO `custom_pages`
  (`id`, `is_published`, `display_order`,
   `featured_image`, `featured_image_asset_id`,
   `category_id`, `sub_category_id`,
   `created_at`, `updated_at`)
VALUES
  (
    @NEWS_ALUEXPO_2025,
    1,
    105,
    @IMG_NEWS_ALUEXPO_2025,
    NULL,
    @CAT_NEWS_DUYS,
    @SUB_NEWS_GENERAL_ANN,
    '2025-07-19 17:20:06.428',
    '2025-07-19 20:46:40.260'
  )
ON DUPLICATE KEY UPDATE
  `is_published`    = VALUES(`is_published`),
  `display_order`   = VALUES(`display_order`),
  `category_id`     = VALUES(`category_id`),
  `sub_category_id` = VALUES(`sub_category_id`),
  `featured_image`  = VALUES(`featured_image`),
  `updated_at`      = VALUES(`updated_at`);

-- =============================================================
-- I18N – @NEWS_ALUEXPO_2025 (TR/EN/DE)
-- Notlar:
-- - content: JSON_OBJECT('html', '...') olarak tutulur
-- - İçerikte linkler HTML anchor ile verildi
-- - tags: CSV string
-- =============================================================
INSERT INTO `custom_pages_i18n`
  (`id`, `page_id`, `locale`,
   `title`, `slug`, `content`,
   `summary`,
   `featured_image_alt`, `meta_title`, `meta_description`,
   `tags`,
   `created_at`, `updated_at`)
VALUES

-- -------------------------------------------------------------
-- TR
-- -------------------------------------------------------------
(
  UUID(),
  @NEWS_ALUEXPO_2025,
  'de',
  'ALUEXPO 2025 – Uluslararası Alüminyum Fuarına Katılıyoruz!',
  'aluexpo-2025-uluslararasi-aluminyum-fuarina-katiliyoruz',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p><strong>ALUEXPO 2025</strong> – 9. Uluslararası Alüminyum Teknolojileri, Makina ve Ürünleri İhtisas Fuarı’na katılıyoruz! ',
      '18–20 Eylül 2025 tarihlerinde <strong>İstanbul Fuar Merkezi</strong> <strong>2. Salon</strong> ',
      '<strong>E155</strong> nolu standımızda sizleri bekliyoruz.</p>',
      '<p><strong>Online davetiye</strong> için: ',
      '<a href="https://aluexpo.com/visitor-register-form" target="_blank" rel="noopener noreferrer">ALUEXPO Ziyaretçi Kaydı</a></p>',
      '<p>ALUEXPO 2025; 33 ülkeden 180 yabancı, 223 yurtiçi olmak üzere toplam 403 katılımcı ve ',
      '80 ülkeden 13.992 sektör profesyonelini bir araya getiriyor. Fuar; ergitme, döküm, ısıl işlem, yeniden ısıtma teknolojileri, ',
      'endüstri 4.0, geri dönüşüm, test ve ölçüm teknolojileri ile alüminyumun tüm üretim ve işleme süreçlerini kapsıyor.</p>',
      '<p>Sizleri standımıza bekliyoruz!</p>'
    )
  ),
  'ALUEXPO 2025 Fuarı’na katılıyoruz. 18-20 Eylül 2025 tarihlerinde İstanbul Fuar Merkezi’nde 2. Salon E155 nolu standımızda sizleri bekliyoruz.',
  'ALUEXPO 2025 duyurusu – Ensotek standı (İFM, Hall 2, E155)',
  'ALUEXPO 2025 | Ensotek – Fuar Katılım Duyurusu',
  'ENSOTEK, ALUEXPO 2025 Uluslararası Alüminyum Fuarı’na katılıyor. 18–20 Eylül 2025 tarihlerinde İstanbul Fuar Merkezi, 2. Salon, E155 standında buluşalım. Online ziyaretçi kaydı ve fuar kapsamı bilgileri içerir.',
  'ensotek,fuar,aluminyum,etkinlik,aluexpo,2025,istanbul,duyuru,stand e155',
  '2025-07-19 17:20:06.428',
  '2025-07-19 20:46:40.260'
),

-- -------------------------------------------------------------
-- EN
-- -------------------------------------------------------------
(
  UUID(),
  @NEWS_ALUEXPO_2025,
  'en',
  'ALUEXPO 2025 – We Are Attending the International Aluminium Fair!',
  'aluexpo-2025-we-are-attending-the-international-aluminium-fair',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p><strong>ALUEXPO 2025</strong> – We are participating in the 9th International Aluminium Technologies, Machinery and Products Specialized Fair! ',
      'Meet us at <strong>Istanbul Expo Center</strong>, <strong>Hall 2</strong>, <strong>Stand E155</strong>, between <strong>September 18–20, 2025</strong>.</p>',
      '<p>For your <strong>online invitation</strong>: ',
      '<a href="https://aluexpo.com/visitor-register-form" target="_blank" rel="noopener noreferrer">ALUEXPO Visitor Registration</a></p>',
      '<p>ALUEXPO 2025 brings together 403 exhibitors from 33 countries and more than 13,992 sector professionals from 80 countries. ',
      'The fair covers aluminium production and processing end-to-end, including melting, casting, heat treatment, re-heating technologies, Industry 4.0, recycling, and test & measurement technologies.</p>',
      '<p>We look forward to welcoming you at our stand!</p>'
    )
  ),
  'We are attending ALUEXPO 2025! Visit us at Istanbul Expo Center, Hall 2, Stand E155, between September 18-20, 2025.',
  'ALUEXPO 2025 announcement – Ensotek stand (Istanbul Expo Center, Hall 2, E155)',
  'ALUEXPO 2025 | Ensotek – Fair Announcement',
  'ENSOTEK is attending ALUEXPO 2025 in Istanbul. Visit us at Istanbul Expo Center, Hall 2, Stand E155 on September 18–20, 2025. Includes visitor registration link and fair scope highlights.',
  'ensotek,fair,aluminium,event,aluexpo,2025,istanbul,announcement,stand e155',
  '2025-07-19 17:20:06.428',
  '2025-07-19 20:46:40.260'
),

-- -------------------------------------------------------------
-- DE
-- -------------------------------------------------------------
(
  UUID(),
  @NEWS_ALUEXPO_2025,
  'de',
  'ALUEXPO 2025 – Wir nehmen an der Internationalen Aluminium-Messe teil!',
  'aluexpo-2025-wir-nehmen-an-der-internationalen-aluminium-messe-teil',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p><strong>ALUEXPO 2025</strong> – Wir nehmen an der 9. Internationalen Aluminium-Technologien-, Maschinen- und Produktmesse teil! ',
      'Besuchen Sie uns vom <strong>18. bis 20. September 2025</strong> auf dem <strong>Istanbul Expo Center</strong>, ',
      '<strong>Halle 2</strong>, <strong>Stand E155</strong>.</p>',
      '<p>Für Ihre <strong>Online-Einladung</strong>: ',
      '<a href="https://aluexpo.com/visitor-register-form" target="_blank" rel="noopener noreferrer">ALUEXPO Besucherregistrierung</a></p>',
      '<p>ALUEXPO 2025 vereint 403 Aussteller aus 33 Ländern und 13.992 Branchenfachleute aus 80 Ländern. ',
      'Die Messe deckt alle Prozesse der Aluminiumproduktion und -verarbeitung ab – darunter Schmelzen, Gießen, Wärmebehandlung, Wiedererwärmung, Industrie 4.0, Recycling sowie Test- und Messtechnik.</p>',
      '<p>Wir freuen uns auf Ihren Besuch an unserem Stand!</p>'
    )
  ),
  'Wir nehmen an der ALUEXPO 2025 teil! Besuchen Sie uns vom 18. bis 20. September 2025 auf der Istanbul Messe, Halle 2, Stand E155.',
  'ALUEXPO 2025 Ankündigung – Ensotek Stand (Istanbul Expo Center, Halle 2, E155)',
  'ALUEXPO 2025 | Ensotek – Messeankündigung',
  'ENSOTEK nimmt an der ALUEXPO 2025 in Istanbul teil. Besuchen Sie uns im Istanbul Expo Center, Halle 2, Stand E155 (18.–20. September 2025). Mit Link zur Besucherregistrierung und Überblick über die Messeschwerpunkte.',
  'ensotek,messe,aluminium,veranstaltung,aluexpo,2025,istanbul,ankündigung,stand e155',
  '2025-07-19 17:20:06.428',
  '2025-07-19 20:46:40.260'
)

ON DUPLICATE KEY UPDATE
  `title`              = VALUES(`title`),
  `slug`               = VALUES(`slug`),
  `content`            = VALUES(`content`),
  `summary`            = VALUES(`summary`),
  `featured_image_alt` = VALUES(`featured_image_alt`),
  `meta_title`         = VALUES(`meta_title`),
  `meta_description`   = VALUES(`meta_description`),
  `tags`               = VALUES(`tags`),
  `updated_at`         = VALUES(`updated_at`);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;

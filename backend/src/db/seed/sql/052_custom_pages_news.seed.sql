-- =============================================================
-- FILE: 052_custom_pages_news.seed.sql
-- Ensotek – NEWS Custom Pages (Parent + i18n TR/EN/DE)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- -------------------------------------------------------------
-- CATEGORY / SUB-CATEGORY
-- -------------------------------------------------------------
SET @CAT_NEWS_DUYS        := 'aaaa2003-1111-4111-8111-aaaaaaaa2003';
SET @SUB_NEWS_GENERAL_ANN := 'bbbb2001-1111-4111-8111-bbbbbbbb2001';

-- module key
SET @MODULE_KEY_NEWS := 'news';

-- -------------------------------------------------------------
-- PAGE IDS
-- -------------------------------------------------------------
SET @PAGE_WEB     := '22220001-2222-4222-8222-222222220001';
SET @PAGE_EGYPT   := '22220003-2222-4222-8222-222222220003';
SET @PAGE_BAKU    := '22220004-2222-4222-8222-222222220004';
SET @PAGE_HOTEL   := '22220005-2222-4222-8222-222222220005';
SET @PAGE_ALUEXPO := '22220006-2222-4222-8222-222222220006';

-- -------------------------------------------------------------
-- IMAGE URLS (Cloudinary)
-- -------------------------------------------------------------
SET @IMG_NEWS_WEB :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp';

SET @IMG_EGYPT_1 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958173/uploads/metahub/news-images/img-20240520-wa0183-1752958172132-879111355.webp';

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

SET @IMG_HOTEL_1 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958402/uploads/metahub/news-images/img-20250618-wa0024-1752958401251-408905732.webp';
SET @IMG_HOTEL_2 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958400/uploads/metahub/news-images/img-20250618-wa0021-1752958399183-255418708.webp';
SET @IMG_HOTEL_3 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958402/uploads/metahub/news-images/img-20250618-wa0012-1752958400227-284317921.webp';
SET @IMG_HOTEL_4 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958401/uploads/metahub/news-images/img-20250618-wa0023-1752958401249-770223355.webp';

SET @IMG_ALUEXPO_1 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752945605/uploads/metahub/news-images/ensotek-email-imza-1752945605003-245572109.webp';

-- -------------------------------------------------------------
-- i18n IDS
-- -------------------------------------------------------------
SET @I18N_WEB_TR     := '66662001-0001-4001-8001-666666662001';
SET @I18N_WEB_EN     := '66662001-0002-4002-8002-666666662001';
SET @I18N_WEB_DE     := '66662001-0003-4003-8003-666666662001';

SET @I18N_EGYPT_TR   := '66662003-0001-4001-8001-666666662003';
SET @I18N_EGYPT_EN   := '66662003-0002-4002-8002-666666662003';
SET @I18N_EGYPT_DE   := '66662003-0003-4003-8003-666666662003';

SET @I18N_BAKU_TR    := '66662004-0001-4001-8001-666666662004';
SET @I18N_BAKU_EN    := '66662004-0002-4002-8002-666666662004';
SET @I18N_BAKU_DE    := '66662004-0003-4003-8003-666666662004';

SET @I18N_HOTEL_TR   := '66662005-0001-4001-8001-666666662005';
SET @I18N_HOTEL_EN   := '66662005-0002-4002-8002-666666662005';
SET @I18N_HOTEL_DE   := '66662005-0003-4003-8003-666666662005';

SET @I18N_ALUEXPO_TR := '66662006-0001-4001-8001-666666662006';
SET @I18N_ALUEXPO_EN := '66662006-0002-4002-8002-666666662006';
SET @I18N_ALUEXPO_DE := '66662006-0003-4003-8003-666666662006';

-- =============================================================
-- PARENT UPSERT (custom_pages)
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
  @PAGE_WEB, @MODULE_KEY_NEWS, 1, 0, 101, 101,
  @IMG_NEWS_WEB, NULL, @IMG_NEWS_WEB, NULL,
  JSON_ARRAY(@IMG_NEWS_WEB), JSON_ARRAY(),
  @CAT_NEWS_DUYS, @SUB_NEWS_GENERAL_ANN,
  NOW(3), NOW(3)
),

-- 02 — Egypt HVAC-R 2025
(
  @PAGE_EGYPT, @MODULE_KEY_NEWS, 1, 0, 102, 102,
  @IMG_EGYPT_1, NULL, @IMG_EGYPT_1, NULL,
  JSON_ARRAY(@IMG_EGYPT_1), JSON_ARRAY(),
  @CAT_NEWS_DUYS, @SUB_NEWS_GENERAL_ANN,
  '2025-07-19 17:20:06.428', '2025-07-19 20:49:51.752'
),

-- 03 — Aquatherm Baku 2025
(
  @PAGE_BAKU, @MODULE_KEY_NEWS, 1, 0, 103, 103,
  @IMG_BAKU_1, NULL, @IMG_BAKU_1, NULL,
  JSON_ARRAY(@IMG_BAKU_1, @IMG_BAKU_2, @IMG_BAKU_3, @IMG_BAKU_4, @IMG_BAKU_5), JSON_ARRAY(),
  @CAT_NEWS_DUYS, @SUB_NEWS_GENERAL_ANN,
  '2025-07-19 17:20:06.428', '2025-07-19 20:51:33.294'
),

-- 04 — Hotel-Tech Antalya 2025
(
  @PAGE_HOTEL, @MODULE_KEY_NEWS, 1, 0, 104, 104,
  @IMG_HOTEL_1, NULL, @IMG_HOTEL_1, NULL,
  JSON_ARRAY(@IMG_HOTEL_1, @IMG_HOTEL_2, @IMG_HOTEL_3, @IMG_HOTEL_4), JSON_ARRAY(),
  @CAT_NEWS_DUYS, @SUB_NEWS_GENERAL_ANN,
  '2025-07-19 17:20:06.428', '2025-07-19 20:53:23.466'
),

-- 05 — ALUEXPO 2025
(
  @PAGE_ALUEXPO, @MODULE_KEY_NEWS, 1, 0, 105, 105,
  @IMG_ALUEXPO_1, NULL, @IMG_ALUEXPO_1, NULL,
  JSON_ARRAY(@IMG_ALUEXPO_1), JSON_ARRAY(),
  @CAT_NEWS_DUYS, @SUB_NEWS_GENERAL_ANN,
  '2025-07-19 17:20:06.428', '2025-07-19 20:46:40.260'
)

ON DUPLICATE KEY UPDATE
  `module_key`     = VALUES(`module_key`),
  `is_published`   = VALUES(`is_published`),
  `featured`       = VALUES(`featured`),
  `display_order`  = VALUES(`display_order`),
  `order_num`      = VALUES(`order_num`),
  `featured_image` = VALUES(`featured_image`),
  `image_url`      = VALUES(`image_url`),
  `images`         = VALUES(`images`),
  `category_id`    = VALUES(`category_id`),
  `sub_category_id`= VALUES(`sub_category_id`),
  `updated_at`     = VALUES(`updated_at`);

-- =============================================================
-- i18n UPSERT — TURKCE
-- =============================================================

INSERT INTO `custom_pages_i18n`
  (`id`, `page_id`, `locale`,
   `title`, `slug`, `content`, `summary`,
   `featured_image_alt`, `meta_title`, `meta_description`, `tags`,
   `created_at`, `updated_at`)
VALUES

(
  @I18N_WEB_TR, @PAGE_WEB, 'tr',
  'Ensotek Web Sitemiz Yenilendi!',
  'ensotek-web-sitemiz-yenilendi',
  JSON_OBJECT('html', CONCAT('<section class="container mx-auto px-4 py-8">','<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Ensotek Web Sitemiz Yenilendi!</h1>','<p class="text-slate-700 mb-4">Dijital donusum vizyonumuz dogrultusunda, Ensotek web sitemizi tamamen yeniledik. Yeni arayuzumuzle sizlere daha hizli, modern ve etkilesimli bir kullanici deneyimi sunmayi hedefliyoruz.</p>','<p class="text-slate-700 mb-4">Artik cok dilli altyapimizla global erisim sagliyoruz.</p>','<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6"><h2 class="text-xl font-semibold text-slate-900 mb-3">Neler Degisti?</h2><ul class="list-disc pl-6 text-slate-700 space-y-2"><li>Modern ve hizli kullanici arayuzu</li><li>Cok dilli icerik altyapisi (TR/EN/DE)</li><li>Haberler ve duyurular icin guclendirilmis icerik yonetimi</li><li>Mobil uyumluluk ve SEO iyilestirmeleri</li></ul></div>','</section>')),
  'Modern arayuz, cok dilli destek ve kullanici odakli tasarimiyla yeni Ensotek web sitemiz yayinda!',
  'Ensotek web sitesi yenilendi',
  'Ensotek Web Sitemiz Yenilendi! | Ensotek',
  'Ensotek web sitesi yenilendi: modern arayuz, cok dilli altyapi, daha hizli ve etkilesimli deneyim.',
  'ensotek,web sitesi,yenilendi,duyuru',
  NOW(3), NOW(3)
),

(
  @I18N_EGYPT_TR, @PAGE_EGYPT, 'tr',
  'Misir HVAC-R Fuarini Basariyla Tamamladik!',
  'misir-hvacr-fuarini-basarili-tamamladik',
  JSON_OBJECT('html', CONCAT('<section class="container mx-auto px-4 py-10"><div class="max-w-4xl mx-auto"><h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Misir HVAC-R Fuarini Basariyla Tamamladik!</h1><p class="text-slate-700 mb-5">ENSOTEK olarak Egypt HVAC-R 2025 Fuarini basariyla tamamlamanin gururunu yasiyoruz.</p></div></section>')),
  'Misir HVAC-R 2025 Fuarinda standimiza gosterilen yogun ilgi icin tesekkur ederiz.',
  'Egypt HVAC-R 2025 fuarinda ENSOTEK standi',
  'Misir HVAC-R 2025 Fuarini Basariyla Tamamladik! | Ensotek',
  'ENSOTEK, Egypt HVAC-R 2025 Fuarini basariyla tamamladi.',
  'ensotek,fuar,misir,hvacr,etkinlik',
  '2025-07-19 17:20:06.428', '2025-07-19 20:49:51.752'
),

(
  @I18N_BAKU_TR, @PAGE_BAKU, 'tr',
  'Aquatherm Baku Fuarini Basariyla Tamamladik!',
  'aquatherm-baku-fuarini-basarili-tamamladik',
  JSON_OBJECT('html', CONCAT('<section class="container mx-auto px-4 py-10"><div class="max-w-4xl mx-auto"><h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Aquatherm Baku Fuarini Basariyla Tamamladik!</h1><p class="text-slate-700 mb-5">ENSOTEK olarak Aquatherm Baku 2025 Fuarini basariyla tamamladik.</p></div></section>')),
  'Aquatherm Baku 2025 Fuarinda buyuk ilgiyle karsilandik.',
  'Aquatherm Baku 2025 fuarinda ENSOTEK standi',
  'Aquatherm Baku 2025 Fuarini Basariyla Tamamladik! | Ensotek',
  'ENSOTEK, Aquatherm Baku 2025 Fuarindaki basarili katilimini tamamladi.',
  'ensotek,fuar,aquatherm,baku,etkinlik',
  '2025-07-19 17:20:06.428', '2025-07-19 20:51:33.294'
),

(
  @I18N_HOTEL_TR, @PAGE_HOTEL, 'tr',
  'Hotel-Tech Antalya Fuarini Basariyla Tamamladik!',
  'hotel-tech-antalya-fuarini-basarili-tamamladik',
  JSON_OBJECT('html', CONCAT('<section class="container mx-auto px-4 py-10"><div class="max-w-4xl mx-auto"><h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Hotel-Tech Antalya Fuarini Basariyla Tamamladik!</h1><p class="text-slate-700 mb-5">Hotel-Tech Antalya fuari kapsaminda otel ve konaklama tesislerinin teknik altyapi ihtiyaclarina yonelik cozumlerimizi ziyaretcilerimizle bulusturduk.</p></div></section>')),
  'Hotel-Tech Antalya Fuarini basariyla tamamladik.',
  'Hotel-Tech Antalya fuarinda ENSOTEK standi',
  'Hotel-Tech Antalya Fuarini Basariyla Tamamladik! | Ensotek',
  'ENSOTEK, Hotel-Tech Antalya fuar katilimini basariyla tamamladi.',
  'ensotek,fuar,hotel-tech,antalya,etkinlik',
  '2025-07-19 17:20:06.428', '2025-07-19 20:53:23.466'
),

(
  @I18N_ALUEXPO_TR, @PAGE_ALUEXPO, 'tr',
  'ALUEXPO 2025 – Uluslararasi Aluminyum Fuarina Katiliyoruz!',
  'aluexpo-2025-uluslararasi-aluminyum-fuarina-katiliyoruz',
  JSON_OBJECT('html', CONCAT('<section class="container mx-auto px-4 py-10"><div class="max-w-4xl mx-auto"><h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">ALUEXPO 2025 – Uluslararasi Aluminyum Fuarina Katiliyoruz!</h1><p class="text-slate-700 mb-5">18-20 Eylul 2025 tarihlerinde Istanbul Fuar Merkezinde, 2. Salon E155 nolu standimizda sizleri bekliyoruz.</p></div></section>')),
  'ALUEXPO 2025 Fuarina katiliyoruz. 18-20 Eylul 2025, Istanbul Fuar Merkezi, 2. Salon, E155.',
  'ALUEXPO 2025 duyurusu – Ensotek standi',
  'ALUEXPO 2025 | Ensotek',
  'ENSOTEK, ALUEXPO 2025 Uluslararasi Aluminyum Fuarina katiliyor.',
  'ensotek,fuar,aluminyum,aluexpo,2025,istanbul',
  '2025-07-19 17:20:06.428', '2025-07-19 20:46:40.260'
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

-- =============================================================
-- i18n UPSERT — ENGLISH
-- =============================================================

INSERT INTO `custom_pages_i18n`
  (`id`, `page_id`, `locale`,
   `title`, `slug`, `content`, `summary`,
   `featured_image_alt`, `meta_title`, `meta_description`, `tags`,
   `created_at`, `updated_at`)
VALUES

(
  @I18N_WEB_EN, @PAGE_WEB, 'en',
  'Our Ensotek Website Has Been Renewed!',
  'ensotek-website-has-been-renewed',
  JSON_OBJECT('html', CONCAT('<section class="container mx-auto px-4 py-8">','<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Our Ensotek Website Has Been Renewed!</h1>','<p class="text-slate-700 mb-4">In line with our digital transformation vision, we have completely renewed our Ensotek website.</p>','<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6"><h2 class="text-xl font-semibold text-slate-900 mb-3">What is new?</h2><ul class="list-disc pl-6 text-slate-700 space-y-2"><li>Modern and faster UI</li><li>Multilingual content (TR/EN/DE)</li><li>Stronger content management</li><li>Mobile-ready and SEO improvements</li></ul></div>','</section>')),
  'Our renewed Ensotek website is live with a modern interface and multilingual support.',
  'Announcement image for the renewed Ensotek website',
  'Ensotek Website Renewed | Ensotek',
  'Ensotek has renewed its website with a modern UI, multilingual support, and a faster experience.',
  'ensotek,website,renewed,announcement',
  NOW(3), NOW(3)
),

(
  @I18N_EGYPT_EN, @PAGE_EGYPT, 'en',
  'We Successfully Completed the Egypt HVAC-R Fair!',
  'we-successfully-completed-the-egypt-hvacr-fair',
  JSON_OBJECT('html', CONCAT('<section class="container mx-auto px-4 py-10"><div class="max-w-4xl mx-auto"><h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">We Successfully Completed the Egypt HVAC-R Fair!</h1><p class="text-slate-700 mb-5">As ENSOTEK, we are proud to have successfully completed the Egypt HVAC-R 2025 Fair.</p></div></section>')),
  'We thank everyone who showed great interest at the Egypt HVAC-R 2025 Fair.',
  'ENSOTEK stand at Egypt HVAC-R 2025',
  'Egypt HVAC-R 2025: Successfully Completed | Ensotek',
  'ENSOTEK successfully completed the Egypt HVAC-R 2025 Fair.',
  'ensotek,fair,egypt,hvacr,event',
  '2025-07-19 17:20:06.428', '2025-07-19 20:49:51.752'
),

(
  @I18N_BAKU_EN, @PAGE_BAKU, 'en',
  'We Successfully Completed the Aquatherm Baku Fair!',
  'we-successfully-completed-the-aquatherm-baku-fair',
  JSON_OBJECT('html', CONCAT('<section class="container mx-auto px-4 py-10"><div class="max-w-4xl mx-auto"><h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">We Successfully Completed the Aquatherm Baku Fair!</h1><p class="text-slate-700 mb-5">We are pleased to announce the successful completion of the Aquatherm Baku 2025 Fair.</p></div></section>')),
  'We received great interest at the Aquatherm Baku 2025 Fair.',
  'ENSOTEK stand at Aquatherm Baku 2025',
  'Aquatherm Baku 2025: Successfully Completed | Ensotek',
  'ENSOTEK successfully completed the Aquatherm Baku 2025 Fair.',
  'ensotek,fair,aquatherm,baku,event',
  '2025-07-19 17:20:06.428', '2025-07-19 20:51:33.294'
),

(
  @I18N_HOTEL_EN, @PAGE_HOTEL, 'en',
  'We Successfully Completed the Hotel-Tech Antalya Fair!',
  'we-successfully-completed-the-hotel-tech-antalya-fair',
  JSON_OBJECT('html', CONCAT('<section class="container mx-auto px-4 py-10"><div class="max-w-4xl mx-auto"><h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">We Successfully Completed the Hotel-Tech Antalya Fair!</h1><p class="text-slate-700 mb-5">At Hotel-Tech Antalya, we showcased our solutions for hotels, resorts, and hospitality facilities.</p></div></section>')),
  'We successfully completed the Hotel-Tech Antalya Fair.',
  'ENSOTEK stand at Hotel-Tech Antalya',
  'Hotel-Tech Antalya: Successfully Completed | Ensotek',
  'ENSOTEK successfully completed Hotel-Tech Antalya.',
  'ensotek,fair,hotel-tech,antalya,event',
  '2025-07-19 17:20:06.428', '2025-07-19 20:53:23.466'
),

(
  @I18N_ALUEXPO_EN, @PAGE_ALUEXPO, 'en',
  'ALUEXPO 2025 – We Are Attending the International Aluminium Fair!',
  'aluexpo-2025-we-are-attending-the-international-aluminium-fair',
  JSON_OBJECT('html', CONCAT('<section class="container mx-auto px-4 py-10"><div class="max-w-4xl mx-auto"><h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">ALUEXPO 2025</h1><p class="text-slate-700 mb-5">Meet us at Istanbul Expo Center, Hall 2, Stand E155, September 18-20, 2025.</p></div></section>')),
  'We are attending ALUEXPO 2025! Istanbul Expo Center, Hall 2, Stand E155, Sep 18-20, 2025.',
  'ALUEXPO 2025 announcement – Ensotek stand',
  'ALUEXPO 2025 | Ensotek',
  'ENSOTEK is attending ALUEXPO 2025 in Istanbul.',
  'ensotek,fair,aluminium,aluexpo,2025,istanbul',
  '2025-07-19 17:20:06.428', '2025-07-19 20:46:40.260'
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

-- =============================================================
-- i18n UPSERT — DEUTSCH
-- =============================================================

INSERT INTO `custom_pages_i18n`
  (`id`, `page_id`, `locale`,
   `title`, `slug`, `content`, `summary`,
   `featured_image_alt`, `meta_title`, `meta_description`, `tags`,
   `created_at`, `updated_at`)
VALUES

(
  @I18N_WEB_DE, @PAGE_WEB, 'de',
  'Unsere Ensotek-Webseite ist erneuert!',
  'ensotek-webseite-wurde-erneuert',
  JSON_OBJECT('html', CONCAT('<section class="container mx-auto px-4 py-8">','<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Unsere Ensotek-Webseite ist erneuert!</h1>','<p class="text-slate-700 mb-4">Im Rahmen unserer Digitalisierungsstrategie haben wir unsere Ensotek-Webseite vollstaendig erneuert.</p>','<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6"><h2 class="text-xl font-semibold text-slate-900 mb-3">Was ist neu?</h2><ul class="list-disc pl-6 text-slate-700 space-y-2"><li>Modernes, schnelleres UI</li><li>Mehrsprachige Inhalte (TR/EN/DE)</li><li>Staerkeres Content-Management</li><li>Mobile Optimierung und SEO-Verbesserungen</li></ul></div>','</section>')),
  'Unsere neue Ensotek-Webseite ist online: modern, mehrsprachig und schneller.',
  'Ankuendigungsbild zur erneuerten Ensotek-Webseite',
  'Ensotek-Webseite erneuert | Ensotek',
  'Ensotek hat seine Webseite erneuert: moderne Oberflaeche, mehrsprachige Struktur und bessere Performance.',
  'ensotek,webseite,erneuert,ankuendigung',
  NOW(3), NOW(3)
),

(
  @I18N_EGYPT_DE, @PAGE_EGYPT, 'de',
  'Wir haben die Egypt HVAC-R Messe erfolgreich abgeschlossen!',
  'egypt-hvacr-messe-erfolgreich-abgeschlossen',
  JSON_OBJECT('html', CONCAT('<section class="container mx-auto px-4 py-10"><div class="max-w-4xl mx-auto"><h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Wir haben die Egypt HVAC-R Messe erfolgreich abgeschlossen!</h1><p class="text-slate-700 mb-5">Als ENSOTEK sind wir stolz darauf, die Egypt HVAC-R 2025 Messe erfolgreich abgeschlossen zu haben.</p></div></section>')),
  'Wir danken allen, die auf der Egypt HVAC-R 2025 Messe grosses Interesse an unserem Stand gezeigt haben.',
  'ENSOTEK Messestand auf der Egypt HVAC-R 2025',
  'Egypt HVAC-R 2025: Erfolgreich abgeschlossen | Ensotek',
  'ENSOTEK hat die Egypt HVAC-R 2025 Messe erfolgreich abgeschlossen.',
  'ensotek,messe,aegypten,hvacr,veranstaltung',
  '2025-07-19 17:20:06.428', '2025-07-19 20:49:51.752'
),

(
  @I18N_BAKU_DE, @PAGE_BAKU, 'de',
  'Wir haben die Aquatherm Baku Messe erfolgreich abgeschlossen!',
  'aquatherm-baku-messe-erfolgreich-abgeschlossen',
  JSON_OBJECT('html', CONCAT('<section class="container mx-auto px-4 py-10"><div class="max-w-4xl mx-auto"><h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Wir haben die Aquatherm Baku Messe erfolgreich abgeschlossen!</h1><p class="text-slate-700 mb-5">Wir freuen uns, die erfolgreiche Teilnahme an der Aquatherm Baku 2025 Messe bekannt zu geben.</p></div></section>')),
  'Wir wurden auf der Aquatherm Baku 2025 Messe mit grossem Interesse empfangen.',
  'ENSOTEK Messestand auf der Aquatherm Baku 2025',
  'Aquatherm Baku 2025: Erfolgreich abgeschlossen | Ensotek',
  'ENSOTEK hat die Aquatherm Baku 2025 Messe erfolgreich abgeschlossen.',
  'ensotek,messe,aquatherm,baku,veranstaltung',
  '2025-07-19 17:20:06.428', '2025-07-19 20:51:33.294'
),

(
  @I18N_HOTEL_DE, @PAGE_HOTEL, 'de',
  'Wir haben die Hotel-Tech Antalya Messe erfolgreich abgeschlossen!',
  'hotel-tech-antalya-messe-erfolgreich-abgeschlossen',
  JSON_OBJECT('html', CONCAT('<section class="container mx-auto px-4 py-10"><div class="max-w-4xl mx-auto"><h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Wir haben die Hotel-Tech Antalya Messe erfolgreich abgeschlossen!</h1><p class="text-slate-700 mb-5">Auf der Hotel-Tech Antalya praesentierten wir Loesungen fuer die technische Infrastruktur von Hotels und Resorts.</p></div></section>')),
  'Wir haben die Hotel-Tech Antalya Messe erfolgreich abgeschlossen.',
  'ENSOTEK Messestand auf der Hotel-Tech Antalya',
  'Hotel-Tech Antalya: Erfolgreich abgeschlossen | Ensotek',
  'ENSOTEK hat die Teilnahme an der Hotel-Tech Antalya erfolgreich abgeschlossen.',
  'ensotek,messe,hotel-tech,antalya,veranstaltung',
  '2025-07-19 17:20:06.428', '2025-07-19 20:53:23.466'
),

(
  @I18N_ALUEXPO_DE, @PAGE_ALUEXPO, 'de',
  'ALUEXPO 2025 – Wir nehmen an der Internationalen Aluminium-Messe teil!',
  'aluexpo-2025-wir-nehmen-an-der-internationalen-aluminium-messe-teil',
  JSON_OBJECT('html', CONCAT('<section class="container mx-auto px-4 py-10"><div class="max-w-4xl mx-auto"><h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">ALUEXPO 2025</h1><p class="text-slate-700 mb-5">Besuchen Sie uns im Istanbul Expo Center, Halle 2, Stand E155, vom 18. bis 20. September 2025.</p></div></section>')),
  'Wir nehmen an der ALUEXPO 2025 teil! Istanbul Expo Center, Halle 2, Stand E155, 18.-20. September 2025.',
  'ALUEXPO 2025 Ankuendigung – Ensotek Stand',
  'ALUEXPO 2025 | Ensotek',
  'ENSOTEK nimmt an der ALUEXPO 2025 in Istanbul teil.',
  'ensotek,messe,aluminium,aluexpo,2025,istanbul',
  '2025-07-19 17:20:06.428', '2025-07-19 20:46:40.260'
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

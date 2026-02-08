-- =============================================================
-- FILE: 052_custom_pages_news.seed.sql  (FINAL / SCHEMA-OK)
-- Ensotek – NEWS Custom Page Seed (TR/EN/DE)
-- TEK HABER: “Ensotek Web Sitemiz Yenilendi!”
-- ✅ module_key artık PARENT: custom_pages.module_key = 'news'
-- ✅ i18n içinde module_key YOK
-- ✅ multi-image gallery (images JSON_ARRAY)
-- ✅ deterministic i18n IDs
-- ✅ NO block comments (/* */)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- -------------------------------------------------------------
-- CATEGORY / SUB CATEGORY (011 & 012 ile hizalı)
-- -------------------------------------------------------------
SET @CAT_NEWS_GENERAL  := 'aaaa2001-1111-4111-8111-aaaaaaaa2001';
SET @CAT_NEWS_DUYS     := 'aaaa2003-1111-4111-8111-aaaaaaaa2003';
SET @CAT_NEWS_PRESS    := 'aaaa2004-1111-4111-8111-aaaaaaaa2004';

SET @SUB_NEWS_GENERAL_ANN  := 'bbbb2001-1111-4111-8111-bbbbbbbb2001';

-- -------------------------------------------------------------
-- PAGE ID (deterministik)
-- -------------------------------------------------------------
SET @NEWS_ANNOUNCE_1 := '22220001-2222-4222-8222-222222220001';

-- -------------------------------------------------------------
-- MODULE KEY (PARENT)
-- Eğer sisteminde farklı key varsa SADECE burayı değiştir.
-- -------------------------------------------------------------
SET @MODULE_KEY_NEWS := 'news';

-- -------------------------------------------------------------
-- FEATURED IMAGE (Cloudinary) - Updated to use valid image
-- -------------------------------------------------------------
SET @IMG_NEWS_RENEWED :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp';

-- -------------------------------------------------------------
-- GALLERY IMAGES (updated to use valid images)
-- -------------------------------------------------------------
SET @IMG_NEWS_2 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp';
SET @IMG_NEWS_3 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp';
SET @IMG_NEWS_4 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp';
SET @IMG_NEWS_5 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1753707610/uploads/ensotek/company-images/logo-1753707609976-31353110.webp';

-- -------------------------------------------------------------
-- I18N IDS (deterministik)
-- -------------------------------------------------------------
SET @I18N_NEWS_ANNOUNCE_1_TR := '66662001-0001-4001-8001-666666662001';
SET @I18N_NEWS_ANNOUNCE_1_EN := '66662001-0002-4002-8002-666666662001';
SET @I18N_NEWS_ANNOUNCE_1_DE := '66662001-0003-4003-8003-666666662001';

-- -------------------------------------------------------------
-- PARENT UPSERT (custom_pages)
-- ✅ module_key BURADA
-- -------------------------------------------------------------
INSERT INTO `custom_pages`
  (`id`,
   `module_key`,
   `is_published`,
   `display_order`,
   `order_num`,
   `featured_image`,
   `featured_image_asset_id`,
   `image_url`,
   `storage_asset_id`,
   `images`,
   `storage_image_ids`,
   `category_id`,
   `sub_category_id`,
   `created_at`,
   `updated_at`)
VALUES
  (
    @NEWS_ANNOUNCE_1,
    @MODULE_KEY_NEWS,
    1,
    101,
    101,
    @IMG_NEWS_RENEWED,
    NULL,
    @IMG_NEWS_RENEWED,
    NULL,
    JSON_ARRAY(
      @IMG_NEWS_RENEWED,
      @IMG_NEWS_2,
      @IMG_NEWS_3,
      @IMG_NEWS_4,
      @IMG_NEWS_5
    ),
    JSON_ARRAY(),
    @CAT_NEWS_DUYS,
    @SUB_NEWS_GENERAL_ANN,
    NOW(3),
    NOW(3)
  )
ON DUPLICATE KEY UPDATE
  `module_key`              = VALUES(`module_key`),
  `is_published`            = VALUES(`is_published`),
  `display_order`           = VALUES(`display_order`),
  `order_num`               = VALUES(`order_num`),
  `category_id`             = VALUES(`category_id`),
  `sub_category_id`         = VALUES(`sub_category_id`),
  `featured_image`          = VALUES(`featured_image`),
  `featured_image_asset_id` = VALUES(`featured_image_asset_id`),
  `image_url`               = VALUES(`image_url`),
  `storage_asset_id`        = VALUES(`storage_asset_id`),
  `images`                  = VALUES(`images`),
  `storage_image_ids`       = VALUES(`storage_image_ids`),
  `updated_at`              = VALUES(`updated_at`);

-- -------------------------------------------------------------
-- I18N UPSERT (custom_pages_i18n)
-- ✅ module_key yok
-- -------------------------------------------------------------
INSERT INTO `custom_pages_i18n`
  (`id`,
   `page_id`,
   `locale`,
   `title`,
   `slug`,
   `content`,
   `summary`,
   `featured_image_alt`,
   `meta_title`,
   `meta_description`,
   `tags`,
   `created_at`,
   `updated_at`)
VALUES

-- TR
(
  @I18N_NEWS_ANNOUNCE_1_TR,
  @NEWS_ANNOUNCE_1,
  'tr',
  'Ensotek Web Sitemiz Yenilendi!',
  'ensotek-web-sitemiz-yenilendi',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-8">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Ensotek Web Sitemiz Yenilendi!</h1>',
        '<p class="text-slate-700 mb-4">',
          'Dijital dönüşüm vizyonumuz doğrultusunda, Ensotek web sitemizi tamamen yeniledik. ',
          'Yeni arayüzümüzle sizlere daha hızlı, modern ve etkileşimli bir kullanıcı deneyimi sunmayı hedefliyoruz.',
        '</p>',
        '<p class="text-slate-700 mb-4">',
          'Artık çok dilli altyapımızla global erişim sağlıyor, güncel haberlerimizi ve teknolojik gelişmelerimizi ',
          'daha kolay duyurabiliyoruz.',
        '</p>',
        '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">Neler Değişti?</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Modern ve hızlı kullanıcı arayüzü</li>',
            '<li>Çok dilli içerik altyapısı (TR/EN/DE)</li>',
            '<li>Haberler ve duyurular için güçlendirilmiş içerik yönetimi</li>',
            '<li>Mobil uyumluluk ve SEO iyileştirmeleri</li>',
          '</ul>',
        '</div>',
      '</section>'
    )
  ),
  'Modern arayüz, çok dilli destek ve kullanıcı odaklı tasarımıyla yeni Ensotek web sitemiz yayında!',
  'Ensotek web sitesi yenilendi – duyuru görseli',
  'Ensotek Web Sitemiz Yenilendi! | Ensotek',
  'Ensotek web sitesi yenilendi: modern arayüz, çok dilli altyapı, daha hızlı ve etkileşimli deneyim.',
  'ensotek,web sitesi,yenilendi,duyuru,çok dilli,etkileşim',
  NOW(3),
  NOW(3)
),

-- EN
(
  @I18N_NEWS_ANNOUNCE_1_EN,
  @NEWS_ANNOUNCE_1,
  'en',
  'Our Ensotek Website Has Been Renewed!',
  'ensotek-website-has-been-renewed',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-8">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Our Ensotek Website Has Been Renewed!</h1>',
        '<p class="text-slate-700 mb-4">',
          'In line with our digital transformation vision, we have completely renewed our Ensotek website. ',
          'With the new interface, we aim to provide a faster, modern, and more interactive experience.',
        '</p>',
        '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">What’s New?</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Modern and faster UI</li>',
            '<li>Multilingual content (TR/EN/DE)</li>',
            '<li>Stronger content management for news and announcements</li>',
            '<li>Mobile-ready pages and SEO improvements</li>',
          '</ul>',
        '</div>',
      '</section>'
    )
  ),
  'Our renewed Ensotek website is live with a modern interface and multilingual support.',
  'Announcement image for the renewed Ensotek website',
  'Ensotek Website Renewed | Ensotek',
  'Ensotek has renewed its website with a modern UI, multilingual support, and a faster experience.',
  'ensotek,website,renewed,announcement,multilingual,interactive',
  NOW(3),
  NOW(3)
),

-- DE
(
  @I18N_NEWS_ANNOUNCE_1_DE,
  @NEWS_ANNOUNCE_1,
  'de',
  'Unsere Ensotek-Webseite ist erneuert!',
  'ensotek-webseite-wurde-erneuert',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-8">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Unsere Ensotek-Webseite ist erneuert!</h1>',
        '<p class="text-slate-700 mb-4">',
          'Im Rahmen unserer Digitalisierungsstrategie haben wir unsere Ensotek-Webseite vollständig erneuert. ',
          'Mit der neuen Oberfläche bieten wir ein schnelleres, moderneres und interaktiveres Nutzererlebnis.',
        '</p>',
        '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">Was ist neu?</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Modernes, schnelleres UI</li>',
            '<li>Mehrsprachige Inhalte (TR/EN/DE)</li>',
            '<li>Stärkeres Content-Management für News & Ankündigungen</li>',
            '<li>Mobile Optimierung und SEO-Verbesserungen</li>',
          '</ul>',
        '</div>',
      '</section>'
    )
  ),
  'Unsere neue Ensotek-Webseite ist online: modern, mehrsprachig und schneller.',
  'Ankündigungsbild zur erneuerten Ensotek-Webseite',
  'Ensotek-Webseite erneuert | Ensotek',
  'Ensotek hat seine Webseite erneuert: moderne Oberfläche, mehrsprachige Struktur und bessere Performance.',
  'ensotek,webseite,erneuert,ankündigung,mehrsprachig,interaktiv',
  NOW(3),
  NOW(3)
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

-- =============================================================
-- FILE: 052.4_custom_pages_news_aluexpo_2025.seed.sql  (FINAL / SCHEMA-OK)
-- Ensotek – NEWS Custom Page Seed (TR/EN/DE)
-- Haber: “ALUEXPO 2025 – Uluslararası Alüminyum Fuarına Katılıyoruz!”
-- ✅ module_key artık PARENT: custom_pages.module_key = 'news'
-- ✅ i18n içinde module_key YOK
-- ✅ multi-image gallery (images JSON_ARRAY)
-- ✅ deterministic i18n IDs
-- ✅ NO block comments
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- -------------------------------------------------------------
-- CATEGORY / SUB CATEGORY
-- -------------------------------------------------------------
SET @CAT_NEWS_GENERAL  := 'aaaa2001-1111-4111-8111-aaaaaaaa2001';
SET @CAT_NEWS_DUYS     := 'aaaa2003-1111-4111-8111-aaaaaaaa2003';
SET @CAT_NEWS_PRESS    := 'aaaa2004-1111-4111-8111-aaaaaaaa2004';
SET @SUB_NEWS_GENERAL_ANN := 'bbbb2001-1111-4111-8111-bbbbbbbb2001';

-- -------------------------------------------------------------
-- PAGE ID (deterministik)
-- -------------------------------------------------------------
SET @NEWS_ALUEXPO_2025 := '22220006-2222-4222-8222-222222220006';

-- -------------------------------------------------------------
-- MODULE KEY (PARENT)
-- -------------------------------------------------------------
SET @MODULE_KEY_NEWS := 'news';

-- -------------------------------------------------------------
-- FEATURED + GALLERY IMAGES (random)
-- -------------------------------------------------------------
SET @IMG_NEWS_ALUEXPO_2025 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752945605/uploads/metahub/news-images/ensotek-email-imza-1752945605003-245572109.webp';

SET @IMG_NEWS_ALUEXPO_2025_2 :=
  'https://images.unsplash.com/photo-1581090700394-0c4c0bef0c89?auto=format&fit=crop&w=1400&q=80';
SET @IMG_NEWS_ALUEXPO_2025_3 :=
  'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80';
SET @IMG_NEWS_ALUEXPO_2025_4 :=
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1400&q=80';
SET @IMG_NEWS_ALUEXPO_2025_5 :=
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80';

-- -------------------------------------------------------------
-- I18N IDS (deterministik)
-- -------------------------------------------------------------
SET @I18N_NEWS_ALUEXPO_2025_TR := '66662006-0001-4001-8001-666666662006';
SET @I18N_NEWS_ALUEXPO_2025_EN := '66662006-0002-4002-8002-666666662006';
SET @I18N_NEWS_ALUEXPO_2025_DE := '66662006-0003-4003-8003-666666662006';

-- -------------------------------------------------------------
-- TIMESTAMPS
-- -------------------------------------------------------------
SET @DT_CREATED := '2025-07-19 17:20:06.428';
SET @DT_UPDATED := '2025-07-19 20:46:40.260';

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
    @NEWS_ALUEXPO_2025,
    @MODULE_KEY_NEWS,
    1,
    105,
    105,
    @IMG_NEWS_ALUEXPO_2025,
    NULL,
    @IMG_NEWS_ALUEXPO_2025,
    NULL,
    JSON_ARRAY(
      @IMG_NEWS_ALUEXPO_2025,
      @IMG_NEWS_ALUEXPO_2025_2,
      @IMG_NEWS_ALUEXPO_2025_3,
      @IMG_NEWS_ALUEXPO_2025_4,
      @IMG_NEWS_ALUEXPO_2025_5
    ),
    JSON_ARRAY(),
    @CAT_NEWS_DUYS,
    @SUB_NEWS_GENERAL_ANN,
    @DT_CREATED,
    @DT_UPDATED
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
  @I18N_NEWS_ALUEXPO_2025_TR,
  @NEWS_ALUEXPO_2025,
  'tr',
  'ALUEXPO 2025 – Uluslararası Alüminyum Fuarına Katılıyoruz!',
  'aluexpo-2025-uluslararasi-aluminyum-fuarina-katiliyoruz',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">ALUEXPO 2025 – Uluslararası Alüminyum Fuarına Katılıyoruz!</h1>',

          '<p class="text-slate-700 mb-5">',
            '<strong>ALUEXPO 2025</strong> kapsamında; <strong>18–20 Eylül 2025</strong> tarihlerinde ',
            '<strong>İstanbul Fuar Merkezi</strong>’nde, <strong>2. Salon</strong> <strong>E155</strong> nolu standımızda sizleri bekliyoruz.',
          '</p>',

          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Online Davetiye</h2>',
              '<p class="text-slate-700 mb-2">Ziyaretçi kaydınızı online olarak oluşturabilirsiniz:</p>',
              '<p class="text-slate-700">',
                '<a class="text-slate-900 underline" href="https://aluexpo.com/visitor-register-form" target="_blank" rel="noopener noreferrer">',
                  'ALUEXPO Ziyaretçi Kaydı',
                '</a>',
              '</p>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Stand Bilgisi</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>İstanbul Fuar Merkezi</li>',
                '<li>2. Salon</li>',
                '<li>Stand: E155</li>',
                '<li>Tarih: 18–20 Eylül 2025</li>',
              '</ul>',
            '</div>',
          '</div>',

          '<p class="text-slate-700 mb-5">',
            'Fuar; alüminyumun üretim ve işleme süreçlerini uçtan uca kapsayan kapsamlı bir etkinliktir. ',
            'Ergitme, döküm, ısıl işlem, yeniden ısıtma teknolojileri, endüstri 4.0, geri dönüşüm ile test ve ölçüm teknolojileri gibi başlıklarda ',
            'sektör profesyonellerini bir araya getirir.',
          '</p>',

          '<div class="bg-slate-900 text-white rounded-2xl p-6">',
            '<p class="text-white/90">',
              '<strong>Sizleri standımıza bekliyoruz.</strong> Projelerinizi konuşmak ve ihtiyaçlarınıza uygun çözümleri paylaşmak için bizimle görüşebilirsiniz.',
            '</p>',
          '</div>',
        '</div>',
      '</section>'
    )
  ),
  'ALUEXPO 2025 Fuarı’na katılıyoruz. 18-20 Eylül 2025 tarihlerinde İstanbul Fuar Merkezi’nde 2. Salon E155 nolu standımızda sizleri bekliyoruz.',
  'ALUEXPO 2025 duyurusu – Ensotek standı (İFM, Hall 2, E155)',
  'ALUEXPO 2025 | Ensotek – Fuar Katılım Duyurusu',
  'ENSOTEK, ALUEXPO 2025 Uluslararası Alüminyum Fuarı’na katılıyor. 18–20 Eylül 2025 tarihlerinde İstanbul Fuar Merkezi, 2. Salon, E155 standında buluşalım.',
  'ensotek,fuar,aluminyum,etkinlik,aluexpo,2025,istanbul,duyuru,stand e155',
  @DT_CREATED,
  @DT_UPDATED
),

-- EN
(
  @I18N_NEWS_ALUEXPO_2025_EN,
  @NEWS_ALUEXPO_2025,
  'en',
  'ALUEXPO 2025 – We Are Attending the International Aluminium Fair!',
  'aluexpo-2025-we-are-attending-the-international-aluminium-fair',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">ALUEXPO 2025 – We Are Attending the International Aluminium Fair!</h1>',

          '<p class="text-slate-700 mb-5">',
            'Meet us at <strong>Istanbul Expo Center</strong>, <strong>Hall 2</strong>, <strong>Stand E155</strong>, ',
            'between <strong>September 18–20, 2025</strong>.',
          '</p>',

          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Online Invitation</h2>',
              '<p class="text-slate-700 mb-2">You can register online via the official form:</p>',
              '<p class="text-slate-700">',
                '<a class="text-slate-900 underline" href="https://aluexpo.com/visitor-register-form" target="_blank" rel="noopener noreferrer">',
                  'ALUEXPO Visitor Registration',
                '</a>',
              '</p>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Stand Details</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Istanbul Expo Center</li>',
                '<li>Hall 2</li>',
                '<li>Stand: E155</li>',
                '<li>Dates: Sep 18–20, 2025</li>',
              '</ul>',
            '</div>',
          '</div>',

          '<p class="text-slate-700 mb-5">',
            'ALUEXPO brings together aluminium technologies across the full value chain, covering topics such as melting, casting, heat treatment, re-heating, Industry 4.0, recycling, and test & measurement.',
          '</p>',

          '<div class="bg-slate-900 text-white rounded-2xl p-6">',
            '<p class="text-white/90"><strong>We look forward to welcoming you at our stand.</strong> Let’s discuss your projects and share tailored solutions.</p>',
          '</div>',
        '</div>',
      '</section>'
    )
  ),
  'We are attending ALUEXPO 2025! Visit us at Istanbul Expo Center, Hall 2, Stand E155, between September 18-20, 2025.',
  'ALUEXPO 2025 announcement – Ensotek stand (Istanbul Expo Center, Hall 2, E155)',
  'ALUEXPO 2025 | Ensotek – Fair Announcement',
  'ENSOTEK is attending ALUEXPO 2025 in Istanbul. Visit us at Istanbul Expo Center, Hall 2, Stand E155 on September 18–20, 2025.',
  'ensotek,fair,aluminium,event,aluexpo,2025,istanbul,announcement,stand e155',
  @DT_CREATED,
  @DT_UPDATED
),

-- DE
(
  @I18N_NEWS_ALUEXPO_2025_DE,
  @NEWS_ALUEXPO_2025,
  'de',
  'ALUEXPO 2025 – Wir nehmen an der Internationalen Aluminium-Messe teil!',
  'aluexpo-2025-wir-nehmen-an-der-internationalen-aluminium-messe-teil',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">ALUEXPO 2025 – Wir nehmen an der Internationalen Aluminium-Messe teil!</h1>',

          '<p class="text-slate-700 mb-5">',
            'Besuchen Sie uns im <strong>Istanbul Expo Center</strong>, <strong>Halle 2</strong>, <strong>Stand E155</strong>, ',
            'vom <strong>18. bis 20. September 2025</strong>.',
          '</p>',

          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Online-Einladung</h2>',
              '<p class="text-slate-700 mb-2">Registrieren Sie sich online über das offizielle Formular:</p>',
              '<p class="text-slate-700">',
                '<a class="text-slate-900 underline" href="https://aluexpo.com/visitor-register-form" target="_blank" rel="noopener noreferrer">',
                  'ALUEXPO Besucherregistrierung',
                '</a>',
              '</p>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Stand-Details</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Istanbul Expo Center</li>',
                '<li>Halle 2</li>',
                '<li>Stand: E155</li>',
                '<li>Datum: 18.–20. September 2025</li>',
              '</ul>',
            '</div>',
          '</div>',

          '<p class="text-slate-700 mb-5">',
            'ALUEXPO vereint Technologien entlang der gesamten Aluminium-Wertschöpfungskette, darunter Schmelzen, Gießen, Wärmebehandlung, Wiedererwärmung, Industrie 4.0, Recycling sowie Test- und Messtechnik.',
          '</p>',

          '<div class="bg-slate-900 text-white rounded-2xl p-6">',
            '<p class="text-white/90"><strong>Wir freuen uns auf Ihren Besuch an unserem Stand.</strong> Gerne besprechen wir Ihre Projekte und passende Lösungen.</p>',
          '</div>',
        '</div>',
      '</section>'
    )
  ),
  'Wir nehmen an der ALUEXPO 2025 teil! Besuchen Sie uns vom 18. bis 20. September 2025 im Istanbul Expo Center, Halle 2, Stand E155.',
  'ALUEXPO 2025 Ankündigung – Ensotek Stand (Istanbul Expo Center, Halle 2, E155)',
  'ALUEXPO 2025 | Ensotek – Messeankündigung',
  'ENSOTEK nimmt an der ALUEXPO 2025 in Istanbul teil. Besuchen Sie uns im Istanbul Expo Center, Halle 2, Stand E155 (18.–20. September 2025).',
  'ensotek,messe,aluminium,veranstaltung,aluexpo,2025,istanbul,ankuendigung,stand e155',
  @DT_CREATED,
  @DT_UPDATED
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

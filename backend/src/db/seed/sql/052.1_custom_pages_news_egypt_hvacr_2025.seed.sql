-- =============================================================
-- FILE: 052.1_custom_pages_news_egypt_hvacr_2025.seed.sql  (FINAL / SCHEMA-OK)
-- Ensotek – NEWS Custom Page Seed (TR/EN/DE)
-- Haber: “Mısır HVAC-R Fuarını Başarıyla Tamamladık!”
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
-- CATEGORY / SUB CATEGORY
-- -------------------------------------------------------------
SET @CAT_NEWS_GENERAL  := 'aaaa2001-1111-4111-8111-aaaaaaaa2001';
SET @CAT_NEWS_DUYS     := 'aaaa2003-1111-4111-8111-aaaaaaaa2003';
SET @CAT_NEWS_PRESS    := 'aaaa2004-1111-4111-8111-aaaaaaaa2004';
SET @SUB_NEWS_GENERAL_ANN  := 'bbbb2001-1111-4111-8111-bbbbbbbb2001';

-- -------------------------------------------------------------
-- PAGE ID (deterministik)
-- -------------------------------------------------------------
SET @NEWS_EGYPT_HVACR_2025 := '22220003-2222-4222-8222-222222220003';

-- -------------------------------------------------------------
-- MODULE KEY (PARENT)
-- -------------------------------------------------------------
SET @MODULE_KEY_NEWS := 'news';

-- -------------------------------------------------------------
-- FEATURED + GALLERY IMAGES (random)
-- -------------------------------------------------------------
SET @IMG_NEWS_EGYPT_HVACR_2025 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958173/uploads/metahub/news-images/img-20240520-wa0183-1752958172132-879111355.webp';

SET @IMG_NEWS_EGYPT_HVACR_2025_2 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958173/uploads/metahub/news-images/img-20240520-wa0183-1752958172132-879111355.webp';
SET @IMG_NEWS_EGYPT_HVACR_2025_3 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958174/uploads/metahub/news-images/img-20240520-wa0185-1752958173126-9783021.webp';
SET @IMG_NEWS_EGYPT_HVACR_2025_4 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958175/uploads/metahub/news-images/img-20240515-wa0016-1752958173920-597814699.webp';
SET @IMG_NEWS_EGYPT_HVACR_2025_5 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958175/uploads/metahub/news-images/img-20240515-wa0016-1752958173920-597814699.webp';

-- -------------------------------------------------------------
-- I18N IDS (deterministik)
-- -------------------------------------------------------------
SET @I18N_NEWS_EGYPT_HVACR_2025_TR := '66662003-0001-4001-8001-666666662003';
SET @I18N_NEWS_EGYPT_HVACR_2025_EN := '66662003-0002-4002-8002-666666662003';
SET @I18N_NEWS_EGYPT_HVACR_2025_DE := '66662003-0003-4003-8003-666666662003';

-- -------------------------------------------------------------
-- TIMESTAMPS
-- -------------------------------------------------------------
SET @DT_CREATED := '2025-07-19 17:20:06.428';
SET @DT_UPDATED := '2025-07-19 20:49:51.752';

-- -------------------------------------------------------------
-- PARENT UPSERT (custom_pages)
-- ✅ module_key BURADA
-- -------------------------------------------------------------
INSERT INTO `custom_pages`
  (`id`,
   `module_key`,
   `is_published`,
   `featured`,
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
    @NEWS_EGYPT_HVACR_2025,
    @MODULE_KEY_NEWS,
    1,
    0,
    102,
    102,
    @IMG_NEWS_EGYPT_HVACR_2025,
    NULL,
    @IMG_NEWS_EGYPT_HVACR_2025,
    NULL,
    JSON_ARRAY(
      @IMG_NEWS_EGYPT_HVACR_2025,
      @IMG_NEWS_EGYPT_HVACR_2025_2,
      @IMG_NEWS_EGYPT_HVACR_2025_3,
      @IMG_NEWS_EGYPT_HVACR_2025_4,
      @IMG_NEWS_EGYPT_HVACR_2025_5
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
  `featured`                = VALUES(`featured`),
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
  @I18N_NEWS_EGYPT_HVACR_2025_TR,
  @NEWS_EGYPT_HVACR_2025,
  'tr',
  'Mısır HVAC-R Fuarını Başarıyla Tamamladık!',
  'misir-hvacr-fuarini-basarili-tamamladik',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Mısır HVAC-R Fuarını Başarıyla Tamamladık!</h1>',
          '<p class="text-slate-700 mb-5">',
            'ENSOTEK olarak Egypt HVAC-R 2025 Fuarı’nı başarıyla tamamlamanın gururunu yaşıyoruz. ',
            'Fuar boyunca soğutma kuleleri ve endüstriyel soğutma çözümlerimiz hakkında ziyaretçilerimize detaylı bilgi sunduk.',
          '</p>',
          '<p class="text-slate-700 mb-5">',
            'Kahire, İskenderiye ve farklı şehirlerden gelen profesyonellerle bir araya gelerek; ',
            'proje ihtiyaçlarını dinledik, uygulama senaryolarını değerlendirdik ve yeni iş birlikleri için güçlü bir zemin oluşturduk.',
          '</p>',

          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Öne Çıkan Başlıklar</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Yeni proje görüşmeleri ve teknik ön değerlendirmeler</li>',
                '<li>Verimlilik ve enerji optimizasyonu odağında sunumlar</li>',
                '<li>Ürün gamımızın farklı sektörlerdeki uygulamaları</li>',
                '<li>İhracat ağımızı büyüten yeni bağlantılar</li>',
              '</ul>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Sırada Ne Var?</h2>',
              '<p class="text-slate-700">',
                'Fuar sonrası süreçte, standımızda görüşme yaptığımız firmalarla teknik doküman paylaşımı ve keşif planlamaları ',
                'başlattık. Çözümlerimizi yerinde analiz ederek en doğru sistemi tasarlamayı hedefliyoruz.',
              '</p>',
            '</div>',
          '</div>',

          '<div class="bg-slate-900 text-white rounded-2xl p-6 mb-6">',
            '<h2 class="text-xl font-semibold mb-2">Teşekkürler</h2>',
            '<p class="text-white/90">',
              'Standımızı ziyaret eden tüm misafirlerimize ve iş ortaklarımıza içten teşekkür ederiz. ',
              'ENSOTEK olarak global çözümler sunmaya ve sürdürülebilir büyümeyi desteklemeye devam edeceğiz.',
            '</p>',
          '</div>',

          '<p class="text-slate-700">',
            'Daha fazla bilgi için ',
            '<a class="text-slate-900 underline" href="https://www.hvacrexpo.com.eg/" target="_blank" rel="noopener noreferrer">Egypt HVAC-R Fuarı web sitesi</a>',
            ' adresini ziyaret edebilirsiniz.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Mısır HVAC-R 2025 Fuarı’nda standımıza gösterilen yoğun ilgi için teşekkür ederiz. Kahire, İskenderiye ve farklı şehirlerden gelen tüm ziyaretçilerimizle verimli görüşmeler gerçekleştirdik.',
  'Egypt HVAC-R 2025 fuarında ENSOTEK standı ve ziyaretçiler',
  'Mısır HVAC-R 2025 Fuarını Başarıyla Tamamladık! | Ensotek',
  'ENSOTEK, Egypt HVAC-R 2025 Fuarı’nı başarıyla tamamladı. Soğutma kuleleri ve endüstriyel çözümlerimizle ziyaretçilerle buluştuk; yeni iş bağlantıları kurduk.',
  'ensotek,fuar,misir,hvacr,etkinlik,sogutma kuleleri,duyuru,uluslararasi',
  @DT_CREATED,
  @DT_UPDATED
),

-- EN
(
  @I18N_NEWS_EGYPT_HVACR_2025_EN,
  @NEWS_EGYPT_HVACR_2025,
  'en',
  'We Successfully Completed the Egypt HVAC-R Fair!',
  'we-successfully-completed-the-egypt-hvacr-fair',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">We Successfully Completed the Egypt HVAC-R Fair!</h1>',
          '<p class="text-slate-700 mb-5">',
            'As ENSOTEK, we are proud to have successfully completed the Egypt HVAC-R 2025 Fair. ',
            'Throughout the event, we introduced our cooling towers and industrial cooling solutions to professionals and decision-makers.',
          '</p>',
          '<p class="text-slate-700 mb-5">',
            'We met with visitors from Cairo, Alexandria, and many other cities—discussing project requirements, ',
            'reviewing application scenarios, and establishing a strong foundation for new partnerships in international markets.',
          '</p>',

          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Highlights</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>New project meetings and technical pre-evaluations</li>',
                '<li>Presentations focused on efficiency and energy optimization</li>',
                '<li>Real-world use cases across multiple industries</li>',
                '<li>New connections strengthening our export network</li>',
              '</ul>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">What’s Next?</h2>',
              '<p class="text-slate-700">',
                'Following the fair, we started technical document sharing and site-assessment planning with the companies we met. ',
                'Our goal is to design the most suitable system based on on-site analysis and measurable performance targets.',
              '</p>',
            '</div>',
          '</div>',

          '<div class="bg-slate-900 text-white rounded-2xl p-6 mb-6">',
            '<h2 class="text-xl font-semibold mb-2">Thank You</h2>',
            '<p class="text-white/90">',
              'We sincerely thank everyone who visited our stand and showed interest in our products. ',
              'ENSOTEK will continue delivering global solutions and supporting sustainable growth.',
            '</p>',
          '</div>',

          '<p class="text-slate-700">',
            'For more information, please visit the ',
            '<a class="text-slate-900 underline" href="https://www.hvacrexpo.com.eg/" target="_blank" rel="noopener noreferrer">Egypt HVAC-R Fair website</a>.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'We thank everyone who showed great interest in our stand at the Egypt HVAC-R 2025 Fair. We met visitors from Cairo, Alexandria, and many cities and discussed new collaboration opportunities.',
  'ENSOTEK stand at Egypt HVAC-R 2025 with visitors',
  'Egypt HVAC-R 2025: Successfully Completed | Ensotek',
  'ENSOTEK successfully completed the Egypt HVAC-R 2025 Fair. We presented cooling tower solutions, discussed real projects, and strengthened international business connections.',
  'ensotek,fair,egypt,hvacr,event,cooling towers,announcement,international',
  @DT_CREATED,
  @DT_UPDATED
),

-- DE
(
  @I18N_NEWS_EGYPT_HVACR_2025_DE,
  @NEWS_EGYPT_HVACR_2025,
  'de',
  'Wir haben die Egypt HVAC-R Messe erfolgreich abgeschlossen!',
  'egypt-hvacr-messe-erfolgreich-abgeschlossen',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Wir haben die Egypt HVAC-R Messe erfolgreich abgeschlossen!</h1>',
          '<p class="text-slate-700 mb-5">',
            'Als ENSOTEK sind wir stolz darauf, die Egypt HVAC-R 2025 Messe erfolgreich abgeschlossen zu haben. ',
            'Während der Veranstaltung präsentierten wir unsere Kühltürme und industriellen Kühllösungen einem internationalen Fachpublikum.',
          '</p>',
          '<p class="text-slate-700 mb-5">',
            'Wir führten Gespräche mit Besuchern aus Kairo, Alexandria und vielen weiteren Städten—',
            'analysierten Projektanforderungen, diskutierten Einsatzszenarien und stärkten die Basis für neue Partnerschaften.',
          '</p>',

          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Schwerpunkte</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Neue Projektgespräche und technische Vorbewertungen</li>',
                '<li>Effizienz- und Energieoptimierungsfokus</li>',
                '<li>Anwendungsbeispiele aus verschiedenen Branchen</li>',
                '<li>Neue Kontakte für unser Exportnetzwerk</li>',
              '</ul>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Wie geht es weiter?</h2>',
              '<p class="text-slate-700">',
                'Nach der Messe starteten wir die technische Dokumentation und die Planung von Vor-Ort-Terminen. ',
                'Ziel ist eine passgenaue Systemauslegung auf Basis von Standortanalyse und klaren Leistungskennzahlen.',
              '</p>',
            '</div>',
          '</div>',

          '<div class="bg-slate-900 text-white rounded-2xl p-6 mb-6">',
            '<h2 class="text-xl font-semibold mb-2">Danke</h2>',
            '<p class="text-white/90">',
              'Wir danken allen Gästen und Partnern, die unseren Stand besucht und Interesse gezeigt haben. ',
              'ENSOTEK wird weiterhin globale Lösungen anbieten und nachhaltiges Wachstum unterstützen.',
            '</p>',
          '</div>',

          '<p class="text-slate-700">',
            'Weitere Informationen finden Sie auf der ',
            '<a class="text-slate-900 underline" href="https://www.hvacrexpo.com.eg/" target="_blank" rel="noopener noreferrer">Website der Egypt HVAC-R Messe</a>.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Wir danken allen, die auf der Egypt HVAC-R 2025 Messe großes Interesse an unserem Stand gezeigt haben. Wir führten intensive Gespräche mit Besuchern aus Kairo, Alexandria und weiteren Städten.',
  'ENSOTEK Messestand auf der Egypt HVAC-R 2025',
  'Egypt HVAC-R 2025: Erfolgreich abgeschlossen | Ensotek',
  'ENSOTEK hat die Egypt HVAC-R 2025 Messe erfolgreich abgeschlossen. Wir präsentierten Kühlturm-Lösungen, analysierten Projektanforderungen und stärkten internationale Geschäftsbeziehungen.',
  'ensotek,messe,aegypten,hvacr,veranstaltung,kuehltuerme,ankuendigung,international',
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

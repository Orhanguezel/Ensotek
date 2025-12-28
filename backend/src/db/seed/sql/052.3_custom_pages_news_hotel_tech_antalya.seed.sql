-- =============================================================
-- FILE: 052.3_custom_pages_news_hotel_tech_antalya.seed.sql  (FINAL / SCHEMA-OK)
-- Ensotek – NEWS Custom Page Seed (TR/EN/DE)
-- Haber: “Hotel-Tech Antalya Fuarını Başarıyla Tamamladık!”
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
SET @NEWS_HOTEL_TECH_ANTALYA := '22220005-2222-4222-8222-222222220005';

-- -------------------------------------------------------------
-- MODULE KEY (PARENT)
-- -------------------------------------------------------------
SET @MODULE_KEY_NEWS := 'news';

-- -------------------------------------------------------------
-- FEATURED + GALLERY IMAGES (random)
-- -------------------------------------------------------------
SET @IMG_NEWS_HOTEL_TECH_ANTALYA :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958400/uploads/metahub/news-images/img-20250618-wa0022-1752958399182-621396987.webp';

SET @IMG_NEWS_HOTEL_TECH_ANTALYA_2 :=
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80';
SET @IMG_NEWS_HOTEL_TECH_ANTALYA_3 :=
  'https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1400&q=80';
SET @IMG_NEWS_HOTEL_TECH_ANTALYA_4 :=
  'https://images.unsplash.com/photo-1551887373-6f2a29b90a0a?auto=format&fit=crop&w=1400&q=80';
SET @IMG_NEWS_HOTEL_TECH_ANTALYA_5 :=
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80';

-- -------------------------------------------------------------
-- I18N IDS (deterministik)
-- -------------------------------------------------------------
SET @I18N_NEWS_HOTEL_TECH_ANTALYA_TR := '66662005-0001-4001-8001-666666662005';
SET @I18N_NEWS_HOTEL_TECH_ANTALYA_EN := '66662005-0002-4002-8002-666666662005';
SET @I18N_NEWS_HOTEL_TECH_ANTALYA_DE := '66662005-0003-4003-8003-666666662005';

-- -------------------------------------------------------------
-- TIMESTAMPS
-- -------------------------------------------------------------
SET @DT_CREATED := '2025-07-19 17:20:06.428';
SET @DT_UPDATED := '2025-07-19 20:53:23.466';

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
    @NEWS_HOTEL_TECH_ANTALYA,
    @MODULE_KEY_NEWS,
    1,
    104,
    104,
    @IMG_NEWS_HOTEL_TECH_ANTALYA,
    NULL,
    @IMG_NEWS_HOTEL_TECH_ANTALYA,
    NULL,
    JSON_ARRAY(
      @IMG_NEWS_HOTEL_TECH_ANTALYA,
      @IMG_NEWS_HOTEL_TECH_ANTALYA_2,
      @IMG_NEWS_HOTEL_TECH_ANTALYA_3,
      @IMG_NEWS_HOTEL_TECH_ANTALYA_4,
      @IMG_NEWS_HOTEL_TECH_ANTALYA_5
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
  @I18N_NEWS_HOTEL_TECH_ANTALYA_TR,
  @NEWS_HOTEL_TECH_ANTALYA,
  'tr',
  'Hotel-Tech Antalya Fuarını Başarıyla Tamamladık!',
  'hotel-tech-antalya-fuarini-basarili-tamamladik',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Hotel-Tech Antalya Fuarını Başarıyla Tamamladık!</h1>',

          '<p class="text-slate-700 mb-5">',
            '<strong>Hotel-Tech Antalya</strong> fuarı kapsamında; otel, resort ve konaklama tesislerinin ',
            'teknik altyapı ihtiyaçlarına yönelik çözümlerimizi ziyaretçilerimizle buluşturduk. ',
            'Saha ihtiyaçlarını dinleyerek, farklı tesis tiplerine göre uygulanabilir senaryoları değerlendirdik.',
          '</p>',

          '<p class="text-slate-700 mb-5">',
            'Fuar boyunca gerçekleştirdiğimiz <strong>B2B görüşmeler</strong> ile yeni iş bağlantıları kurduk; ',
            'mevcut iş ortaklarımızla da proje süreçlerini ve teknik gereksinimleri detaylandıran verimli toplantılar yaptık. ',
            'Çözüm yaklaşımımızı “tasarım + üretim + devreye alma + servis” ekseninde anlattık.',
          '</p>',

          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Öne Çıkanlar</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Otel teknik altyapıları için uçtan uca çözüm yaklaşımı</li>',
                '<li>İşletme verimliliğini artıran mühendislik odaklı öneriler</li>',
                '<li>B2B toplantılar: ihtiyaç analizi ve proje ön değerlendirme</li>',
                '<li>Yeni teknoloji ve ürün tanıtımları</li>',
              '</ul>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Sonraki Adımlar</h2>',
              '<p class="text-slate-700">',
                'Fuar sonrası süreçte, görüşmelerimizi teknik doküman paylaşımı ve teklif çalışmalarına taşıyoruz. ',
                'Hedefimiz; tesisin ihtiyacına uygun, ölçülebilir performans çıktıları sunan sistemleri doğru mühendislikle konumlandırmak.',
              '</p>',
            '</div>',
          '</div>',

          '<div class="bg-slate-900 text-white rounded-2xl p-6 mb-6">',
            '<h2 class="text-xl font-semibold mb-2">Teşekkürler</h2>',
            '<p class="text-white/90">',
              'Standımızı ziyaret eden tüm misafirlerimize ve iş ortaklarımıza teşekkür ederiz. ',
              'ENSOTEK olarak sektörde sürdürülebilir çözümler sunmaya ve uluslararası iş birliklerimizi güçlendirmeye devam edeceğiz.',
            '</p>',
          '</div>',

          '<p class="text-slate-700">',
            'Fuar web sitesi için ',
            '<a class="text-slate-900 underline" href="https://www.hoteltechantalya.com/" target="_blank" rel="noopener noreferrer">buraya tıklayınız</a>.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Hotel-Tech Antalya Fuarı’nı başarıyla tamamladık. Standımızı ziyaret eden tüm müşterilerimize ve iş ortaklarımıza teşekkür ederiz.',
  'Hotel-Tech Antalya fuarında ENSOTEK standı ve ziyaretçiler',
  'Hotel-Tech Antalya Fuarını Başarıyla Tamamladık! | Ensotek',
  'ENSOTEK, Hotel-Tech Antalya fuar katılımını başarıyla tamamladı. Otel ve tesislerin teknik ihtiyaçlarına yönelik çözümler, B2B görüşmeler ve yeni teknolojiler öne çıktı.',
  'ensotek,fuar,hotel-tech,antalya,etkinlik,teknoloji,duyuru,b2b,otel',
  @DT_CREATED,
  @DT_UPDATED
),

-- EN
(
  @I18N_NEWS_HOTEL_TECH_ANTALYA_EN,
  @NEWS_HOTEL_TECH_ANTALYA,
  'en',
  'We Successfully Completed the Hotel-Tech Antalya Fair!',
  'we-successfully-completed-the-hotel-tech-antalya-fair',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">We Successfully Completed the Hotel-Tech Antalya Fair!</h1>',

          '<p class="text-slate-700 mb-5">',
            'At <strong>Hotel-Tech Antalya</strong>, we showcased our solutions designed for the technical infrastructure needs ',
            'of hotels, resorts, and hospitality facilities. We listened to real operational requirements and evaluated practical implementation scenarios.',
          '</p>',

          '<p class="text-slate-700 mb-5">',
            'Through <strong>B2B meetings</strong>, we established new business connections and held productive discussions with existing partners. ',
            'We shared our end-to-end approach covering design, manufacturing, commissioning, and after-sales support—tailored to facility requirements.',
          '</p>',

          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Highlights</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>End-to-end solutions for hospitality technical infrastructure</li>',
                '<li>Engineering-driven recommendations to improve efficiency</li>',
                '<li>B2B sessions: needs analysis and project pre-evaluation</li>',
                '<li>Presentations on new technologies and products</li>',
              '</ul>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">What’s Next?</h2>',
              '<p class="text-slate-700">',
                'After the fair, we are moving forward with technical documentation sharing and quotation work. ',
                'Our goal is to position the right system with measurable performance outcomes—supported by sound engineering.',
              '</p>',
            '</div>',
          '</div>',

          '<div class="bg-slate-900 text-white rounded-2xl p-6 mb-6">',
            '<h2 class="text-xl font-semibold mb-2">Thank You</h2>',
            '<p class="text-white/90">',
              'We thank all visitors and partners who stopped by our stand. ',
              'ENSOTEK will continue delivering sustainable solutions and strengthening international collaborations.',
            '</p>',
          '</div>',

          '<p class="text-slate-700">',
            '<a class="text-slate-900 underline" href="https://www.hoteltechantalya.com/" target="_blank" rel="noopener noreferrer">Click here</a> ',
            'for the fair website.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'We successfully completed the Hotel-Tech Antalya Fair. We thank all visitors and partners who visited our stand.',
  'ENSOTEK stand at Hotel-Tech Antalya with visitors',
  'Hotel-Tech Antalya: Successfully Completed | Ensotek',
  'ENSOTEK successfully completed its participation at Hotel-Tech Antalya, connecting with hospitality decision-makers and engineering professionals through B2B meetings and solution presentations.',
  'ensotek,fair,hotel-tech,antalya,event,technology,announcement,b2b,hospitality',
  @DT_CREATED,
  @DT_UPDATED
),

-- DE
(
  @I18N_NEWS_HOTEL_TECH_ANTALYA_DE,
  @NEWS_HOTEL_TECH_ANTALYA,
  'de',
  'Wir haben die Hotel-Tech Antalya Messe erfolgreich abgeschlossen!',
  'hotel-tech-antalya-messe-erfolgreich-abgeschlossen',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Wir haben die Hotel-Tech Antalya Messe erfolgreich abgeschlossen!</h1>',

          '<p class="text-slate-700 mb-5">',
            'Auf der <strong>Hotel-Tech Antalya</strong> präsentierten wir Lösungen für die technische Infrastruktur von Hotels, Resorts und Hospitality-Anlagen. ',
            'Wir analysierten reale Betriebsanforderungen und bewerteten praxisnahe Umsetzungsszenarien.',
          '</p>',

          '<p class="text-slate-700 mb-5">',
            'Durch <strong>B2B-Gespräche</strong> knüpften wir neue Geschäftskontakte und führten produktive Meetings mit bestehenden Partnern. ',
            'Wir stellten unseren End-to-End Ansatz vor—von Auslegung und Produktion bis Inbetriebnahme und After-Sales Support.',
          '</p>',

          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Highlights</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>End-to-End-Lösungen für Hotel-Infrastruktur</li>',
                '<li>Engineering-Ansatz zur Effizienzsteigerung</li>',
                '<li>B2B-Meetings: Bedarfserhebung und Projektvorprüfung</li>',
                '<li>Vorstellungen neuer Technologien und Produkte</li>',
              '</ul>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Nächste Schritte</h2>',
              '<p class="text-slate-700">',
                'Nach der Messe führen wir den Austausch mit technischen Unterlagen und Angebotsphasen fort. ',
                'Ziel sind standortgerechte Systeme mit messbaren Leistungskennzahlen—getragen von sauberer Ingenieursarbeit.',
              '</p>',
            '</div>',
          '</div>',

          '<div class="bg-slate-900 text-white rounded-2xl p-6 mb-6">',
            '<h2 class="text-xl font-semibold mb-2">Danke</h2>',
            '<p class="text-white/90">',
              'Wir danken allen Besuchern und Partnern für ihr Interesse. ',
              'ENSOTEK wird weiterhin nachhaltige Lösungen anbieten und internationale Kooperationen stärken.',
            '</p>',
          '</div>',

          '<p class="text-slate-700">',
            'Zur Messe-Website ',
            '<a class="text-slate-900 underline" href="https://www.hoteltechantalya.com/" target="_blank" rel="noopener noreferrer">hier klicken</a>.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Wir haben die Hotel-Tech Antalya Messe erfolgreich abgeschlossen. Wir danken allen Besuchern und Partnern, die unseren Stand besucht haben.',
  'ENSOTEK Messestand auf der Hotel-Tech Antalya mit Besuchern',
  'Hotel-Tech Antalya: Erfolgreich abgeschlossen | Ensotek',
  'ENSOTEK hat die Teilnahme an der Hotel-Tech Antalya erfolgreich abgeschlossen. Im Fokus standen B2B-Gespräche, Infrastruktur-Lösungen für die Hotellerie und Präsentationen neuer Technologien.',
  'ensotek,messe,hotel-tech,antalya,veranstaltung,technologie,ankuendigung,b2b,hotel',
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

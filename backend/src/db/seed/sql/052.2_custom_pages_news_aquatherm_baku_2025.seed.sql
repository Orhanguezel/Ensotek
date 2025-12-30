-- =============================================================
-- FILE: 052.2_custom_pages_news_aquatherm_baku_2025.seed.sql  (FINAL / SCHEMA-OK)
-- Ensotek – NEWS Custom Page Seed (TR/EN/DE)
-- Haber: “Aquatherm Bakü Fuarını Başarıyla Tamamladık!”
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
SET @NEWS_AQUATHERM_BAKU_2025 := '22220004-2222-4222-8222-222222220004';

-- -------------------------------------------------------------
-- MODULE KEY (PARENT)
-- -------------------------------------------------------------
SET @MODULE_KEY_NEWS := 'news';

-- -------------------------------------------------------------
-- FEATURED + GALLERY IMAGES (random)
-- -------------------------------------------------------------
SET @IMG_NEWS_AQUATHERM_BAKU_2025 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958291/uploads/metahub/news-images/img-20241017-wa0040-1752958289686-74069766.webp';

SET @IMG_NEWS_AQUATHERM_BAKU_2025_2 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958291/uploads/metahub/news-images/baku-fuar-1-1752958289688-847911396.webp';
SET @IMG_NEWS_AQUATHERM_BAKU_2025_3 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958291/uploads/metahub/news-images/img-20241017-wa0033-1752958290248-519948162.webp';
SET @IMG_NEWS_AQUATHERM_BAKU_2025_4 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958291/uploads/metahub/news-images/img-20241017-wa0042-1752958290250-566260910.webp';
SET @IMG_NEWS_AQUATHERM_BAKU_2025_5 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958292/uploads/metahub/news-images/img-20241127-wa0007-1752958291068-704255418.webp';

-- -------------------------------------------------------------
-- I18N IDS (deterministik)
-- -------------------------------------------------------------
SET @I18N_NEWS_AQUATHERM_BAKU_2025_TR := '66662004-0001-4001-8001-666666662004';
SET @I18N_NEWS_AQUATHERM_BAKU_2025_EN := '66662004-0002-4002-8002-666666662004';
SET @I18N_NEWS_AQUATHERM_BAKU_2025_DE := '66662004-0003-4003-8003-666666662004';

-- -------------------------------------------------------------
-- TIMESTAMPS
-- -------------------------------------------------------------
SET @DT_CREATED := '2025-07-19 17:20:06.428';
SET @DT_UPDATED := '2025-07-19 20:51:33.294';

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
    @NEWS_AQUATHERM_BAKU_2025,
    @MODULE_KEY_NEWS,
    1,
    103,
    103,
    @IMG_NEWS_AQUATHERM_BAKU_2025,
    NULL,
    @IMG_NEWS_AQUATHERM_BAKU_2025,
    NULL,
    JSON_ARRAY(
      @IMG_NEWS_AQUATHERM_BAKU_2025,
      @IMG_NEWS_AQUATHERM_BAKU_2025_2,
      @IMG_NEWS_AQUATHERM_BAKU_2025_3,
      @IMG_NEWS_AQUATHERM_BAKU_2025_4,
      @IMG_NEWS_AQUATHERM_BAKU_2025_5
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
  @I18N_NEWS_AQUATHERM_BAKU_2025_TR,
  @NEWS_AQUATHERM_BAKU_2025,
  'tr',
  'Aquatherm Bakü Fuarını Başarıyla Tamamladık!',
  'aquatherm-baku-fuarini-basarili-tamamladik',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Aquatherm Bakü Fuarını Başarıyla Tamamladık!</h1>',
          '<p class="text-slate-700 mb-5">',
            'ENSOTEK olarak Aquatherm Bakü 2025 Fuarı’nı başarıyla tamamladık. ',
            'Fuarda yenilikçi çözümlerimiz yoğun ilgi gördü; teknik toplantılar gerçekleştirdik ve farklı sektörlerden profesyonellerle bir araya geldik.',
          '</p>',
          '<p class="text-slate-700 mb-5">',
            'Bakü’de hem yeni iş bağlantıları kurduk hem de mevcut müşterilerimizle proje süreçlerine ilişkin değerlendirmeler yapma fırsatı yakaladık. ',
            'Bölgesel ihtiyaçlara uygun çözümlerimizi sahada anlatmak, bizim için önemli bir kazanım oldu.',
          '</p>',

          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Fuar Notları</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Yeni potansiyel proje görüşmeleri ve keşif planlamaları</li>',
                '<li>Ürün performansı ve verimlilik odağında teknik anlatımlar</li>',
                '<li>Çözüm odaklı yaklaşım: tasarım, üretim ve servis süreçleri</li>',
                '<li>Bölgesel partnerlikler için stratejik adımlar</li>',
              '</ul>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Sonraki Adımlar</h2>',
              '<p class="text-slate-700">',
                'Fuar sonrası, görüşmelerimizi teknik doküman paylaşımı ve teklif sürecine taşıyoruz. ',
                'Hedefimiz; sahaya uygun, ölçülebilir performans çıktıları sağlayan sistemleri hızlıca devreye almak.',
              '</p>',
            '</div>',
          '</div>',

          '<div class="bg-slate-900 text-white rounded-2xl p-6 mb-6">',
            '<h2 class="text-xl font-semibold mb-2">Teşekkürler</h2>',
            '<p class="text-white/90">',
              'Standımızı ziyaret eden tüm misafirlerimize, değerli müşterilerimize ve Bakü’deki temsilcilerimize teşekkür ederiz. ',
              'ENSOTEK olarak uluslararası platformlarda ülkemizi ve sektörümüzü en iyi şekilde temsil etmeye devam edeceğiz.',
            '</p>',
          '</div>',

          '<p class="text-slate-700">',
            'Daha fazla bilgi için ',
            '<a class="text-slate-900 underline" href="https://www.aquatherm.az/" target="_blank" rel="noopener noreferrer">Aquatherm Bakü Fuarı web sitesi</a>',
            ' adresini ziyaret edebilirsiniz.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Aquatherm Bakü 2025 Fuarı’nda büyük ilgiyle karşılandık. Standımızı ziyaret eden değerli müşterilerimize ve Bakü’deki temsilcilerimize teşekkür ederiz.',
  'Aquatherm Bakü 2025 fuarında ENSOTEK standı ve ziyaretçiler',
  'Aquatherm Bakü 2025 Fuarını Başarıyla Tamamladık! | Ensotek',
  'ENSOTEK, Aquatherm Bakü 2025 Fuarı’ndaki başarılı katılımını tamamladı. Yenilikçi çözümlerimizi tanıttık; yeni bağlantılar kurduk ve mevcut müşterilerimizle buluştuk.',
  'ensotek,fuar,aquatherm,baku,bakü,etkinlik,uluslararasi,duyuru',
  @DT_CREATED,
  @DT_UPDATED
),

-- EN
(
  @I18N_NEWS_AQUATHERM_BAKU_2025_EN,
  @NEWS_AQUATHERM_BAKU_2025,
  'en',
  'We Successfully Completed the Aquatherm Baku Fair!',
  'we-successfully-completed-the-aquatherm-baku-fair',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">We Successfully Completed the Aquatherm Baku Fair!</h1>',
          '<p class="text-slate-700 mb-5">',
            'We are pleased to announce the successful completion of the Aquatherm Baku 2025 Fair. ',
            'Our innovative solutions attracted strong interest, and we held technical meetings with industry professionals throughout the event.',
          '</p>',
          '<p class="text-slate-700 mb-5">',
            'In Baku, we built new business connections and also had the opportunity to meet existing clients to review ongoing and upcoming projects. ',
            'Sharing our solutions on the ground and discussing regional requirements was a valuable outcome for our team.',
          '</p>',

          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Key Takeaways</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>New project discussions and site-assessment planning</li>',
                '<li>Technical briefings on performance and efficiency</li>',
                '<li>End-to-end approach: design, manufacturing, and service</li>',
                '<li>Strategic steps for regional partnerships</li>',
              '</ul>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Next Steps</h2>',
              '<p class="text-slate-700">',
                'After the fair, we are moving discussions into technical document sharing and quotation phases. ',
                'Our goal is to deliver site-ready systems with measurable performance outcomes—quickly and reliably.',
              '</p>',
            '</div>',
          '</div>',

          '<div class="bg-slate-900 text-white rounded-2xl p-6 mb-6">',
            '<h2 class="text-xl font-semibold mb-2">Thank You</h2>',
            '<p class="text-white/90">',
              'We would like to thank all guests, valued customers, and our representatives in Baku for visiting our stand. ',
              'ENSOTEK will continue representing our industry on international platforms in the best possible way.',
            '</p>',
          '</div>',

          '<p class="text-slate-700">',
            'For more information, please visit the ',
            '<a class="text-slate-900 underline" href="https://www.aquatherm.az/" target="_blank" rel="noopener noreferrer">Aquatherm Baku Fair website</a>.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'We received great interest at the Aquatherm Baku 2025 Fair. We thank our valued customers and representatives in Baku who visited our stand.',
  'ENSOTEK stand at Aquatherm Baku 2025 with visitors',
  'Aquatherm Baku 2025: Successfully Completed | Ensotek',
  'ENSOTEK successfully completed the Aquatherm Baku 2025 Fair—presenting innovative solutions, building new connections, and meeting with existing clients to review projects and regional needs.',
  'ensotek,fair,aquatherm,baku,event,international,announcement',
  @DT_CREATED,
  @DT_UPDATED
),

-- DE
(
  @I18N_NEWS_AQUATHERM_BAKU_2025_DE,
  @NEWS_AQUATHERM_BAKU_2025,
  'de',
  'Wir haben die Aquatherm Baku Messe erfolgreich abgeschlossen!',
  'aquatherm-baku-messe-erfolgreich-abgeschlossen',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-4xl mx-auto">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Wir haben die Aquatherm Baku Messe erfolgreich abgeschlossen!</h1>',
          '<p class="text-slate-700 mb-5">',
            'Wir freuen uns, die erfolgreiche Teilnahme an der Aquatherm Baku 2025 Messe bekannt zu geben. ',
            'Unsere innovativen Lösungen stießen auf großes Interesse, und wir führten während der Veranstaltung zahlreiche technische Gespräche.',
          '</p>',
          '<p class="text-slate-700 mb-5">',
            'In Baku knüpften wir neue Geschäftskontakte und trafen bestehende Kunden, um laufende und geplante Projekte zu besprechen. ',
            'Der Austausch zu regionalen Anforderungen und die Vorstellung unserer Lösungen vor Ort waren ein wichtiger Mehrwert.',
          '</p>',

          '<div class="grid md:grid-cols-2 gap-6 mb-6">',
            '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Wichtige Erkenntnisse</h2>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Neue Projektgespräche und Terminplanung für Standortanalysen</li>',
                '<li>Technische Briefings zu Leistung und Effizienz</li>',
                '<li>End-to-End Ansatz: Auslegung, Produktion und Service</li>',
                '<li>Strategische Schritte für regionale Partnerschaften</li>',
              '</ul>',
            '</div>',
            '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6">',
              '<h2 class="text-xl font-semibold text-slate-900 mb-3">Nächste Schritte</h2>',
              '<p class="text-slate-700">',
                'Nach der Messe überführen wir die Gespräche in den Austausch technischer Unterlagen und Angebotsphasen. ',
                'Ziel ist die schnelle Bereitstellung standortgerechter Systeme mit messbaren Leistungskennzahlen.',
              '</p>',
            '</div>',
          '</div>',

          '<div class="bg-slate-900 text-white rounded-2xl p-6 mb-6">',
            '<h2 class="text-xl font-semibold mb-2">Danke</h2>',
            '<p class="text-white/90">',
              'Wir danken allen Gästen, unseren Kunden und unseren Vertretern in Baku für ihren Besuch. ',
              'Als ENSOTEK werden wir unsere Branche weiterhin bestmöglich auf internationalen Plattformen repräsentieren.',
            '</p>',
          '</div>',

          '<p class="text-slate-700">',
            'Weitere Informationen finden Sie auf der ',
            '<a class="text-slate-900 underline" href="https://www.aquatherm.az/" target="_blank" rel="noopener noreferrer">Aquatherm Baku Messe-Website</a>.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Wir wurden auf der Aquatherm Baku 2025 Messe mit großem Interesse empfangen. Wir danken allen, die unseren Stand besucht haben.',
  'ENSOTEK Messestand auf der Aquatherm Baku 2025',
  'Aquatherm Baku 2025: Erfolgreich abgeschlossen | Ensotek',
  'ENSOTEK hat die Aquatherm Baku 2025 Messe erfolgreich abgeschlossen. Wir präsentierten innovative Lösungen, knüpften Kontakte und trafen bestehende Kunden zur Projektabstimmung.',
  'ensotek,messe,aquatherm,baku,veranstaltung,international,ankuendigung',
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

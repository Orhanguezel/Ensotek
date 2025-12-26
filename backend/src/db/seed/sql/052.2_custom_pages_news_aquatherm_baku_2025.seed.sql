-- =============================================================
-- FILE: 052.2_custom_pages_news_aquatherm_baku_2025.seed.sql
-- NEWS – custom_pages + custom_pages_i18n
-- Yeni haber: “Aquatherm Bakü Fuarını Başarıyla Tamamladık!”
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
SET @NEWS_AQUATHERM_BAKU_2025 := '22220004-2222-4222-8222-222222220004';

/* FEATURED IMAGE (Cloudinary) – ilk görseli featured yaptık */
SET @IMG_NEWS_AQUATHERM_BAKU_2025 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958291/uploads/metahub/news-images/img-20241017-wa0040-1752958289686-74069766.webp';

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
    @NEWS_AQUATHERM_BAKU_2025,
    1,
    103,
    @IMG_NEWS_AQUATHERM_BAKU_2025,
    NULL,
    @CAT_NEWS_DUYS,
    @SUB_NEWS_GENERAL_ANN,
    '2025-07-19 17:20:06.428',
    '2025-07-19 20:51:33.294'
  )
ON DUPLICATE KEY UPDATE
  `is_published`    = VALUES(`is_published`),
  `display_order`   = VALUES(`display_order`),
  `category_id`     = VALUES(`category_id`),
  `sub_category_id` = VALUES(`sub_category_id`),
  `featured_image`  = VALUES(`featured_image`),
  `updated_at`      = VALUES(`updated_at`);

-- =============================================================
-- I18N – @NEWS_AQUATHERM_BAKU_2025 (TR/EN/DE)
-- content: JSON_OBJECT('html', '...') formatı
-- tags: CSV string
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
  @NEWS_AQUATHERM_BAKU_2025,
  'tr',
  'Aquatherm Bakü Fuarını Başarıyla Tamamladık!',
  'aquatherm-baku-fuarini-basarili-tamamladik',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Aquatherm Bakü 2025 Fuarı’nı başarıyla tamamlamanın mutluluğunu yaşıyoruz! ',
      'Fuarda, sektöre sunduğumuz yenilikçi ürün ve çözümlerimiz büyük ilgi gördü. ',
      'Bakü''de ülkemizi ve şirketimizi temsil ederek, hem yeni iş bağlantıları kurduk hem de mevcut müşterilerimizle ',
      'bir araya gelme fırsatı yakaladık.</p>',
      '<p>Fuarda standımızı ziyaret eden tüm misafirlerimize, değerli müşterilerimize ve Bakü’deki temsilcilerimize teşekkür ediyoruz. ',
      'ENSOTEK olarak, uluslararası platformlarda sektörümüzü ve ülkemizi en iyi şekilde temsil etmeye devam edeceğiz.</p>',
      '<p>Daha fazla bilgi için ',
      '<a href="https://www.aquatherm.az/" target="_blank" rel="noopener noreferrer">Aquatherm Bakü Fuarı web sitesi</a> ',
      'adresini ziyaret edebilirsiniz.</p>'
    )
  ),
  'Aquatherm Bakü 2025 Fuarı''nda büyük ilgiyle karşılandık. Standımızı ziyaret eden değerli müşterilerimize ve Bakü''deki temsilcilerimize teşekkür ederiz.',
  'Aquatherm Bakü 2025 fuarında ENSOTEK standı ve ziyaretçiler',
  'Aquatherm Bakü 2025 Fuarını Başarıyla Tamamladık! | Ensotek',
  'ENSOTEK, Aquatherm Bakü 2025 Fuarı’ndaki başarılı katılımını tamamladı. Standımızda yenilikçi ürün ve çözümlerimizi tanıttık; yeni iş bağlantıları kurduk ve mevcut müşterilerimizle buluştuk.',
  'ensotek,fuar,aquatherm,baku,bakü,etkinlik,uluslararasi,duyuru',
  '2025-07-19 17:20:06.428',
  '2025-07-19 20:51:33.294'
),

-- -------------------------------------------------------------
-- EN
-- -------------------------------------------------------------
(
  UUID(),
  @NEWS_AQUATHERM_BAKU_2025,
  'en',
  'We Successfully Completed the Aquatherm Baku Fair!',
  'we-successfully-completed-the-aquatherm-baku-fair',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>We are pleased to announce the successful completion of the Aquatherm Baku 2025 Fair! ',
      'Our stand attracted significant attention with our innovative products and solutions. ',
      'Representing our country and company in Baku, we established new business connections and had the opportunity ',
      'to meet our existing clients.</p>',
      '<p>We would like to thank all our guests, valued customers, and our representatives in Baku who visited our stand. ',
      'As ENSOTEK, we will continue to represent our industry and country on international platforms in the best way possible.</p>',
      '<p>For more information, please visit the ',
      '<a href="https://www.aquatherm.az/" target="_blank" rel="noopener noreferrer">Aquatherm Baku Fair website</a>.</p>'
    )
  ),
  'We received great interest at the Aquatherm Baku 2025 Fair. We thank our valued customers and representatives in Baku who visited our stand.',
  'ENSOTEK stand at Aquatherm Baku 2025 with visitors',
  'Aquatherm Baku 2025: Successfully Completed | Ensotek',
  'ENSOTEK successfully completed the Aquatherm Baku 2025 Fair, presenting innovative products and solutions, building new business connections, and meeting with existing clients. Visit the official fair website for details.',
  'ensotek,fair,aquatherm,baku,event,international,announcement',
  '2025-07-19 17:20:06.428',
  '2025-07-19 20:51:33.294'
),

-- -------------------------------------------------------------
-- DE
-- -------------------------------------------------------------
(
  UUID(),
  @NEWS_AQUATHERM_BAKU_2025,
  'de',
  'Wir haben die Aquatherm Baku Messe erfolgreich abgeschlossen!',
  'aquatherm-baku-messe-erfolgreich-abgeschlossen',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Wir freuen uns, die erfolgreiche Teilnahme an der Aquatherm Baku 2025 Messe bekannt zu geben! ',
      'Unser Stand erregte mit unseren innovativen Produkten und Lösungen großes Interesse. ',
      'In Baku haben wir unser Land und unser Unternehmen vertreten, neue Geschäftskontakte geknüpft und ',
      'bestehende Kunden getroffen.</p>',
      '<p>Wir danken allen Gästen, unseren geschätzten Kunden und unseren Vertretern in Baku für ihren Besuch an unserem Stand. ',
      'Als ENSOTEK werden wir unsere Branche und unser Land weiterhin bestmöglich auf internationalen Plattformen repräsentieren.</p>',
      '<p>Weitere Informationen finden Sie auf der ',
      '<a href="https://www.aquatherm.az/" target="_blank" rel="noopener noreferrer">Aquatherm Baku Messe-Website</a>.</p>'
    )
  ),
  'Wir wurden auf der Aquatherm Baku 2025 Messe mit großem Interesse empfangen. Wir danken unseren geschätzten Kunden und Vertretern in Baku, die unseren Stand besucht haben.',
  'ENSOTEK Messestand auf der Aquatherm Baku 2025',
  'Aquatherm Baku 2025: Erfolgreich abgeschlossen | Ensotek',
  'ENSOTEK hat die Aquatherm Baku 2025 Messe erfolgreich abgeschlossen. Wir präsentierten innovative Produkte und Lösungen, knüpften neue Kontakte und trafen bestehende Kunden. Weitere Informationen auf der offiziellen Website.',
  'ensotek,messe,aquatherm,baku,veranstaltung,international,ankündigung',
  '2025-07-19 17:20:06.428',
  '2025-07-19 20:51:33.294'
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

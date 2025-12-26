-- =============================================================
-- FILE: 052.1_custom_pages_news_egypt_hvacr_2025.seed.sql
-- NEWS – custom_pages + custom_pages_i18n
-- Yeni haber: “Mısır HVAC-R Fuarını Başarıyla Tamamladık!”
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
SET @NEWS_EGYPT_HVACR_2025 := '22220003-2222-4222-8222-222222220003';

/* FEATURED IMAGE (Cloudinary) – ilk görseli featured yaptık */
SET @IMG_NEWS_EGYPT_HVACR_2025 :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958173/uploads/metahub/news-images/img-20240515-wa0024-1752958172130-54632362.webp';

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
    @NEWS_EGYPT_HVACR_2025,
    1,
    102,
    @IMG_NEWS_EGYPT_HVACR_2025,
    NULL,
    @CAT_NEWS_DUYS,
    @SUB_NEWS_GENERAL_ANN,
    '2025-07-19 17:20:06.428',
    '2025-07-19 20:49:51.752'
  )
ON DUPLICATE KEY UPDATE
  `is_published`    = VALUES(`is_published`),
  `display_order`   = VALUES(`display_order`),
  `category_id`     = VALUES(`category_id`),
  `sub_category_id` = VALUES(`sub_category_id`),
  `featured_image`  = VALUES(`featured_image`),
  `updated_at`      = VALUES(`updated_at`);

-- =============================================================
-- I18N – @NEWS_EGYPT_HVACR_2025 (TR/EN/DE)
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
  @NEWS_EGYPT_HVACR_2025,
  'de',
  'Mısır HVAC-R Fuarını Başarıyla Tamamladık!',
  'misir-hvacr-fuarini-basarili-tamamladik',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>ENSOTEK olarak, Mısır HVAC-R 2025 Fuarı’nı başarıyla tamamlamanın gururunu yaşıyoruz! ',
      'Fuar süresince Kahire, İskenderiye ve farklı şehirlerden gelen ziyaretçilerimize soğutma kulelerimiz ',
      've sektördeki yenilikçi çözümlerimiz hakkında detaylı bilgi verdik.</p>',
      '<p>Uluslararası pazarda büyümeye devam ederken, yeni iş bağlantıları kurmanın ve mevcut müşterilerimizle ',
      'ilişkilerimizi güçlendirmenin mutluluğunu yaşadık.</p>',
      '<p>Fuar boyunca standımızı ziyaret eden ve ürünlerimize ilgi gösteren tüm misafirlerimize içten teşekkür ederiz. ',
      'ENSOTEK olarak, global çözümler sunmaya ve sektörümüzde öncü olmaya devam edeceğiz.</p>',
      '<p>Daha fazla bilgi için <a href="https://www.hvacrexpo.com.eg/" target="_blank" rel="noopener noreferrer">Egypt HVAC-R Fuarı web sitesi</a> adresini ziyaret edebilirsiniz.</p>'
    )
  ),
  'Mısır HVAC-R 2025 Fuarı’nda standımıza gösterilen yoğun ilgi için teşekkür ederiz. Kahire, İskenderiye ve farklı şehirlerden gelen tüm ziyaretçilerimize minnettarız.',
  'Egypt HVAC-R 2025 fuarında ENSOTEK standı ve ziyaretçiler',
  'Mısır HVAC-R 2025 Fuarını Başarıyla Tamamladık! | Ensotek',
  'ENSOTEK, Egypt HVAC-R 2025 Fuarı’nı başarıyla tamamladı. Standımıza gösterilen ilgi için teşekkür eder, yeni iş bağlantıları ve global büyüme hedeflerimizi paylaşırız.',
  'ensotek,fuar,misir,hvacr,etkinlik,sogutma kuleleri,duyuru',
  '2025-07-19 17:20:06.428',
  '2025-07-19 20:49:51.752'
),

-- -------------------------------------------------------------
-- EN
-- -------------------------------------------------------------
(
  UUID(),
  @NEWS_EGYPT_HVACR_2025,
  'en',
  'We Successfully Completed the Egypt HVAC-R Fair!',
  'we-successfully-completed-the-egypt-hvacr-fair',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>As ENSOTEK, we are proud to have successfully completed the Egypt HVAC-R 2025 Fair! ',
      'During the event, we provided detailed information about our cooling towers and innovative solutions to visitors ',
      'from Cairo, Alexandria, and other cities.</p>',
      '<p>As we continue to grow in international markets, we are delighted to have established new business connections ',
      'and strengthened relationships with our existing clients.</p>',
      '<p>We sincerely thank all our guests who visited our stand and showed interest in our products throughout the fair. ',
      'ENSOTEK will continue to provide global solutions and remain a leader in our sector.</p>',
      '<p>For more information, please visit the ',
      '<a href="https://www.hvacrexpo.com.eg/" target="_blank" rel="noopener noreferrer">Egypt HVAC-R Fair website</a>.</p>'
    )
  ),
  'We would like to thank everyone who showed great interest in our stand at the Egypt HVAC-R 2025 Fair. We are grateful to all our visitors from Cairo, Alexandria, and various cities.',
  'ENSOTEK stand at Egypt HVAC-R 2025 with visitors',
  'Egypt HVAC-R 2025: Successfully Completed | Ensotek',
  'ENSOTEK successfully completed the Egypt HVAC-R 2025 Fair, sharing cooling tower solutions and strengthening international business connections. Visit the official fair website for details.',
  'ensotek,fair,egypt,hvacr,event,cooling towers,announcement',
  '2025-07-19 17:20:06.428',
  '2025-07-19 20:49:51.752'
),

-- -------------------------------------------------------------
-- DE
-- -------------------------------------------------------------
(
  UUID(),
  @NEWS_EGYPT_HVACR_2025,
  'de',
  'Wir haben die Egypt HVAC-R Messe erfolgreich abgeschlossen!',
  'egypt-hvacr-messe-erfolgreich-abgeschlossen',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Als ENSOTEK sind wir stolz darauf, die Egypt HVAC-R 2025 Messe erfolgreich abgeschlossen zu haben! ',
      'Während der Messe informierten wir Besucher aus Kairo, Alexandria und anderen Städten ausführlich über unsere ',
      'Kühltürme und innovativen Lösungen.</p>',
      '<p>Während wir auf internationalen Märkten weiter wachsen, freuen wir uns, neue Geschäftskontakte geknüpft ',
      'und bestehende Kundenbeziehungen gestärkt zu haben.</p>',
      '<p>Wir danken allen Gästen, die unseren Stand während der Messe besucht und Interesse an unseren Produkten gezeigt haben. ',
      'ENSOTEK wird weiterhin globale Lösungen anbieten und eine führende Rolle in der Branche einnehmen.</p>',
      '<p>Weitere Informationen finden Sie auf der ',
      '<a href="https://www.hvacrexpo.com.eg/" target="_blank" rel="noopener noreferrer">Website der Egypt HVAC-R Messe</a>.</p>'
    )
  ),
  'Wir danken allen, die auf der Egypt HVAC-R 2025 Messe großes Interesse an unserem Stand gezeigt haben. Wir sind dankbar für alle Besucher aus Kairo, Alexandria und verschiedenen Städten.',
  'ENSOTEK Messestand auf der Egypt HVAC-R 2025',
  'Egypt HVAC-R 2025: Erfolgreich abgeschlossen | Ensotek',
  'ENSOTEK hat die Egypt HVAC-R 2025 Messe erfolgreich abgeschlossen. Wir präsentierten unsere Kühlturm-Lösungen, knüpften neue Kontakte und stärkten bestehende Kundenbeziehungen.',
  'ensotek,messe,ägypten,hvacr,veranstaltung,kühltürme,ankündigung',
  '2025-07-19 17:20:06.428',
  '2025-07-19 20:49:51.752'
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

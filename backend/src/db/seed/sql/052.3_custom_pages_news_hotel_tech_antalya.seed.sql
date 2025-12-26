-- =============================================================
-- FILE: 052.3_custom_pages_news_hotel_tech_antalya.seed.sql
-- NEWS – custom_pages + custom_pages_i18n
-- Yeni haber: “Hotel-Tech Antalya Fuarını Başarıyla Tamamladık!”
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
SET @NEWS_HOTEL_TECH_ANTALYA := '22220005-2222-4222-8222-222222220005';

/* FEATURED IMAGE (Cloudinary) – ilk görseli featured yaptık */
SET @IMG_NEWS_HOTEL_TECH_ANTALYA :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752958400/uploads/metahub/news-images/img-20250618-wa0022-1752958399182-621396987.webp';

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
    @NEWS_HOTEL_TECH_ANTALYA,
    1,
    104,
    @IMG_NEWS_HOTEL_TECH_ANTALYA,
    NULL,
    @CAT_NEWS_DUYS,
    @SUB_NEWS_GENERAL_ANN,
    '2025-07-19 17:20:06.428',
    '2025-07-19 20:53:23.466'
  )
ON DUPLICATE KEY UPDATE
  `is_published`    = VALUES(`is_published`),
  `display_order`   = VALUES(`display_order`),
  `category_id`     = VALUES(`category_id`),
  `sub_category_id` = VALUES(`sub_category_id`),
  `featured_image`  = VALUES(`featured_image`),
  `updated_at`      = VALUES(`updated_at`);

-- =============================================================
-- I18N – @NEWS_HOTEL_TECH_ANTALYA (TR/EN/DE)
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
  @NEWS_HOTEL_TECH_ANTALYA,
  'de',
  'Hotel-Tech Antalya Fuarını Başarıyla Tamamladık!',
  'hotel-tech-antalya-fuarini-basarili-tamamladik',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p><strong>Hotel-Tech Antalya</strong> fuarı; yeni inşa edeceğiniz ya da mevcut otelinizin tüm teknik ihtiyaçlarını bir arada görebileceğiniz dünyadaki tek fuardır. ',
      'Katılımcı profili itibarıyla otel ve tatil köyleri, inşaat firmaları, toplu konutlar, hastaneler, okul ve yurtlar için gerekli altyapı malzemelerini “Dünya Markaları” ile bir arada bulabileceksiniz. ',
      'Aynı zamanda B2B görüşmelerin yapıldığı bu fuarda, yeni teknolojiler ve ürünlerin anlatıldığı eğitim seminerleriyle son gelişmeleri yakalayabilirsiniz.</p>',
      '<p>Otel yöneticileri, makina, elektrik, inşaat, çevre ve kimya mühendisleri ile sektör profesyonellerini katılımcılarımızla buluşturuyoruz. ',
      'Hotel-Tech Antalya olarak yılların deneyimine sahip bir ekip olarak, katılımcı ve ziyaretçilerimizin beklentilerini biliyor ve karşılıyoruz. ',
      'Katılımcı firma ve kuruluşlarımızın çeşitliliği, kalitesi ve başarısı bunun en güzel göstergesidir.</p>',
      '<p>Fuar web sitesi için ',
      '<a href="https://www.hoteltechantalya.com/" target="_blank" rel="noopener noreferrer">tıklayınız</a>.</p>'
    )
  ),
  'Hotel-Tech Antalya Fuarı''nı başarıyla tamamladık. Standımızı ziyaret eden tüm müşterilerimize teşekkür ederiz.',
  'Hotel-Tech Antalya fuarında ENSOTEK standı ve ziyaretçiler',
  'Hotel-Tech Antalya Fuarını Başarıyla Tamamladık! | Ensotek',
  'ENSOTEK, Hotel-Tech Antalya fuar katılımını başarıyla tamamladı. Fuarda otel ve tesislerin teknik ihtiyaçlarına yönelik çözümler, B2B görüşmeler ve yeni teknolojilere dair seminerler öne çıktı. Detaylar için fuarın resmi web sitesini ziyaret edin.',
  'ensotek,fuar,hotel-tech,antalya,etkinlik,teknoloji,duyuru,b2b',
  '2025-07-19 17:20:06.428',
  '2025-07-19 20:53:23.466'
),

-- -------------------------------------------------------------
-- EN
-- -------------------------------------------------------------
(
  UUID(),
  @NEWS_HOTEL_TECH_ANTALYA,
  'en',
  'We Successfully Completed the Hotel-Tech Antalya Fair!',
  'we-successfully-completed-the-hotel-tech-antalya-fair',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p><strong>Hotel-Tech Antalya</strong> is the only fair in the world where you can find all the technical needs of your new or existing hotel in one place. ',
      'With its participant profile, you will find infrastructure materials required for hotels, holiday resorts, construction companies, mass housing, hospitals, schools, and dormitories together with “World Brands”. ',
      'At this fair, where B2B meetings take place, educational seminars on new technologies and products will keep you updated with the latest developments.</p>',
      '<p>We bring together hotel managers, mechanical, electrical, civil, environmental and chemical engineers, and sector professionals with our participants. ',
      'As Hotel-Tech Antalya, our experienced team understands the expectations of both participants and visitors. ',
      'The diversity, quality, capabilities, and success of our participant companies and institutions are the best proof of this.</p>',
      '<p><a href="https://www.hoteltechantalya.com/" target="_blank" rel="noopener noreferrer">Click here</a> for the fair website.</p>'
    )
  ),
  'We successfully completed the Hotel-Tech Antalya Fair. We thank all our customers who visited our stand.',
  'ENSOTEK stand at Hotel-Tech Antalya with visitors',
  'Hotel-Tech Antalya: Successfully Completed | Ensotek',
  'ENSOTEK successfully completed its participation at Hotel-Tech Antalya. The event brings together hotel decision-makers and engineering professionals for B2B meetings, infrastructure solutions, and seminars on new technologies. Visit the official fair website for details.',
  'ensotek,fair,hotel-tech,antalya,event,technology,announcement,b2b',
  '2025-07-19 17:20:06.428',
  '2025-07-19 20:53:23.466'
),

-- -------------------------------------------------------------
-- DE
-- -------------------------------------------------------------
(
  UUID(),
  @NEWS_HOTEL_TECH_ANTALYA,
  'de',
  'Wir haben die Hotel-Tech Antalya Messe erfolgreich abgeschlossen!',
  'hotel-tech-antalya-messe-erfolgreich-abgeschlossen',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Die <strong>Hotel-Tech Antalya</strong> Messe ist die einzige Messe weltweit, auf der Sie alle technischen Anforderungen für Ihr neues oder bestehendes Hotel an einem Ort finden können. ',
      'Das Teilnehmerprofil umfasst Hotels und Resorts, Bauunternehmen, Wohnanlagen, Krankenhäuser, Schulen und Wohnheime, die alle notwendigen Infrastrukturmaterialien zusammen mit „Weltmarken“ entdecken können. ',
      'Auf dieser Messe, bei der auch B2B-Meetings stattfinden, halten Sie Seminare zu neuen Technologien und Produkten auf dem neuesten Stand.</p>',
      '<p>Wir bringen Hotelmanager, Maschinenbau-, Elektro-, Bau-, Umwelt- und Chemieingenieure sowie Branchenprofis mit unseren Teilnehmern zusammen. ',
      'Als Hotel-Tech Antalya verfügen wir über jahrelange Erfahrung und kennen die Erwartungen der Teilnehmer und Besucher. ',
      'Die Vielfalt, Qualität und der Erfolg unserer Teilnehmer sind der beste Beweis dafür.</p>',
      '<p>Für die Messe-Website ',
      '<a href="https://www.hoteltechantalya.com/" target="_blank" rel="noopener noreferrer">hier klicken</a>.</p>'
    )
  ),
  'Wir haben die Hotel-Tech Antalya Messe erfolgreich abgeschlossen. Wir danken allen Kunden, die unseren Stand besucht haben.',
  'ENSOTEK Messestand auf der Hotel-Tech Antalya mit Besuchern',
  'Hotel-Tech Antalya: Erfolgreich abgeschlossen | Ensotek',
  'ENSOTEK hat die Teilnahme an der Hotel-Tech Antalya erfolgreich abgeschlossen. Die Messe vereint Entscheider aus der Hotellerie und Ingenieurwesen für B2B-Gespräche, Infrastruktur-Lösungen sowie Seminare zu neuen Technologien und Produkten. Weitere Informationen auf der offiziellen Website.',
  'ensotek,messe,hotel-tech,antalya,veranstaltung,technologie,ankündigung,b2b',
  '2025-07-19 17:20:06.428',
  '2025-07-19 20:53:23.466'
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

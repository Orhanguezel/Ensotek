-- =============================================================
-- FILE: 051_custom_pages_about.seed.sql (FINAL)
-- Ensotek Kurumsal Sayfaları – Hakkımızda
-- ✅ module_key artık PARENT: custom_pages.module_key = 'about'
-- categories + sub_categories ile ilişkili
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- -------------------------------------------------------------
-- SABİT SAYFA ID (custom_pages.id)
-- -------------------------------------------------------------
SET @PAGE_ABOUT := '11111111-2222-3333-4444-555555555573';

-- -------------------------------------------------------------
-- PARENT MODULE KEY
-- -------------------------------------------------------------
SET @MODULE_KEY := 'about';

-- -------------------------------------------------------------
-- KATEGORİ & ALT KATEGORİ
-- -------------------------------------------------------------
SET @CAT_ABOUT_ROOT := 'aaaa7001-1111-4111-8111-aaaaaaaa7001';
SET @SUB_ABOUT_PAGE := 'bbbb7001-1111-4111-8111-bbbbbbbb7001'; -- Hakkımızda

-- -------------------------------------------------------------
-- GÖRSEL URL’LERİ
-- -------------------------------------------------------------
SET @IMG_ABOUT_MAIN :=
  'https://res.cloudinary.com/dbozv7wqd/image/upload/v1752786288/uploads/metahub/about-images/closed-circuit-water-cooling-towers1-1752786287184-840184158.webp';
SET @IMG_ABOUT_2 :=
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';
SET @IMG_ABOUT_3 :=
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80';

-- -------------------------------------------------------------
-- PARENT UPSERT (custom_pages)
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
    @PAGE_ABOUT,
    @MODULE_KEY,
    1,
    30,
    30,
    @IMG_ABOUT_MAIN,
    NULL,
    @IMG_ABOUT_MAIN,
    NULL,
    JSON_ARRAY(
      @IMG_ABOUT_MAIN,
      @IMG_ABOUT_2,
      @IMG_ABOUT_3
    ),
    JSON_ARRAY(),
    @CAT_ABOUT_ROOT,
    @SUB_ABOUT_PAGE,
    NOW(3),
    NOW(3)
  )
ON DUPLICATE KEY UPDATE
  `module_key`               = VALUES(`module_key`),
  `is_published`             = VALUES(`is_published`),
  `display_order`            = VALUES(`display_order`),
  `order_num`                = VALUES(`order_num`),
  `featured_image`           = VALUES(`featured_image`),
  `featured_image_asset_id`  = VALUES(`featured_image_asset_id`),
  `image_url`                = VALUES(`image_url`),
  `storage_asset_id`         = VALUES(`storage_asset_id`),
  `images`                   = VALUES(`images`),
  `storage_image_ids`        = VALUES(`storage_image_ids`),
  `category_id`              = VALUES(`category_id`),
  `sub_category_id`          = VALUES(`sub_category_id`),
  `updated_at`               = VALUES(`updated_at`);

-- -------------------------------------------------------------
-- I18N UPSERT – TR / EN / DE
-- ✅ module_key kolonu YOK
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
  UUID(),
  @PAGE_ABOUT,
  'tr',
  'Ensotek Su Soğutma Kuleleri',
  'ensotek-su-sogutma-kuleleri',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Ensotek, 40 yıllık deneyimiyle İstanbul Merkez Ofis ve Ankara Fabrikası''nda uzman kadrosu ile su soğutma kuleleri alanında hizmet vermektedir. ',
      'Firmamız, Türkiye''nin en büyük su soğutma kulesi üretim tesisine sahiptir.</p>',
      '<p>Cam elyaf takviyeli polyester (FRP) malzemeden, korozyona dayanıklı, boyasız, uzun ömürlü, bakımı kolay ve düşük yatırım/işletme maliyetli açık ve kapalı devre su soğutma kuleleri üretmekteyiz.</p>',
      '<p>Hem yurt içinde hem de yurt dışında binlerce projede başarılı çözümler ürettik. En iyi reklamın ürünün kendisi olduğu prensibiyle, müşterilerimizin tekrar tekrar bizi tercih etmesini ve her seferinde memnun kalmasını hedefliyoruz.</p>',
      '<p>Ar-Ge faaliyetlerimiz ve müşteri geri bildirimleriyle ürünlerimizi sürekli geliştiriyor, Türkiye içinde ve dışında örnek bir firma konumunda yer alıyoruz. ',
      'Ensotek, CTI (Cooling Technology Institute) ve SOSIAD üyesidir; üretim sistemimiz ISO-9001:2015 ile belgelenmiştir ve ürünlerimiz CE belgelidir.</p>'
    )
  ),
  'Ensotek''in 40 yıllık deneyimi, FRP su soğutma kuleleri üretimi ve ulusal/uluslararası projelerdeki lider konumu özetlenir.',
  'Ensotek su soğutma kuleleri üretim tesisi',
  'Ensotek Su Soğutma Kuleleri | 40 Yıllık Deneyim',
  'Ensotek, 40 yıllık deneyimi ve Türkiye''nin en büyük su soğutma kulesi üretim tesisiyle FRP açık ve kapalı devre soğutma kuleleri sunan sektör lideridir.',
  'ensotek,hakkimizda,frp,su sogutma kuleleri,uretim tesisi',
  NOW(3),
  NOW(3)
),
-- EN
(
  UUID(),
  @PAGE_ABOUT,
  'en',
  'Ensotek Water Cooling Towers',
  'ensotek-water-cooling-towers',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Ensotek serves its customers from its Istanbul Headquarters and Ankara Factory with an expert team and over 40 years of experience in water cooling towers. ',
      'Our company owns the largest water cooling tower production facility in Turkey.</p>',
      '<p>Ensotek manufactures open and closed circuit water cooling towers made from Fiberglass Reinforced Polyester (FRP), which are corrosion resistant, long-lasting, easy to maintain and offer low investment and operating costs.</p>',
      '<p>We have delivered successful solutions in thousands of projects both in Turkey and abroad. ',
      'With the principle that the best advertisement is the product itself, we aim for our customers to work with us repeatedly and be satisfied every time.</p>',
      '<p>Through continuous R&amp;D activities and customer feedback, we keep improving our products and have become an exemplary company in Turkey and worldwide. ',
      'Ensotek is a member of CTI (Cooling Technology Institute) and SOSIAD; our production system is certified with ISO-9001:2015 and our products are CE marked.</p>'
    )
  ),
  'Summarizes Ensotek''s 40 years of experience, FRP water cooling tower production and leading position in global projects.',
  'Ensotek water cooling tower production facility',
  'Ensotek Water Cooling Towers | 40 Years of Experience',
  'Ensotek is the sector leader with Turkey''s largest water cooling tower production facility, delivering FRP open and closed circuit cooling towers for projects worldwide.',
  'ensotek,about us,frp,water cooling towers,production facility',
  NOW(3),
  NOW(3)
),
-- DE
(
  UUID(),
  @PAGE_ABOUT,
  'de',
  'Ensotek Wasserkühltürme',
  'ensotek-wasserkuehltuerme',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Ensotek betreut seine Kunden mit über 40 Jahren Erfahrung und einem erfahrenen Expertenteam vom Hauptsitz in Istanbul sowie dem Werk in Ankara im Bereich Wasserkühltürme. ',
      'Unser Unternehmen verfügt über die größte Produktionsanlage für Wasserkühltürme in der Türkei.</p>',
      '<p>Wir fertigen offene und geschlossene Wasserkühltürme aus glasfaserverstärktem Polyester (GFK/FRP) – korrosionsbeständig, unlackiert, langlebig, wartungsfreundlich und mit niedrigen Investitions- und Betriebskosten.</p>',
      '<p>Wir haben in der Türkei und im Ausland in tausenden Projekten erfolgreiche Lösungen umgesetzt. ',
      'Nach dem Prinzip, dass das beste Marketing das Produkt selbst ist, möchten wir, dass unsere Kunden uns immer wieder wählen und jedes Mal zufrieden sind.</p>',
      '<p>Durch kontinuierliche F&amp;E-Aktivitäten und Kundenfeedback verbessern wir unsere Produkte fortlaufend und zählen zu den beispielgebenden Unternehmen in der Türkei und international. ',
      'Ensotek ist Mitglied des CTI (Cooling Technology Institute) und der SOSIAD; unser Produktionssystem ist nach ISO-9001:2015 zertifiziert und unsere Produkte sind CE-gekennzeichnet.</p>'
    )
  ),
  'Zusammenfassung von Ensoteks über 40 Jahren Erfahrung, der FRP/GFK-Produktion und der führenden Rolle in nationalen und internationalen Projekten.',
  'Produktionsanlage für Ensotek Wasserkühltürme',
  'Ensotek Wasserkühltürme | Über 40 Jahre Erfahrung',
  'Ensotek ist Branchenführer mit der größten Produktionsanlage für Wasserkühltürme in der Türkei und liefert FRP/GFK-Kühlturm-Lösungen für Projekte weltweit.',
  'ensotek,über uns,gfk,frp,wasserkühltürme,produktionsanlage',
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

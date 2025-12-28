-- =============================================================
-- FILE: 051.2_custom_pages_vision.seed.sql (FINAL) (IMAGELESS)
-- Ensotek Kurumsal Sayfaları – Vizyon
-- ✅ module_key PARENT: custom_pages.module_key = 'vision'
-- ✅ featured_image / images temizlendi (icon-first tasarım için)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

SET @PAGE_VISION := '11111111-2222-3333-4444-555555555572';
SET @MODULE_KEY := 'vision';

SET @CAT_ABOUT_ROOT := 'aaaa7001-1111-4111-8111-aaaaaaaa7001';
SET @SUB_VISION     := 'bbbb7003-1111-4111-8111-bbbbbbbb7003';

-- -------------------------------------------------------------
-- PARENT UPSERT (custom_pages) — IMAGELESS
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
    @PAGE_VISION,
    @MODULE_KEY,
    1,
    20,
    20,
    NULL,
    NULL,
    NULL,
    NULL,
    JSON_ARRAY(),
    JSON_ARRAY(),
    @CAT_ABOUT_ROOT,
    @SUB_VISION,
    NOW(3),
    NOW(3)
  )
ON DUPLICATE KEY UPDATE
  `module_key`              = VALUES(`module_key`),
  `is_published`            = VALUES(`is_published`),
  `display_order`           = VALUES(`display_order`),
  `order_num`               = VALUES(`order_num`),
  `featured_image`          = VALUES(`featured_image`),
  `featured_image_asset_id` = VALUES(`featured_image_asset_id`),
  `image_url`               = VALUES(`image_url`),
  `storage_asset_id`        = VALUES(`storage_asset_id`),
  `images`                  = VALUES(`images`),
  `storage_image_ids`       = VALUES(`storage_image_ids`),
  `category_id`             = VALUES(`category_id`),
  `sub_category_id`         = VALUES(`sub_category_id`),
  `updated_at`              = VALUES(`updated_at`);

-- -------------------------------------------------------------
-- I18N UPSERT – TR / EN / DE
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
  @PAGE_VISION,
  'tr',
  'Vizyonumuz',
  'vizyonumuz',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>',
      'Vizyonumuz; müşteri memnuniyetini merkeze alarak, kaliteli, verimli ve sürdürülebilir çözümler sunmak; ',
      'ulusal ve uluslararası pazarda tercih edilen, güvenilir ve öncü bir marka olmaktır.',
      '</p>'
    )
  ),
  'Ensotek vizyonu: sürdürülebilir kalite ve güvenilir marka yaklaşımı.',
  NULL,
  'Vizyonumuz | Ensotek',
  'Müşteri memnuniyetini merkeze alan, sürdürülebilir kalite anlayışıyla hareket eden Ensotek vizyonu.',
  'ensotek,vizyon,surdurulebilir,kalite',
  NOW(3),
  NOW(3)
),

-- EN
(
  UUID(),
  @PAGE_VISION,
  'en',
  'Our Vision',
  'our-vision',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>',
      'Our vision is to prioritize customer satisfaction by delivering high-quality, efficient and sustainable solutions; ',
      'and to become a trusted and leading brand in national and international markets.',
      '</p>'
    )
  ),
  'Ensotek vision: sustainable quality and trusted brand approach.',
  NULL,
  'Our Vision | Ensotek',
  'Ensotek’s vision: customer-first approach with sustainable quality and leadership.',
  'ensotek,vision,sustainable,quality',
  NOW(3),
  NOW(3)
),

-- DE
(
  UUID(),
  @PAGE_VISION,
  'de',
  'Unsere Vision',
  'unsere-vision',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>',
      'Unsere Vision ist es, die Kundenzufriedenheit in den Mittelpunkt zu stellen, hochwertige, effiziente und nachhaltige Lösungen zu liefern ',
      'und eine bevorzugte, verlässliche und führende Marke auf nationalen und internationalen Märkten zu werden.',
      '</p>'
    )
  ),
  'Ensotek Vision: nachhaltige Qualität und verlässlicher Markenansatz.',
  NULL,
  'Unsere Vision | Ensotek',
  'Ensoteks Vision: kundenorientiert, nachhaltig und führend – mit Fokus auf Qualität.',
  'ensotek,vision,nachhaltig,qualität',
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

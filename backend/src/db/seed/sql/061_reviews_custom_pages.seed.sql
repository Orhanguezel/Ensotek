
-- =============================================================
-- FILE: 061_reviews_custom_pages.seed.sql
-- custom_pages için örnek review seed’leri (TR / EN / DE)
--  - DE: şimdilik Almanca içerik yazıldı (dile göre değişsin istedin)
-- =============================================================

SET NAMES utf8mb4;
START TRANSACTION;

-- -------------------------------------------------------------
-- PAGE ID’LERİ (051 & 053 ile uyumlu)
-- -------------------------------------------------------------
SET @PAGE_MISSION := '11111111-2222-3333-4444-555555555571';
SET @PAGE_VISION  := '11111111-2222-3333-4444-555555555572';
SET @PAGE_ABOUT   := '11111111-2222-3333-4444-555555555573';

SET @BLOG_MAINT_1 := '33330001-3333-4333-8333-333333330001';

-- =============================================================
-- REVIEW ID’LERİ (sabit)
-- =============================================================
SET @REV_MISSION_TR := '44440001-4444-4444-8444-444444440001';
SET @REV_MISSION_EN := '44440002-4444-4444-8444-444444440002';
SET @REV_MISSION_DE := '44440006-4444-4444-8444-444444440006';

SET @REV_ABOUT_TR   := '44440003-4444-4444-8444-444444440003';
SET @REV_ABOUT_EN   := '44440004-4444-4444-8444-444444440004';
SET @REV_ABOUT_DE   := '44440007-4444-4444-8444-444444440007';

SET @REV_BLOG_TR    := '44440005-4444-4444-8444-444444440005';
SET @REV_BLOG_EN    := '44440008-4444-4444-8444-444444440008';
SET @REV_BLOG_DE    := '44440009-4444-4444-8444-444444440009';

-- -------------------------------------------------------------
-- REVIEWS (parent)
-- target_type: 'custom_page'
-- -------------------------------------------------------------
INSERT INTO `reviews`
  (`id`, `target_type`, `target_id`,
   `name`, `email`,
   `rating`, `is_active`, `is_approved`, `display_order`,
   `likes_count`, `dislikes_count`, `helpful_count`,
   `submitted_locale`,
   `created_at`, `updated_at`)
VALUES
  -- Misyonumuz (TR)
  (
    @REV_MISSION_TR,
    'custom_page',
    @PAGE_MISSION,
    'Ahmet Yılmaz',
    'ahmet@example.com',
    5,
    1,
    1,
    10,
    3,
    0,
    3,
    'tr',
    NOW(3),
    NOW(3)
  ),
  -- Our Mission (EN)
  (
    @REV_MISSION_EN,
    'custom_page',
    @PAGE_MISSION,
    'John Doe',
    'john.doe@example.com',
    4,
    1,
    1,
    20,
    1,
    0,
    1,
    'en',
    NOW(3),
    NOW(3)
  ),
  -- Unsere Mission (DE)
  (
    @REV_MISSION_DE,
    'custom_page',
    @PAGE_MISSION,
    'Max Müller',
    'max.mueller@example.com',
    5,
    1,
    1,
    25,
    2,
    0,
    2,
    'de',
    NOW(3),
    NOW(3)
  ),
  -- Hakkımızda (TR)
  (
    @REV_ABOUT_TR,
    'custom_page',
    @PAGE_ABOUT,
    'Mehmet Kara',
    'mehmet.kara@example.com',
    5,
    1,
    1,
    30,
    5,
    0,
    5,
    'tr',
    NOW(3),
    NOW(3)
  ),
  -- About (EN)
  (
    @REV_ABOUT_EN,
    'custom_page',
    @PAGE_ABOUT,
    'Emily Smith',
    'emily.smith@example.com',
    5,
    1,
    1,
    40,
    2,
    0,
    2,
    'en',
    NOW(3),
    NOW(3)
  ),
  -- Über Ensotek (DE)
  (
    @REV_ABOUT_DE,
    'custom_page',
    @PAGE_ABOUT,
    'Anna Schneider',
    'anna.schneider@example.com',
    5,
    1,
    1,
    45,
    1,
    0,
    1,
    'de',
    NOW(3),
    NOW(3)
  ),
  -- Blog (TR)
  (
    @REV_BLOG_TR,
    'custom_page',
    @BLOG_MAINT_1,
    'Serkan Demir',
    'serkan.demir@example.com',
    4,
    1,
    1,
    50,
    0,
    0,
    0,
    'tr',
    NOW(3),
    NOW(3)
  ),
  -- Blog (EN)
  (
    @REV_BLOG_EN,
    'custom_page',
    @BLOG_MAINT_1,
    'Michael Brown',
    'michael.brown@example.com',
    4,
    1,
    1,
    55,
    0,
    0,
    0,
    'en',
    NOW(3),
    NOW(3)
  ),
  -- Blog (DE)
  (
    @REV_BLOG_DE,
    'custom_page',
    @BLOG_MAINT_1,
    'Paul Weber',
    'paul.weber@example.com',
    4,
    1,
    1,
    60,
    0,
    0,
    0,
    'de',
    NOW(3),
    NOW(3)
  )
ON DUPLICATE KEY UPDATE
  `target_type`      = VALUES(`target_type`),
  `target_id`        = VALUES(`target_id`),
  `name`             = VALUES(`name`),
  `email`            = VALUES(`email`),
  `rating`           = VALUES(`rating`),
  `is_active`        = VALUES(`is_active`),
  `is_approved`      = VALUES(`is_approved`),
  `display_order`    = VALUES(`display_order`),
  `likes_count`      = VALUES(`likes_count`),
  `dislikes_count`   = VALUES(`dislikes_count`),
  `helpful_count`    = VALUES(`helpful_count`),
  `submitted_locale` = VALUES(`submitted_locale`),
  `updated_at`       = VALUES(`updated_at`);

-- -------------------------------------------------------------
-- REVIEW I18N (dile göre içerik farklı)
-- - Her review için sadece kendi locale kaydı var (şimdilik).
-- -------------------------------------------------------------
INSERT INTO `review_i18n`
  (`id`, `review_id`, `locale`,
   `title`, `comment`, `admin_reply`,
   `created_at`, `updated_at`)
VALUES
  -- ============================
  -- MISSION (TR / EN / DE)
  -- ============================
  (
    UUID(),
    @REV_MISSION_TR,
    'tr',
    'Misyon metni çok net ve anlaşılır',
    'Ensotek''in misyon açıklaması, sektöre bakışını ve müşteri odaklı yaklaşımını çok net şekilde ortaya koyuyor.',
    NULL,
    NOW(3),
    NOW(3)
  ),
  (
    UUID(),
    @REV_MISSION_EN,
    'en',
    'Strong customer-oriented mission',
    'I really like how Ensotek puts customer satisfaction and efficiency at the center of its mission.',
    NULL,
    NOW(3),
    NOW(3)
  ),
  (
    UUID(),
    @REV_MISSION_DE,
    'de',
    'Klare und kundenorientierte Mission',
    'Die Mission ist verständlich formuliert und zeigt den Fokus auf Effizienz und Kundenzufriedenheit.',
    NULL,
    NOW(3),
    NOW(3)
  ),

  -- ============================
  -- ABOUT (TR / EN / DE)
  -- ============================
  (
    UUID(),
    @REV_ABOUT_TR,
    'tr',
    '40 yıllık deneyimi hissettiriyor',
    'Hakkımızda sayfasındaki bilgiler, firmanın sektörde ne kadar köklü ve tecrübeli olduğunu çok iyi anlatıyor.',
    NULL,
    NOW(3),
    NOW(3)
  ),
  (
    UUID(),
    @REV_ABOUT_EN,
    'en',
    'Impressive background',
    'The about page gives a very clear picture of Ensotek''s long-term experience and strong reference projects.',
    NULL,
    NOW(3),
    NOW(3)
  ),
  (
    UUID(),
    @REV_ABOUT_DE,
    'de',
    'Sehr überzeugender Unternehmenshintergrund',
    'Die „Über uns“-Seite vermittelt einen klaren Eindruck von Ensoteks Erfahrung und den starken Referenzprojekten.',
    NULL,
    NOW(3),
    NOW(3)
  ),

  -- ============================
  -- BLOG (TR / EN / DE)
  -- ============================
  (
    UUID(),
    @REV_BLOG_TR,
    'tr',
    'Bakım rehberi çok faydalı',
    'Periyodik bakım yazısı, sahadaki ekibimiz için kontrol listesi gibi kullanabileceğimiz pratik bilgiler içeriyor.',
    NULL,
    NOW(3),
    NOW(3)
  ),
  (
    UUID(),
    @REV_BLOG_EN,
    'en',
    'Very practical maintenance guide',
    'The periodic maintenance article provides actionable tips that can be used as a checklist by field teams.',
    NULL,
    NOW(3),
    NOW(3)
  ),
  (
    UUID(),
    @REV_BLOG_DE,
    'de',
    'Sehr hilfreicher Wartungsleitfaden',
    'Der Artikel zur regelmäßigen Wartung enthält praxisnahe Hinweise, die sich als Checkliste für Serviceteams nutzen lassen.',
    NULL,
    NOW(3),
    NOW(3)
  )
ON DUPLICATE KEY UPDATE
  `title`       = VALUES(`title`),
  `comment`     = VALUES(`comment`),
  `admin_reply` = VALUES(`admin_reply`),
  `updated_at`  = VALUES(`updated_at`);

COMMIT;

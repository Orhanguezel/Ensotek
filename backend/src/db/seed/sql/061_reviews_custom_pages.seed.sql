-- =============================================================
-- FILE: 061_reviews_custom_pages.seed.sql
-- custom_pages için örnek review seed’leri (TR / EN / DE)
-- DOĞRU i18n MODEL:
--   - reviews: parent (tek kayıt)
--   - review_i18n: (review_id + locale) ile TR/EN/DE çevirileri
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
-- REVIEW PARENT ID’LERİ (sabit)  ✅ 1 parent = 3 locale i18n
-- Not: Eski dosyada TR/EN/DE ayrı id’lerdi. Artık parent’lar tekil.
-- =============================================================
SET @REV_MISSION := '44440001-4444-4444-8444-444444440001';
SET @REV_ABOUT   := '44440003-4444-4444-8444-444444440003';
SET @REV_BLOG    := '44440005-4444-4444-8444-444444440005';

-- -------------------------------------------------------------
-- REVIEWS (parent)
-- target_type: 'custom_page'
-- submitted_locale: orijinal gönderim dili (örnek olarak 'tr' seçildi)
-- -------------------------------------------------------------
INSERT INTO `reviews`
  (`id`, `target_type`, `target_id`,
   `name`, `email`,
   `rating`, `is_active`, `is_approved`, `display_order`,
   `likes_count`, `dislikes_count`, `helpful_count`,
   `submitted_locale`,
   `created_at`, `updated_at`)
VALUES
  -- Mission page review (parent)
  (
    @REV_MISSION,
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
  -- About page review (parent)
  (
    @REV_ABOUT,
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
  -- Blog maintenance review (parent)
  (
    @REV_BLOG,
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
-- REVIEW I18N
-- ✅ Aynı review_id altında TR/EN/DE çeviriler
-- UNIQUE: (review_id, locale) çakışırsa UPDATE çalışır.
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
    @REV_MISSION,
    'tr',
    'Misyon metni çok net ve anlaşılır',
    'Ensotek''in misyon açıklaması, sektöre bakışını ve müşteri odaklı yaklaşımını çok net şekilde ortaya koyuyor.',
    NULL,
    NOW(3),
    NOW(3)
  ),
  (
    UUID(),
    @REV_MISSION,
    'en',
    'Strong customer-oriented mission',
    'I really like how Ensotek puts customer satisfaction and efficiency at the center of its mission.',
    NULL,
    NOW(3),
    NOW(3)
  ),
  (
    UUID(),
    @REV_MISSION,
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
    @REV_ABOUT,
    'tr',
    '40 yıllık deneyimi hissettiriyor',
    'Hakkımızda sayfasındaki bilgiler, firmanın sektörde ne kadar köklü ve tecrübeli olduğunu çok iyi anlatıyor.',
    NULL,
    NOW(3),
    NOW(3)
  ),
  (
    UUID(),
    @REV_ABOUT,
    'en',
    'Impressive background',
    'The about page gives a very clear picture of Ensotek''s long-term experience and strong reference projects.',
    NULL,
    NOW(3),
    NOW(3)
  ),
  (
    UUID(),
    @REV_ABOUT,
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
    @REV_BLOG,
    'tr',
    'Bakım rehberi çok faydalı',
    'Periyodik bakım yazısı, sahadaki ekibimiz için kontrol listesi gibi kullanabileceğimiz pratik bilgiler içeriyor.',
    NULL,
    NOW(3),
    NOW(3)
  ),
  (
    UUID(),
    @REV_BLOG,
    'en',
    'Very practical maintenance guide',
    'The periodic maintenance article provides actionable tips that can be used as a checklist by field teams.',
    NULL,
    NOW(3),
    NOW(3)
  ),
  (
    UUID(),
    @REV_BLOG,
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

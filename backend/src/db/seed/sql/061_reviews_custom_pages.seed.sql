-- =============================================================
-- FILE: 061_reviews_custom_pages.seed.sql  (FIXED)
-- custom_pages için örnek review seed’leri (TR / EN / DE)
-- KONU: Ensotek – Soğutma Kuleleri (Cooling Towers)
-- MODEL:
--   - reviews: parent
--   - review_i18n: (review_id + locale) UNIQUE önerilir
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

-- -------------------------------------------------------------
-- PAGE ID’LERİ (051 & 053 ile uyumlu)
-- -------------------------------------------------------------
SET @PAGE_MISSION := '11111111-2222-3333-4444-555555555571';
SET @PAGE_VISION  := '11111111-2222-3333-4444-555555555572';
SET @PAGE_ABOUT   := '11111111-2222-3333-4444-555555555573';

SET @BLOG_MAINT_1 := '33330001-3333-4333-8333-333333330001';

-- -------------------------------------------------------------
-- SOĞUTMA KULELERİ: custom_page ID’leri (örnek)
-- -------------------------------------------------------------
SET @PAGE_COOLING_TOWERS        := '11111111-2222-3333-4444-555555555581';
SET @PAGE_COOLING_TOWER_TYPES   := '11111111-2222-3333-4444-555555555582';
SET @PAGE_COOLING_TOWER_MAINT   := '11111111-2222-3333-4444-555555555583';
SET @PAGE_COOLING_TOWER_PROJECT := '11111111-2222-3333-4444-555555555584';

-- =============================================================
-- REVIEW PARENT ID’LERİ (sabit) ✅ 1 parent = 3 locale i18n
-- =============================================================
SET @REV_MISSION := '44440001-4444-4444-8444-444444440001';
SET @REV_ABOUT   := '44440003-4444-4444-8444-444444440003';
SET @REV_BLOG    := '44440005-4444-4444-8444-444444440005';

-- SOĞUTMA KULELERİ review parent’ları
SET @REV_CT_OVERVIEW  := '44440011-4444-4444-8444-444444440011';
SET @REV_CT_TYPES     := '44440012-4444-4444-8444-444444440012';
SET @REV_CT_MAINT     := '44440013-4444-4444-8444-444444440013';
SET @REV_CT_PROJECTS  := '44440014-4444-4444-8444-444444440014';
SET @REV_CT_NOISE     := '44440015-4444-4444-8444-444444440015';
SET @REV_CT_WATER     := '44440016-4444-4444-8444-444444440016';

-- -------------------------------------------------------------
-- REVIEWS (parent)
-- target_type: 'custom_page'
-- submitted_locale: demo amaçlı doğru dile set edildi
-- -------------------------------------------------------------
INSERT INTO `reviews`
  (`id`, `target_type`, `target_id`,
   `name`, `email`,
   `rating`, `is_active`, `is_approved`, `display_order`,
   `likes_count`, `dislikes_count`, `helpful_count`,
   `submitted_locale`,
   `created_at`, `updated_at`)
VALUES
  (
    @REV_MISSION, 'custom_page', @PAGE_MISSION,
    'Ahmet Yılmaz', 'ahmet@example.com',
    5, 1, 1, 10,
    3, 0, 3,
    'tr',
    NOW(3), NOW(3)
  ),
  (
    @REV_ABOUT, 'custom_page', @PAGE_ABOUT,
    'Mehmet Kara', 'mehmet.kara@example.com',
    5, 1, 1, 30,
    5, 0, 5,
    'tr',
    NOW(3), NOW(3)
  ),
  (
    @REV_BLOG, 'custom_page', @BLOG_MAINT_1,
    'Serkan Demir', 'serkan.demir@example.com',
    4, 1, 1, 50,
    0, 0, 0,
    'tr',
    NOW(3), NOW(3)
  ),
  (
    @REV_CT_OVERVIEW, 'custom_page', @PAGE_COOLING_TOWERS,
    'Murat Akın', 'murat.akin@example.com',
    5, 1, 1, 110,
    7, 0, 6,
    'tr',
    NOW(3), NOW(3)
  ),
  (
    @REV_CT_TYPES, 'custom_page', @PAGE_COOLING_TOWER_TYPES,
    'Elif Şahin', 'elif.sahin@example.com',
    5, 1, 1, 120,
    4, 0, 4,
    'tr',
    NOW(3), NOW(3)
  ),
  (
    @REV_CT_MAINT, 'custom_page', @PAGE_COOLING_TOWER_MAINT,
    'Kemal Öz', 'kemal.oz@example.com',
    4, 1, 1, 130,
    2, 0, 2,
    'tr',
    NOW(3), NOW(3)
  ),
  (
    @REV_CT_PROJECTS, 'custom_page', @PAGE_COOLING_TOWER_PROJECT,
    'Zeynep Kılıç', 'zeynep.kilic@example.com',
    5, 1, 1, 140,
    3, 0, 3,
    'tr',
    NOW(3), NOW(3)
  ),
  (
    @REV_CT_NOISE, 'custom_page', @PAGE_COOLING_TOWERS,
    'Tolga Demir', 'tolga.demir@example.com',
    5, 1, 1, 150,
    1, 0, 1,
    'tr',
    NOW(3), NOW(3)
  ),
  (
    @REV_CT_WATER, 'custom_page', @PAGE_COOLING_TOWERS,
    'Seda Arslan', 'seda.arslan@example.com',
    4, 1, 1, 160,
    1, 0, 1,
    'tr',
    NOW(3), NOW(3)
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
-- IMPORTANT: idempotent olması için sabit id kullanıldı.
-- Öneri: review_i18n tablosunda UNIQUE(review_id, locale) olmalı.
-- -------------------------------------------------------------
INSERT INTO `review_i18n`
  (`id`, `review_id`, `locale`,
   `title`, `comment`, `admin_reply`,
   `created_at`, `updated_at`)
VALUES
  -- ===================== MISSION =====================
  ('44440001-4444-4444-8444-444444441001', @REV_MISSION, 'tr',
   'Misyon metni çok net ve anlaşılır',
   'Ensotek''in misyon açıklaması, sektöre bakışını ve müşteri odaklı yaklaşımını çok net şekilde ortaya koyuyor.',
   NULL, NOW(3), NOW(3)),
  ('44440001-4444-4444-8444-444444441002', @REV_MISSION, 'en',
   'Strong customer-oriented mission',
   'I really like how Ensotek puts customer satisfaction and efficiency at the center of its mission.',
   NULL, NOW(3), NOW(3)),
  ('44440001-4444-4444-8444-444444441003', @REV_MISSION, 'de',
   'Klare und kundenorientierte Mission',
   'Die Mission ist verständlich formuliert und zeigt den Fokus auf Effizienz und Kundenzufriedenheit.',
   NULL, NOW(3), NOW(3)),

  -- ===================== ABOUT =====================
  ('44440003-4444-4444-8444-444444443001', @REV_ABOUT, 'tr',
   '40 yıllık deneyimi hissettiriyor',
   'Hakkımızda sayfasındaki bilgiler, firmanın sektörde ne kadar köklü ve tecrübeli olduğunu çok iyi anlatıyor.',
   NULL, NOW(3), NOW(3)),
  ('44440003-4444-4444-8444-444444443002', @REV_ABOUT, 'en',
   'Impressive background',
   'The about page gives a very clear picture of Ensotek''s long-term experience and strong reference projects.',
   NULL, NOW(3), NOW(3)),
  ('44440003-4444-4444-8444-444444443003', @REV_ABOUT, 'de',
   'Sehr überzeugender Unternehmenshintergrund',
   'Die „Über uns“-Seite vermittelt einen klaren Eindruck von Ensoteks Erfahrung und den starken Referenzprojekten.',
   NULL, NOW(3), NOW(3)),

  -- ===================== BLOG =====================
  ('44440005-4444-4444-8444-444444445001', @REV_BLOG, 'tr',
   'Bakım rehberi çok faydalı',
   'Periyodik bakım yazısı, sahadaki ekibimiz için kontrol listesi gibi kullanabileceğimiz pratik bilgiler içeriyor.',
   NULL, NOW(3), NOW(3)),
  ('44440005-4444-4444-8444-444444445002', @REV_BLOG, 'en',
   'Very practical maintenance guide',
   'The periodic maintenance article provides actionable tips that can be used as a checklist by field teams.',
   NULL, NOW(3), NOW(3)),
  ('44440005-4444-4444-8444-444444445003', @REV_BLOG, 'de',
   'Sehr hilfreicher Wartungsleitfaden',
   'Der Artikel zur regelmäßigen Wartung enthält praxisnahe Hinweise, die sich als Checkliste für Serviceteams nutzen lassen.',
   NULL, NOW(3), NOW(3)),

  -- ===================== COOLING TOWERS OVERVIEW =====================
  ('44440011-4444-4444-8444-444444440111', @REV_CT_OVERVIEW, 'tr',
   'Soğutma kulesi seçimi için çok iyi bir özet',
   'Soğutma kulesi sayfasında kapasiteler, çalışma prensibi ve seçim kriterleri sade ve teknik olarak doğru anlatılmış. Proje başlangıcında doğru karar vermemize yardımcı oldu.',
   NULL, NOW(3), NOW(3)),
  ('44440011-4444-4444-8444-444444440112', @REV_CT_OVERVIEW, 'en',
   'Excellent overview for selecting a cooling tower',
   'The page explains capacity, operating principles and selection criteria in a clear and technically accurate way. It helped us make the right call at the start of the project.',
   NULL, NOW(3), NOW(3)),
  ('44440011-4444-4444-8444-444444440113', @REV_CT_OVERVIEW, 'de',
   'Sehr guter Überblick zur Auswahl von Kühltürmen',
   'Die Seite erläutert Kapazität, Funktionsprinzip und Auswahlkriterien klar und technisch korrekt. Das hat uns bei der Projektentscheidung deutlich geholfen.',
   NULL, NOW(3), NOW(3)),

  -- ===================== TYPES =====================
  ('44440012-4444-4444-8444-444444440121', @REV_CT_TYPES, 'tr',
   'Açık/kapalı devre farkı netleşti',
   'Açık devre, kapalı devre ve hibrit çözümlerin avantaj/dezavantajları iyi karşılaştırılmış. Özellikle su kalitesi ve bakım ihtiyacı açısından doğru çerçeve sunuyor.',
   NULL, NOW(3), NOW(3)),
  ('44440012-4444-4444-8444-444444440122', @REV_CT_TYPES, 'en',
   'Clear comparison of open vs. closed circuit',
   'The pros/cons of open circuit, closed circuit and hybrid solutions are well structured. It sets the right expectations about water quality and maintenance requirements.',
   NULL, NOW(3), NOW(3)),
  ('44440012-4444-4444-8444-444444440123', @REV_CT_TYPES, 'de',
   'Guter Vergleich: offener vs. geschlossener Kreislauf',
   'Vor- und Nachteile von offenen, geschlossenen und hybriden Systemen sind sauber gegenübergestellt – besonders im Hinblick auf Wasserqualität und Wartungsaufwand.',
   NULL, NOW(3), NOW(3)),

  -- ===================== MAINTENANCE =====================
  ('44440013-4444-4444-8444-444444440131', @REV_CT_MAINT, 'tr',
   'Bakım ve hijyen adımları pratik',
   'Periyodik bakım adımları (dolgu kontrolü, fan-kayış ayarı, su şartlandırma, drift eliminatör temizliği) sahada uygulanabilir şekilde yazılmış. Hijyen ve verim için önemli.',
   NULL, NOW(3), NOW(3)),
  ('44440013-4444-4444-8444-444444440132', @REV_CT_MAINT, 'en',
   'Practical maintenance and hygiene steps',
   'Maintenance steps (fill inspection, fan/belt alignment, water treatment, drift eliminator cleaning) are described in an actionable way. Great for hygiene and efficiency.',
   NULL, NOW(3), NOW(3)),
  ('44440013-4444-4444-8444-444444440133', @REV_CT_MAINT, 'de',
   'Praxisnahe Wartungs- und Hygieneschritte',
   'Wartungspunkte (Füllkörper, Ventilator/Riemen, Wasseraufbereitung, Drift-Eliminator) sind sehr praxisnah beschrieben – wichtig für Hygiene und Effizienz.',
   NULL, NOW(3), NOW(3)),

  -- ===================== PROJECTS / REFERENCES =====================
  ('44440014-4444-4444-8444-444444440141', @REV_CT_PROJECTS, 'tr',
   'Referanslar güven veriyor',
   'Soğutma kuleleri referans projeleri sektör çeşitliliği açısından güçlü. Teklif sürecinde teknik ekip için ikna edici oldu.',
   NULL, NOW(3), NOW(3)),
  ('44440014-4444-4444-8444-444444440142', @REV_CT_PROJECTS, 'en',
   'References inspire confidence',
   'The cooling tower reference projects show strong sector coverage. It was convincing for our technical team during the quotation process.',
   NULL, NOW(3), NOW(3)),
  ('44440014-4444-4444-8444-444444440143', @REV_CT_PROJECTS, 'de',
   'Referenzen schaffen Vertrauen',
   'Die Referenzprojekte im Bereich Kühltürme zeigen eine starke Branchenabdeckung. Das war im Angebotsprozess sehr überzeugend.',
   NULL, NOW(3), NOW(3)),

  -- ===================== NOISE / VIBRATION =====================
  ('44440015-4444-4444-8444-444444440151', @REV_CT_NOISE, 'tr',
   'Ses seviyesi için doğru yaklaşım',
   'Ses seviyesi ve titreşim konularında doğru mühendislik yaklaşımı anlatılmış. Yerleşim, fan seçimi ve izolasyon gibi detaylar karar sürecini kolaylaştırdı.',
   NULL, NOW(3), NOW(3)),
  ('44440015-4444-4444-8444-444444440152', @REV_CT_NOISE, 'en',
   'Good engineering approach for noise control',
   'The page addresses noise and vibration with the right engineering perspective. Layout, fan choice and isolation details helped streamline decisions.',
   NULL, NOW(3), NOW(3)),
  ('44440015-4444-4444-8444-444444440153', @REV_CT_NOISE, 'de',
   'Guter Ansatz für Schall- und Vibrationskontrolle',
   'Schall und Vibration werden mit dem richtigen Engineering-Fokus erklärt. Aufstellung, Ventilatorwahl und Entkopplung waren sehr hilfreich.',
   NULL, NOW(3), NOW(3)),

  -- ===================== WATER CONSUMPTION / TREATMENT =====================
  ('44440016-4444-4444-8444-444444440161', @REV_CT_WATER, 'tr',
   'Su tüketimi ve şartlandırma bilgisi yerinde',
   'Buharlaşma kaybı, sürüklenme (drift) ve blöf (blowdown) gibi konuların açıklanması faydalı. Su şartlandırma önerileri net ve uygulanabilir.',
   NULL, NOW(3), NOW(3)),
  ('44440016-4444-4444-8444-444444440162', @REV_CT_WATER, 'en',
   'Solid information on water use and treatment',
   'Explanations about evaporation loss, drift and blowdown are helpful. Water treatment guidance is clear and practical.',
   NULL, NOW(3), NOW(3)),
  ('44440016-4444-4444-8444-444444440163', @REV_CT_WATER, 'de',
   'Gute Informationen zu Wasserverbrauch und Aufbereitung',
   'Erläuterungen zu Verdunstung, Drift und Blowdown sind sehr nützlich. Empfehlungen zur Wasseraufbereitung sind klar und praxisnah.',
   NULL, NOW(3), NOW(3))

ON DUPLICATE KEY UPDATE
  `title`       = VALUES(`title`),
  `comment`     = VALUES(`comment`),
  `admin_reply` = VALUES(`admin_reply`),
  `updated_at`  = VALUES(`updated_at`);

COMMIT;

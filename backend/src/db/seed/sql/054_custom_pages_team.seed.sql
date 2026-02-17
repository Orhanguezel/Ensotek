-- =============================================================
-- FILE: 054_custom_pages_team.seed.sql  (FINAL / SCHEMA-OK)
-- TEAM – custom_pages + custom_pages_i18n (UI-READY)
-- Kurallar:
--  - Sadece "--" yorum
--  - module_key='team' (SADECE custom_pages parent)
--  - Çoklu görsel (images JSON_ARRAY) + featured_image
--  - Deterministik i18n id (UUID() YOK)
--  - time_zone='+00:00'
--  - NO Tailwind class in HTML content
--  - NO duplicated name/role in content.html (FE already renders them)
--  - Social block uses: .ens-teamSocial + .ens-teamSocial__link
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- -------------------------------------------------------------
-- KATEGORİ / ALT KATEGORİLER (011 & 012 ile hizalı)
-- -------------------------------------------------------------
SET @CAT_TEAM_MAIN := 'aaaa9101-1111-4111-8111-aaaaaaaa9101';

SET @SUB_TEAM_MGMT    := 'bbbb9101-1111-4111-8111-bbbbbbbb9101';
SET @SUB_TEAM_ENG     := 'bbbb9102-1111-4111-8111-bbbbbbbb9102';
SET @SUB_TEAM_SERVICE := 'bbbb9103-1111-4111-8111-bbbbbbbb9103';
SET @SUB_TEAM_FT      := 'bbbb9104-1111-4111-8111-bbbbbbbb9104';

-- -------------------------------------------------------------
-- MODULE KEY (PARENT)
-- -------------------------------------------------------------
SET @MODULE_KEY_TEAM := 'team';

-- -------------------------------------------------------------
-- SABİT PAGE ID’LERİ (deterministik)
-- -------------------------------------------------------------
SET @TEAM_MGMT_1    := '44440001-4444-4444-8444-444444440001';
SET @TEAM_ENG_1     := '44440002-4444-4444-8444-444444440002';
SET @TEAM_SERVICE_1 := '44440003-4444-4444-8444-444444440003';
SET @TEAM_MGMT_2    := '44440004-4444-4444-8444-444444440004';
SET @TEAM_MGMT_3    := '44440005-4444-4444-8444-444444440005';
SET @TEAM_FT_1      := '44440006-4444-4444-8444-444444440006';

-- -------------------------------------------------------------
-- FEATURED IMAGES (primary) + random gallery extras
-- -------------------------------------------------------------
SET @IMG_TEAM_MGMT_1 := 'https://www.ensotek.de/uploads/team/1.jpeg';
SET @IMG_TEAM_MGMT_2 := 'https://www.ensotek.de/uploads/team/2.jpeg';
SET @IMG_TEAM_MGMT_3 := 'https://www.ensotek.de/uploads/team/3.jpeg';

SET @IMG_TEAM_ENG_1 := 'https://www.ensotek.de/uploads/team/5.jpeg';
SET @IMG_TEAM_SERVICE_1 := 'https://www.ensotek.de/uploads/team/5.jpeg';
SET @IMG_TEAM_FT_1 := 'https://www.ensotek.de/uploads/team/5.jpeg';

SET @IMG_TEAM_COMMON_1 := 'https://www.ensotek.de/uploads/team/9.jpeg';
SET @IMG_TEAM_COMMON_2 := 'https://images.unsplash.com/photo-1522071901873-411886a10004?auto=format&fit=crop&w=1400&h=900&q=80';
SET @IMG_TEAM_COMMON_3 := 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&h=900&q=80';
SET @IMG_TEAM_COMMON_4 := 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&h=900&q=80';

-- -------------------------------------------------------------
-- I18N IDS (deterministik) – TR/EN/DE (6 kişi x 3 locale)
-- -------------------------------------------------------------
SET @I18N_TEAM_MGMT_1_TR := '88440001-0001-4001-8001-888888884401';
SET @I18N_TEAM_MGMT_1_EN := '88440001-0002-4002-8002-888888884401';
SET @I18N_TEAM_MGMT_1_DE := '88440001-0003-4003-8003-888888884401';

SET @I18N_TEAM_ENG_1_TR := '88440002-0001-4001-8001-888888884402';
SET @I18N_TEAM_ENG_1_EN := '88440002-0002-4002-8002-888888884402';
SET @I18N_TEAM_ENG_1_DE := '88440002-0003-4003-8003-888888884402';

SET @I18N_TEAM_SERVICE_1_TR := '88440003-0001-4001-8001-888888884403';
SET @I18N_TEAM_SERVICE_1_EN := '88440003-0002-4002-8002-888888884403';
SET @I18N_TEAM_SERVICE_1_DE := '88440003-0003-4003-8003-888888884403';

SET @I18N_TEAM_MGMT_2_TR := '88440004-0001-4001-8001-888888884404';
SET @I18N_TEAM_MGMT_2_EN := '88440004-0002-4002-8002-888888884404';
SET @I18N_TEAM_MGMT_2_DE := '88440004-0003-4003-8003-888888884404';

SET @I18N_TEAM_MGMT_3_TR := '88440005-0001-4001-8001-888888884405';
SET @I18N_TEAM_MGMT_3_EN := '88440005-0002-4002-8002-888888884405';
SET @I18N_TEAM_MGMT_3_DE := '88440005-0003-4003-8003-888888884405';

SET @I18N_TEAM_FT_1_TR := '88440006-0001-4001-8001-888888884406';
SET @I18N_TEAM_FT_1_EN := '88440006-0002-4002-8002-888888884406';
SET @I18N_TEAM_FT_1_DE := '88440006-0003-4003-8003-888888884406';

-- -------------------------------------------------------------
-- TIMESTAMP
-- -------------------------------------------------------------
SET @DT_NOW := NOW(3);

-- -------------------------------------------------------------
-- PARENT UPSERT (custom_pages) – TEAM members as custom pages
-- -------------------------------------------------------------
INSERT INTO `custom_pages`
  (`id`,
   `module_key`,
   `is_published`,
   `featured`,
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
    @TEAM_MGMT_1,
    @MODULE_KEY_TEAM,
    1,
    0,
    801,
    801,
    @IMG_TEAM_MGMT_1,
    NULL,
    @IMG_TEAM_MGMT_1,
    NULL,
    JSON_ARRAY(@IMG_TEAM_MGMT_1, @IMG_TEAM_COMMON_3, @IMG_TEAM_COMMON_4),
    JSON_ARRAY(),
    @CAT_TEAM_MAIN,
    @SUB_TEAM_MGMT,
    @DT_NOW,
    @DT_NOW
  ),
  (
    @TEAM_MGMT_2,
    @MODULE_KEY_TEAM,
    1,
    0,
    802,
    802,
    @IMG_TEAM_MGMT_2,
    NULL,
    @IMG_TEAM_MGMT_2,
    NULL,
    JSON_ARRAY(@IMG_TEAM_MGMT_2, @IMG_TEAM_COMMON_1, @IMG_TEAM_COMMON_3),
    JSON_ARRAY(),
    @CAT_TEAM_MAIN,
    @SUB_TEAM_MGMT,
    @DT_NOW,
    @DT_NOW
  ),
  (
    @TEAM_MGMT_3,
    @MODULE_KEY_TEAM,
    1,
    0,
    803,
    803,
    @IMG_TEAM_MGMT_3,
    NULL,
    @IMG_TEAM_MGMT_3,
    NULL,
    JSON_ARRAY(@IMG_TEAM_MGMT_3, @IMG_TEAM_COMMON_2, @IMG_TEAM_COMMON_4),
    JSON_ARRAY(),
    @CAT_TEAM_MAIN,
    @SUB_TEAM_MGMT,
    @DT_NOW,
    @DT_NOW
  ),
  (
    @TEAM_ENG_1,
    @MODULE_KEY_TEAM,
    1,
    0,
    811,
    811,
    @IMG_TEAM_ENG_1,
    NULL,
    @IMG_TEAM_ENG_1,
    NULL,
    JSON_ARRAY(@IMG_TEAM_ENG_1, @IMG_TEAM_COMMON_3, @IMG_TEAM_COMMON_2),
    JSON_ARRAY(),
    @CAT_TEAM_MAIN,
    @SUB_TEAM_ENG,
    @DT_NOW,
    @DT_NOW
  ),
  (
    @TEAM_SERVICE_1,
    @MODULE_KEY_TEAM,
    1,
    0,
    821,
    821,
    @IMG_TEAM_SERVICE_1,
    NULL,
    @IMG_TEAM_SERVICE_1,
    NULL,
    JSON_ARRAY(@IMG_TEAM_SERVICE_1, @IMG_TEAM_COMMON_4, @IMG_TEAM_COMMON_1),
    JSON_ARRAY(),
    @CAT_TEAM_MAIN,
    @SUB_TEAM_SERVICE,
    @DT_NOW,
    @DT_NOW
  ),
  (
    @TEAM_FT_1,
    @MODULE_KEY_TEAM,
    1,
    0,
    831,
    831,
    @IMG_TEAM_FT_1,
    NULL,
    @IMG_TEAM_FT_1,
    NULL,
    JSON_ARRAY(@IMG_TEAM_FT_1, @IMG_TEAM_COMMON_2, @IMG_TEAM_COMMON_3),
    JSON_ARRAY(),
    @CAT_TEAM_MAIN,
    @SUB_TEAM_FT,
    @DT_NOW,
    @DT_NOW
  )
ON DUPLICATE KEY UPDATE
  `module_key`              = VALUES(`module_key`),
  `is_published`            = VALUES(`is_published`),
  `featured`                = VALUES(`featured`),
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

-- =============================================================
-- I18N UPSERT (custom_pages_i18n) – TEAM members
-- ✅ module_key i18n’de YOK (schema uyumlu)
-- ✅ content.html içinde H1 + role satırı YOK (duplicate fix)
-- ✅ Social block: .ens-teamSocial + .ens-teamSocial__link (CSS stable)
-- =============================================================
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

-- =============================================================
-- TEAM_MGMT_1 (İbrahim YAĞAR) – TR/EN/DE
-- =============================================================
(
  @I18N_TEAM_MGMT_1_TR, @TEAM_MGMT_1, 'tr',
  'İbrahim YAĞAR',
  'ibrahim-yagar-kurucu-genel-mudur',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Ensotek Su Soğutma Kuleleri’nin kurucusu ve genel müdürüdür. Şirketi yaklaşık <strong>36 yıl önce</strong> kurarak Ensotek’i yerel bir girişimden global ölçekte bilinen bir markaya dönüştürmüştür.</p>',
      '<h2>Odak Alanları</h2>',
      '<ul>',
        '<li><strong>Strateji ve büyüme:</strong> Pazarlara açılım ve uzun vadeli büyüme planı</li>',
        '<li><strong>İnovasyon:</strong> Verimlilik, dayanıklılık ve sürdürülebilirlik</li>',
        '<li><strong>Kurumsal yönetim:</strong> Kalite kültürü ve marka standardı</li>',
      '</ul>',
      '<h2>Yaklaşım</h2>',
      '<p>Ensotek’te müşteri memnuniyetini, sürdürülebilir üretimi ve ölçülebilir kalite standartlarını önceliklendirir. Ar-Ge ve saha geri bildirimlerini ürün geliştirme döngüsüne entegre eden liderlik anlayışıyla hareket eder.</p>',
      '<hr/>',
      '<h2>İletişim &amp; Sosyal</h2>',
      '<div class="ens-teamSocial">',
        '<a class="ens-teamSocial__link" href="https://www.linkedin.com/in/ibrahim-yagar" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>',
        '<a class="ens-teamSocial__link" href="https://x.com/ensotek" target="_blank" rel="noopener noreferrer" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>',
        '<a class="ens-teamSocial__link" href="mailto:info@ensotek.com" aria-label="E-posta"><i class="fa-solid fa-envelope"></i></a>',
        '<a class="ens-teamSocial__link" href="tel:+905555555555" aria-label="Telefon"><i class="fa-solid fa-phone"></i></a>',
      '</div>'
    )
  ),
  'Kurucu & Genel Müdür',
  'Ensotek yönetim ekibi – İbrahim YAĞAR',
  'İbrahim YAĞAR | Kurucu & Genel Müdür – Ensotek',
  'İbrahim YAĞAR; Ensotek’in kurucusu ve genel müdürü. Strateji, inovasyon ve kurumsal yönetimi uzun yıllara dayanan deneyimiyle yönetir.',
  'ensotek,ekibimiz,yönetim,kurucu,genel müdür,ibrahim yagar,su soğutma kuleleri',
  @DT_NOW, @DT_NOW
),
(
  @I18N_TEAM_MGMT_1_EN, @TEAM_MGMT_1, 'en',
  'İbrahim YAĞAR',
  'ibrahim-yagar-founder-managing-director',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>He is the founder and managing director of Ensotek Cooling Towers. He established the company around <strong>36 years ago</strong> and scaled it into a globally recognized brand.</p>',
      '<h2>Key Focus Areas</h2>',
      '<ul>',
        '<li><strong>Strategy &amp; growth:</strong> Market expansion and long-term direction</li>',
        '<li><strong>Innovation:</strong> Efficiency, durability and sustainability</li>',
        '<li><strong>Corporate leadership:</strong> Quality culture and brand standards</li>',
      '</ul>',
      '<h2>Approach</h2>',
      '<p>He prioritizes customer satisfaction, sustainable manufacturing, and measurable quality standards. His leadership integrates R&amp;D with real-world field feedback into continuous product improvement.</p>',
      '<hr/>',
      '<h2>Contact &amp; Social</h2>',
      '<div class="ens-teamSocial">',
        '<a class="ens-teamSocial__link" href="https://www.linkedin.com/in/ibrahim-yagar" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>',
        '<a class="ens-teamSocial__link" href="https://x.com/ensotek" target="_blank" rel="noopener noreferrer" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>',
        '<a class="ens-teamSocial__link" href="mailto:info@ensotek.com" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>',
        '<a class="ens-teamSocial__link" href="tel:+905555555555" aria-label="Phone"><i class="fa-solid fa-phone"></i></a>',
      '</div>'
    )
  ),
  'Founder & Managing Director',
  'Ensotek leadership team – İbrahim YAĞAR',
  'İbrahim YAĞAR | Founder & Managing Director – Ensotek',
  'İbrahim YAĞAR is the founder and managing director of Ensotek Cooling Towers. He leads strategy, innovation and corporate governance with decades of experience.',
  'ensotek,our team,management,founder,managing director,ibrahim yagar,cooling towers',
  @DT_NOW, @DT_NOW
),
(
  @I18N_TEAM_MGMT_1_DE, @TEAM_MGMT_1, 'de',
  'İbrahim YAĞAR',
  'ibrahim-yagar-geschaeftsfuehrer-und-gruender',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Er ist Geschäftsführer und Gründer von Ensotek. Er gründete das Unternehmen vor rund <strong>36 Jahren</strong> und entwickelte Ensotek zu einer international anerkannten Marke.</p>',
      '<h2>Schwerpunkte</h2>',
      '<ul>',
        '<li><strong>Strategie &amp; Wachstum:</strong> Marktentwicklung und langfristige Ausrichtung</li>',
        '<li><strong>Innovation:</strong> Effizienz, Langlebigkeit und Nachhaltigkeit</li>',
        '<li><strong>Unternehmensführung:</strong> Qualitätskultur und Markenstandards</li>',
      '</ul>',
      '<h2>Ansatz</h2>',
      '<p>Im Mittelpunkt stehen Kundenzufriedenheit, nachhaltige Produktion und messbare Qualitätsstandards. Feld-Feedback wird systematisch in die Produktentwicklung integriert.</p>',
      '<hr/>',
      '<h2>Kontakt &amp; Social</h2>',
      '<div class="ens-teamSocial">',
        '<a class="ens-teamSocial__link" href="https://www.linkedin.com/in/ibrahim-yagar" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>',
        '<a class="ens-teamSocial__link" href="https://x.com/ensotek" target="_blank" rel="noopener noreferrer" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>',
        '<a class="ens-teamSocial__link" href="mailto:info@ensotek.com" aria-label="E-Mail"><i class="fa-solid fa-envelope"></i></a>',
        '<a class="ens-teamSocial__link" href="tel:+905555555555" aria-label="Telefon"><i class="fa-solid fa-phone"></i></a>',
      '</div>'
    )
  ),
  'Geschäftsführer & Gründer',
  'Ensotek Management – İbrahim YAĞAR',
  'İbrahim YAĞAR | Geschäftsführer & Gründer – Ensotek',
  'İbrahim YAĞAR ist Geschäftsführer und Gründer von Ensotek. Er verantwortet Strategie, Innovation und Unternehmensführung mit jahrzehntelanger Erfahrung.',
  'ensotek,unser team,management,gruender,geschaeftsfuehrer,ibrahim yagar,kuehltuerme',
  @DT_NOW, @DT_NOW
),

-- =============================================================
-- TEAM_MGMT_2 (Hamdi YAĞAR) – TR/EN/DE
-- =============================================================
(
  @I18N_TEAM_MGMT_2_TR, @TEAM_MGMT_2, 'tr',
  'Hamdi YAĞAR',
  'hamdi-yagar-yonetim-operasyon',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Ensotek’te operasyonel mükemmellik, üretim koordinasyonu ve süreç iyileştirme alanlarında görev alır. Tedarik, planlama ve kalite süreçlerinin uçtan uca takibini sağlayarak teslimat performansını güçlendirir.</p>',
      '<h2>Odak Alanları</h2>',
      '<ul>',
        '<li><strong>Operasyon yönetimi:</strong> Üretim planlama, kapasite ve termin yönetimi</li>',
        '<li><strong>Süreç iyileştirme:</strong> Verimlilik, standardizasyon ve yalın yaklaşım</li>',
        '<li><strong>Kalite &amp; teslimat:</strong> Süreç kontrol, izlenebilirlik ve müşteri memnuniyeti</li>',
      '</ul>',
      '<hr/>',
      '<h2>İletişim &amp; Sosyal</h2>',
      '<div class="ens-teamSocial">',
        '<a class="ens-teamSocial__link" href="https://www.linkedin.com/company/ensotek/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>',
        '<a class="ens-teamSocial__link" href="mailto:info@ensotek.com" aria-label="E-posta"><i class="fa-solid fa-envelope"></i></a>',
        '<a class="ens-teamSocial__link" href="tel:+905555555555" aria-label="Telefon"><i class="fa-solid fa-phone"></i></a>',
      '</div>'
    )
  ),
  'Yönetim & Operasyon',
  'Ensotek yönetim ekibi – Hamdi YAĞAR',
  'Hamdi YAĞAR | Yönetim & Operasyon – Ensotek',
  'Hamdi YAĞAR; Ensotek’te operasyon, üretim koordinasyonu ve süreç iyileştirmeden sorumludur. Üretim planlama ve kalite süreçlerinde uçtan uca yönetim yaklaşımıyla çalışır.',
  'ensotek,ekibimiz,yönetim,operasyon,hamdi yagar,üretim,kalite',
  @DT_NOW, @DT_NOW
),
(
  @I18N_TEAM_MGMT_2_EN, @TEAM_MGMT_2, 'en',
  'Hamdi YAĞAR',
  'hamdi-yagar-operations-management',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>He focuses on operational excellence, production coordination, and continuous process improvement at Ensotek. He strengthens delivery performance by ensuring end-to-end control of planning, supply, and quality workflows.</p>',
      '<h2>Key Focus Areas</h2>',
      '<ul>',
        '<li><strong>Operations:</strong> Production planning, capacity and lead-time management</li>',
        '<li><strong>Process improvement:</strong> Efficiency, standardization, and lean practices</li>',
        '<li><strong>Quality &amp; delivery:</strong> Process control, traceability, and customer satisfaction</li>',
      '</ul>',
      '<hr/>',
      '<h2>Contact &amp; Social</h2>',
      '<div class="ens-teamSocial">',
        '<a class="ens-teamSocial__link" href="https://www.linkedin.com/company/ensotek/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>',
        '<a class="ens-teamSocial__link" href="mailto:info@ensotek.com" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>',
        '<a class="ens-teamSocial__link" href="tel:+905555555555" aria-label="Phone"><i class="fa-solid fa-phone"></i></a>',
      '</div>'
    )
  ),
  'Operations Management',
  'Ensotek leadership team – Hamdi YAĞAR',
  'Hamdi YAĞAR | Operations Management – Ensotek',
  'Hamdi YAĞAR leads operations, production coordination, and process improvement at Ensotek. He drives planning discipline, traceability, and delivery performance across workflows.',
  'ensotek,our team,management,operations,hamdi yagar,production,quality',
  @DT_NOW, @DT_NOW
),
(
  @I18N_TEAM_MGMT_2_DE, @TEAM_MGMT_2, 'de',
  'Hamdi YAĞAR',
  'hamdi-yagar-operations-management',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Er verantwortet operative Exzellenz, Produktionskoordination und kontinuierliche Prozessverbesserung bei Ensotek. Durch die End-to-End-Steuerung von Planung, Supply und Qualität stärkt er Termin- und Lieferperformance.</p>',
      '<h2>Schwerpunkte</h2>',
      '<ul>',
        '<li><strong>Operatives Management:</strong> Produktionsplanung, Kapazität und Durchlaufzeiten</li>',
        '<li><strong>Prozessverbesserung:</strong> Effizienz, Standardisierung und Lean</li>',
        '<li><strong>Qualität &amp; Lieferung:</strong> Prozesskontrolle, Rückverfolgbarkeit und Kundenzufriedenheit</li>',
      '</ul>',
      '<hr/>',
      '<h2>Kontakt &amp; Social</h2>',
      '<div class="ens-teamSocial">',
        '<a class="ens-teamSocial__link" href="https://www.linkedin.com/company/ensotek/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>',
        '<a class="ens-teamSocial__link" href="mailto:info@ensotek.com" aria-label="E-Mail"><i class="fa-solid fa-envelope"></i></a>',
        '<a class="ens-teamSocial__link" href="tel:+905555555555" aria-label="Telefon"><i class="fa-solid fa-phone"></i></a>',
      '</div>'
    )
  ),
  'Operations & Prozessmanagement',
  'Ensotek Management – Hamdi YAĞAR',
  'Hamdi YAĞAR | Operations & Prozessmanagement – Ensotek',
  'Hamdi YAĞAR verantwortet Operations, Produktionskoordination und Prozessverbesserung bei Ensotek. Er stärkt Planung, Rückverfolgbarkeit und Lieferperformance entlang der Prozesse.',
  'ensotek,unser team,management,operations,hamdi yagar,produktion,qualitaet',
  @DT_NOW, @DT_NOW
),

-- =============================================================
-- TEAM_MGMT_3 (Ahmet Gökhan YAĞAR) – TR/EN/DE
-- =============================================================
(
  @I18N_TEAM_MGMT_3_TR, @TEAM_MGMT_3, 'tr',
  'Ahmet Gökhan YAĞAR',
  'ahmet-gokhan-yagar-is-gelistirme',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Ensotek’te iş geliştirme, teklif/proje koordinasyonu ve müşteri ilişkileri süreçlerinde görev alır. Proje gereksinimlerinin doğru anlaşılması, teknik-ticari uyum ve teslimat sonrası memnuniyetin sürdürülebilirliği üzerine çalışır.</p>',
      '<h2>Odak Alanları</h2>',
      '<ul>',
        '<li><strong>İş geliştirme:</strong> Yeni pazarlar, müşteri kazanımı ve iş ortaklıkları</li>',
        '<li><strong>Proje yönetimi:</strong> Keşif, teklif, planlama ve uygulama koordinasyonu</li>',
        '<li><strong>Müşteri deneyimi:</strong> İletişim, beklenti yönetimi ve uzun vadeli ilişki</li>',
      '</ul>',
      '<hr/>',
      '<h2>İletişim &amp; Sosyal</h2>',
      '<div class="ens-teamSocial">',
        '<a class="ens-teamSocial__link" href="https://www.linkedin.com/company/ensotek/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>',
        '<a class="ens-teamSocial__link" href="mailto:info@ensotek.com" aria-label="E-posta"><i class="fa-solid fa-envelope"></i></a>',
        '<a class="ens-teamSocial__link" href="tel:+905555555555" aria-label="Telefon"><i class="fa-solid fa-phone"></i></a>',
      '</div>'
    )
  ),
  'İş Geliştirme & Proje Yönetimi',
  'Ensotek yönetim ekibi – Ahmet Gökhan YAĞAR',
  'Ahmet Gökhan YAĞAR | İş Geliştirme – Ensotek',
  'Ahmet Gökhan YAĞAR; Ensotek’te iş geliştirme ve proje koordinasyonundan sorumludur. Keşif, teklif ve uygulama süreçlerinde teknik-ticari uyumu ve müşteri deneyimini yönetir.',
  'ensotek,ekibimiz,yönetim,is gelistirme,proje yönetimi,ahmet gokhan yagar',
  @DT_NOW, @DT_NOW
),
(
  @I18N_TEAM_MGMT_3_EN, @TEAM_MGMT_3, 'en',
  'Ahmet Gökhan YAĞAR',
  'ahmet-gokhan-yagar-business-development',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>He works on business development, proposal/project coordination, and customer relationship processes at Ensotek. He focuses on clear requirement definition, technical-commercial alignment, and sustainable customer satisfaction.</p>',
      '<h2>Key Focus Areas</h2>',
      '<ul>',
        '<li><strong>Business development:</strong> New markets, customer acquisition, and partnerships</li>',
        '<li><strong>Project coordination:</strong> Survey, proposal, planning and delivery coordination</li>',
        '<li><strong>Customer experience:</strong> Communication, expectation management, and long-term relationships</li>',
      '</ul>',
      '<hr/>',
      '<h2>Contact &amp; Social</h2>',
      '<div class="ens-teamSocial">',
        '<a class="ens-teamSocial__link" href="https://www.linkedin.com/company/ensotek/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>',
        '<a class="ens-teamSocial__link" href="mailto:info@ensotek.com" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>',
        '<a class="ens-teamSocial__link" href="tel:+905555555555" aria-label="Phone"><i class="fa-solid fa-phone"></i></a>',
      '</div>'
    )
  ),
  'Business Development & Project Coordination',
  'Ensotek leadership team – Ahmet Gökhan YAĞAR',
  'Ahmet Gökhan YAĞAR | Business Development – Ensotek',
  'Ahmet Gökhan YAĞAR leads business development and project coordination at Ensotek. He manages requirement definition, technical-commercial alignment, and customer experience across project phases.',
  'ensotek,our team,management,business development,project coordination,ahmet gokhan yagar',
  @DT_NOW, @DT_NOW
),
(
  @I18N_TEAM_MGMT_3_DE, @TEAM_MGMT_3, 'de',
  'Ahmet Gökhan YAĞAR',
  'ahmet-gokhan-yagar-business-development',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Er verantwortet Business Development, Angebots-/Projektkoordination und Kundenbeziehungen bei Ensotek. Im Fokus stehen klare Anforderungen, technisch-kaufmännische Abstimmung und nachhaltige Kundenzufriedenheit.</p>',
      '<h2>Schwerpunkte</h2>',
      '<ul>',
        '<li><strong>Business Development:</strong> Neue Märkte, Kundengewinnung und Partnerschaften</li>',
        '<li><strong>Projektkoordination:</strong> Analyse, Angebot, Planung und Umsetzung</li>',
        '<li><strong>Kundenerlebnis:</strong> Kommunikation, Erwartungsmanagement und langfristige Beziehungen</li>',
      '</ul>',
      '<hr/>',
      '<h2>Kontakt &amp; Social</h2>',
      '<div class="ens-teamSocial">',
        '<a class="ens-teamSocial__link" href="https://www.linkedin.com/company/ensotek/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>',
        '<a class="ens-teamSocial__link" href="mailto:info@ensotek.com" aria-label="E-Mail"><i class="fa-solid fa-envelope"></i></a>',
        '<a class="ens-teamSocial__link" href="tel:+905555555555" aria-label="Telefon"><i class="fa-solid fa-phone"></i></a>',
      '</div>'
    )
  ),
  'Business Development & Projektkoordination',
  'Ensotek Management – Ahmet Gökhan YAĞAR',
  'Ahmet Gökhan YAĞAR | Business Development – Ensotek',
  'Ahmet Gökhan YAĞAR verantwortet Business Development und Projektkoordination bei Ensotek. Er steuert Anforderungen, technisch-kaufmännische Abstimmung und Kundenerlebnis in allen Projektphasen.',
  'ensotek,unser team,management,business development,projektkoordination,ahmet gokhan yagar',
  @DT_NOW, @DT_NOW
),

-- =============================================================
-- TEAM_ENG_1 (Mehmet KAYA) – TR/EN/DE
-- =============================================================
(
  @I18N_TEAM_ENG_1_TR, @TEAM_ENG_1, 'tr',
  'Mehmet KAYA',
  'mehmet-kaya-kidemli-proje-muhendisi',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Su soğutma kulesi projelerinde keşif, teknik çözümleme, boyutlandırma ve uygulama koordinasyonunda görev alır. Saha koşulları ve proses gereksinimlerine göre optimum çözümü belirleyerek performans ve enerji verimliliği hedeflerini destekler.</p>',
      '<h2>Uzmanlık Alanları</h2>',
      '<ul>',
        '<li><strong>Proje mühendisliği:</strong> Keşif, teknik ek, planlama</li>',
        '<li><strong>Performans:</strong> Approach/Range, debi, fan ve dolgu seçimi</li>',
        '<li><strong>Uygulama:</strong> Montaj koordinasyonu, devreye alma, saha testleri</li>',
      '</ul>',
      '<hr/>',
      '<h2>İletişim &amp; Sosyal</h2>',
      '<div class="ens-teamSocial">',
        '<a class="ens-teamSocial__link" href="https://www.linkedin.com/company/ensotek/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>',
        '<a class="ens-teamSocial__link" href="mailto:info@ensotek.com" aria-label="E-posta"><i class="fa-solid fa-envelope"></i></a>',
      '</div>'
    )
  ),
  'Kıdemli Proje Mühendisi',
  'Ensotek mühendislik ekibi – Mehmet KAYA',
  'Mehmet KAYA | Kıdemli Proje Mühendisi – Ensotek',
  'Mehmet KAYA; su soğutma kulesi projelerinde boyutlandırma, teknik çözüm ve devreye alma süreçlerine liderlik eder. Performans ve enerji verimliliği odaklı yaklaşım benimser.',
  'ensotek,ekibimiz,mühendislik,proje mühendisliği,kıdemli mühendis,mehmet kaya',
  @DT_NOW, @DT_NOW
),
(
  @I18N_TEAM_ENG_1_EN, @TEAM_ENG_1, 'en',
  'Mehmet KAYA',
  'mehmet-kaya-senior-project-engineer',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>He works on site surveys, technical sizing, solution design and implementation coordination for cooling tower projects. He helps ensure performance and energy efficiency targets by selecting optimal solutions based on process requirements and site conditions.</p>',
      '<h2>Areas of Expertise</h2>',
      '<ul>',
        '<li><strong>Project engineering:</strong> Survey, technical annex, planning</li>',
        '<li><strong>Performance:</strong> Approach/Range, flow rate, fan/fill selection</li>',
        '<li><strong>Execution:</strong> Installation coordination, commissioning, field tests</li>',
      '</ul>',
      '<hr/>',
      '<h2>Contact &amp; Social</h2>',
      '<div class="ens-teamSocial">',
        '<a class="ens-teamSocial__link" href="https://www.linkedin.com/company/ensotek/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>',
        '<a class="ens-teamSocial__link" href="mailto:info@ensotek.com" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>',
      '</div>'
    )
  ),
  'Senior Project Engineer',
  'Ensotek engineering team – Mehmet KAYA',
  'Mehmet KAYA | Senior Project Engineer – Ensotek',
  'Mehmet KAYA supports cooling tower projects through sizing, technical solution design and commissioning coordination, focusing on performance and energy efficiency.',
  'ensotek,our team,engineering,project engineering,senior engineer,mehmet kaya',
  @DT_NOW, @DT_NOW
),
(
  @I18N_TEAM_ENG_1_DE, @TEAM_ENG_1, 'de',
  'Mehmet KAYA',
  'mehmet-kaya-senior-projektingenieur',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Er arbeitet an Begehungen, technischer Auslegung, Lösungsdesign und Umsetzungskoordination für Kühlturmprojekte. Er definiert optimale Lösungen basierend auf Prozessanforderungen und Standortbedingungen.</p>',
      '<h2>Expertise</h2>',
      '<ul>',
        '<li><strong>Projektengineering:</strong> Analyse, technischer Anhang, Planung</li>',
        '<li><strong>Performance:</strong> Approach/Range, Volumenstrom, Ventilator/Füllkörper</li>',
        '<li><strong>Umsetzung:</strong> Montagekoordination, Inbetriebnahme, Feldtests</li>',
      '</ul>',
      '<hr/>',
      '<h2>Kontakt &amp; Social</h2>',
      '<div class="ens-teamSocial">',
        '<a class="ens-teamSocial__link" href="https://www.linkedin.com/company/ensotek/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>',
        '<a class="ens-teamSocial__link" href="mailto:info@ensotek.com" aria-label="E-Mail"><i class="fa-solid fa-envelope"></i></a>',
      '</div>'
    )
  ),
  'Senior Projektingenieur',
  'Ensotek Engineering-Team – Mehmet KAYA',
  'Mehmet KAYA | Senior Projektingenieur – Ensotek',
  'Mehmet KAYA unterstützt Kühlturmprojekte durch Auslegung, Lösungsdesign und Inbetriebnahmekoordination – mit Fokus auf Performance und Energieeffizienz.',
  'ensotek,unser team,engineering,projektengineering,senior ingenieur,mehmet kaya',
  @DT_NOW, @DT_NOW
),

-- =============================================================
-- TEAM_SERVICE_1 (Ali DEMİR) – TR/EN/DE
-- =============================================================
(
  @I18N_TEAM_SERVICE_1_TR, @TEAM_SERVICE_1, 'tr',
  'Ali DEMİR',
  'ali-demir-saha-servis-sorumlusu',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Montaj, devreye alma ve periyodik bakım süreçlerinde saha ekibini koordine eder. Arıza tespiti, hızlı müdahale ve planlı bakım organizasyonu ile sistemlerin sürekliliğini destekler.</p>',
      '<h2>Uzmanlık Alanları</h2>',
      '<ul>',
        '<li><strong>Devreye alma:</strong> Test, ayar ve performans doğrulama</li>',
        '<li><strong>Servis operasyonu:</strong> Arıza analizi, yedek parça ve müdahale planı</li>',
        '<li><strong>Bakım:</strong> Periyodik plan, raporlama ve iyileştirme</li>',
      '</ul>',
      '<hr/>',
      '<h2>İletişim</h2>',
      '<div class="ens-teamSocial">',
        '<a class="ens-teamSocial__link" href="mailto:service@ensotek.com" aria-label="E-posta"><i class="fa-solid fa-envelope"></i></a>',
        '<a class="ens-teamSocial__link" href="tel:+905555555555" aria-label="Telefon"><i class="fa-solid fa-phone"></i></a>',
      '</div>'
    )
  ),
  'Saha & Servis Sorumlusu',
  'Ensotek saha ve servis ekibi – Ali DEMİR',
  'Ali DEMİR | Saha & Servis – Ensotek',
  'Ali DEMİR; devreye alma, bakım ve servis süreçlerinde saha ekiplerini koordine eder. Hızlı müdahale ve planlı bakım yaklaşımıyla sistem sürekliliğine odaklanır.',
  'ensotek,ekibimiz,servis,saha,devreye alma,bakım,ali demir',
  @DT_NOW, @DT_NOW
),
(
  @I18N_TEAM_SERVICE_1_EN, @TEAM_SERVICE_1, 'en',
  'Ali DEMİR',
  'ali-demir-field-service-supervisor',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>He coordinates field teams for installation, commissioning and preventive maintenance. He supports continuity through troubleshooting, rapid response and planned maintenance execution.</p>',
      '<h2>Areas of Expertise</h2>',
      '<ul>',
        '<li><strong>Commissioning:</strong> Testing, tuning and verification</li>',
        '<li><strong>Service operations:</strong> Fault analysis, spare parts, intervention planning</li>',
        '<li><strong>Maintenance:</strong> Preventive schedules, reporting and improvement</li>',
      '</ul>',
      '<hr/>',
      '<h2>Contact</h2>',
      '<div class="ens-teamSocial">',
        '<a class="ens-teamSocial__link" href="mailto:service@ensotek.com" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>',
        '<a class="ens-teamSocial__link" href="tel:+905555555555" aria-label="Phone"><i class="fa-solid fa-phone"></i></a>',
      '</div>'
    )
  ),
  'Field & Service Supervisor',
  'Ensotek field & service team – Ali DEMİR',
  'Ali DEMİR | Field & Service – Ensotek',
  'Ali DEMİR supervises commissioning, maintenance and service operations, focusing on rapid response and preventive maintenance to ensure continuity and reliability.',
  'ensotek,our team,service,field,commissioning,maintenance,ali demir',
  @DT_NOW, @DT_NOW
),
(
  @I18N_TEAM_SERVICE_1_DE, @TEAM_SERVICE_1, 'de',
  'Ali DEMİR',
  'ali-demir-field-service-supervisor',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Er koordiniert Teams für Installation, Inbetriebnahme und planmäßige Wartung. Er sichert Verfügbarkeit durch Störungsanalyse, schnelle Einsätze und strukturierte Wartungspläne.</p>',
      '<h2>Expertise</h2>',
      '<ul>',
        '<li><strong>Inbetriebnahme:</strong> Tests, Einstellungen und Verifikation</li>',
        '<li><strong>Service:</strong> Störungsanalyse, Ersatzteile, Einsatzplanung</li>',
        '<li><strong>Wartung:</strong> Präventive Pläne, Reporting und Verbesserung</li>',
      '</ul>',
      '<hr/>',
      '<h2>Kontakt</h2>',
      '<div class="ens-teamSocial">',
        '<a class="ens-teamSocial__link" href="mailto:service@ensotek.com" aria-label="E-Mail"><i class="fa-solid fa-envelope"></i></a>',
        '<a class="ens-teamSocial__link" href="tel:+905555555555" aria-label="Telefon"><i class="fa-solid fa-phone"></i></a>',
      '</div>'
    )
  ),
  'Field & Service Supervisor',
  'Ensotek Service-Team – Ali DEMİR',
  'Ali DEMİR | Service & Feld – Ensotek',
  'Ali DEMİR koordiniert Inbetriebnahme, Wartung und Serviceeinsätze mit Fokus auf schnelle Reaktion und präventive Wartung.',
  'ensotek,unser team,service,feld,inbetriebnahme,wartung,ali demir',
  @DT_NOW, @DT_NOW
),

-- =============================================================
-- TEAM_FT_1 (Can Zemheri) – TR/EN/DE
-- =============================================================
(
  @I18N_TEAM_FT_1_TR, @TEAM_FT_1, 'tr',
  'Can Zemheri',
  'can-zemheri-dis-ticaret',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Ensotek’in uluslararası satış ve dış ticaret süreçlerinde görev alır. İhracat operasyonu, teklif süreçleri, lojistik koordinasyon ve müşteri iletişimini uçtan uca takip eder.</p>',
      '<h2>Odak Alanları</h2>',
      '<ul>',
        '<li><strong>İhracat operasyonu:</strong> Evrak, gümrük ve sevkiyat koordinasyonu</li>',
        '<li><strong>Teklif &amp; müşteri yönetimi:</strong> Dokümantasyon ve termin takibi</li>',
        '<li><strong>Pazar gelişimi:</strong> Yeni ülke/kanal çalışmaları ve iş ortaklıkları</li>',
      '</ul>',
      '<hr/>',
      '<h2>İletişim &amp; Sosyal</h2>',
      '<div class="ens-teamSocial">',
        '<a class="ens-teamSocial__link" href="https://www.linkedin.com/company/ensotek/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>',
        '<a class="ens-teamSocial__link" href="mailto:export@ensotek.com" aria-label="E-posta"><i class="fa-solid fa-envelope"></i></a>',
        '<a class="ens-teamSocial__link" href="tel:+905555555555" aria-label="Telefon"><i class="fa-solid fa-phone"></i></a>',
      '</div>'
    )
  ),
  'Dış Ticaret Uzmanı',
  'Ensotek dış ticaret – Can Zemheri',
  'Can Zemheri | Dış Ticaret – Ensotek',
  'Can Zemheri; Ensotek’in ihracat ve dış ticaret süreçlerini yönetir. Lojistik koordinasyon, teklif takibi ve uluslararası müşteri iletişiminde uçtan uca sorumluluk alır.',
  'ensotek,ekibimiz,dis ticaret,ihracat,lojistik,can zemheri',
  @DT_NOW, @DT_NOW
),
(
  @I18N_TEAM_FT_1_EN, @TEAM_FT_1, 'en',
  'Can Zemheri',
  'can-zemheri-foreign-trade',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>He supports Ensotek’s international sales and foreign trade operations. He ensures end-to-end execution across export documentation, logistics coordination, proposals and customer communication.</p>',
      '<h2>Key Focus Areas</h2>',
      '<ul>',
        '<li><strong>Export operations:</strong> Documentation, customs and shipment coordination</li>',
        '<li><strong>Proposals &amp; customer management:</strong> Documentation and lead-time tracking</li>',
        '<li><strong>Market development:</strong> New countries/channels and partnerships</li>',
      '</ul>',
      '<hr/>',
      '<h2>Contact &amp; Social</h2>',
      '<div class="ens-teamSocial">',
        '<a class="ens-teamSocial__link" href="https://www.linkedin.com/company/ensotek/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>',
        '<a class="ens-teamSocial__link" href="mailto:export@ensotek.com" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>',
        '<a class="ens-teamSocial__link" href="tel:+905555555555" aria-label="Phone"><i class="fa-solid fa-phone"></i></a>',
      '</div>'
    )
  ),
  'Foreign Trade Specialist',
  'Ensotek foreign trade – Can Zemheri',
  'Can Zemheri | Foreign Trade – Ensotek',
  'Can Zemheri manages export workflows and foreign trade operations at Ensotek, coordinating logistics, proposal tracking and international customer communication end-to-end.',
  'ensotek,our team,foreign trade,export,logistics,can zemheri',
  @DT_NOW, @DT_NOW
),
(
  @I18N_TEAM_FT_1_DE, @TEAM_FT_1, 'de',
  'Can Zemheri',
  'can-zemheri-aussenhandel',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<p>Er unterstützt den internationalen Vertrieb sowie Außenhandelsprozesse bei Ensotek. Er verantwortet die End-to-End-Abwicklung von Exportdokumenten, Logistikkoordination, Angeboten und Kundenkommunikation.</p>',
      '<h2>Schwerpunkte</h2>',
      '<ul>',
        '<li><strong>Exportabwicklung:</strong> Dokumente, Zoll und Versandkoordination</li>',
        '<li><strong>Angebote &amp; Kundenmanagement:</strong> Dokumentation und Terminverfolgung</li>',
        '<li><strong>Marktentwicklung:</strong> Neue Länder/Kanäle und Partnerschaften</li>',
      '</ul>',
      '<hr/>',
      '<h2>Kontakt &amp; Social</h2>',
      '<div class="ens-teamSocial">',
        '<a class="ens-teamSocial__link" href="https://www.linkedin.com/company/ensotek/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>',
        '<a class="ens-teamSocial__link" href="mailto:export@ensotek.com" aria-label="E-Mail"><i class="fa-solid fa-envelope"></i></a>',
        '<a class="ens-teamSocial__link" href="tel:+905555555555" aria-label="Telefon"><i class="fa-solid fa-phone"></i></a>',
      '</div>'
    )
  ),
  'Außenhandel',
  'Ensotek Außenhandel – Can Zemheri',
  'Can Zemheri | Außenhandel – Ensotek',
  'Can Zemheri verantwortet Export- und Außenhandelsprozesse bei Ensotek: Logistikkoordination, Angebots-Tracking und internationale Kundenkommunikation – Ende-zu-Ende.',
  'ensotek,unser team,aussenhandel,export,logistik,can zemheri',
  @DT_NOW, @DT_NOW
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

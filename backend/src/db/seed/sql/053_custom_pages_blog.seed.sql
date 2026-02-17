-- =============================================================
-- FILE: 053_custom_pages_blog.seed.sql  (FINAL / SCHEMA-OK)
-- Ensotek – BLOG Custom Pages Seed (TR/EN/DE)
-- ✅ module_key PARENT TABLODA: custom_pages.module_key = 'blog'
-- ✅ i18n içinde module_key YOK
-- ✅ multi-image gallery (images JSON_ARRAY)
-- ✅ deterministic IDs (NO UUID())
-- ✅ time_zone='+00:00'
-- ✅ NO block comments (/* */)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- -------------------------------------------------------------
-- CATEGORY / SUB CATEGORY (011 & 012 ile hizalı)
-- -------------------------------------------------------------
SET @CAT_BLOG_GENERAL := 'aaaa3001-1111-4111-8111-aaaaaaaa3001';
SET @CAT_BLOG_TECH    := 'aaaa3002-1111-4111-8111-aaaaaaaa3002';

SET @SUB_BLOG_MAINT   := 'bbbb3001-1111-4111-8111-bbbbbbbb3001';
SET @SUB_BLOG_DESIGN  := 'bbbb3002-1111-4111-8111-bbbbbbbb3002';
SET @SUB_BLOG_TECH_G  := 'bbbb3101-1111-4111-8111-bbbbbbbb3101';

-- -------------------------------------------------------------
-- PAGE IDS (deterministik)
-- -------------------------------------------------------------
SET @BLOG_MAINT_1  := '33330001-3333-4333-8333-333333330001';
SET @BLOG_DESIGN_1 := '33330002-3333-4333-8333-333333330002';
SET @BLOG_TECH_1   := '33331001-3333-4333-8333-333333331001';

-- -------------------------------------------------------------
-- MODULE KEY (PARENT)
-- -------------------------------------------------------------
SET @MODULE_KEY_BLOG := 'blog';

-- -------------------------------------------------------------
-- IMAGES (featured + random gallery)
-- -------------------------------------------------------------
SET @IMG_BLOG_MAINT_1 :=
  'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1400&q=80';
SET @IMG_BLOG_DESIGN_1 :=
  'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1400&q=80';
SET @IMG_BLOG_TECH_1 :=
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80';

SET @IMG_BLOG_COMMON_1 :=
  'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1400&q=80';
SET @IMG_BLOG_COMMON_2 :=
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1400&q=80';
SET @IMG_BLOG_COMMON_3 :=
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80';
SET @IMG_BLOG_COMMON_4 :=
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80';
SET @IMG_BLOG_COMMON_5 :=
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=80';
SET @IMG_BLOG_COMMON_6 :=
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80';

-- -------------------------------------------------------------
-- I18N IDS (deterministik)
-- -------------------------------------------------------------
SET @I18N_BLOG_MAINT_1_TR  := '77773001-0001-4001-8001-777777773001';
SET @I18N_BLOG_MAINT_1_EN  := '77773001-0002-4002-8002-777777773001';
SET @I18N_BLOG_MAINT_1_DE  := '77773001-0003-4003-8003-777777773001';

SET @I18N_BLOG_DESIGN_1_TR := '77773002-0001-4001-8001-777777773002';
SET @I18N_BLOG_DESIGN_1_EN := '77773002-0002-4002-8002-777777773002';
SET @I18N_BLOG_DESIGN_1_DE := '77773002-0003-4003-8003-777777773002';

SET @I18N_BLOG_TECH_1_TR   := '77773101-0001-4001-8001-777777773101';
SET @I18N_BLOG_TECH_1_EN   := '77773101-0002-4002-8002-777777773101';
SET @I18N_BLOG_TECH_1_DE   := '77773101-0003-4003-8003-777777773101';

-- -------------------------------------------------------------
-- TIMESTAMPS
-- -------------------------------------------------------------
SET @DT_NOW := NOW(3);

-- -------------------------------------------------------------
-- PARENT UPSERT (custom_pages)  ✅ module_key burada
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
    @BLOG_MAINT_1,
    @MODULE_KEY_BLOG,
    1,
    0,
    201,
    201,
    @IMG_BLOG_MAINT_1,
    NULL,
    @IMG_BLOG_MAINT_1,
    NULL,
    JSON_ARRAY(
      @IMG_BLOG_MAINT_1,
      @IMG_BLOG_COMMON_1,
      @IMG_BLOG_COMMON_2,
      @IMG_BLOG_COMMON_5,
      @IMG_BLOG_COMMON_6
    ),
    JSON_ARRAY(),
    @CAT_BLOG_GENERAL,
    @SUB_BLOG_MAINT,
    @DT_NOW,
    @DT_NOW
  ),
  (
    @BLOG_DESIGN_1,
    @MODULE_KEY_BLOG,
    1,
    0,
    202,
    202,
    @IMG_BLOG_DESIGN_1,
    NULL,
    @IMG_BLOG_DESIGN_1,
    NULL,
    JSON_ARRAY(
      @IMG_BLOG_DESIGN_1,
      @IMG_BLOG_COMMON_1,
      @IMG_BLOG_COMMON_3,
      @IMG_BLOG_COMMON_4,
      @IMG_BLOG_COMMON_6
    ),
    JSON_ARRAY(),
    @CAT_BLOG_GENERAL,
    @SUB_BLOG_DESIGN,
    @DT_NOW,
    @DT_NOW
  ),
  (
    @BLOG_TECH_1,
    @MODULE_KEY_BLOG,
    1,
    0,
    203,
    203,
    @IMG_BLOG_TECH_1,
    NULL,
    @IMG_BLOG_TECH_1,
    NULL,
    JSON_ARRAY(
      @IMG_BLOG_TECH_1,
      @IMG_BLOG_COMMON_2,
      @IMG_BLOG_COMMON_3,
      @IMG_BLOG_COMMON_4,
      @IMG_BLOG_COMMON_5
    ),
    JSON_ARRAY(),
    @CAT_BLOG_TECH,
    @SUB_BLOG_TECH_G,
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
-- I18N UPSERT – BLOG_MAINT_1  ✅ module_key YOK
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
(
  @I18N_BLOG_MAINT_1_TR,
  @BLOG_MAINT_1,
  'tr',
  'Su Soğutma Kulelerinde Periyodik Bakım',
  'su-sogutma-kulelerinde-periyodik-bakim',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-3xl">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Su Soğutma Kulelerinde Periyodik Bakım</h1>',
          '<p class="text-slate-700 mb-6">',
            'Su soğutma kulelerinde verim, su kalitesi ve mekanik kondisyon birlikte yönetilmelidir. ',
            'Bu rehber; saha ekibi için pratik kontrol listeleri ve önerilen periyotları bir araya getirir.',
          '</p>',
          '<div class="flex flex-wrap gap-2 mb-8">',
            '<span class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">Bakım</span>',
            '<span class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">Su Kalitesi</span>',
            '<span class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">Performans</span>',
          '</div>',
        '</div>',

        '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-lg font-semibold text-slate-900 mb-2">1) Görsel Kontrol</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Sızıntı, taşma, havuz seviyeleri</li>',
              '<li>Anormal titreşim/ses, fan kanadı hasarı</li>',
              '<li>Motor/kaplin/kayış ve bağlantı elemanları</li>',
              '<li>Elektrik panosu, termik/faz koruma, kablo pabuçları</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-lg font-semibold text-slate-900 mb-2">2) Su Kalitesi Takibi</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>pH, iletkenlik, sertlik, alkalinite</li>',
              '<li>Blowdown oranı ve kimyasal şartlandırma</li>',
              '<li>Biyolojik oluşum (biofilm) ve korozyon izleri</li>',
              '<li>Filtre/strainer ve by-pass kontrolü</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-lg font-semibold text-slate-900 mb-2">3) Dolgu ve Nozul Temizliği</h2>',
            '<p class="text-slate-700 mb-3">',
              'Kireçlenme ve tıkanıklık, ısı transferini doğrudan düşürür. Planlı temizlik, enerji maliyetini azaltır.',
            '</p>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Nozul dağılımı: eşit yağmurlama kontrolü</li>',
              '<li>Dolgu yüzeyi: tıkanıklık ve kırık parça kontrolü</li>',
              '<li>Havuz: çamur/sediment temizliği</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-lg font-semibold text-slate-900 mb-2">4) Fan – Tahrik Kontrolü</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Rulmanlar, yağlama/ısı artışı</li>',
              '<li>Kayış gerginliği ve kasnak hizası</li>',
              '<li>Fan balansı ve gevşek bağlantılar</li>',
              '<li>Vibrasyon trendi (varsa ölçüm kayıtları)</li>',
            '</ul>',
          '</div>',
        '</div>',

        '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">Kısa Performans Kontrolü</h2>',
          '<p class="text-slate-700 mb-4">',
            'Range/Approach değerleri sezon boyunca izlenmelidir. Ani sapmalar; su dağılımı, dolgu tıkanıklığı veya fan debisi problemlerini işaret edebilir.',
          '</p>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Giriş/çıkış su sıcaklıkları ve debi kaydı</li>',
            '<li>Fan amper/enerji tüketimi trendi</li>',
            '<li>Drift eliminator ve damlacık kontrolü</li>',
          '</ul>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">Bakım Periyot Önerisi</h2>',
          '<div class="grid md:grid-cols-2 gap-4">',
            '<div class="rounded-xl bg-slate-50 border border-slate-200 p-5">',
              '<h3 class="font-semibold text-slate-900 mb-2">Haftalık</h3>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Görsel kontrol + kaçak/seviye</li>',
                '<li>Panoda alarm/koruma kontrolü</li>',
              '</ul>',
            '</div>',
            '<div class="rounded-xl bg-slate-50 border border-slate-200 p-5">',
              '<h3 class="font-semibold text-slate-900 mb-2">Aylık</h3>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Nozul/filtre kontrolü</li>',
                '<li>Fan tahrik ve vibrasyon gözlemi</li>',
              '</ul>',
            '</div>',
            '<div class="rounded-xl bg-slate-50 border border-slate-200 p-5">',
              '<h3 class="font-semibold text-slate-900 mb-2">3–6 Ay</h3>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Dolgu ve havuz temizliği</li>',
                '<li>Su analizi doğrulama</li>',
              '</ul>',
            '</div>',
            '<div class="rounded-xl bg-slate-50 border border-slate-200 p-5">',
              '<h3 class="font-semibold text-slate-900 mb-2">Yıllık</h3>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Kapsamlı mekanik kontrol</li>',
                '<li>Performans değerlendirmesi</li>',
              '</ul>',
            '</div>',
          '</div>',
        '</div>',
      '</section>'
    )
  ),
  'Su soğutma kulelerinin verimli ve uzun ömürlü çalışması için periyodik bakım kontrol listeleri ve önerilen periyotlar.',
  'Periyodik bakım rehberi – su soğutma kulesi ekipmanı',
  'Su Soğutma Kulelerinde Periyodik Bakım | Ensotek',
  'Su soğutma kulelerinde periyodik bakım: su kalitesi takibi, dolgu/nozul temizliği, fan-tahrik kontrolleri, performans izleme ve bakım periyotları.',
  'ensotek,blog,bakim,periyodik bakım,su sogutma kuleleri,water quality,fan drive',
  @DT_NOW,
  @DT_NOW
),
(
  @I18N_BLOG_MAINT_1_EN,
  @BLOG_MAINT_1,
  'en',
  'Periodic Maintenance for Water Cooling Towers',
  'periodic-maintenance-water-cooling-towers',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-3xl">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Periodic Maintenance for Water Cooling Towers</h1>',
          '<p class="text-slate-700 mb-6">',
            'Efficiency, water quality, and mechanical condition must be managed together. ',
            'This guide consolidates practical checklists and recommended intervals for field teams.',
          '</p>',
          '<div class="flex flex-wrap gap-2 mb-8">',
            '<span class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">Maintenance</span>',
            '<span class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">Water Quality</span>',
            '<span class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">Performance</span>',
          '</div>',
        '</div>',

        '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-lg font-semibold text-slate-900 mb-2">1) Visual Inspection</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Leaks, overflow, basin levels</li>',
              '<li>Abnormal vibration/noise, fan blade damage</li>',
              '<li>Motor/coupling/belt and fasteners</li>',
              '<li>Electrical panel, protections, terminals</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-lg font-semibold text-slate-900 mb-2">2) Water Quality Monitoring</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>pH, conductivity, hardness, alkalinity</li>',
              '<li>Blowdown rate and chemical treatment</li>',
              '<li>Biofilm and corrosion indicators</li>',
              '<li>Filter/strainer and by-pass checks</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-lg font-semibold text-slate-900 mb-2">3) Fill & Nozzle Cleaning</h2>',
            '<p class="text-slate-700 mb-3">Scaling and clogging reduce heat transfer. Planned cleaning helps reduce energy costs.</p>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Nozzle distribution: uniform spray</li>',
              '<li>Fill surface: clogging and damage</li>',
              '<li>Basin: sludge/sediment cleaning</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-lg font-semibold text-slate-900 mb-2">4) Fan & Drive Checks</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Bearings, lubrication and heat</li>',
              '<li>Belt tension and pulley alignment</li>',
              '<li>Fan balance and loose connections</li>',
              '<li>Vibration trend (if available)</li>',
            '</ul>',
          '</div>',
        '</div>',

        '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">Quick Performance Check</h2>',
          '<p class="text-slate-700 mb-4">',
            'Track Range/Approach throughout the season. Sudden deviations may indicate distribution issues, fill fouling, or fan airflow problems.',
          '</p>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Inlet/outlet water temperatures and flow logs</li>',
            '<li>Fan current/energy consumption trend</li>',
            '<li>Drift eliminator and droplet control</li>',
          '</ul>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">Suggested Maintenance Frequency</h2>',
          '<div class="grid md:grid-cols-2 gap-4">',
            '<div class="rounded-xl bg-slate-50 border border-slate-200 p-5">',
              '<h3 class="font-semibold text-slate-900 mb-2">Weekly</h3>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2"><li>Visual checks + levels/leaks</li><li>Panel alarms/protections</li></ul>',
            '</div>',
            '<div class="rounded-xl bg-slate-50 border border-slate-200 p-5">',
              '<h3 class="font-semibold text-slate-900 mb-2">Monthly</h3>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2"><li>Nozzle/filter inspections</li><li>Fan drive checks</li></ul>',
            '</div>',
            '<div class="rounded-xl bg-slate-50 border border-slate-200 p-5">',
              '<h3 class="font-semibold text-slate-900 mb-2">Every 3–6 months</h3>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2"><li>Basin/fill cleaning</li><li>Water analysis validation</li></ul>',
            '</div>',
            '<div class="rounded-xl bg-slate-50 border border-slate-200 p-5">',
              '<h3 class="font-semibold text-slate-900 mb-2">Annually</h3>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2"><li>Comprehensive mechanical inspection</li><li>Performance review</li></ul>',
            '</div>',
          '</div>',
        '</div>',
      '</section>'
    )
  ),
  'Summary of periodic maintenance checklists and intervals for water cooling towers.',
  'Periodic maintenance guide – water cooling tower equipment',
  'Periodic Maintenance for Water Cooling Towers | Ensotek',
  'Periodic maintenance for water cooling towers: water quality monitoring, fill/nozzle cleaning, fan-drive checks, performance tracking, and recommended intervals.',
  'ensotek,blog,maintenance,periodic maintenance,water cooling towers,water quality,fan drive',
  @DT_NOW,
  @DT_NOW
),
(
  @I18N_BLOG_MAINT_1_DE,
  @BLOG_MAINT_1,
  'de',
  'Regelmaessige Wartung von Wasserkuehltuermen',
  'regelmaessige-wartung-wasserkuehltuerme',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<div class="max-w-3xl">',
          '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Regelmaessige Wartung von Wasserkuehltuermen</h1>',
          '<p class="text-slate-700 mb-6">',
            'Effizienz, Wasserqualitaet und mechanischer Zustand muessen gemeinsam gesteuert werden. ',
            'Dieser Leitfaden fasst praxisnahe Checklisten und Wartungsintervalle zusammen.',
          '</p>',
        '</div>',

        '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-lg font-semibold text-slate-900 mb-2">1) Sichtpruefung</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Leckagen, Ueberlauf, Beckenfuellstaende</li>',
              '<li>Ungewoehnliche Vibration/Geraeusche, Ventilatorblaetter</li>',
              '<li>Motor/Antrieb/Riemen und Befestigungen</li>',
              '<li>Schaltschrank, Schutzfunktionen, Klemmen</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-lg font-semibold text-slate-900 mb-2">2) Wasserqualitaet</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>pH, Leitfaehigkeit, Haerte, Alkalinitaet</li>',
              '<li>Absalzung (Blowdown) und Chemiebehandlung</li>',
              '<li>Biofilm und Korrosionsindikatoren</li>',
              '<li>Filter/Strainer und By-pass pruefen</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-lg font-semibold text-slate-900 mb-2">3) Fuellkoerper & Duesen</h2>',
            '<p class="text-slate-700 mb-3">Verkalkung und Verstopfung reduzieren die Waermeuebertragung. Geplante Reinigung senkt Energieaufwand.</p>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Duesenbild: gleichmaessige Verteilung</li>',
              '<li>Fuellkoerper: Verschmutzung und Schaeden</li>',
              '<li>Becken: Schlamm/Sediment entfernen</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-lg font-semibold text-slate-900 mb-2">4) Ventilator & Antrieb</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Lager, Schmierung und Temperatur</li>',
              '<li>Riemenspannung und Riemenscheibenflucht</li>',
              '<li>Ventilatorbalance und lockere Verbindungen</li>',
              '<li>Vibrationstrend (falls vorhanden)</li>',
            '</ul>',
          '</div>',
        '</div>',

        '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">Kurzer Performance-Check</h2>',
          '<p class="text-slate-700 mb-4">',
            'Range/Approach sollten saisonal getrackt werden. Plaetzliche Abweichungen deuten oft auf Verteilung, Fuellkoerper oder Luftleistung hin.',
          '</p>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Ein-/Austrittstemperaturen und Durchfluss protokollieren</li>',
            '<li>Ventilatorstrom/Energieverbrauch trendbasiert beobachten</li>',
            '<li>Drift Eliminator und Tropfenmitnahme kontrollieren</li>',
          '</ul>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">Empfohlene Wartungsintervalle</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Woechentlich: Sichtpruefung + Fuellstand/Leckagen</li>',
            '<li>Monatlich: Duesen/Filter + Antriebskontrolle</li>',
            '<li>Alle 3–6 Monate: Becken/Fuellkoerper reinigen + Wasseranalyse validieren</li>',
            '<li>Jaehrlich: umfassende mechanische Pruefung + Performance-Bewertung</li>',
          '</ul>',
        '</div>',
      '</section>'
    )
  ),
  'Zusammenfassung von Checklisten und Intervallen fuer die regelmaessige Wartung von Wasserkuehltuermen.',
  'Wartungsleitfaden – Wasserkuehlturm-Anlage',
  'Regelmaessige Wartung von Wasserkuehltuermen | Ensotek',
  'Regelmaessige Wartung von Wasserkuehltuermen: Wasserqualitaet, Reinigung, Antriebskontrollen, Performance-Tracking und Intervalle.',
  'ensotek,blog,wartung,regelmaessige wartung,wasserkuehltuerme,wasserqualitaet,antrieb',
  @DT_NOW,
  @DT_NOW
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

-- =============================================================
-- I18N UPSERT – BLOG_DESIGN_1  ✅ module_key YOK
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
(
  @I18N_BLOG_DESIGN_1_TR,
  @BLOG_DESIGN_1,
  'tr',
  'Endüstriyel Tesisler için Soğutma Kulesi Yerleşimi',
  'endustriyel-tesisler-icin-sogutma-kulesi-yerlesimi',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Endüstriyel Tesisler için Soğutma Kulesi Yerleşimi</h1>',
        '<p class="text-slate-700 mb-6">',
          'Doğru yerleşim; performans, gürültü, servis erişimi ve işletme sürekliliğini doğrudan etkiler. ',
          'Bu yazıda proje fazında kritik yerleşim kriterlerini ve sık yapılan hataları derledik.',
        '</p>',

        '<div class="grid md:grid-cols-2 gap-4 mb-6">',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">1) Hava Sirkülasyonu</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li><strong>Recirculation</strong> riskini azaltın; egzoz ve taze hava yollarını ayırın.</li>',
              '<li>Yüksek duvarlar ve dar şaftlar, sıcak havanın geri emilmesini artırabilir.</li>',
              '<li>Komşu ekipmanlardan yayılan sıcak hava ve buharı hesaba katın.</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">2) Servis ve Bakım Erişimi</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Güvenli yürüyüş yolları ve korkuluklar</li>',
              '<li>Motor/fan için kaldırma alanı (vinç güzergahı)</li>',
              '<li>Havuz temizliği için drenaj ve erişim planı</li>',
            '</ul>',
          '</div>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">3) Gürültü Yönetimi</h2>',
          '<p class="text-slate-700 mb-4">',
            'Yerleşim, gürültü kontrolünde ilk savunma hattıdır. Mesafe, bariyer ve yönlendirme doğru kurgulanırsa ek akustik yatırım azalır.',
          '</p>',
          '<div class="grid md:grid-cols-2 gap-4">',
            '<div class="rounded-xl bg-slate-50 border border-slate-200 p-5">',
              '<h3 class="font-semibold text-slate-900 mb-2">Hızlı Kontroller</h3>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>En yakın sınır/konut mesafesi</li>',
                '<li>Yansıma yapan yüzeyler (duvar, cephe)</li>',
                '<li>Fan hızı/kanat tipi seçimi</li>',
              '</ul>',
            '</div>',
            '<div class="rounded-xl bg-slate-50 border border-slate-200 p-5">',
              '<h3 class="font-semibold text-slate-900 mb-2">Çözümler</h3>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Akustik louver / susturucu</li>',
                '<li>Ses bariyeri ve yönlendirme</li>',
                '<li>VFD ile düşük devir işletme</li>',
              '</ul>',
            '</div>',
          '</div>',
        '</div>',

        '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">4) Borulama ve Hidrolik</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Pompa–kule mesafesini minimize edin; sürtünme kayıplarını düşürün.</li>',
            '<li>By-pass ve izolasyon vanalarını servis edilebilir konumda planlayın.</li>',
            '<li>Drain/overflow hatlarının tahliye güvenliğini kontrol edin.</li>',
            '<li>Vibrasyon izolatörleri ve esnek bağlantıları doğru seçin.</li>',
          '</ul>',
        '</div>',

        '<div class="bg-slate-900 text-white rounded-2xl p-6">',
          '<h2 class="text-xl font-semibold mb-2">Saha Notu</h2>',
          '<p class="text-white/90">',
            'Yerleşim onayından önce, 3D model veya yerleşim krokisi üzerinde bakım senaryolarını (fan-motor değişimi, dolgu temizliği, nozül servis) mutlaka simüle edin.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Endüstriyel tesislerde soğutma kulesi konumlandırması için hava sirkülasyonu, servis erişimi, gürültü ve hidrolik kriterleri.',
  'Tasarım önerileri – endüstriyel tesis yerleşimi ve soğutma kulesi',
  'Endüstriyel Tesisler için Soğutma Kulesi Yerleşimi | Ensotek',
  'Soğutma kulesi yerleşimi: recirculation riskinin azaltılması, servis erişimi, gürültü yönetimi ve borulama/hidrolik optimizasyonu için pratik öneriler.',
  'ensotek,blog,tesis yerlesimi,tasarim onerileri,su sogutma kuleleri,noise control,hydraulic',
  @DT_NOW,
  @DT_NOW
),
(
  @I18N_BLOG_DESIGN_1_EN,
  @BLOG_DESIGN_1,
  'en',
  'Cooling Tower Layout for Industrial Plants',
  'cooling-tower-layout-industrial-plants',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Cooling Tower Layout for Industrial Plants</h1>',
        '<p class="text-slate-700 mb-6">',
          'Layout decisions affect performance, noise, serviceability, and uptime. ',
          'This article summarizes key placement criteria and common pitfalls during the design phase.',
        '</p>',

        '<div class="grid md:grid-cols-2 gap-4 mb-6">',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">1) Airflow Management</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Reduce <strong>recirculation</strong>; separate exhaust and fresh air paths.</li>',
              '<li>High walls and narrow shafts can increase hot air re-ingestion.</li>',
              '<li>Consider hot air plumes from neighboring equipment.</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">2) Service Access</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Safe walkways and guardrails</li>',
              '<li>Lifting/maintenance clearance for motor and fan</li>',
              '<li>Drainage plan for basin cleaning</li>',
            '</ul>',
          '</div>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">3) Noise Considerations</h2>',
          '<p class="text-slate-700 mb-4">',
            'Placement is the first line of defense. Proper distance, barriers, and orientation can reduce additional acoustic investments.',
          '</p>',
          '<div class="grid md:grid-cols-2 gap-4">',
            '<div class="rounded-xl bg-slate-50 border border-slate-200 p-5">',
              '<h3 class="font-semibold text-slate-900 mb-2">Quick Checks</h3>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Distance to the nearest boundary/residential area</li>',
                '<li>Reflective surfaces (walls, facades)</li>',
                '<li>Fan speed and blade selection</li>',
              '</ul>',
            '</div>',
            '<div class="rounded-xl bg-slate-50 border border-slate-200 p-5">',
              '<h3 class="font-semibold text-slate-900 mb-2">Mitigations</h3>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Acoustic louvers / silencers</li>',
                '<li>Noise barriers and redirection</li>',
                '<li>Lower-speed operation with VFD</li>',
              '</ul>',
            '</div>',
          '</div>',
        '</div>',

        '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">4) Piping & Hydraulics</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Minimize pump-to-tower distance to reduce friction losses.</li>',
            '<li>Place isolation and bypass valves for easy service.</li>',
            '<li>Verify safe routing for drain/overflow lines.</li>',
            '<li>Select vibration isolators and flexible connectors appropriately.</li>',
          '</ul>',
        '</div>',

        '<div class="bg-slate-900 text-white rounded-2xl p-6">',
          '<h2 class="text-xl font-semibold mb-2">Field Note</h2>',
          '<p class="text-white/90">Before final approval, simulate maintenance scenarios (fan/motor replacement, fill cleaning, nozzle service) on a layout or 3D model.</p>',
        '</div>',
      '</section>'
    )
  ),
  'Practical layout guidance focusing on airflow, service access, noise, and hydraulic considerations for cooling towers in industrial plants.',
  'Design tips – industrial plant layout and cooling tower placement',
  'Cooling Tower Layout for Industrial Plants | Ensotek',
  'Cooling tower layout: reduce recirculation risk, plan service access, manage noise, and optimize piping/hydraulics with practical design-phase recommendations.',
  'ensotek,blog,plant layout,design tips,water cooling towers,noise,hydraulic',
  @DT_NOW,
  @DT_NOW
),
(
  @I18N_BLOG_DESIGN_1_DE,
  @BLOG_DESIGN_1,
  'de',
  'Kuehlturm-Layout fuer Industrieanlagen',
  'kuehlturm-layout-industrieanlagen',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Kuehlturm-Layout fuer Industrieanlagen</h1>',
        '<p class="text-slate-700 mb-6">',
          'Layout-Entscheidungen beeinflussen Leistung, Laerm, Servicezugang und Verfuegbarkeit. ',
          'Dieser Beitrag fasst zentrale Platzierungskriterien und typische Fehler in der Planungsphase zusammen.',
        '</p>',

        '<div class="grid md:grid-cols-2 gap-4 mb-6">',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">1) Luftfuehrung</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li><strong>Recirculation</strong> vermeiden; Abluft und Frischluftwege trennen.</li>',
              '<li>Hohe Waende und enge Schaechte koennen Rueckansaugung beguenstigen.</li>',
              '<li>Warmluftfahnen benachbarter Anlagen beruecksichtigen.</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">2) Servicezugang</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Sichere Laufwege und Geländer</li>',
              '<li>Hub-/Wartungsfreiraeume fuer Motor und Ventilator</li>',
              '<li>Entwaesserungskonzept fuer Beckenreinigung</li>',
            '</ul>',
          '</div>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">3) Laermmanagement</h2>',
          '<p class="text-slate-700 mb-4">',
            'Die Platzierung ist die erste Schutzstufe. Distanz, Barrieren und Ausrichtung koennen akustische Zusatzmassnahmen reduzieren.',
          '</p>',
          '<div class="grid md:grid-cols-2 gap-4">',
            '<div class="rounded-xl bg-slate-50 border border-slate-200 p-5">',
              '<h3 class="font-semibold text-slate-900 mb-2">Schnellchecks</h3>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Abstand zur naechsten Grenze/Wohnbebauung</li>',
                '<li>Reflektierende Flaechen (Waende/Fassaden)</li>',
                '<li>Ventilatordrehzahl und Fluegelwahl</li>',
              '</ul>',
            '</div>',
            '<div class="rounded-xl bg-slate-50 border border-slate-200 p-5">',
              '<h3 class="font-semibold text-slate-900 mb-2">Massnahmen</h3>',
              '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
                '<li>Akustik-Louver / Schalldaempfer</li>',
                '<li>Laermbarrieren und Umlenkung</li>',
                '<li>Niedrige Drehzahl mit Frequenzumrichter</li>',
              '</ul>',
            '</div>',
          '</div>',
        '</div>',

        '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">4) Rohrleitungen & Hydraulik</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Pumpe–Kuehlturm Distanz minimieren; Druckverluste reduzieren.</li>',
            '<li>By-pass/Absperrarmaturen servicefreundlich anordnen.</li>',
            '<li>Drain/Overflow sicher ableiten.</li>',
            '<li>Schwingungsdaempfer und flexible Verbindungen passend auslegen.</li>',
          '</ul>',
        '</div>',

        '<div class="bg-slate-900 text-white rounded-2xl p-6">',
          '<h2 class="text-xl font-semibold mb-2">Praxis-Hinweis</h2>',
          '<p class="text-white/90">Vor der finalen Freigabe Wartungsszenarien (Motor/Ventilator-Tausch, Fuellkoerper-Reinigung, Duesenservice) im Layout oder 3D-Modell durchspielen.</p>',
        '</div>',
      '</section>'
    )
  ),
  'Kompakte Layout-Empfehlungen: Luftfuehrung, Servicezugang, Laerm und Hydraulik fuer Kuehltuerme in Industrieanlagen.',
  'Design-Tipps – Anlagenlayout und Kuehlturm-Positionierung',
  'Kuehlturm-Layout fuer Industrieanlagen | Ensotek',
  'Kuehlturm-Layout: Recirculation reduzieren, Servicezugang planen, Laerm managen und Rohrleitung/Hydraulik optimieren.',
  'ensotek,blog,anlagenlayout,design tipps,wasserkuehltuerme,laerm,hydraulik',
  @DT_NOW,
  @DT_NOW
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

-- =============================================================
-- I18N UPSERT – BLOG_TECH_1  ✅ module_key YOK
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
(
  @I18N_BLOG_TECH_1_TR,
  @BLOG_TECH_1,
  'tr',
  'FRP Soğutma Kulelerinde Isı Transferi Temelleri',
  'frp-sogutma-kulelerinde-isi-transferi-temelleri',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">FRP Soğutma Kulelerinde Isı Transferi Temelleri</h1>',
        '<p class="text-slate-700 mb-6">',
          'Isı transferi performansı; hava debisi, dolgu (fill) verimi ve su dağıtım kararlılığı ile doğrudan ilişkilidir. ',
          'Bu yazıda temel metrikleri (range/approach), sık sahaya yansıyan problemleri ve hızlı teşhis ipuçlarını özetliyoruz.',
        '</p>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">Temel Kavramlar</h2>',
          '<div class="grid md:grid-cols-2 gap-4">',
            '<div class="rounded-xl bg-slate-50 border border-slate-200 p-5">',
              '<h3 class="font-semibold text-slate-900 mb-2">Range</h3>',
              '<p class="text-slate-700">Kule giriş ve çıkış su sıcaklığı farkı. Sistem yükünü ve kule kapasite kullanımını anlamaya yardımcı olur.</p>',
            '</div>',
            '<div class="rounded-xl bg-slate-50 border border-slate-200 p-5">',
              '<h3 class="font-semibold text-slate-900 mb-2">Approach</h3>',
              '<p class="text-slate-700">Kule çıkış su sıcaklığı ile yaş termometre (wet-bulb) arasındaki fark. Ne kadar düşükse performans o kadar iyidir.</p>',
            '</div>',
          '</div>',
        '</div>',

        '<div class="grid md:grid-cols-2 gap-4 mb-6">',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">1) Hava Debisi</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Fan hızı (VFD), kanat açısı ve kanat yüzeyi</li>',
              '<li>Hava girişlerinde tıkanıklık ve louver durumu</li>',
              '<li>Recirculation ve kısa devre hava akışı</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">2) Dolgu Verimi</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Dolgu yüzey alanı ve temas süresi</li>',
              '<li>Kireçlenme / biyolojik oluşum (biofouling)</li>',
              '<li>Yanlış kimyasal şartlandırma kaynaklı tıkanma</li>',
            '</ul>',
          '</div>',
        '</div>',

        '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">Hızlı Teşhis Tablosu</h2>',
          '<div class="overflow-x-auto">',
            '<table class="w-full text-left border-collapse">',
              '<thead>',
                '<tr class="text-slate-900">',
                  '<th class="py-2 pr-4 border-b border-slate-200">Belirti</th>',
                  '<th class="py-2 pr-4 border-b border-slate-200">Muhtemel Neden</th>',
                  '<th class="py-2 border-b border-slate-200">Kontrol</th>',
                '</tr>',
              '</thead>',
              '<tbody class="text-slate-700">',
                '<tr>',
                  '<td class="py-2 pr-4 border-b border-slate-100">Approach yükseldi</td>',
                  '<td class="py-2 pr-4 border-b border-slate-100">Dolgu kirli / hava debisi düşük</td>',
                  '<td class="py-2 border-b border-slate-100">Dolgu/nozul + fan amper</td>',
                '</tr>',
                '<tr>',
                  '<td class="py-2 pr-4 border-b border-slate-100">Range düştü</td>',
                  '<td class="py-2 pr-4 border-b border-slate-100">Yük azaldı / debi değişti</td>',
                  '<td class="py-2 border-b border-slate-100">Debi ölçümü + proses</td>',
                '</tr>',
                '<tr>',
                  '<td class="py-2 pr-4 border-b border-slate-100">Damlacık artışı</td>',
                  '<td class="py-2 pr-4 border-b border-slate-100">Drift eliminator hasarı</td>',
                  '<td class="py-2 border-b border-slate-100">Eliminator kontrolü</td>',
                '</tr>',
              '</tbody>',
            '</table>',
          '</div>',
        '</div>',

        '<div class="bg-slate-900 text-white rounded-2xl p-6">',
          '<h2 class="text-xl font-semibold mb-2">Pratik Öneri</h2>',
          '<p class="text-white/90">',
            'Trend analizi yapın: aynı hava koşullarında (benzer wet-bulb) approach/range ve fan enerji tüketimini kaydedin. ',
            'Sapmalar, arıza oluşmadan önce sinyal verir.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'FRP soğutma kulelerinde ısı transferini etkileyen temel parametreler: range/approach, hava debisi, dolgu verimi ve hızlı teşhis ipuçları.',
  'Teknik rehber – FRP soğutma kulelerinde ısı transferi',
  'FRP Soğutma Kulelerinde Isı Transferi Temelleri | Ensotek',
  'FRP soğutma kulelerinde ısı transferi: range/approach metrikleri, fan hava debisi, dolgu verimi, su dağıtımı ve saha için hızlı teşhis kontrol listeleri.',
  'ensotek,blog,frp,isi transferi,teknik rehber,su sogutma kuleleri,approach,range',
  @DT_NOW,
  @DT_NOW
),
(
  @I18N_BLOG_TECH_1_EN,
  @BLOG_TECH_1,
  'en',
  'Basics of Heat Transfer in FRP Cooling Towers',
  'basics-heat-transfer-frp-cooling-towers',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Basics of Heat Transfer in FRP Cooling Towers</h1>',
        '<p class="text-slate-700 mb-6">',
          'Heat transfer performance depends on airflow, fill efficiency, and stable water distribution. ',
          'This article summarizes key metrics (range/approach), common site issues, and quick troubleshooting tips.',
        '</p>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">Core Metrics</h2>',
          '<div class="grid md:grid-cols-2 gap-4">',
            '<div class="rounded-xl bg-slate-50 border border-slate-200 p-5">',
              '<h3 class="font-semibold text-slate-900 mb-2">Range</h3>',
              '<p class="text-slate-700">Difference between inlet and outlet water temperature. Indicates load and capacity utilization.</p>',
            '</div>',
            '<div class="rounded-xl bg-slate-50 border border-slate-200 p-5">',
              '<h3 class="font-semibold text-slate-900 mb-2">Approach</h3>',
              '<p class="text-slate-700">Difference between outlet water temperature and wet-bulb. Lower approach typically means better performance.</p>',
            '</div>',
          '</div>',
        '</div>',

        '<div class="grid md:grid-cols-2 gap-4 mb-6">',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">1) Airflow</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Fan speed (VFD), blade angle and surface condition</li>',
              '<li>Blockage at air inlets and louver condition</li>',
              '<li>Recirculation and short-circuit airflow</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">2) Fill Efficiency</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Surface area and contact time</li>',
              '<li>Scaling and biofouling</li>',
              '<li>Fouling due to inconsistent water treatment</li>',
            '</ul>',
          '</div>',
        '</div>',

        '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">Quick Troubleshooting</h2>',
          '<div class="overflow-x-auto">',
            '<table class="w-full text-left border-collapse">',
              '<thead><tr class="text-slate-900">',
                '<th class="py-2 pr-4 border-b border-slate-200">Symptom</th>',
                '<th class="py-2 pr-4 border-b border-slate-200">Likely cause</th>',
                '<th class="py-2 border-b border-slate-200">Check</th>',
              '</tr></thead>',
              '<tbody class="text-slate-700">',
                '<tr><td class="py-2 pr-4 border-b border-slate-100">Approach increases</td><td class="py-2 pr-4 border-b border-slate-100">Fouled fill / low airflow</td><td class="py-2 border-b border-slate-100">Fill/nozzles + fan current</td></tr>',
                '<tr><td class="py-2 pr-4 border-b border-slate-100">Range decreases</td><td class="py-2 pr-4 border-b border-slate-100">Load/flow change</td><td class="py-2 border-b border-slate-100">Flow measurement + process</td></tr>',
                '<tr><td class="py-2 pr-4 border-b border-slate-100">More droplet carryover</td><td class="py-2 pr-4 border-b border-slate-100">Damaged drift eliminator</td><td class="py-2 border-b border-slate-100">Eliminator inspection</td></tr>',
              '</tbody>',
            '</table>',
          '</div>',
        '</div>',

        '<div class="bg-slate-900 text-white rounded-2xl p-6">',
          '<h2 class="text-xl font-semibold mb-2">Practical Tip</h2>',
          '<p class="text-white/90">Track trends: at similar wet-bulb conditions, record approach/range and fan energy. Deviations are early-warning signals.</p>',
        '</div>',
      '</section>'
    )
  ),
  'Key parameters for heat transfer in FRP cooling towers: range/approach, airflow, fill efficiency, and quick troubleshooting.',
  'Technical guide – heat transfer in FRP cooling towers',
  'Basics of Heat Transfer in FRP Cooling Towers | Ensotek',
  'Heat transfer in FRP cooling towers: range/approach metrics, fan airflow, fill efficiency, water distribution, and quick field troubleshooting checklists.',
  'ensotek,blog,frp,heat transfer,technical guide,water cooling towers,approach,range',
  @DT_NOW,
  @DT_NOW
),
(
  @I18N_BLOG_TECH_1_DE,
  @BLOG_TECH_1,
  'de',
  'Grundlagen der Waermeuebertragung in FRP-Kuehltuermen',
  'grundlagen-waermeuebertragung-frp-kuehltuerme',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Grundlagen der Waermeuebertragung in FRP-Kuehltuermen</h1>',
        '<p class="text-slate-700 mb-6">',
          'Die Leistung haengt von Luftstrom, Fuellkoerper (Fill) und stabiler Wasserverteilung ab. ',
          'Hier fassen wir Kennzahlen (Range/Approach), typische Praxisprobleme und schnelle Diagnosehinweise zusammen.',
        '</p>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">Grundbegriffe</h2>',
          '<div class="grid md:grid-cols-2 gap-4">',
            '<div class="rounded-xl bg-slate-50 border border-slate-200 p-5">',
              '<h3 class="font-semibold text-slate-900 mb-2">Range</h3>',
              '<p class="text-slate-700">Differenz zwischen Ein- und Austrittstemperatur des Wassers. Zeigt Last und Auslastung.</p>',
            '</div>',
            '<div class="rounded-xl bg-slate-50 border border-slate-200 p-5">',
              '<h3 class="font-semibold text-slate-900 mb-2">Approach</h3>',
              '<p class="text-slate-700">Differenz zwischen Austrittswasser und Nasskugeltemperatur. Ein kleiner Approach bedeutet meist bessere Performance.</p>',
            '</div>',
          '</div>',
        '</div>',

        '<div class="grid md:grid-cols-2 gap-4 mb-6">',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">1) Luftleistung</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Ventilatordrehzahl (FU), Schaufelwinkel, Zustand</li>',
              '<li>Einlassbereiche, Louver und Verstopfungen</li>',
              '<li>Recirculation und Kurzschlussstroemung</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">2) Fuellkoerper-Effizienz</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Oberflaeche und Kontaktzeit</li>',
              '<li>Verkalkung und Biofouling</li>',
              '<li>Verschmutzung durch unpassende Wasserbehandlung</li>',
            '</ul>',
          '</div>',
        '</div>',

        '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">Schnelldiagnose</h2>',
          '<div class="overflow-x-auto">',
            '<table class="w-full text-left border-collapse">',
              '<thead><tr class="text-slate-900">',
                '<th class="py-2 pr-4 border-b border-slate-200">Symptom</th>',
                '<th class="py-2 pr-4 border-b border-slate-200">Moegliche Ursache</th>',
                '<th class="py-2 border-b border-slate-200">Pruefung</th>',
              '</tr></thead>',
              '<tbody class="text-slate-700">',
                '<tr><td class="py-2 pr-4 border-b border-slate-100">Approach steigt</td><td class="py-2 pr-4 border-b border-slate-100">Fuellkoerper verschmutzt / Luftstrom niedrig</td><td class="py-2 border-b border-slate-100">Fuellkoerper/Duesen + Ventilatorstrom</td></tr>',
                '<tr><td class="py-2 pr-4 border-b border-slate-100">Range sinkt</td><td class="py-2 pr-4 border-b border-slate-100">Last/Durchfluss aendert sich</td><td class="py-2 border-b border-slate-100">Durchflussmessung + Prozess</td></tr>',
                '<tr><td class="py-2 pr-4 border-b border-slate-100">Tropfenmitnahme steigt</td><td class="py-2 pr-4 border-b border-slate-100">Drift Eliminator beschaedigt</td><td class="py-2 border-b border-slate-100">Eliminator kontrollieren</td></tr>',
              '</tbody>',
            '</table>',
          '</div>',
        '</div>',

        '<div class="bg-slate-900 text-white rounded-2xl p-6">',
          '<h2 class="text-xl font-semibold mb-2">Praxis-Tipp</h2>',
          '<p class="text-white/90">Trends erfassen: bei aehnlicher Nasskugeltemperatur Approach/Range und Energieverbrauch protokollieren. Abweichungen sind Fruehwarnsignale.</p>',
        '</div>',
      '</section>'
    )
  ),
  'Wichtige Parameter: Range/Approach, Luftleistung, Fuellkoerper-Effizienz und schnelle Diagnosehinweise fuer FRP-Kuehltuerme.',
  'Technikleitfaden – Waermeuebertragung in FRP-Kuehltuermen',
  'Grundlagen der Waermeuebertragung in FRP-Kuehltuermen | Ensotek',
  'FRP-Kuehltuerme: Waermeuebertragung beeinflusst durch Luftstrom, Fuellkoerper, Wasserverteilung sowie Range/Approach und Praxis-Checklisten.',
  'ensotek,blog,frp,waermeuebertragung,technikleitfaden,wasserkuehltuerme,approach,range',
  @DT_NOW,
  @DT_NOW
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

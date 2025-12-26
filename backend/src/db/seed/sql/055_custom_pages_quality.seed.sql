-- =============================================================
-- FILE: 055_custom_pages_quality.seed.sql
-- CUSTOM PAGE – Kalite Belgelerimiz & Kalite Standartlarımız
-- custom_pages + custom_pages_i18n (TR/EN/DE)
-- NOT: Bu dosyada BLOK YORUM (/* */) YOKTUR. Sadece "--" kullanılır.
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- -------------------------------------------------------------
-- KATEGORİ / ALT KATEGORİ (KENDİ PROJENE GÖRE DÜZENLE)
-- -------------------------------------------------------------
-- Eğer custom_pages.category_id/sub_category_id FK zorunluysa,
-- aşağıdaki ID’leri 011/012 seed’lerinle uyumlu gerçek ID’lere çek.
SET @CAT_CORPORATE := 'aaaa7001-1111-4111-8111-aaaaaaaa7001'; -- ABOUT: KURUMSAL
SET @SUB_CORP_QUALITY := 'bbbb7004-1111-4111-8111-bbbbbbbb7004'; -- Kurumsal > Kalite & Sertifikalar


-- -------------------------------------------------------------
-- SABİT PAGE ID (deterministik)
-- -------------------------------------------------------------
SET @QUALITY_CERTS_1 := '33330001-3333-4333-8333-333333330001';

-- -------------------------------------------------------------
-- FEATURED IMAGE + SERTİFİKA GÖRSELLERİ
-- Bu URL’leri kendi storage/cloudinary URL’lerinle değiştir.
-- -------------------------------------------------------------
SET @IMG_QUALITY_HERO :=
  'https://images.unsplash.com/photo-1581091870627-3c7d1a2b1f33?auto=format&fit=crop&w=1400&h=900&q=80';

-- Sertifikalar (ekrandaki gibi 6 adet)
SET @CERT_IMG_1 := 'https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&h=800&q=80';
SET @CERT_IMG_2 := 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1200&h=800&q=80';
SET @CERT_IMG_3 := 'https://images.unsplash.com/photo-1554774853-b414d88f2b2f?auto=format&fit=crop&w=1200&h=800&q=80';
SET @CERT_IMG_4 := 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=1200&h=800&q=80';
SET @CERT_IMG_5 := 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=1200&h=800&q=80';
SET @CERT_IMG_6 := 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&h=800&q=80';

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
    @QUALITY_CERTS_1,
    1,
    120,
    @IMG_QUALITY_HERO,
    NULL,
    @CAT_CORPORATE,
    @SUB_CORP_QUALITY,
    NOW(3),
    NOW(3)
  )
ON DUPLICATE KEY UPDATE
  `is_published`    = VALUES(`is_published`),
  `display_order`   = VALUES(`display_order`),
  `category_id`     = VALUES(`category_id`),
  `sub_category_id` = VALUES(`sub_category_id`),
  `featured_image`  = VALUES(`featured_image`),
  `updated_at`      = VALUES(`updated_at`);

-- =============================================================
-- I18N – Kalite Belgelerimiz (TR/EN/DE)
-- content JSON_OBJECT('html', CONCAT(...)) formatında tutulur.
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
  @QUALITY_CERTS_1,
  'tr',
  'Kalite Belgelerimiz & Kalite Standartlarımız',
  'kalite-belgelerimiz-kalite-standartlarimiz',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Kalite Belgelerimiz & Kalite Standartlarımız</h1>',
        '<p class="text-slate-700 mb-8">',
          'Ensotek, ürün ve hizmet kalitesini <strong>uluslararası standartlar</strong> ile doğrular. ',
          'Sertifikasyonlarımız; <strong>güvenilirlik</strong>, <strong>verimlilik</strong> ve <strong>sürdürülebilirlik</strong> odağımızın somut göstergesidir.',
        '</p>',

        '<div class="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-2xl border-l-4 border-blue-700 shadow-sm mb-10">',
          '<h2 class="text-2xl text-slate-900 mb-4">Standartlarımız</h2>',
          '<div class="space-y-4 text-slate-700">',
            '<p>',
              'Ensotek bünyesinde uyguladığımız kalite yönetim yaklaşımı; süreçlerin ölçülebilir yönetimini, ',
              'risklerin kontrolünü ve sürekli iyileştirmeyi esas alır.',
            '</p>',
            '<ul class="list-disc pl-6 space-y-2">',
              '<li><strong>ISO 9001</strong>: Kalite Yönetim Sistemi</li>',
              '<li><strong>ISO 14001</strong>: Çevre Yönetim Sistemi</li>',
              '<li><strong>ISO 45001</strong> / OHSAS: İş Sağlığı ve Güvenliği yaklaşımı</li>',
              '<li><strong>Uygunluk & standartlara uyum</strong>: Ürün güvenliği ve dokümantasyon disiplinleri</li>',
            '</ul>',
          '</div>',
        '</div>',

        '<div class="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm mb-10">',
          '<h2 class="text-xl text-blue-800 mb-4">Sertifikalar</h2>',
          '<p class="text-slate-700 mb-6">',
            'Aşağıda sertifikalarımızı ayrı ayrı görüntüleyebilirsiniz. Görselleri büyütmek için tıklayın.',
          '</p>',

          '<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">',
            '<a href="', @CERT_IMG_1, '" target="_blank" rel="noopener" class="block group">',
              '<div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">',
                '<img src="', @CERT_IMG_1, '" alt="ISO sertifikası – Ensotek" class="w-full h-56 object-cover group-hover:opacity-95"/>',
                '<div class="p-4">',
                  '<div class="text-sm font-semibold text-slate-900">Sertifika 1</div>',
                  '<div class="text-xs text-slate-600 mt-1">Kalite Yönetim Sistemi dokümantasyonu</div>',
                '</div>',
              '</div>',
            '</a>',

            '<a href="', @CERT_IMG_2, '" target="_blank" rel="noopener" class="block group">',
              '<div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">',
                '<img src="', @CERT_IMG_2, '" alt="ISO sertifikası – Ensotek" class="w-full h-56 object-cover group-hover:opacity-95"/>',
                '<div class="p-4">',
                  '<div class="text-sm font-semibold text-slate-900">Sertifika 2</div>',
                  '<div class="text-xs text-slate-600 mt-1">Süreç ve kalite standartları</div>',
                '</div>',
              '</div>',
            '</a>',

            '<a href="', @CERT_IMG_3, '" target="_blank" rel="noopener" class="block group">',
              '<div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">',
                '<img src="', @CERT_IMG_3, '" alt="Uygunluk beyanı – Ensotek" class="w-full h-56 object-cover group-hover:opacity-95"/>',
                '<div class="p-4">',
                  '<div class="text-sm font-semibold text-slate-900">Sertifika 3</div>',
                  '<div class="text-xs text-slate-600 mt-1">Uygunluk / beyan dokümanı</div>',
                '</div>',
              '</div>',
            '</a>',

            '<a href="', @CERT_IMG_4, '" target="_blank" rel="noopener" class="block group">',
              '<div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">',
                '<img src="', @CERT_IMG_4, '" alt="Standart / uygunluk belgesi – Ensotek" class="w-full h-56 object-cover group-hover:opacity-95"/>',
                '<div class="p-4">',
                  '<div class="text-sm font-semibold text-slate-900">Sertifika 4</div>',
                  '<div class="text-xs text-slate-600 mt-1">Standartlara uyum ve kayıt</div>',
                '</div>',
              '</div>',
            '</a>',

            '<a href="', @CERT_IMG_5, '" target="_blank" rel="noopener" class="block group">',
              '<div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">',
                '<img src="', @CERT_IMG_5, '" alt="ISO sertifikası – Ensotek" class="w-full h-56 object-cover group-hover:opacity-95"/>',
                '<div class="p-4">',
                  '<div class="text-sm font-semibold text-slate-900">Sertifika 5</div>',
                  '<div class="text-xs text-slate-600 mt-1">Yönetim sistemi belgelendirmesi</div>',
                '</div>',
              '</div>',
            '</a>',

            '<a href="', @CERT_IMG_6, '" target="_blank" rel="noopener" class="block group">',
              '<div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">',
                '<img src="', @CERT_IMG_6, '" alt="ISO sertifikası – Ensotek" class="w-full h-56 object-cover group-hover:opacity-95"/>',
                '<div class="p-4">',
                  '<div class="text-sm font-semibold text-slate-900">Sertifika 6</div>',
                  '<div class="text-xs text-slate-600 mt-1">Kalite ve uygunluk kayıtları</div>',
                '</div>',
              '</div>',
            '</a>',
          '</div>',
        '</div>',

        '<div class="bg-gradient-to-r from-slate-900 to-blue-800 text-white p-8 rounded-2xl shadow-sm">',
          '<h2 class="text-xl mb-3">Kalite Taahhüdümüz</h2>',
          '<p class="text-white/90">',
            'Ensotek; tasarım, üretim ve saha süreçlerinde <strong>standartlara uyum</strong>, <strong>izlenebilirlik</strong> ve ',
            '<strong>sürekli iyileştirme</strong> yaklaşımıyla müşterilerine güvenilir çözümler sunmayı taahhüt eder.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Ensotek kalite belgeleri ve sertifikaları sayfası',
  'Ensotek kalite belgeleri – sertifikalar',
  'Kalite Belgelerimiz & Kalite Standartlarımız | Ensotek',
  'Ensotek kalite belgeleri ve kalite standartları: ISO 9001, ISO 14001, iş sağlığı ve güvenliği yaklaşımı ve uygunluk dokümantasyonları. Sertifikaları ayrı görsellerle inceleyin.',
  'ensotek,kalite,sertifika,iso 9001,iso 14001,iso 45001,ohsas,standartlar',
  NOW(3),
  NOW(3)
),

-- -------------------------------------------------------------
-- EN
-- -------------------------------------------------------------
(
  UUID(),
  @QUALITY_CERTS_1,
  'en',
  'Quality Certificates & Quality Standards',
  'quality-certificates-quality-standards',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Quality Certificates & Quality Standards</h1>',
        '<p class="text-slate-700 mb-8">',
          'Ensotek validates product and service quality through <strong>internationally recognised standards</strong>. ',
          'Our certifications reflect a consistent focus on <strong>reliability</strong>, <strong>efficiency</strong> and <strong>sustainability</strong>.',
        '</p>',

        '<div class="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-2xl border-l-4 border-blue-700 shadow-sm mb-10">',
          '<h2 class="text-2xl text-slate-900 mb-4">Our Standards</h2>',
          '<div class="space-y-4 text-slate-700">',
            '<p>',
              'Our quality management approach is built on measurable process control, risk management and continuous improvement across operations.',
            '</p>',
            '<ul class="list-disc pl-6 space-y-2">',
              '<li><strong>ISO 9001</strong>: Quality Management System</li>',
              '<li><strong>ISO 14001</strong>: Environmental Management System</li>',
              '<li><strong>ISO 45001</strong> / OHSAS: Occupational health and safety approach</li>',
              '<li><strong>Compliance & documentation</strong>: Product safety and conformity disciplines</li>',
            '</ul>',
          '</div>',
        '</div>',

        '<div class="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm mb-10">',
          '<h2 class="text-xl text-blue-800 mb-4">Certificates</h2>',
          '<p class="text-slate-700 mb-6">',
            'You can view each certificate separately below. Click an image to open it in full size.',
          '</p>',

          '<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">',
            '<a href="', @CERT_IMG_1, '" target="_blank" rel="noopener" class="block group">',
              '<div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">',
                '<img src="', @CERT_IMG_1, '" alt="Ensotek certificate" class="w-full h-56 object-cover group-hover:opacity-95"/>',
                '<div class="p-4"><div class="text-sm font-semibold text-slate-900">Certificate 1</div><div class="text-xs text-slate-600 mt-1">Quality management documentation</div></div>',
              '</div>',
            '</a>',
            '<a href="', @CERT_IMG_2, '" target="_blank" rel="noopener" class="block group">',
              '<div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">',
                '<img src="', @CERT_IMG_2, '" alt="Ensotek certificate" class="w-full h-56 object-cover group-hover:opacity-95"/>',
                '<div class="p-4"><div class="text-sm font-semibold text-slate-900">Certificate 2</div><div class="text-xs text-slate-600 mt-1">Process and quality standards</div></div>',
              '</div>',
            '</a>',
            '<a href="', @CERT_IMG_3, '" target="_blank" rel="noopener" class="block group">',
              '<div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">',
                '<img src="', @CERT_IMG_3, '" alt="Ensotek declaration / conformity document" class="w-full h-56 object-cover group-hover:opacity-95"/>',
                '<div class="p-4"><div class="text-sm font-semibold text-slate-900">Certificate 3</div><div class="text-xs text-slate-600 mt-1">Declaration / conformity document</div></div>',
              '</div>',
            '</a>',
            '<a href="', @CERT_IMG_4, '" target="_blank" rel="noopener" class="block group">',
              '<div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">',
                '<img src="', @CERT_IMG_4, '" alt="Ensotek compliance document" class="w-full h-56 object-cover group-hover:opacity-95"/>',
                '<div class="p-4"><div class="text-sm font-semibold text-slate-900">Certificate 4</div><div class="text-xs text-slate-600 mt-1">Standards and compliance record</div></div>',
              '</div>',
            '</a>',
            '<a href="', @CERT_IMG_5, '" target="_blank" rel="noopener" class="block group">',
              '<div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">',
                '<img src="', @CERT_IMG_5, '" alt="Ensotek certificate" class="w-full h-56 object-cover group-hover:opacity-95"/>',
                '<div class="p-4"><div class="text-sm font-semibold text-slate-900">Certificate 5</div><div class="text-xs text-slate-600 mt-1">Management system certification</div></div>',
              '</div>',
            '</a>',
            '<a href="', @CERT_IMG_6, '" target="_blank" rel="noopener" class="block group">',
              '<div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">',
                '<img src="', @CERT_IMG_6, '" alt="Ensotek certificate" class="w-full h-56 object-cover group-hover:opacity-95"/>',
                '<div class="p-4"><div class="text-sm font-semibold text-slate-900">Certificate 6</div><div class="text-xs text-slate-600 mt-1">Quality and compliance records</div></div>',
              '</div>',
            '</a>',
          '</div>',
        '</div>',

        '<div class="bg-gradient-to-r from-slate-900 to-blue-800 text-white p-8 rounded-2xl shadow-sm">',
          '<h2 class="text-xl mb-3">Our Quality Commitment</h2>',
          '<p class="text-white/90">',
            'Ensotek commits to delivering reliable solutions through <strong>standards compliance</strong>, <strong>traceability</strong> and ',
            '<strong>continuous improvement</strong> across design, manufacturing and field operations.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Ensotek quality certificates and standards page',
  'Ensotek quality certificates – certificates gallery',
  'Quality Certificates & Standards | Ensotek',
  'Ensotek quality certificates and standards: ISO 9001, ISO 14001, occupational H&S approach, and compliance documentation. View each certificate as a separate image.',
  'ensotek,quality,certificate,iso 9001,iso 14001,iso 45001,ohsas,standards',
  NOW(3),
  NOW(3)
),

-- -------------------------------------------------------------
-- DE
-- -------------------------------------------------------------
(
  UUID(),
  @QUALITY_CERTS_1,
  'de',
  'Zertifikate & Qualitätsstandards',
  'zertifikate-qualitaetsstandards',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Zertifikate & Qualitätsstandards</h1>',
        '<p class="text-slate-700 mb-8">',
          'Ensotek bestätigt seine Qualität durch <strong>international anerkannte Standards</strong>. ',
          'Unsere Zertifikate stehen für <strong>Zuverlässigkeit</strong>, <strong>Effizienz</strong> und <strong>Nachhaltigkeit</strong>.',
        '</p>',

        '<div class="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-2xl border-l-4 border-blue-700 shadow-sm mb-10">',
          '<h2 class="text-2xl text-slate-900 mb-4">Unsere Standards</h2>',
          '<div class="space-y-4 text-slate-700">',
            '<p>',
              'Unser Qualitätsmanagement basiert auf messbarer Prozesssteuerung, Risikomanagement und kontinuierlicher Verbesserung.',
            '</p>',
            '<ul class="list-disc pl-6 space-y-2">',
              '<li><strong>ISO 9001</strong>: Qualitätsmanagementsystem</li>',
              '<li><strong>ISO 14001</strong>: Umweltmanagementsystem</li>',
              '<li><strong>ISO 45001</strong> / OHSAS: Arbeitsschutz- und Sicherheitsansatz</li>',
              '<li><strong>Konformität & Dokumentation</strong>: Produktsicherheit und Nachweisführung</li>',
            '</ul>',
          '</div>',
        '</div>',

        '<div class="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm mb-10">',
          '<h2 class="text-xl text-blue-800 mb-4">Zertifikate</h2>',
          '<p class="text-slate-700 mb-6">',
            'Unten können Sie jedes Zertifikat einzeln ansehen. Klicken Sie auf ein Bild, um es in voller Größe zu öffnen.',
          '</p>',

          '<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">',
            '<a href="', @CERT_IMG_1, '" target="_blank" rel="noopener" class="block group">',
              '<div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">',
                '<img src="', @CERT_IMG_1, '" alt="Ensotek Zertifikat" class="w-full h-56 object-cover group-hover:opacity-95"/>',
                '<div class="p-4"><div class="text-sm font-semibold text-slate-900">Zertifikat 1</div><div class="text-xs text-slate-600 mt-1">Qualitätsmanagement-Dokumentation</div></div>',
              '</div>',
            '</a>',
            '<a href="', @CERT_IMG_2, '" target="_blank" rel="noopener" class="block group">',
              '<div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">',
                '<img src="', @CERT_IMG_2, '" alt="Ensotek Zertifikat" class="w-full h-56 object-cover group-hover:opacity-95"/>',
                '<div class="p-4"><div class="text-sm font-semibold text-slate-900">Zertifikat 2</div><div class="text-xs text-slate-600 mt-1">Prozess- und Qualitätsstandards</div></div>',
              '</div>',
            '</a>',
            '<a href="', @CERT_IMG_3, '" target="_blank" rel="noopener" class="block group">',
              '<div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">',
                '<img src="', @CERT_IMG_3, '" alt="Ensotek Konformitätsdokument" class="w-full h-56 object-cover group-hover:opacity-95"/>',
                '<div class="p-4"><div class="text-sm font-semibold text-slate-900">Zertifikat 3</div><div class="text-xs text-slate-600 mt-1">Erklärung / Konformitätsdokument</div></div>',
              '</div>',
            '</a>',
            '<a href="', @CERT_IMG_4, '" target="_blank" rel="noopener" class="block group">',
              '<div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">',
                '<img src="', @CERT_IMG_4, '" alt="Ensotek Nachweis" class="w-full h-56 object-cover group-hover:opacity-95"/>',
                '<div class="p-4"><div class="text-sm font-semibold text-slate-900">Zertifikat 4</div><div class="text-xs text-slate-600 mt-1">Normen- und Konformitätsnachweis</div></div>',
              '</div>',
            '</a>',
            '<a href="', @CERT_IMG_5, '" target="_blank" rel="noopener" class="block group">',
              '<div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">',
                '<img src="', @CERT_IMG_5, '" alt="Ensotek Zertifikat" class="w-full h-56 object-cover group-hover:opacity-95"/>',
                '<div class="p-4"><div class="text-sm font-semibold text-slate-900">Zertifikat 5</div><div class="text-xs text-slate-600 mt-1">Managementsystem-Zertifizierung</div></div>',
              '</div>',
            '</a>',
            '<a href="', @CERT_IMG_6, '" target="_blank" rel="noopener" class="block group">',
              '<div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">',
                '<img src="', @CERT_IMG_6, '" alt="Ensotek Zertifikat" class="w-full h-56 object-cover group-hover:opacity-95"/>',
                '<div class="p-4"><div class="text-sm font-semibold text-slate-900">Zertifikat 6</div><div class="text-xs text-slate-600 mt-1">Qualitäts- und Konformitätsunterlagen</div></div>',
              '</div>',
            '</a>',
          '</div>',
        '</div>',

        '<div class="bg-gradient-to-r from-slate-900 to-blue-800 text-white p-8 rounded-2xl shadow-sm">',
          '<h2 class="text-xl mb-3">Unser Qualitätsversprechen</h2>',
          '<p class="text-white/90">',
            'Ensotek steht für <strong>Normenkonformität</strong>, <strong>Rückverfolgbarkeit</strong> und ',
            '<strong>kontinuierliche Verbesserung</strong> – von der Entwicklung über die Fertigung bis zum Einsatz vor Ort.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Ensotek Zertifikate und Qualitätsstandards',
  'Ensotek Zertifikate – Galerie',
  'Zertifikate & Qualitätsstandards | Ensotek',
  'Ensotek Zertifikate und Qualitätsstandards: ISO 9001, ISO 14001, Arbeitsschutz-Ansatz sowie Konformitätsdokumente. Alle Zertifikate als отдельные Bilder anzeigen.',
  'ensotek,qualitaet,zertifikat,iso 9001,iso 14001,iso 45001,ohsas,standards',
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

-- =============================================================
-- FILE: 051.6_custom_pages_terms.seed.sql (FINAL)
-- Ensotek – Custom Page: Kullanım Koşulları (TR/EN/DE)
-- ✅ module_key artık PARENT: custom_pages.module_key = 'terms'
-- Category: LEGAL (aaaa7101)
-- SubCategory: Kullanım Koşulları (bbbb7007)
-- NOT: Bu dosyada BLOK YORUM (/* */) YOKTUR. Sadece "--" kullanılır.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

SET @CAT_LEGAL  := 'aaaa7101-1111-4111-8111-aaaaaaaa7101';
SET @SUB_TERMS  := 'bbbb7007-1111-4111-8111-bbbbbbbb7007';
SET @PAGE_TERMS := '55550004-5555-4555-8555-555555550004';

-- PARENT MODULE KEY
SET @MODULE_KEY := 'terms';

SET @IMG_TERMS :=
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80';
SET @IMG_TERMS_2 :=
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80';
SET @IMG_TERMS_3 :=
  'https://images.unsplash.com/photo-1523287562758-66c7fc58967f?auto=format&fit=crop&w=1400&q=80';

-- -------------------------------------------------------------
-- PARENT UPSERT (custom_pages)
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
    @PAGE_TERMS,
    @MODULE_KEY,
    1,
    0,
    30,
    30,
    @IMG_TERMS,
    NULL,
    @IMG_TERMS,
    NULL,
    JSON_ARRAY(@IMG_TERMS, @IMG_TERMS_2, @IMG_TERMS_3),
    JSON_ARRAY(),
    @CAT_LEGAL,
    @SUB_TERMS,
    NOW(3),
    NOW(3)
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

-- -------------------------------------------------------------
-- I18N UPSERT (custom_pages_i18n)
-- ✅ module_key yok
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
(
  UUID(), @PAGE_TERMS, 'tr',
  'Kullanım Koşulları',
  'kullanim-kosullari',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Kullanım Koşulları</h1>',
        '<p class="text-slate-700 mb-8">',
          'Bu web sitesini ziyaret eden veya kullanan herkes aşağıdaki koşulları kabul etmiş sayılır. ',
          'Koşullar; içerik kullanımını, sorumluluk sınırlarını, üçüncü taraf bağlantılarını ve değişiklik hükümlerini kapsar.',
        '</p>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Amaç ve Kapsam</h2>',
          '<p class="text-slate-700">',
            'Bu koşullar, Ensotek web sitesinin kullanımına ilişkin kuralları ve tarafların hak/yükümlülülüklerini düzenler. ',
            'Sitedeki içerikler bilgilendirme amaçlıdır.',
          '</p>',
        '</div>',

        '<div class="grid md:grid-cols-2 gap-6 mb-6">',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. İçerik ve Fikri Mülkiyet</h2>',
            '<p class="text-slate-700 mb-3">',
              'Sitedeki metin, görsel, logo ve diğer tüm materyaller Ensotek’e veya hak sahiplerine aittir.',
            '</p>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>İzinsiz kopyalama/çoğaltma/yayma yapılamaz</li>',
              '<li>Marka ve logo kullanımı yazılı izne tabidir</li>',
              '<li>Teknik dokümanlar yalnızca bilgilendirme amaçlı paylaşılır</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Kullanıcı Yükümlülükleri</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Siteyi hukuka ve ahlaka aykırı amaçlarla kullanmamak</li>',
              '<li>Sisteme zarar verebilecek girişimlerde bulunmamak</li>',
              '<li>Yanıltıcı/gerçeğe aykırı bilgi paylaşmamak</li>',
            '</ul>',
          '</div>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">4. Sorumluluk Reddi</h2>',
          '<p class="text-slate-700 mb-3">',
            'Sitede yer alan bilgiler genel bilgilendirme amaçlıdır. Ensotek, içeriğin doğruluğu ve güncelliği için makul çaba gösterir; ',
            'ancak içeriklerin hatasız olduğu veya her zaman güncel kalacağı yönünde garanti vermez.',
          '</p>',
          '<p class="text-slate-700">',
            'Sitedeki bilgilere dayanarak alınacak kararlardan doğabilecek zararlar kullanıcı sorumluluğundadır.',
          '</p>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">5. Üçüncü Taraf Bağlantılar</h2>',
          '<p class="text-slate-700">',
            'Üçüncü taraf sitelere verilen bağlantılar bilgi amaçlıdır. Ensotek bu sitelerin içeriğinden ve uygulamalarından sorumlu değildir.',
          '</p>',
        '</div>',

        '<div class="bg-slate-900 text-white rounded-2xl p-6">',
          '<h2 class="text-xl font-semibold mb-3">6. Değişiklikler</h2>',
          '<p class="text-white/90">',
            'Ensotek, kullanım koşullarını güncelleme hakkını saklı tutar. Güncellemeler web sitesinde yayımlandığı tarihten itibaren geçerlidir.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Ensotek Kullanım Koşulları: web sitesinin kullanımı, fikri mülkiyet, sorumluluk sınırları ve değişiklik hükümleri.',
  'Ensotek Kullanım Koşulları sayfası',
  'Kullanım Koşulları | Ensotek',
  'Ensotek web sitesi kullanım koşulları: içerik hakları, kullanıcı yükümlülükleri, sorumluluk reddi ve üçüncü taraf bağlantılar.',
  'ensotek,legal,kullanim kosullari,terms,fikri mulkiyet,sorumluluk',
  NOW(3), NOW(3)
),
(
  UUID(), @PAGE_TERMS, 'en',
  'Terms of Use',
  'terms-of-use',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Terms of Use</h1>',
        '<p class="text-slate-700 mb-8">',
          'By accessing or using this website you agree to the terms below. These terms cover content usage, limitation of liability, external links and updates.',
        '</p>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Purpose and Scope</h2>',
          '<p class="text-slate-700">',
            'These terms govern the use of the Ensotek website. Website content is provided for informational purposes only.',
          '</p>',
        '</div>',

        '<div class="grid md:grid-cols-2 gap-6 mb-6">',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Intellectual Property</h2>',
            '<p class="text-slate-700 mb-3">',
              'Texts, images, logos and all materials are owned by Ensotek or respective rights holders.',
            '</p>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>No reproduction or distribution without permission</li>',
              '<li>Trademark/logo use requires written consent</li>',
              '<li>Technical documents are provided for reference</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. User Obligations</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Do not use the site for unlawful purposes</li>',
              '<li>Do not attempt to harm systems or services</li>',
              '<li>Do not submit misleading information</li>',
            '</ul>',
          '</div>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">4. Disclaimer</h2>',
          '<p class="text-slate-700 mb-3">',
            'Content is provided “as is” for general information. Ensotek makes reasonable efforts to keep information accurate and up to date, but provides no warranty.',
          '</p>',
          '<p class="text-slate-700">',
            'Any reliance on site content is at the user’s own risk.',
          '</p>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">5. External Links</h2>',
          '<p class="text-slate-700">',
            'Links to third-party websites are provided for convenience. Ensotek is not responsible for third-party content or practices.',
          '</p>',
        '</div>',

        '<div class="bg-slate-900 text-white rounded-2xl p-6">',
          '<h2 class="text-xl font-semibold mb-3">6. Changes</h2>',
          '<p class="text-white/90">',
            'Ensotek may update these terms. Changes take effect upon publication on this website.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Ensotek Terms of Use: website usage, intellectual property, user obligations, disclaimer and updates.',
  'Ensotek Terms of Use page',
  'Terms of Use | Ensotek',
  'Ensotek Terms of Use covers IP, user obligations, disclaimers, external links and changes.',
  'ensotek,legal,terms of use,disclaimer,intellectual property',
  NOW(3), NOW(3)
),
(
  UUID(), @PAGE_TERMS, 'de',
  'Nutzungsbedingungen',
  'nutzungsbedingungen',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Nutzungsbedingungen</h1>',
        '<p class="text-slate-700 mb-8">',
          'Durch den Zugriff auf diese Website akzeptieren Sie die folgenden Bedingungen. Sie regeln u. a. Inhaltsnutzung, Haftungsbeschränkung, externe Links und Änderungen.',
        '</p>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Zweck und Geltungsbereich</h2>',
          '<p class="text-slate-700">Diese Bedingungen regeln die Nutzung der Ensotek-Website. Inhalte dienen der allgemeinen Information.</p>',
        '</div>',

        '<div class="grid md:grid-cols-2 gap-6 mb-6">',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Urheberrechte</h2>',
            '<p class="text-slate-700 mb-3">Texte, Bilder, Logos und Materialien sind Eigentum von Ensotek bzw. Rechteinhabern.</p>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Keine Vervielfältigung ohne Erlaubnis</li>',
              '<li>Marken-/Logonutzung nur mit Zustimmung</li>',
              '<li>Technische Dokumente dienen als Referenz</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Pflichten der Nutzer</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Keine rechtswidrige Nutzung</li>',
              '<li>Keine schädigenden Systemeingriffe</li>',
              '<li>Keine irreführenden Angaben</li>',
            '</ul>',
          '</div>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">4. Haftungsausschluss</h2>',
          '<p class="text-slate-700 mb-3">',
            'Inhalte werden „wie gesehen“ bereitgestellt. Ensotek bemüht sich um Aktualität, übernimmt jedoch keine Gewähr.',
          '</p>',
          '<p class="text-slate-700">Die Nutzung der Informationen erfolgt auf eigenes Risiko.</p>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">5. Externe Links</h2>',
          '<p class="text-slate-700">Für Inhalte verlinkter Drittseiten übernimmt Ensotek keine Verantwortung.</p>',
        '</div>',

        '<div class="bg-slate-900 text-white rounded-2xl p-6">',
          '<h2 class="text-xl font-semibold mb-3">6. Änderungen</h2>',
          '<p class="text-white/90">Ensotek kann diese Bedingungen aktualisieren. Änderungen gelten ab Veröffentlichung.</p>',
        '</div>',
      '</section>'
    )
  ),
  'Ensotek Nutzungsbedingungen: Website-Nutzung, Urheberrechte, Pflichten, Haftungsausschluss und Änderungen.',
  'Ensotek Nutzungsbedingungen',
  'Nutzungsbedingungen | Ensotek',
  'Die Nutzungsbedingungen regeln Inhaltsnutzung, Haftungsausschluss, externe Links und Aktualisierungen.',
  'ensotek,legal,nutzungsbedingungen,haftung,urheberrecht',
  NOW(3), NOW(3)
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

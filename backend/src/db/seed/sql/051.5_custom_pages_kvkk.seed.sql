-- =============================================================
-- FILE: 051.5_custom_pages_kvkk.seed.sql (FINAL - FIXED, rerunnable)
-- Ensotek – Custom Page: KVKK (TR/EN/DE)
-- ✅ custom_pages.module_key = 'kvkk'
-- Category: LEGAL (aaaa7101)
-- SubCategory: KVKK (bbbb7006)
-- NOT: Bu dosyada BLOK YORUM (/* */) YOKTUR. Sadece "--" kullanılır.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

SET @CAT_LEGAL := 'aaaa7101-1111-4111-8111-aaaaaaaa7101';
SET @SUB_KVKK  := 'bbbb7006-1111-4111-8111-bbbbbbbb7006';

-- PAGE ID (privacy ile çakışmayacak şekilde)
SET @PAGE_KVKK := '55550003-5555-4555-8555-555555550003';

-- PARENT MODULE KEY
SET @MODULE_KEY := 'kvkk';

-- Deterministic I18N IDs (rerunnable)
SET @I18N_TR := '66660003-5555-4555-8555-5555555500tr';
SET @I18N_EN := '66660003-5555-4555-8555-5555555500en';
SET @I18N_DE := '66660003-5555-4555-8555-5555555500de';

SET @IMG_KVKK :=
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80';
SET @IMG_KVKK_2 :=
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=80';
SET @IMG_KVKK_3 :=
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80';

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
    @PAGE_KVKK,
    @MODULE_KEY,
    1,
    0,
    20,
    20,
    @IMG_KVKK,
    NULL,
    @IMG_KVKK,
    NULL,
    JSON_ARRAY(@IMG_KVKK, @IMG_KVKK_2, @IMG_KVKK_3),
    JSON_ARRAY(),
    @CAT_LEGAL,
    @SUB_KVKK,
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
-- ✅ deterministic IDs => rerunnable
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
  @I18N_TR, @PAGE_KVKK, 'tr',
  'KVKK',
  'kvkk',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">KVKK</h1>',
        '<p class="text-slate-700 mb-8">',
          'Ensotek, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında kişisel verilerin işlenmesi ve korunmasına önem verir. ',
          'Bu sayfa; veri sorumlusu, işlenen veri kategorileri, amaçlar, hukuki sebepler ve başvuru haklarına ilişkin genel bilgilendirme sunar.',
        '</p>',
        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Veri Sorumlusu</h2>',
          '<p class="text-slate-700">',
            'Kişisel verileriniz, veri sorumlusu sıfatıyla Ensotek tarafından KVKK ve ilgili mevzuata uygun olarak işlenebilir.',
          '</p>',
        '</div>',
        '<div class="grid md:grid-cols-2 gap-6 mb-6">',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Veri Kategorileri</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Kimlik ve iletişim verileri (iletişim formları vb.)</li>',
              '<li>Talep/iletişim içerikleri ve yazışmalar</li>',
              '<li>İşlem güvenliği ve teknik log verileri</li>',
              '<li>Kurumsal ziyaretçi bilgileri (firma/ünvan vb. – varsa)</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. İşleme Amaçları</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Taleplere dönüş ve müşteri ilişkilerinin yönetimi</li>',
              '<li>Hizmet süreçlerinin iyileştirilmesi ve kalite yönetimi</li>',
              '<li>Bilgi güvenliği ve sistem güvenliğinin sağlanması</li>',
              '<li>Hukuki yükümlülükler ve uyuşmazlık yönetimi</li>',
            '</ul>',
          '</div>',
        '</div>',
        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">4. Hukuki Sebepler</h2>',
          '<p class="text-slate-700 mb-3">',
            'Veriler; sözleşmenin kurulması/ifası, meşru menfaat, hukuki yükümlülüklerin yerine getirilmesi ve gerektiğinde açık rıza gibi hukuki sebeplere dayanılarak işlenebilir.',
          '</p>',
          '<p class="text-slate-700">',
            'Somut süreçlere göre hukuki sebep değişebilir. İlgili detaylar Aydınlatma Metni sayfamızda ayrıca yer alır.',
          '</p>',
        '</div>',
        '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">5. Veri Güvenliği</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Yetkilendirme ve erişim kontrolü</li>',
            '<li>Loglama, izleme ve olay yönetimi</li>',
            '<li>Yedekleme ve iş sürekliliği önlemleri</li>',
            '<li>Gerekli hallerde sözleşmesel gizlilik yükümlülükleri</li>',
          '</ul>',
        '</div>',
        '<div class="bg-slate-900 text-white rounded-2xl p-6">',
          '<h2 class="text-xl font-semibold mb-3">6. Başvuru Hakları</h2>',
          '<p class="text-white/90">',
            'KVKK kapsamında; bilgi talep etme, düzeltme, silme, işleme itiraz etme gibi haklara sahipsiniz. Başvurularınız, mevzuat çerçevesinde değerlendirilir.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Ensotek KVKK sayfası: 6698 sayılı kanun kapsamında veri işleme ve ilgili kişi haklarına ilişkin genel bilgilendirme.',
  'Ensotek KVKK bilgilendirme sayfası',
  'KVKK | Ensotek',
  'Ensotek KVKK bilgilendirmesi: kişisel verilerin işlenmesi, hukuki sebepler, güvenlik önlemleri ve başvuru hakları.',
  'ensotek,legal,kvkk,kisisel veri,veri guvenligi,aydinlatma',
  NOW(3), NOW(3)
),
(
  @I18N_EN, @PAGE_KVKK, 'en',
  'PDPL (KVKK)',
  'pdpl-kvkk',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">PDPL (KVKK)</h1>',
        '<p class="text-slate-700 mb-8">',
          'Ensotek processes and protects personal data in accordance with Turkish PDPL (KVKK No. 6698) and applicable regulations. ',
          'This page provides a general overview of data categories, purposes, legal grounds and rights.',
        '</p>',
        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Data Controller</h2>',
          '<p class="text-slate-700">Ensotek may process personal data as the data controller in line with applicable laws.</p>',
        '</div>',
        '<div class="grid md:grid-cols-2 gap-6 mb-6">',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Data Categories</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Identity and contact data (contact forms, etc.)</li>',
              '<li>Request/correspondence content</li>',
              '<li>Security and technical log data</li>',
              '<li>Business visitor data (company/title – if provided)</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Purposes</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Responding to requests and managing customer relations</li>',
              '<li>Improving service processes and quality management</li>',
              '<li>Operating information security and system protection</li>',
              '<li>Complying with legal obligations and dispute handling</li>',
            '</ul>',
          '</div>',
        '</div>',
        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">4. Legal Grounds</h2>',
          '<p class="text-slate-700">',
            'Data may be processed based on contract performance, legitimate interests, compliance with legal obligations, and consent where required. ',
            'Details for specific processes are also outlined in our Information Notice.',
          '</p>',
        '</div>',
        '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">5. Security</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Access controls and authorisation</li>',
            '<li>Logging, monitoring and incident management</li>',
            '<li>Backups and business continuity measures</li>',
            '<li>Confidentiality obligations with providers where applicable</li>',
          '</ul>',
        '</div>',
        '<div class="bg-slate-900 text-white rounded-2xl p-6">',
          '<h2 class="text-xl font-semibold mb-3">6. Data Subject Rights</h2>',
          '<p class="text-white/90">',
            'You have rights such as requesting information, rectification, deletion and objection. Requests are handled according to applicable laws.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Ensotek PDPL/KVKK overview: data categories, purposes, legal grounds and rights.',
  'Ensotek PDPL/KVKK notice page',
  'PDPL (KVKK) | Ensotek',
  'Ensotek PDPL/KVKK overview covering processing purposes, legal grounds, security measures and data subject rights.',
  'ensotek,legal,pdpl,kvkk,personal data,data protection',
  NOW(3), NOW(3)
),
(
  @I18N_DE, @PAGE_KVKK, 'de',
  'DSGVO / KVKK',
  'dsgvo-kvkk',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">DSGVO / KVKK</h1>',
        '<p class="text-slate-700 mb-8">',
          'Ensotek verarbeitet personenbezogene Daten im Einklang mit den anwendbaren gesetzlichen Vorgaben (u. a. DSGVO/KVKK-Kontext). ',
          'Diese Seite bietet eine allgemeine Übersicht zu Kategorien, Zwecken, Rechtsgrundlagen und Rechten.',
        '</p>',
        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Verantwortlicher</h2>',
          '<p class="text-slate-700">Ensotek kann personenbezogene Daten als Verantwortlicher rechtskonform verarbeiten.</p>',
        '</div>',
        '<div class="grid md:grid-cols-2 gap-6 mb-6">',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Datenkategorien</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Kontakt- und Identifikationsdaten</li>',
              '<li>Inhalte von Anfragen/Korrespondenz</li>',
              '<li>Sicherheits- und technische Logdaten</li>',
              '<li>Unternehmensbezogene Angaben (falls angegeben)</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Zwecke</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Bearbeitung von Anfragen und Kundenkommunikation</li>',
              '<li>Qualitätsmanagement und Prozessverbesserung</li>',
              '<li>Informationssicherheit und Systemschutz</li>',
              '<li>Erfüllung gesetzlicher Pflichten und Streitbeilegung</li>',
            '</ul>',
          '</div>',
        '</div>',
        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">4. Rechtsgrundlagen</h2>',
          '<p class="text-slate-700">',
            'Die Verarbeitung kann auf Grundlage vertraglicher Erforderlichkeit, berechtigter Interessen, gesetzlicher Pflichten und – sofern erforderlich – Einwilligung erfolgen. ',
            'Weitere Details sind in der Informationspflicht/Aydınlatma Metni beschrieben.',
          '</p>',
        '</div>',
        '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">5. Sicherheit</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Zugriffskontrollen und Berechtigungen</li>',
            '<li>Protokollierung, Monitoring und Incident-Management</li>',
            '<li>Backups und Notfallmaßnahmen</li>',
            '<li>Ggf. vertragliche Vertraulichkeitsregelungen</li>',
          '</ul>',
        '</div>',
        '<div class="bg-slate-900 text-white rounded-2xl p-6">',
          '<h2 class="text-xl font-semibold mb-3">6. Betroffenenrechte</h2>',
          '<p class="text-white/90">',
            'Sie haben Rechte wie Auskunft, Berichtigung, Löschung und Widerspruch. Anträge werden nach anwendbarem Recht bearbeitet.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Ensotek DSGVO/KVKK Übersicht: Datenkategorien, Zwecke, Rechtsgrundlagen und Rechte.',
  'Ensotek DSGVO/KVKK Hinweis',
  'DSGVO / KVKK | Ensotek',
  'Übersicht zu personenbezogenen Daten bei Ensotek: Verarbeitung, Rechtsgrundlagen, Sicherheitsmaßnahmen und Betroffenenrechte.',
  'ensotek,legal,datenschutz,dsgvo,kvkk,personenbezogene daten',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `page_id`             = VALUES(`page_id`),
  `locale`              = VALUES(`locale`),
  `title`               = VALUES(`title`),
  `slug`                = VALUES(`slug`),
  `content`             = VALUES(`content`),
  `summary`             = VALUES(`summary`),
  `featured_image_alt`  = VALUES(`featured_image_alt`),
  `meta_title`          = VALUES(`meta_title`),
  `meta_description`    = VALUES(`meta_description`),
  `tags`                = VALUES(`tags`),
  `updated_at`          = VALUES(`updated_at`);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;

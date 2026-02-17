-- =============================================================
-- FILE: 051.8_custom_pages_privacy_notice.seed.sql (FINAL)
-- Ensotek – Custom Page: Aydınlatma Metni (TR/EN/DE)
-- ✅ module_key artık PARENT: custom_pages.module_key = 'privacy_notice'
-- Category: LEGAL (aaaa7101)
-- SubCategory: Aydınlatma Metni (bbbb7009)
-- NOT: Bu dosyada BLOK YORUM (/* */) YOKTUR. Sadece "--" kullanılır.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

SET @CAT_LEGAL   := 'aaaa7101-1111-4111-8111-aaaaaaaa7101';
SET @SUB_NOTICE  := 'bbbb7009-1111-4111-8111-bbbbbbbb7009';
SET @PAGE_NOTICE := '55550006-5555-4555-8555-555555550006';

-- PARENT MODULE KEY
SET @MODULE_KEY := 'privacy_notice';

SET @IMG_NOTICE :=
  'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1400&q=80';
SET @IMG_NOTICE_2 :=
  'https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=1400&q=80';
SET @IMG_NOTICE_3 :=
  'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=1400&q=80';

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
    @PAGE_NOTICE,
    @MODULE_KEY,
    1,
    0,
    50,
    50,
    @IMG_NOTICE,
    NULL,
    @IMG_NOTICE,
    NULL,
    JSON_ARRAY(@IMG_NOTICE, @IMG_NOTICE_2, @IMG_NOTICE_3),
    JSON_ARRAY(),
    @CAT_LEGAL,
    @SUB_NOTICE,
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
  UUID(), @PAGE_NOTICE, 'tr',
  'Aydınlatma Metni',
  'aydinlatma-metni',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Aydınlatma Metni</h1>',
        '<p class="text-slate-700 mb-8">',
          'Bu metin, kişisel verilerin işlenmesine ilişkin bilgilendirme amacıyla hazırlanmıştır. ',
          'İşlenen veriler, amaçlar, hukuki sebepler, aktarım tarafları ve haklarınız aşağıda özetlenmiştir.',
        '</p>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Veri Sorumlusu</h2>',
          '<p class="text-slate-700">Veri sorumlusu Ensotek’tir.</p>',
        '</div>',

        '<div class="grid md:grid-cols-2 gap-6 mb-6">',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. İşlenen Veriler</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>İletişim bilgileri (ad, e-posta, telefon)</li>',
              '<li>Talep/mesaj içerikleri</li>',
              '<li>Teknik veriler ve log kayıtları</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. İşleme Amaçları</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>İletişim taleplerinin alınması ve yanıtlanması</li>',
              '<li>Teklif ve satış süreçlerinin yürütülmesi</li>',
              '<li>Bilgi güvenliği ve sistem güvenliği</li>',
              '<li>Yasal yükümlülüklerin yerine getirilmesi</li>',
            '</ul>',
          '</div>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">4. Hukuki Sebepler</h2>',
          '<p class="text-slate-700">',
            'Veriler; sözleşmenin kurulması/ifası, meşru menfaat, hukuki yükümlülük ve gerektiğinde açık rıza gibi sebeplerle işlenebilir.',
          '</p>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">5. Aktarım</h2>',
          '<p class="text-slate-700 mb-3">',
            'Hizmetin sağlanması kapsamında sınırlı olarak hizmet sağlayıcılara (barındırma, e-posta, güvenlik, analiz vb.) aktarım yapılabilir. ',
            'Bu aktarım sözleşmesel ve güvenlik tedbirleriyle yürütülür.',
          '</p>',
          '<p class="text-slate-700">',
            'Yasal zorunluluk halinde yetkili kurum/kuruluşlara aktarım söz konusu olabilir.',
          '</p>',
        '</div>',

        '<div class="bg-slate-900 text-white rounded-2xl p-6">',
          '<h2 class="text-xl font-semibold mb-3">6. Haklarınız</h2>',
          '<p class="text-white/90">',
            'KVKK kapsamında; bilgi talep etme, düzeltme, silme, itiraz gibi haklara sahipsiniz. Talepleriniz mevzuat çerçevesinde değerlendirilir.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Ensotek Aydınlatma Metni: veri sorumlusu, işleme amaçları, hukuki sebepler, aktarım ve haklar.',
  'Ensotek Aydınlatma Metni sayfası',
  'Aydınlatma Metni | Ensotek',
  'Ensotek aydınlatma metni; kişisel verilerin işlenmesi, hukuki sebepler, aktarım ve ilgili kişi hakları hakkında bilgilendirir.',
  'ensotek,legal,aydinlatma metni,kvkk,kisisel veri,veri isleme',
  NOW(3), NOW(3)
),
(
  UUID(), @PAGE_NOTICE, 'en',
  'Information Notice',
  'information-notice',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Information Notice</h1>',
        '<p class="text-slate-700 mb-8">',
          'This notice provides information about processing of personal data, including data categories, purposes, legal grounds, transfers and your rights.',
        '</p>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Data Controller</h2>',
          '<p class="text-slate-700">Ensotek is the data controller.</p>',
        '</div>',

        '<div class="grid md:grid-cols-2 gap-6 mb-6">',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Data We Process</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Contact data (name, email, phone)</li>',
              '<li>Request/message content</li>',
              '<li>Technical data and logs</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Purposes</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Receiving and responding to requests</li>',
              '<li>Managing quotation and sales processes</li>',
              '<li>Information security and system protection</li>',
              '<li>Complying with legal obligations</li>',
            '</ul>',
          '</div>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">4. Legal Grounds</h2>',
          '<p class="text-slate-700">Processing may rely on contract necessity, legitimate interests, legal obligations and consent where required.</p>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">5. Transfers</h2>',
          '<p class="text-slate-700">',
            'Limited sharing with service providers (hosting, email delivery, security, analytics, etc.) may occur under contractual and security safeguards. ',
            'Legal disclosures to authorities may occur where required.',
          '</p>',
        '</div>',

        '<div class="bg-slate-900 text-white rounded-2xl p-6">',
          '<h2 class="text-xl font-semibold mb-3">6. Your Rights</h2>',
          '<p class="text-white/90">You may contact us to exercise your rights under applicable laws. Requests are assessed and handled accordingly.</p>',
        '</div>',
      '</section>'
    )
  ),
  'Ensotek Information Notice: controller, purposes, legal grounds, transfers and rights.',
  'Ensotek Information Notice page',
  'Information Notice | Ensotek',
  'Ensotek information notice about personal data processing, transfers and data subject rights.',
  'ensotek,legal,information notice,privacy,personal data,rights',
  NOW(3), NOW(3)
),
(
  UUID(), @PAGE_NOTICE, 'de',
  'Informationspflicht',
  'informationspflicht',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Informationspflicht</h1>',
        '<p class="text-slate-700 mb-8">',
          'Diese Informationen erläutern die Verarbeitung personenbezogener Daten, einschließlich Kategorien, Zwecke, Rechtsgrundlagen, Weitergaben und Ihrer Rechte.',
        '</p>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Verantwortlicher</h2>',
          '<p class="text-slate-700">Verantwortlicher ist Ensotek.</p>',
        '</div>',

        '<div class="grid md:grid-cols-2 gap-6 mb-6">',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Verarbeitete Daten</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Kontaktdaten (Name, E-Mail, Telefon)</li>',
              '<li>Inhalte von Anfragen/Nachrichten</li>',
              '<li>Technische Daten und Logs</li>',
            '</ul>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Zwecke</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Entgegennahme und Beantwortung von Anfragen</li>',
              '<li>Angebots- und Vertriebsprozesse</li>',
              '<li>Informationssicherheit und Systemschutz</li>',
              '<li>Erfüllung gesetzlicher Pflichten</li>',
            '</ul>',
          '</div>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">4. Rechtsgrundlagen</h2>',
          '<p class="text-slate-700">Verarbeitung kann auf Vertragserforderlichkeit, berechtigte Interessen, gesetzliche Pflichten und ggf. Einwilligung gestützt werden.</p>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">5. Weitergabe</h2>',
          '<p class="text-slate-700">',
            'Eine begrenzte Weitergabe an Dienstleister (Hosting, E-Mail, Sicherheit, Analyse usw.) kann unter vertraglichen und technischen Schutzmaßnahmen erfolgen. ',
            'Gesetzliche Offenlegungen an Behörden können erforderlich sein.',
          '</p>',
        '</div>',

        '<div class="bg-slate-900 text-white rounded-2xl p-6">',
          '<h2 class="text-xl font-semibold mb-3">6. Ihre Rechte</h2>',
          '<p class="text-white/90">Sie können uns kontaktieren, um Ihre Betroffenenrechte nach anwendbarem Recht wahrzunehmen.</p>',
        '</div>',
      '</section>'
    )
  ),
  'Ensotek Informationspflicht: Zwecke, Rechtsgrundlagen, Weitergabe und Betroffenenrechte.',
  'Ensotek Informationspflicht',
  'Informationspflicht | Ensotek',
  'Hinweise zur Datenverarbeitung bei Ensotek: Zwecke, Rechtsgrundlagen, Weitergabe und Rechte.',
  'ensotek,legal,informationspflicht,datenschutz,personenbezogene daten',
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

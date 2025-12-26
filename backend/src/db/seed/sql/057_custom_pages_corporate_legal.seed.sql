-- =============================================================
-- FILE: 057_custom_pages_corporate_legal.seed.sql
-- Ensotek – Corporate Legal Pages (TR/EN/DE)
-- Pages:
--  - KVKK
--  - Kullanım Koşulları
--  - Çerez Politikası
--  - Aydınlatma Metni
--  - Yasal Bilgilendirme
-- Category: ABOUT/Kurumsal (aaaa7001)
-- NOT: Bu dosyada BLOK YORUM (/* */) YOKTUR. Sadece "--" kullanılır.
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- -------------------------------------------------------------
-- CATEGORY
-- -------------------------------------------------------------
SET @CAT_CORPORATE := 'aaaa7001-1111-4111-8111-aaaaaaaa7001'; -- KURUMSAL

-- -------------------------------------------------------------
-- SUB CATEGORIES (deterministik)
-- -------------------------------------------------------------
SET @SUB_KVKK       := 'bbbb7006-1111-4111-8111-bbbbbbbb7006';
SET @SUB_TERMS      := 'bbbb7007-1111-4111-8111-bbbbbbbb7007';
SET @SUB_COOKIES    := 'bbbb7008-1111-4111-8111-bbbbbbbb7008';
SET @SUB_NOTICE     := 'bbbb7009-1111-4111-8111-bbbbbbbb7009';
SET @SUB_LEGAL      := 'bbbb7010-1111-4111-8111-bbbbbbbb7010';

-- -------------------------------------------------------------
-- PAGE IDS (deterministik)
-- -------------------------------------------------------------
SET @PAGE_KVKK    := '55550002-5555-4555-8555-555555550002';
SET @PAGE_TERMS   := '55550003-5555-4555-8555-555555550003';
SET @PAGE_COOKIES := '55550004-5555-4555-8555-555555550004';
SET @PAGE_NOTICE  := '55550005-5555-4555-8555-555555550005';
SET @PAGE_LEGAL   := '55550006-5555-4555-8555-555555550006';

-- -------------------------------------------------------------
-- I18N IDS (deterministik)  (page_id + locale)
-- -------------------------------------------------------------
SET @I18N_KVKK_TR := '66660002-0001-4001-8001-666666660002';
SET @I18N_KVKK_EN := '66660002-0002-4002-8002-666666660002';
SET @I18N_KVKK_DE := '66660002-0003-4003-8003-666666660002';

SET @I18N_TERMS_TR := '66660003-0001-4001-8001-666666660003';
SET @I18N_TERMS_EN := '66660003-0002-4002-8002-666666660003';
SET @I18N_TERMS_DE := '66660003-0003-4003-8003-666666660003';

SET @I18N_COOKIES_TR := '66660004-0001-4001-8001-666666660004';
SET @I18N_COOKIES_EN := '66660004-0002-4002-8002-666666660004';
SET @I18N_COOKIES_DE := '66660004-0003-4003-8003-666666660004';

SET @I18N_NOTICE_TR := '66660005-0001-4001-8001-666666660005';
SET @I18N_NOTICE_EN := '66660005-0002-4002-8002-666666660005';
SET @I18N_NOTICE_DE := '66660005-0003-4003-8003-666666660005';

SET @I18N_LEGAL_TR := '66660006-0001-4001-8001-666666660006';
SET @I18N_LEGAL_EN := '66660006-0002-4002-8002-666666660006';
SET @I18N_LEGAL_DE := '66660006-0003-4003-8003-666666660006';

-- -------------------------------------------------------------
-- FEATURED IMAGES (placeholder)
-- -------------------------------------------------------------
SET @IMG_KVKK :=
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80';
SET @IMG_TERMS :=
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80';
SET @IMG_COOKIES :=
  'https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=1400&q=80';
SET @IMG_NOTICE :=
  'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1400&q=80';
SET @IMG_LEGAL :=
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80';

-- -------------------------------------------------------------
-- PARENT UPSERT (custom_pages)
-- -------------------------------------------------------------
INSERT INTO `custom_pages`
  (`id`, `is_published`, `display_order`,
   `featured_image`, `featured_image_asset_id`,
   `category_id`, `sub_category_id`,
   `created_at`, `updated_at`)
VALUES
  (@PAGE_KVKK,    1, 20,  @IMG_KVKK,    NULL, @CAT_CORPORATE, @SUB_KVKK,    NOW(3), NOW(3)),
  (@PAGE_TERMS,   1, 30,  @IMG_TERMS,   NULL, @CAT_CORPORATE, @SUB_TERMS,   NOW(3), NOW(3)),
  (@PAGE_COOKIES, 1, 40,  @IMG_COOKIES, NULL, @CAT_CORPORATE, @SUB_COOKIES, NOW(3), NOW(3)),
  (@PAGE_NOTICE,  1, 50,  @IMG_NOTICE,  NULL, @CAT_CORPORATE, @SUB_NOTICE,  NOW(3), NOW(3)),
  (@PAGE_LEGAL,   1, 60,  @IMG_LEGAL,   NULL, @CAT_CORPORATE, @SUB_LEGAL,   NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `is_published`    = VALUES(`is_published`),
  `display_order`   = VALUES(`display_order`),
  `category_id`     = VALUES(`category_id`),
  `sub_category_id` = VALUES(`sub_category_id`),
  `featured_image`  = VALUES(`featured_image`),
  `updated_at`      = VALUES(`updated_at`);

-- =============================================================
-- I18N UPSERT (custom_pages_i18n)
-- ÖNEMLİ: (page_id, locale) UNIQUE olmalı.
-- =============================================================
INSERT INTO `custom_pages_i18n`
  (`id`, `page_id`, `locale`,
   `title`, `slug`, `content`,
   `summary`,
   `featured_image_alt`, `meta_title`, `meta_description`,
   `tags`,
   `created_at`, `updated_at`)
VALUES

-- =============================================================
-- KVKK
-- =============================================================
(
  @I18N_KVKK_TR, @PAGE_KVKK, 'tr',
  'KVKK',
  'kvkk',
  JSON_OBJECT('html', CONCAT(
    '<section class="container mx-auto px-4 py-8">',
      '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">KVKK</h1>',
      '<p class="text-slate-700 mb-6">',
        'Ensotek, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında kişisel verilerin işlenmesi ve korunmasına önem verir.',
      '</p>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Veri Sorumlusu</h2>',
        '<p class="text-slate-700">',
          'Kişisel verileriniz, veri sorumlusu sıfatıyla Ensotek tarafından mevzuata uygun olarak işlenebilir.',
        '</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. İşlenen Veri Kategorileri</h2>',
        '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
          '<li>Kimlik ve iletişim bilgileri (iletişim formları vb.)</li>',
          '<li>İşlem güvenliği ve teknik log verileri</li>',
          '<li>Müşteri talep/şikayet kayıtları ve yazışmalar</li>',
        '</ul>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. İşleme Amaçları</h2>',
        '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
          '<li>Taleplere dönüş yapılması ve müşteri ilişkilerinin yürütülmesi</li>',
          '<li>Hizmet süreçlerinin iyileştirilmesi ve kalite yönetimi</li>',
          '<li>Bilgi güvenliği süreçlerinin yürütülmesi</li>',
          '<li>Hukuki yükümlülüklerin yerine getirilmesi</li>',
        '</ul>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">4. Hukuki Sebepler</h2>',
        '<p class="text-slate-700">',
          'Veriler; sözleşmenin kurulması/ifası, meşru menfaat, hukuki yükümlülüklerin yerine getirilmesi ve gerektiğinde açık rıza gibi hukuki sebeplere dayanılarak işlenebilir.',
        '</p>',
      '</div>',

      '<div class="bg-slate-900 text-white rounded-xl p-6">',
        '<h2 class="text-xl font-semibold mb-3">5. Başvuru Hakları</h2>',
        '<p class="text-white/90">',
          'KVKK kapsamında; bilgi talep etme, düzeltme, silme, işleme itiraz etme gibi haklara sahipsiniz. Başvurularınız ilgili aydınlatma metni çerçevesinde değerlendirilir.',
        '</p>',
      '</div>',
    '</section>'
  )),
  'Ensotek KVKK sayfası: 6698 sayılı kanun kapsamında veri işleme, hukuki sebepler ve başvuru hakları hakkında bilgilendirme.',
  'Ensotek KVKK bilgilendirme sayfası',
  'KVKK | Ensotek',
  'Ensotek KVKK bilgilendirmesi: kişisel verilerin işlenmesi, hukuki sebepler ve ilgili kişi başvuru hakları.',
  'ensotek,kurumsal,kvkk,kisisel veri,veri guvenligi,aydinlatma',
  NOW(3), NOW(3)
),
(
  @I18N_KVKK_EN, @PAGE_KVKK, 'en',
  'PDPL (KVKK)',
  'pdpl-kvkk',
  JSON_OBJECT('html', CONCAT(
    '<section class="container mx-auto px-4 py-8">',
      '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">PDPL (KVKK)</h1>',
      '<p class="text-slate-700 mb-6">',
        'Ensotek processes and protects personal data in accordance with Turkish PDPL (KVKK No. 6698) and applicable regulations.',
      '</p>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Data Controller</h2>',
        '<p class="text-slate-700">Your personal data may be processed by Ensotek as the data controller in compliance with applicable laws.</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Data Categories</h2>',
        '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
          '<li>Identity and contact details (via contact forms, etc.)</li>',
          '<li>Security and technical log data</li>',
          '<li>Customer request/complaint records and correspondence</li>',
        '</ul>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Purposes of Processing</h2>',
        '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
          '<li>Responding to requests and managing customer relationships</li>',
          '<li>Improving service processes and quality management</li>',
          '<li>Operating information security processes</li>',
          '<li>Complying with legal obligations</li>',
        '</ul>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">4. Legal Grounds</h2>',
        '<p class="text-slate-700">',
          'Data may be processed based on legal grounds such as contract performance, legitimate interest, compliance with legal obligations, and consent where required.',
        '</p>',
      '</div>',

      '<div class="bg-slate-900 text-white rounded-xl p-6">',
        '<h2 class="text-xl font-semibold mb-3">5. Data Subject Rights</h2>',
        '<p class="text-white/90">',
          'You have rights such as requesting information, rectification, deletion, and objection. Requests are handled in line with our information notices.',
        '</p>',
      '</div>',
    '</section>'
  )),
  'Ensotek PDPL/KVKK notice: data categories, purposes, legal grounds, and data subject rights.',
  'Ensotek PDPL/KVKK notice page',
  'PDPL (KVKK) | Ensotek',
  'Ensotek PDPL/KVKK notice covering personal data processing, legal grounds, and data subject rights.',
  'ensotek,corporate,pdpl,kvkk,personal data,data protection',
  NOW(3), NOW(3)
),
(
  @I18N_KVKK_DE, @PAGE_KVKK, 'de',
  'DSGVO / KVKK',
  'dsgvo-kvkk',
  JSON_OBJECT('html', CONCAT(
    '<section class="container mx-auto px-4 py-8">',
      '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">DSGVO / KVKK</h1>',
      '<p class="text-slate-700 mb-6">',
        'Ensotek verarbeitet und schützt personenbezogene Daten im Einklang mit den anwendbaren gesetzlichen Vorgaben (u. a. DSGVO/KVKK-Kontext).',
      '</p>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Verantwortlicher</h2>',
        '<p class="text-slate-700">Personenbezogene Daten können durch Ensotek als Verantwortlichen rechtskonform verarbeitet werden.</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Datenkategorien</h2>',
        '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
          '<li>Kontakt- und Identifikationsdaten (Kontaktformulare usw.)</li>',
          '<li>Sicherheits- und technische Logdaten</li>',
          '<li>Anfrage-/Beschwerdeprotokolle und Korrespondenz</li>',
        '</ul>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Zwecke</h2>',
        '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
          '<li>Bearbeitung von Anfragen und Kundenkommunikation</li>',
          '<li>Qualitätsmanagement und Prozessverbesserung</li>',
          '<li>Informationssicherheit</li>',
          '<li>Erfüllung gesetzlicher Pflichten</li>',
        '</ul>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">4. Rechtsgrundlagen</h2>',
        '<p class="text-slate-700">',
          'Die Verarbeitung kann auf Grundlage vertraglicher Erforderlichkeit, berechtigter Interessen, gesetzlicher Pflichten und – sofern erforderlich – Einwilligung erfolgen.',
        '</p>',
      '</div>',

      '<div class="bg-slate-900 text-white rounded-xl p-6">',
        '<h2 class="text-xl font-semibold mb-3">5. Betroffenenrechte</h2>',
        '<p class="text-white/90">',
          'Sie haben Rechte wie Auskunft, Berichtigung, Löschung und Widerspruch. Anträge werden im Rahmen der Informationspflichten bearbeitet.',
        '</p>',
      '</div>',
    '</section>'
  )),
  'Ensotek DSGVO/KVKK Hinweis: Datenkategorien, Zwecke, Rechtsgrundlagen und Betroffenenrechte.',
  'Ensotek DSGVO/KVKK Hinweis',
  'DSGVO / KVKK | Ensotek',
  'Hinweis zu personenbezogenen Daten bei Ensotek: Verarbeitung, Rechtsgrundlagen und Betroffenenrechte im DSGVO/KVKK-Kontext.',
  'ensotek,unternehmen,datenschutz,dsgvo,kvkk,personenbezogene daten',
  NOW(3), NOW(3)
),

-- =============================================================
-- Kullanım Koşulları / Terms / Nutzungsbedingungen
-- =============================================================
(
  @I18N_TERMS_TR, @PAGE_TERMS, 'tr',
  'Kullanım Koşulları',
  'kullanim-kosullari',
  JSON_OBJECT('html', CONCAT(
    '<section class="container mx-auto px-4 py-8">',
      '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Kullanım Koşulları</h1>',
      '<p class="text-slate-700 mb-6">',
        'Bu web sitesini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız. Lütfen düzenli aralıklarla kontrol ediniz.',
      '</p>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Amaç ve Kapsam</h2>',
        '<p class="text-slate-700">Bu koşullar, Ensotek web sitesinin kullanımına ilişkin kuralları ve tarafların sorumluluklarını düzenler.</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. İçerik ve Fikri Mülkiyet</h2>',
        '<p class="text-slate-700">',
          'Sitedeki metin, görsel, logo ve diğer içerikler Ensotek’e veya hak sahiplerine aittir. İzinsiz kopyalama, çoğaltma veya yayma yapılamaz.',
        '</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Sorumluluk Reddi</h2>',
        '<p class="text-slate-700">',
          'Sitede yer alan bilgiler genel bilgilendirme amaçlıdır. Ensotek, içeriğin güncelliği ve doğruluğu için makul çaba gösterir; ancak kesin taahhüt vermez.',
        '</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">4. Bağlantılar</h2>',
        '<p class="text-slate-700">',
          'Üçüncü taraf sitelere verilen bağlantılar bilgi amaçlıdır. Ensotek bu sitelerin içeriğinden sorumlu değildir.',
        '</p>',
      '</div>',

      '<div class="bg-slate-900 text-white rounded-xl p-6">',
        '<h2 class="text-xl font-semibold mb-3">5. Değişiklikler</h2>',
        '<p class="text-white/90">',
          'Ensotek, kullanım koşullarını güncelleme hakkını saklı tutar. Güncellemeler web sitesinde yayımlandığı tarihten itibaren geçerlidir.',
        '</p>',
      '</div>',
    '</section>'
  )),
  'Ensotek Kullanım Koşulları: web sitesinin kullanımı, içerik hakları, sorumluluk reddi ve güncelleme hükümleri.',
  'Ensotek Kullanım Koşulları sayfası',
  'Kullanım Koşulları | Ensotek',
  'Ensotek web sitesi kullanım koşulları: içerik hakları, sorumluluk sınırları, üçüncü taraf bağlantılar ve değişiklikler.',
  'ensotek,kurumsal,kullanim kosullari,sorumluluk reddi,fikri mulkiyet',
  NOW(3), NOW(3)
),
(
  @I18N_TERMS_EN, @PAGE_TERMS, 'en',
  'Terms of Use',
  'terms-of-use',
  JSON_OBJECT('html', CONCAT(
    '<section class="container mx-auto px-4 py-8">',
      '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Terms of Use</h1>',
      '<p class="text-slate-700 mb-6">',
        'By using this website, you agree to the terms below. Please review them periodically.',
      '</p>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Purpose and Scope</h2>',
        '<p class="text-slate-700">These terms govern the use of the Ensotek website and set out responsibilities of the parties.</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Content and Intellectual Property</h2>',
        '<p class="text-slate-700">Texts, images, logos and other content are owned by Ensotek or respective rights holders and may not be reproduced without permission.</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Disclaimer</h2>',
        '<p class="text-slate-700">Content is provided for general information. Ensotek makes reasonable efforts to keep information accurate, but does not provide a guarantee.</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">4. Links</h2>',
        '<p class="text-slate-700">Links to third-party websites are provided for convenience. Ensotek is not responsible for third-party content.</p>',
      '</div>',

      '<div class="bg-slate-900 text-white rounded-xl p-6">',
        '<h2 class="text-xl font-semibold mb-3">5. Changes</h2>',
        '<p class="text-white/90">Ensotek may update these terms from time to time. Updates are effective from the date they are published on the website.</p>',
      '</div>',
    '</section>'
  )),
  'Ensotek Terms of Use: rules for using the website, IP rights, disclaimers and updates.',
  'Ensotek Terms of Use page',
  'Terms of Use | Ensotek',
  'Ensotek Terms of Use covers intellectual property, disclaimers, third-party links, and policy changes.',
  'ensotek,corporate,terms of use,disclaimer,intellectual property',
  NOW(3), NOW(3)
),
(
  @I18N_TERMS_DE, @PAGE_TERMS, 'de',
  'Nutzungsbedingungen',
  'nutzungsbedingungen',
  JSON_OBJECT('html', CONCAT(
    '<section class="container mx-auto px-4 py-8">',
      '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Nutzungsbedingungen</h1>',
      '<p class="text-slate-700 mb-6">',
        'Durch die Nutzung dieser Website akzeptieren Sie die folgenden Bedingungen. Bitte prüfen Sie diese regelmäßig.',
      '</p>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Zweck und Geltungsbereich</h2>',
        '<p class="text-slate-700">Diese Bedingungen regeln die Nutzung der Ensotek-Website und die Verantwortlichkeiten der Parteien.</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Inhalte und Urheberrechte</h2>',
        '<p class="text-slate-700">Texte, Bilder, Logos und sonstige Inhalte sind Eigentum von Ensotek bzw. der Rechteinhaber und dürfen nicht ohne Erlaubnis vervielfältigt werden.</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Haftungsausschluss</h2>',
        '<p class="text-slate-700">Die Inhalte dienen der allgemeinen Information. Ensotek bemüht sich um Aktualität, übernimmt jedoch keine Garantie.</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">4. Externe Links</h2>',
        '<p class="text-slate-700">Links zu Drittseiten dienen der Information. Für deren Inhalte übernimmt Ensotek keine Verantwortung.</p>',
      '</div>',

      '<div class="bg-slate-900 text-white rounded-xl p-6">',
        '<h2 class="text-xl font-semibold mb-3">5. Änderungen</h2>',
        '<p class="text-white/90">Ensotek behält sich das Recht vor, diese Bedingungen zu ändern. Änderungen gelten ab Veröffentlichung auf der Website.</p>',
      '</div>',
    '</section>'
  )),
  'Ensotek Nutzungsbedingungen: Regeln zur Website-Nutzung, Urheberrechte, Haftungsausschluss und Änderungen.',
  'Ensotek Nutzungsbedingungen',
  'Nutzungsbedingungen | Ensotek',
  'Die Nutzungsbedingungen von Ensotek regeln Urheberrechte, Haftungsbeschränkungen, externe Links und Aktualisierungen.',
  'ensotek,unternehmen,nutzungsbedingungen,haftung,urheberrecht',
  NOW(3), NOW(3)
),

-- =============================================================
-- Çerez Politikası / Cookie Policy / Cookie-Richtlinie
-- =============================================================
(
  @I18N_COOKIES_TR, @PAGE_COOKIES, 'tr',
  'Çerez Politikası',
  'cerez-politikasi',
  JSON_OBJECT('html', CONCAT(
    '<section class="container mx-auto px-4 py-8">',
      '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Çerez Politikası</h1>',
      '<p class="text-slate-700 mb-6">',
        'Web sitemizde kullanıcı deneyimini geliştirmek, güvenliği sağlamak ve site performansını izlemek için çerezler kullanılabilir.',
      '</p>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Çerez Nedir?</h2>',
        '<p class="text-slate-700">Çerezler, ziyaret ettiğiniz web sitesi tarafından tarayıcınıza kaydedilen küçük metin dosyalarıdır.</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Çerez Türleri</h2>',
        '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
          '<li><strong>Zorunlu çerezler:</strong> Sitenin çalışması için gereklidir.</li>',
          '<li><strong>Performans/analitik:</strong> Trafik ve kullanım ölçümleri için kullanılır.</li>',
          '<li><strong>Fonksiyonel:</strong> Tercihlerinizi (dil vb.) hatırlayabilir.</li>',
        '</ul>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Çerez Yönetimi</h2>',
        '<p class="text-slate-700">',
          'Çerez tercihlerinizi tarayıcı ayarlarınızdan yönetebilir, dilediğiniz zaman silebilir veya engelleyebilirsiniz. ',
          'Bazı çerezleri devre dışı bırakmak sitenin bazı işlevlerini etkileyebilir.',
        '</p>',
      '</div>',

      '<div class="bg-slate-900 text-white rounded-xl p-6">',
        '<h2 class="text-xl font-semibold mb-3">4. Güncellemeler</h2>',
        '<p class="text-white/90">Çerez politikası zaman zaman güncellenebilir. Güncel sürüm bu sayfada yayımlanır.</p>',
      '</div>',
    '</section>'
  )),
  'Ensotek Çerez Politikası: çerez türleri, kullanım amaçları ve tarayıcı üzerinden tercih yönetimi.',
  'Ensotek Çerez Politikası sayfası',
  'Çerez Politikası | Ensotek',
  'Ensotek çerez politikası; zorunlu, analitik ve fonksiyonel çerezler ile çerez tercih yönetimi hakkında bilgi verir.',
  'ensotek,kurumsal,cerez politikasi,cookies,analitik,tercih yonetimi',
  NOW(3), NOW(3)
),
(
  @I18N_COOKIES_EN, @PAGE_COOKIES, 'en',
  'Cookie Policy',
  'cookie-policy',
  JSON_OBJECT('html', CONCAT(
    '<section class="container mx-auto px-4 py-8">',
      '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Cookie Policy</h1>',
      '<p class="text-slate-700 mb-6">',
        'We may use cookies to improve user experience, maintain security, and monitor website performance.',
      '</p>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. What Are Cookies?</h2>',
        '<p class="text-slate-700">Cookies are small text files stored in your browser by the website you visit.</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Types of Cookies</h2>',
        '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
          '<li><strong>Strictly necessary:</strong> Required for the site to function.</li>',
          '<li><strong>Performance/analytics:</strong> Used to measure traffic and usage.</li>',
          '<li><strong>Functional:</strong> May remember preferences (e.g., language).</li>',
        '</ul>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Managing Cookies</h2>',
        '<p class="text-slate-700">You can manage, delete or block cookies via your browser settings. Disabling certain cookies may affect site functionality.</p>',
      '</div>',

      '<div class="bg-slate-900 text-white rounded-xl p-6">',
        '<h2 class="text-xl font-semibold mb-3">4. Updates</h2>',
        '<p class="text-white/90">This policy may be updated from time to time. The current version is published on this page.</p>',
      '</div>',
    '</section>'
  )),
  'Ensotek Cookie Policy: cookie types, purposes and preference management in your browser.',
  'Ensotek Cookie Policy page',
  'Cookie Policy | Ensotek',
  'Ensotek Cookie Policy explains necessary, analytics and functional cookies and how to manage preferences.',
  'ensotek,corporate,cookie policy,cookies,analytics,preferences',
  NOW(3), NOW(3)
),
(
  @I18N_COOKIES_DE, @PAGE_COOKIES, 'de',
  'Cookie-Richtlinie',
  'cookie-richtlinie',
  JSON_OBJECT('html', CONCAT(
    '<section class="container mx-auto px-4 py-8">',
      '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Cookie-Richtlinie</h1>',
      '<p class="text-slate-700 mb-6">',
        'Wir verwenden gegebenenfalls Cookies, um die Nutzererfahrung zu verbessern, Sicherheit zu gewährleisten und die Website-Performance zu messen.',
      '</p>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Was sind Cookies?</h2>',
        '<p class="text-slate-700">Cookies sind kleine Textdateien, die von der besuchten Website im Browser gespeichert werden.</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Arten von Cookies</h2>',
        '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
          '<li><strong>Notwendig:</strong> Für den Betrieb der Website erforderlich.</li>',
          '<li><strong>Performance/Analyse:</strong> Zur Messung von Nutzung und Traffic.</li>',
          '<li><strong>Funktional:</strong> Kann Präferenzen (z. B. Sprache) speichern.</li>',
        '</ul>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Cookie-Verwaltung</h2>',
        '<p class="text-slate-700">Cookies können über die Browsereinstellungen verwaltet, gelöscht oder blockiert werden. Das Deaktivieren kann Funktionen einschränken.</p>',
      '</div>',

      '<div class="bg-slate-900 text-white rounded-xl p-6">',
        '<h2 class="text-xl font-semibold mb-3">4. Aktualisierungen</h2>',
        '<p class="text-white/90">Diese Richtlinie kann aktualisiert werden. Die aktuelle Version wird auf dieser Seite veröffentlicht.</p>',
      '</div>',
    '</section>'
  )),
  'Ensotek Cookie-Richtlinie: Cookie-Arten, Zwecke und Verwaltung der Einstellungen im Browser.',
  'Ensotek Cookie-Richtlinie',
  'Cookie-Richtlinie | Ensotek',
  'Die Cookie-Richtlinie von Ensotek erläutert notwendige, Analyse- und funktionale Cookies sowie die Verwaltung.',
  'ensotek,unternehmen,cookie richtlinie,cookies,analyse,einstellungen',
  NOW(3), NOW(3)
),

-- =============================================================
-- Aydınlatma Metni / Information Notice / Informationspflicht
-- =============================================================
(
  @I18N_NOTICE_TR, @PAGE_NOTICE, 'tr',
  'Aydınlatma Metni',
  'aydinlatma-metni',
  JSON_OBJECT('html', CONCAT(
    '<section class="container mx-auto px-4 py-8">',
      '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Aydınlatma Metni</h1>',
      '<p class="text-slate-700 mb-6">',
        'Bu metin, kişisel verilerinizin hangi amaçlarla işlendiği ve haklarınız hakkında bilgilendirme sağlar.',
      '</p>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Veri Sorumlusu</h2>',
        '<p class="text-slate-700">Veri sorumlusu Ensotek’tir.</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. İşleme Amaçları</h2>',
        '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
          '<li>İletişim taleplerinin alınması ve yanıtlanması</li>',
          '<li>Hizmet süreçlerinin yürütülmesi ve geliştirilmesi</li>',
          '<li>Bilgi güvenliği süreçleri ve sistem güvenliği</li>',
          '<li>Yasal yükümlülüklerin yerine getirilmesi</li>',
        '</ul>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Aktarım</h2>',
        '<p class="text-slate-700">',
          'Gerekli hallerde, hizmetin sağlanması kapsamında sınırlı olarak tedarikçilerle (barındırma/e-posta vb.) veri paylaşımı yapılabilir.',
        '</p>',
      '</div>',

      '<div class="bg-slate-900 text-white rounded-xl p-6">',
        '<h2 class="text-xl font-semibold mb-3">4. Haklarınız</h2>',
        '<p class="text-white/90">KVKK kapsamındaki haklarınızı kullanmak için bize başvurabilirsiniz.</p>',
      '</div>',
    '</section>'
  )),
  'Ensotek Aydınlatma Metni: veri sorumlusu, işleme amaçları, aktarım ve ilgili kişi hakları.',
  'Ensotek Aydınlatma Metni sayfası',
  'Aydınlatma Metni | Ensotek',
  'Ensotek aydınlatma metni; kişisel verilerin işlenmesi, aktarım ve haklar hakkında bilgilendirme içerir.',
  'ensotek,kurumsal,aydinlatma metni,kisisel veri,kvkk',
  NOW(3), NOW(3)
),
(
  @I18N_NOTICE_EN, @PAGE_NOTICE, 'en',
  'Information Notice',
  'information-notice',
  JSON_OBJECT('html', CONCAT(
    '<section class="container mx-auto px-4 py-8">',
      '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Information Notice</h1>',
      '<p class="text-slate-700 mb-6">',
        'This notice explains how your personal data is processed and what rights you have.',
      '</p>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Data Controller</h2>',
        '<p class="text-slate-700">Ensotek is the data controller.</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Purposes</h2>',
        '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
          '<li>Receiving and responding to contact requests</li>',
          '<li>Operating and improving service processes</li>',
          '<li>Information security and system protection</li>',
          '<li>Complying with legal obligations</li>',
        '</ul>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Transfers</h2>',
        '<p class="text-slate-700">Where necessary, limited data may be shared with service providers (hosting/email, etc.) to deliver services.</p>',
      '</div>',

      '<div class="bg-slate-900 text-white rounded-xl p-6">',
        '<h2 class="text-xl font-semibold mb-3">4. Your Rights</h2>',
        '<p class="text-white/90">You may contact us to exercise your data subject rights under applicable laws.</p>',
      '</div>',
    '</section>'
  )),
  'Ensotek Information Notice: data controller, purposes, transfers and data subject rights.',
  'Ensotek Information Notice page',
  'Information Notice | Ensotek',
  'Ensotek Information Notice covers purposes of processing, transfers and data subject rights.',
  'ensotek,corporate,information notice,personal data,privacy',
  NOW(3), NOW(3)
),
(
  @I18N_NOTICE_DE, @PAGE_NOTICE, 'de',
  'Informationspflicht',
  'informationspflicht',
  JSON_OBJECT('html', CONCAT(
    '<section class="container mx-auto px-4 py-8">',
      '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Informationspflicht</h1>',
      '<p class="text-slate-700 mb-6">',
        'Diese Informationen erläutern die Verarbeitung personenbezogener Daten und Ihre Rechte.',
      '</p>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Verantwortlicher</h2>',
        '<p class="text-slate-700">Verantwortlicher ist Ensotek.</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Zwecke</h2>',
        '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
          '<li>Entgegennahme und Beantwortung von Kontaktanfragen</li>',
          '<li>Durchführung und Verbesserung von Serviceprozessen</li>',
          '<li>Informationssicherheit und Systemschutz</li>',
          '<li>Erfüllung gesetzlicher Pflichten</li>',
        '</ul>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Weitergabe</h2>',
        '<p class="text-slate-700">Bei Bedarf kann eine begrenzte Weitergabe an Dienstleister (Hosting/E-Mail etc.) erfolgen, um Leistungen bereitzustellen.</p>',
      '</div>',

      '<div class="bg-slate-900 text-white rounded-xl p-6">',
        '<h2 class="text-xl font-semibold mb-3">4. Ihre Rechte</h2>',
        '<p class="text-white/90">Sie können uns kontaktieren, um Ihre Betroffenenrechte nach anwendbarem Recht wahrzunehmen.</p>',
      '</div>',
    '</section>'
  )),
  'Ensotek Informationspflicht: Verantwortlicher, Zwecke, Weitergabe und Betroffenenrechte.',
  'Ensotek Informationspflicht',
  'Informationspflicht | Ensotek',
  'Hinweise zur Datenverarbeitung bei Ensotek: Zwecke, Weitergabe und Rechte der Betroffenen.',
  'ensotek,unternehmen,informationspflicht,datenschutz,personenbezogene daten',
  NOW(3), NOW(3)
),

-- =============================================================
-- Yasal Bilgilendirme / Legal Notice / Impressum
-- =============================================================
(
  @I18N_LEGAL_TR, @PAGE_LEGAL, 'tr',
  'Yasal Bilgilendirme',
  'yasal-bilgilendirme',
  JSON_OBJECT('html', CONCAT(
    '<section class="container mx-auto px-4 py-8">',
      '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Yasal Bilgilendirme</h1>',
      '<p class="text-slate-700 mb-6">',
        'Bu sayfa, Ensotek web sitesine ilişkin genel yasal uyarıları ve bilgilendirmeleri içerir.',
      '</p>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. İçerik Sorumluluğu</h2>',
        '<p class="text-slate-700">Ensotek, içeriklerin doğruluğu için makul çaba gösterir; ancak içerikler bilgilendirme amaçlıdır ve bağlayıcı değildir.</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Harici Bağlantılar</h2>',
        '<p class="text-slate-700">Üçüncü taraf bağlantıların içeriklerinden Ensotek sorumlu değildir.</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Fikri Mülkiyet</h2>',
        '<p class="text-slate-700">Web sitesindeki tüm içerikler (metin/görsel/logo) izinsiz kullanılamaz.</p>',
      '</div>',

      '<div class="bg-slate-900 text-white rounded-xl p-6">',
        '<h2 class="text-xl font-semibold mb-3">4. İletişim</h2>',
        '<p class="text-white/90">Yasal bilgilendirmeler hakkında sorularınız için bizimle iletişime geçebilirsiniz.</p>',
      '</div>',
    '</section>'
  )),
  'Ensotek Yasal Bilgilendirme: içerik sorumluluğu, harici bağlantılar, fikri mülkiyet ve genel uyarılar.',
  'Ensotek Yasal Bilgilendirme sayfası',
  'Yasal Bilgilendirme | Ensotek',
  'Ensotek web sitesi yasal bilgilendirmeleri: sorumluluk reddi, harici bağlantılar ve fikri mülkiyet.',
  'ensotek,kurumsal,yasal bilgilendirme,impressum,sorumluluk reddi',
  NOW(3), NOW(3)
),
(
  @I18N_LEGAL_EN, @PAGE_LEGAL, 'en',
  'Legal Notice',
  'legal-notice',
  JSON_OBJECT('html', CONCAT(
    '<section class="container mx-auto px-4 py-8">',
      '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Legal Notice</h1>',
      '<p class="text-slate-700 mb-6">This page provides general legal information and disclaimers regarding the Ensotek website.</p>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Content</h2>',
        '<p class="text-slate-700">Content is provided for general information only and is not legally binding.</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. External Links</h2>',
        '<p class="text-slate-700">Ensotek is not responsible for the content of third-party websites linked from this site.</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Intellectual Property</h2>',
        '<p class="text-slate-700">All texts, images and logos are protected and may not be used without permission.</p>',
      '</div>',

      '<div class="bg-slate-900 text-white rounded-xl p-6">',
        '<h2 class="text-xl font-semibold mb-3">4. Contact</h2>',
        '<p class="text-white/90">For legal questions, please contact us.</p>',
      '</div>',
    '</section>'
  )),
  'Ensotek Legal Notice: disclaimers, external links, intellectual property, and general legal information.',
  'Ensotek Legal Notice page',
  'Legal Notice | Ensotek',
  'Ensotek Legal Notice covers disclaimers, external links and intellectual property.',
  'ensotek,corporate,legal notice,disclaimer,intellectual property',
  NOW(3), NOW(3)
),
(
  @I18N_LEGAL_DE, @PAGE_LEGAL, 'de',
  'Impressum / Rechtliche Hinweise',
  'impressum-rechtliche-hinweise',
  JSON_OBJECT('html', CONCAT(
    '<section class="container mx-auto px-4 py-8">',
      '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Impressum / Rechtliche Hinweise</h1>',
      '<p class="text-slate-700 mb-6">Diese Seite enthält allgemeine rechtliche Hinweise zur Ensotek-Website.</p>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Inhalte</h2>',
        '<p class="text-slate-700">Die Inhalte dienen der allgemeinen Information und sind nicht rechtsverbindlich.</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Externe Links</h2>',
        '<p class="text-slate-700">Für Inhalte externer Websites übernimmt Ensotek keine Verantwortung.</p>',
      '</div>',

      '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
        '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Urheberrechte</h2>',
        '<p class="text-slate-700">Texte, Bilder und Logos sind geschützt und dürfen nicht ohne Erlaubnis verwendet werden.</p>',
      '</div>',

      '<div class="bg-slate-900 text-white rounded-xl p-6">',
        '<h2 class="text-xl font-semibold mb-3">4. Kontakt</h2>',
        '<p class="text-white/90">Bei rechtlichen Fragen können Sie uns kontaktieren.</p>',
      '</div>',
    '</section>'
  )),
  'Ensotek Impressum / Rechtliche Hinweise: Haftungsausschluss, externe Links und Urheberrechte.',
  'Ensotek Impressum / Rechtliche Hinweise',
  'Impressum | Ensotek',
  'Rechtliche Hinweise bei Ensotek: Haftungsausschluss, externe Links und Urheberrechte.',
  'ensotek,unternehmen,impressum,rechtliche hinweise,haftung',
  NOW(3), NOW(3)
)

ON DUPLICATE KEY UPDATE
  `id`                 = VALUES(`id`),
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

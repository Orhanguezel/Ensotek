-- =============================================================
-- FILE: 051.4_custom_pages_privacy.seed.sql (FINAL)
-- Ensotek – Custom Page: Privacy Policy (TR/EN/DE)
-- ✅ module_key artık PARENT: custom_pages.module_key = 'privacy'
-- Category: ABOUT/Kurumsal (aaaa7001)
-- SubCategory: Gizlilik Politikası (bbbb7005)
-- NOT: Bu dosyada BLOK YORUM (/* */) YOKTUR. Sadece "--" kullanılır.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- -------------------------------------------------------------
-- CATEGORY / SUB CATEGORY
-- -------------------------------------------------------------
SET @CAT_CORPORATE := 'aaaa7001-1111-4111-8111-aaaaaaaa7001'; -- ABOUT / Kurumsal
SET @SUB_PRIVACY   := 'bbbb7005-1111-4111-8111-bbbbbbbb7005'; -- Gizlilik Politikası

-- -------------------------------------------------------------
-- PAGE ID (deterministik, diğer custom page ID’leriyle çakışmaz)
-- -------------------------------------------------------------
SET @PAGE_PRIVACY := '55550002-5555-4555-8555-555555550002';

-- -------------------------------------------------------------
-- PARENT MODULE KEY
-- -------------------------------------------------------------
SET @MODULE_KEY := 'privacy';

-- FEATURED IMAGE
SET @IMG_PRIVACY :=
  'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1400&q=80';
SET @IMG_PRIVACY_2 :=
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80';
SET @IMG_PRIVACY_3 :=
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1400&q=80';

-- -------------------------------------------------------------
-- PARENT UPSERT (custom_pages) – şema uyumlu alanlar
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
    @PAGE_PRIVACY,
    @MODULE_KEY,
    1,
    0,
    10,
    10,
    @IMG_PRIVACY,
    NULL,
    @IMG_PRIVACY,
    NULL,
    JSON_ARRAY(@IMG_PRIVACY, @IMG_PRIVACY_2, @IMG_PRIVACY_3),
    JSON_ARRAY(),
    @CAT_CORPORATE,
    @SUB_PRIVACY,
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

-- =============================================================
-- I18N – Privacy Policy (TR/EN/DE)
-- content JSON_OBJECT('html', CONCAT(...))
-- ✅ module_key kolonu YOK (i18n tablosunda kullanılmıyor)
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

-- -------------------------------------------------------------
-- TR
-- -------------------------------------------------------------
(
  UUID(),
  @PAGE_PRIVACY,
  'tr',
  'Gizlilik Politikası',
  'gizlilik-politikasi',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Gizlilik Politikası</h1>',
        '<p class="text-slate-700 mb-8">',
          'Ensotek olarak, web sitemizi ziyaret eden kullanıcılarımızın gizliliğini korumayı ve kişisel verileri yürürlükteki mevzuata uygun şekilde işlemeyi taahhüt ederiz. ',
          'Bu metin; hangi verileri topladığımızı, ne amaçla işlediğimizi, nasıl sakladığımızı ve haklarınızı açıklar.',
        '</p>',

        '<div class="grid md:grid-cols-2 gap-6 mb-10">',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Kapsam</h2>',
            '<p class="text-slate-700">',
              'Bu politika; web sitesi ziyaretleri, iletişim formları, teklif/ürün talepleri, e-posta iletişimi ve teknik loglar dahil olmak üzere ',
              'dijital kanallardan elde edilen verileri kapsar.',
            '</p>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Toplanan Veriler</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>İletişim: ad-soyad, e-posta, telefon, firma/ünvan (varsa)</li>',
              '<li>Talep içeriği: mesaj, teknik ihtiyaçlar, ürün ilgisi</li>',
              '<li>Teknik: IP, tarayıcı/cihaz, sayfa görüntüleme, erişim zamanı, log kayıtları</li>',
              '<li>Çerezler: tercih ve kullanım verileri (detaylar Çerez Politikası’nda)</li>',
            '</ul>',
          '</div>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. İşleme Amaçları</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Taleplerinize yanıt vermek, teklif süreçlerini yürütmek ve iletişimi sürdürmek</li>',
            '<li>Web sitesi güvenliği, hata analizi, performans ve kullanıcı deneyimini iyileştirmek</li>',
            '<li>Yasal yükümlülüklerin yerine getirilmesi ve uyuşmazlıkların yönetilmesi</li>',
            '<li>İş sürekliliği ve bilgi güvenliği süreçlerinin yürütülmesi</li>',
          '</ul>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">4. Saklama Süreleri</h2>',
          '<p class="text-slate-700 mb-3">',
            'Veriler; ilgili amacın gerektirdiği süre boyunca ve/veya mevzuatta öngörülen sürelerle sınırlı olacak şekilde saklanır.',
          '</p>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>İletişim/talep kayıtları: süreç gereksinimi + yasal süreler</li>',
            '<li>Güvenlik ve sistem logları: güvenlik/denetim ihtiyacı ile sınırlı</li>',
            '<li>Çerez verileri: çerez türüne göre değişir</li>',
          '</ul>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">5. Üçüncü Taraflar ve Aktarımlar</h2>',
          '<p class="text-slate-700 mb-3">',
            'Hizmet altyapısı (barındırma, e-posta gönderimi, güvenlik, analiz vb.) kapsamında sınırlı ölçüde hizmet sağlayıcılarla paylaşım olabilir. ',
            'Bu paylaşımlar, sözleşmesel yükümlülükler ve teknik/idari tedbirlerle yönetilir.',
          '</p>',
          '<p class="text-slate-700">',
            'Üçüncü tarafların veri işleme faaliyetleri, kendi politikalarına tabi olabilir. Bu nedenle ilgili sağlayıcıların koşullarını incelemenizi öneririz.',
          '</p>',
        '</div>',

        '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">6. Güvenlik Önlemleri</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Erişim kontrolü ve yetkilendirme</li>',
            '<li>İletişim güvenliği ve izleme</li>',
            '<li>Yedekleme ve iş sürekliliği tedbirleri</li>',
            '<li>Loglama ve olay yönetimi süreçleri</li>',
          '</ul>',
        '</div>',

        '<div class="bg-slate-900 text-white rounded-2xl p-6">',
          '<h2 class="text-xl font-semibold mb-3">7. Haklarınız ve İletişim</h2>',
          '<p class="text-white/90 mb-3">',
            'Kişisel verilerinizle ilgili talepleriniz için bizimle iletişime geçebilirsiniz. Başvurular, ilgili mevzuat kapsamındaki haklar çerçevesinde değerlendirilir.',
          '</p>',
          '<p class="text-white/80">',
            'Ayrıca KVKK/aydınlatma metinlerimiz ve çerez tercihleri sayfası üzerinden detaylı bilgilere ulaşabilirsiniz.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Ensotek Gizlilik Politikası: web sitesinde toplanan veriler, kullanım amaçları, saklama, güvenlik ve kullanıcı hakları hakkında bilgilendirme.',
  'Ensotek Gizlilik Politikası sayfası',
  'Gizlilik Politikası | Ensotek',
  'Ensotek Gizlilik Politikası; toplanan veriler, işleme amaçları, saklama ve güvenlik önlemleri ile kullanıcı hakları hakkında bilgilendirir.',
  'ensotek,kurumsal,gizlilik politikası,veri güvenliği,kvkk,çerezler',
  NOW(3),
  NOW(3)
),

-- -------------------------------------------------------------
-- EN
-- -------------------------------------------------------------
(
  UUID(),
  @PAGE_PRIVACY,
  'en',
  'Privacy Policy',
  'privacy-policy',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Privacy Policy</h1>',
        '<p class="text-slate-700 mb-8">',
          'At Ensotek, we are committed to protecting the privacy of visitors and processing personal data in compliance with applicable laws. ',
          'This notice explains what we collect, why we process it, how we store it, and your rights.',
        '</p>',

        '<div class="grid md:grid-cols-2 gap-6 mb-10">',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Scope</h2>',
            '<p class="text-slate-700">',
              'This policy covers data collected via website visits, contact forms, quote/product requests, email communications, and technical logs.',
            '</p>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Information We Collect</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Contact details: name, email, phone, company/title (if provided)</li>',
              '<li>Request content: message, technical needs, product interest</li>',
              '<li>Technical data: IP, browser/device, page views, access times, logs</li>',
              '<li>Cookies: usage and preference data (see Cookie Policy)</li>',
            '</ul>',
          '</div>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Purposes of Processing</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>To respond to inquiries, manage quotation processes, and maintain communication</li>',
            '<li>To improve website security, error analysis, performance and user experience</li>',
            '<li>To comply with legal obligations and manage disputes</li>',
            '<li>To operate business continuity and information security processes</li>',
          '</ul>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">4. Retention</h2>',
          '<p class="text-slate-700 mb-3">',
            'We retain data only as long as necessary for the stated purposes and/or as required by law.',
          '</p>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Contact/request records: as needed for the process and legal requirements</li>',
            '<li>Security/system logs: limited to security/audit needs</li>',
            '<li>Cookie data: varies by cookie type</li>',
          '</ul>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">5. Service Providers and Sharing</h2>',
          '<p class="text-slate-700 mb-3">',
            'We may share limited data with service providers (hosting, email delivery, security, analytics, etc.) under contractual and security safeguards.',
          '</p>',
          '<p class="text-slate-700">',
            'Third-party processing may be subject to their own policies. We recommend reviewing relevant provider terms.',
          '</p>',
        '</div>',

        '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">6. Security Measures</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Access controls and authorisation</li>',
            '<li>Secure communications and monitoring</li>',
            '<li>Backups and business continuity</li>',
            '<li>Logging and incident management processes</li>',
          '</ul>',
        '</div>',

        '<div class="bg-slate-900 text-white rounded-2xl p-6">',
          '<h2 class="text-xl font-semibold mb-3">7. Your Rights and Contact</h2>',
          '<p class="text-white/90 mb-3">',
            'You may contact us regarding your personal data. Requests are handled within the scope of applicable laws and our information notices.',
          '</p>',
          '<p class="text-white/80">',
            'For cookies, please use the cookie preferences and Cookie Policy page.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Ensotek Privacy Policy: data collected on the website, purposes of processing, retention, security and user rights.',
  'Ensotek Privacy Policy page',
  'Privacy Policy | Ensotek',
  'Ensotek Privacy Policy explains what data we collect, why we process it, how we protect it, and what rights users have.',
  'ensotek,corporate,privacy policy,data protection,cookies,security',
  NOW(3),
  NOW(3)
),

-- -------------------------------------------------------------
-- DE
-- -------------------------------------------------------------
(
  UUID(),
  @PAGE_PRIVACY,
  'de',
  'Datenschutzerklärung',
  'datenschutzerklaerung',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-10">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Datenschutzerklärung</h1>',
        '<p class="text-slate-700 mb-8">',
          'Ensotek verpflichtet sich, die Privatsphäre der Besucher zu schützen und personenbezogene Daten im Einklang mit den anwendbaren gesetzlichen Vorgaben zu verarbeiten. ',
          'Diese Erklärung beschreibt Datenkategorien, Zwecke, Speicherfristen, Sicherheitsmaßnahmen und Ihre Rechte.',
        '</p>',

        '<div class="grid md:grid-cols-2 gap-6 mb-10">',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Geltungsbereich</h2>',
            '<p class="text-slate-700">',
              'Diese Richtlinie umfasst Daten aus Websitebesuchen, Kontaktformularen, Angebots-/Produktanfragen, E-Mail-Kommunikation und technischen Logs.',
            '</p>',
          '</div>',
          '<div class="bg-white border border-slate-200 rounded-2xl p-6">',
            '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Erhobene Daten</h2>',
            '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
              '<li>Kontakt: Name, E-Mail, Telefon, Unternehmen/Funktion (falls angegeben)</li>',
              '<li>Anfrageinhalte: Nachricht, technische Anforderungen, Produktinteresse</li>',
              '<li>Technische Daten: IP, Browser/Gerät, Seitenaufrufe, Zugriffszeiten, Logs</li>',
              '<li>Cookies: Nutzungs- und Präferenzdaten (siehe Cookie-Richtlinie)</li>',
            '</ul>',
          '</div>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Zwecke</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Bearbeitung von Anfragen, Durchführung von Angebotsprozessen und Kommunikation</li>',
            '<li>Verbesserung von Sicherheit, Fehleranalyse, Performance und Nutzererlebnis</li>',
            '<li>Erfüllung gesetzlicher Pflichten und Streitbeilegung</li>',
            '<li>Informationssicherheit und Business-Continuity</li>',
          '</ul>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">4. Speicherdauer</h2>',
          '<p class="text-slate-700 mb-3">',
            'Daten werden nur so lange gespeichert, wie es für die genannten Zwecke erforderlich ist und/oder gesetzliche Pflichten bestehen.',
          '</p>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Kontakt-/Anfragedaten: prozessbezogen + gesetzliche Fristen</li>',
            '<li>Sicherheits-/Systemlogs: begrenzt nach Sicherheits-/Auditbedarf</li>',
            '<li>Cookie-Daten: abhängig vom Cookie-Typ</li>',
          '</ul>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">5. Dienstleister und Weitergabe</h2>',
          '<p class="text-slate-700 mb-3">',
            'Eine begrenzte Weitergabe an Dienstleister (Hosting, E-Mail, Sicherheit, Analyse etc.) kann erfolgen und wird durch Verträge sowie Sicherheitsmaßnahmen abgesichert.',
          '</p>',
          '<p class="text-slate-700">',
            'Drittanbieter können eigenen Richtlinien unterliegen. Bitte prüfen Sie die jeweiligen Bedingungen.',
          '</p>',
        '</div>',

        '<div class="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">6. Sicherheitsmaßnahmen</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Zugriffskontrolle und Berechtigungen</li>',
            '<li>Sichere Kommunikation und Monitoring</li>',
            '<li>Backups und Notfallmaßnahmen</li>',
            '<li>Protokollierung und Incident-Management</li>',
          '</ul>',
        '</div>',

        '<div class="bg-slate-900 text-white rounded-2xl p-6">',
          '<h2 class="text-xl font-semibold mb-3">7. Rechte und Kontakt</h2>',
          '<p class="text-white/90 mb-3">',
            'Sie können uns bezüglich Ihrer personenbezogenen Daten kontaktieren. Anträge werden im Rahmen der anwendbaren Gesetze und Informationspflichten bearbeitet.',
          '</p>',
          '<p class="text-white/80">',
            'Cookie-Einstellungen verwalten Sie über die Cookie-Hinweise und die Cookie-Richtlinie.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Ensotek Datenschutzerklärung: Datenkategorien, Zwecke, Aufbewahrung, Sicherheitsmaßnahmen und Rechte der Nutzer.',
  'Ensotek Datenschutzerklärung',
  'Datenschutzerklärung | Ensotek',
  'Die Ensotek Datenschutzerklärung erläutert, welche Daten wir erheben, wofür wir sie verwenden, wie wir sie schützen und welche Rechte Nutzer haben.',
  'ensotek,unternehmen,datenschutz,cookies,sicherheit,personenbezogene daten',
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

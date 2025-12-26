-- =============================================================
-- FILE: 056_custom_pages_privacy.seed.sql
-- Ensotek – Custom Page: Privacy Policy (TR/EN/DE)
-- Category: ABOUT/Kurumsal (aaaa7001)
-- SubCategory: Gizlilik Politikası (bbbb7005)
-- NOT: Bu dosyada BLOK YORUM (/* */) YOKTUR. Sadece "--" kullanılır.
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- -------------------------------------------------------------
-- CATEGORY / SUB CATEGORY
-- -------------------------------------------------------------
SET @CAT_CORPORATE := 'aaaa7001-1111-4111-8111-aaaaaaaa7001'; -- KURUMSAL
SET @SUB_PRIVACY   := 'bbbb7005-1111-4111-8111-bbbbbbbb7005'; -- Gizlilik Politikası

-- -------------------------------------------------------------
-- PAGE ID (deterministik)
-- -------------------------------------------------------------
SET @PAGE_PRIVACY := '55550001-5555-4555-8555-555555550001';

-- FEATURED IMAGE (placeholder – istersen değiştir)
SET @IMG_PRIVACY :=
  'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1400&q=80';

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
    @PAGE_PRIVACY,
    1,
    10,
    @IMG_PRIVACY,
    NULL,
    @CAT_CORPORATE,
    @SUB_PRIVACY,
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
-- I18N – Gizlilik Politikası (TR/EN/DE)
-- content JSON_OBJECT('html', CONCAT(...))
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
  @PAGE_PRIVACY,
  'de',
  'Gizlilik Politikası',
  'gizlilik-politikasi',
  JSON_OBJECT(
    'html',
    CONCAT(
      '<section class="container mx-auto px-4 py-8">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Gizlilik Politikası</h1>',
        '<p class="text-slate-700 mb-6">',
          'Ensotek olarak, web sitemizi ziyaret eden kullanıcılarımızın gizliliğini korumayı ve kişisel verileri mevzuata uygun şekilde işlemeyi taahhüt ederiz.',
        '</p>',

        '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Kapsam</h2>',
          '<p class="text-slate-700">',
            'Bu metin; web sitemiz üzerinden toplanan bilgilerin hangi amaçlarla işlendiğini, nasıl korunduğunu ve kullanıcıların haklarını açıklamaktadır.',
          '</p>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Toplanan Bilgiler</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>İletişim formları üzerinden paylaşılan ad-soyad, e-posta, telefon gibi bilgiler</li>',
            '<li>Teknik veriler (IP, tarayıcı türü, cihaz bilgisi, erişim zamanı) ve log kayıtları</li>',
            '<li>Çerezler aracılığıyla toplanan kullanım ve tercih verileri</li>',
          '</ul>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. İşleme Amaçları</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Taleplerinize yanıt vermek ve iletişimi sürdürmek</li>',
            '<li>Web sitesi güvenliği, performans ve hizmet kalitesini iyileştirmek</li>',
            '<li>Yasal yükümlülüklerin yerine getirilmesi</li>',
          '</ul>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">4. Saklama ve Güvenlik</h2>',
          '<p class="text-slate-700">',
            'Veriler; yetkisiz erişime karşı teknik ve idari tedbirlerle korunur ve yalnızca gerekli süre boyunca saklanır.',
          '</p>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">5. Üçüncü Taraflar</h2>',
          '<p class="text-slate-700">',
            'Hizmet altyapısı (barındırma, e-posta gönderimi, analiz vb.) kapsamında iş ortaklarıyla sınırlı veri paylaşımı olabilir. Bu paylaşımlar sözleşmesel ve güvenlik tedbirleriyle yönetilir.',
          '</p>',
        '</div>',

        '<div class="bg-slate-900 text-white rounded-xl p-6">',
          '<h2 class="text-xl font-semibold mb-3">6. Haklar ve İletişim</h2>',
          '<p class="text-white/90">',
            'Kişisel verilerinizle ilgili talepleriniz için bizimle iletişime geçebilirsiniz. İlgili süreçler ayrıca KVKK / Aydınlatma metinlerimiz kapsamında değerlendirilir.',
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
      '<section class="container mx-auto px-4 py-8">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Privacy Policy</h1>',
        '<p class="text-slate-700 mb-6">',
          'At Ensotek, we are committed to protecting the privacy of visitors and processing personal data in compliance with applicable laws.',
        '</p>',

        '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Scope</h2>',
          '<p class="text-slate-700">',
            'This notice explains what information we collect through our website, why we process it, how we protect it, and the rights available to users.',
          '</p>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Information We Collect</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Information provided via contact forms (name, email, phone, etc.)</li>',
            '<li>Technical data (IP address, browser/device details, access times) and logs</li>',
            '<li>Usage and preference data collected via cookies</li>',
          '</ul>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Purposes of Processing</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>To respond to inquiries and maintain communication</li>',
            '<li>To improve website security, performance, and service quality</li>',
            '<li>To comply with legal obligations</li>',
          '</ul>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">4. Retention and Security</h2>',
          '<p class="text-slate-700">',
            'We apply appropriate technical and organisational measures to protect data and retain it only for as long as necessary.',
          '</p>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">5. Third Parties</h2>',
          '<p class="text-slate-700">',
            'We may share limited data with service providers (hosting, email delivery, analytics, etc.) under contractual and security safeguards.',
          '</p>',
        '</div>',

        '<div class="bg-slate-900 text-white rounded-xl p-6">',
          '<h2 class="text-xl font-semibold mb-3">6. Your Rights and Contact</h2>',
          '<p class="text-white/90">',
            'You may contact us regarding your personal data. Related processes are also assessed under our PDPL/KVKK and information notices where applicable.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Ensotek Privacy Policy: information collected on the website, purposes of use, retention, security measures, and user rights.',
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
      '<section class="container mx-auto px-4 py-8">',
        '<h1 class="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Datenschutzerklärung</h1>',
        '<p class="text-slate-700 mb-6">',
          'Ensotek verpflichtet sich, die Privatsphäre der Besucher zu schützen und personenbezogene Daten im Einklang mit den anwendbaren gesetzlichen Vorgaben zu verarbeiten.',
        '</p>',

        '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">1. Geltungsbereich</h2>',
          '<p class="text-slate-700">',
            'Diese Erklärung beschreibt, welche Daten über unsere Website erhoben werden, zu welchen Zwecken dies geschieht, wie wir sie schützen und welche Rechte Nutzern zustehen.',
          '</p>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">2. Erhobene Daten</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Angaben aus Kontaktformularen (Name, E-Mail, Telefon usw.)</li>',
            '<li>Technische Daten (IP-Adresse, Browser-/Geräteinformationen, Zugriffszeiten) und Logdaten</li>',
            '<li>Nutzungs- und Präferenzdaten über Cookies</li>',
          '</ul>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">3. Zwecke der Verarbeitung</h2>',
          '<ul class="list-disc pl-6 text-slate-700 space-y-2">',
            '<li>Beantwortung von Anfragen und Kommunikation</li>',
            '<li>Verbesserung von Sicherheit, Performance und Servicequalität</li>',
            '<li>Erfüllung gesetzlicher Pflichten</li>',
          '</ul>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">4. Aufbewahrung und Sicherheit</h2>',
          '<p class="text-slate-700">',
            'Wir treffen geeignete technische und organisatorische Maßnahmen und speichern Daten nur so lange, wie es erforderlich ist.',
          '</p>',
        '</div>',

        '<div class="bg-white border border-slate-200 rounded-xl p-6 mb-6">',
          '<h2 class="text-xl font-semibold text-slate-900 mb-3">5. Dritte Dienstleister</h2>',
          '<p class="text-slate-700">',
            'Eine begrenzte Weitergabe an Dienstleister (Hosting, E-Mail-Versand, Analyse usw.) kann erfolgen und wird durch vertragliche sowie sicherheitstechnische Maßnahmen abgesichert.',
          '</p>',
        '</div>',

        '<div class="bg-slate-900 text-white rounded-xl p-6">',
          '<h2 class="text-xl font-semibold mb-3">6. Rechte und Kontakt</h2>',
          '<p class="text-white/90">',
            'Bei Fragen oder Anträgen zu Ihren personenbezogenen Daten können Sie uns kontaktieren. Relevante Prozesse werden – soweit anwendbar – auch im Kontext DSGVO/KVKK bewertet.',
          '</p>',
        '</div>',
      '</section>'
    )
  ),
  'Ensotek Datenschutzerklärung: erhobene Daten, Zwecke, Aufbewahrung, Sicherheitsmaßnahmen und Rechte der Nutzer.',
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

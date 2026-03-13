-- =============================================================
-- FILE: 305_kompozit_pages.seed.sql
-- MOE Kompozit — Kurumsal + Yasal custom page içerikleri
-- module_key = 'kompozit_about' | 'kompozit_legal'
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

INSERT INTO `custom_pages`
(
  `id`,
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
  `sub_category_id`
)
VALUES
  ('bc010001-5001-4001-9001-cccccccc0001', 'kompozit_about', 1, 0, 10, 10, NULL, NULL, NULL, NULL, '[]', '[]', NULL, NULL),
  ('bc010002-5002-4002-9002-cccccccc0002', 'kompozit_legal', 1, 0, 20, 20, NULL, NULL, NULL, NULL, '[]', '[]', NULL, NULL),
  ('bc010003-5003-4003-9003-cccccccc0003', 'kompozit_legal', 1, 0, 30, 30, NULL, NULL, NULL, NULL, '[]', '[]', NULL, NULL),
  ('bc010004-5004-4004-9004-cccccccc0004', 'kompozit_legal', 1, 0, 40, 40, NULL, NULL, NULL, NULL, '[]', '[]', NULL, NULL),
  ('bc010005-5005-4005-9005-cccccccc0005', 'kompozit_legal', 1, 0, 50, 50, NULL, NULL, NULL, NULL, '[]', '[]', NULL, NULL)
ON DUPLICATE KEY UPDATE
  `module_key` = VALUES(`module_key`),
  `is_published` = VALUES(`is_published`),
  `featured` = VALUES(`featured`),
  `display_order` = VALUES(`display_order`),
  `order_num` = VALUES(`order_num`);

INSERT INTO `custom_pages_i18n`
(
  `id`,
  `page_id`,
  `locale`,
  `title`,
  `slug`,
  `content`,
  `summary`,
  `meta_title`,
  `meta_description`,
  `tags`
)
VALUES
  (
    'bc020001-6001-4001-a001-cccccccc0001',
    'bc010001-5001-4001-9001-cccccccc0001',
    'tr',
    'Hakkımızda',
    'about',
    JSON_OBJECT('html', '<p>MOE Kompozit, karbon fiber, CTP ve cam elyaf tabanlı kompozit parçalarda mühendislik, prototipleme ve seri üretim desteği sunmak amacıyla yapılandırılmış bir endüstriyel çözüm markasıdır.</p><h2>Nasıl Çalışıyoruz?</h2><p>Her projeyi uygulama şartları, mekanik beklentiler, proses uyumu ve toplam sahip olma maliyeti ekseninde değerlendiriyoruz. Numune doğrulama, proses standardizasyonu ve seri üretime geçiş planı aynı akış içinde ele alınır.</p><h2>Odaklandığımız Alanlar</h2><ul><li>Karbon fiber yapısal parçalar</li><li>CTP ve cam elyaf endüstriyel gövde bileşenleri</li><li>Özel panel, profil ve koruyucu kaplama çözümleri</li><li>Prototipten seri üretime geçiş mühendisliği</li></ul><p>MOE Kompozit, teknik ekiplerle aynı dili konuşan, uygulama odaklı ve teslimat disiplini yüksek bir üretim partneri olmayı hedefler.</p>'),
    'MOE Kompozit’in mühendislik yaklaşımı, üretim disiplini ve kompozit parça geliştirme odağı.',
    'Hakkımızda | MOE Kompozit',
    'MOE Kompozit’in kompozit mühendislik, prototipleme ve seri üretim yaklaşımını inceleyin.',
    'moe kompozit, hakkımızda, kompozit mühendislik, seri üretim'
  ),
  (
    'bc020002-6002-4002-a002-cccccccc0002',
    'bc010002-5002-4002-9002-cccccccc0002',
    'tr',
    'Gizlilik Politikası',
    'privacy',
    JSON_OBJECT('html', '<p>MOE Kompozit olarak web sitesi üzerinden iletilen kişisel verilerin gizliliğini önemsiyoruz. İletişim ve teklif formlarında paylaşılan bilgiler yalnızca talep yönetimi, geri dönüş sağlama ve müşteri ilişkileri süreçleri için kullanılır.</p><h2>Toplanan Veriler</h2><ul><li>Ad soyad ve firma bilgisi</li><li>E-posta adresi ve telefon numarası</li><li>Talep içeriği, teknik dosya ve ek açıklamalar</li><li>Temel ziyaret ve performans kayıtları</li></ul><h2>Verilerin Kullanımı</h2><p>Toplanan veriler izinsiz üçüncü taraflarla pazarlama amacıyla paylaşılmaz. Yasal yükümlülükler veya açık rıza halleri dışında veri aktarımı yapılmaz.</p><h2>Haklar</h2><p>İlgili kişiler, veri işlenip işlenmediğini öğrenme, düzeltme, silme ve itiraz etme haklarına sahiptir. Taleplerinizi iletişim kanallarımız üzerinden iletebilirsiniz.</p>'),
    'MOE Kompozit kişisel veri işleme ve gizlilik esasları.',
    'Gizlilik Politikası | MOE Kompozit',
    'MOE Kompozit web sitesi gizlilik politikası ve kişisel veri işleme esasları.',
    'gizlilik politikası, kişisel veri, moe kompozit'
  ),
  (
    'bc020003-6003-4003-a003-cccccccc0003',
    'bc010003-5003-4003-9003-cccccccc0003',
    'tr',
    'Kullanım Koşulları',
    'terms',
    JSON_OBJECT('html', '<p>Bu web sitesini kullanan her ziyaretçi aşağıdaki kullanım koşullarını kabul etmiş sayılır. Sitede yer alan içerik, görsel ve teknik açıklamalar bilgilendirme amacı taşır; nihai teknik şartname yerine geçmez.</p><h2>İçerik Kullanımı</h2><p>Metin, görsel ve marka öğeleri izinsiz olarak kopyalanamaz, çoğaltılamaz veya ticari amaçla kullanılamaz.</p><h2>Sorumluluk Sınırı</h2><p>Web sitesindeki içerik güncel tutulmaya çalışılır; ancak projeye özel teknik doğrulama yapılmadan yalnızca site içeriğine dayanılarak karar verilmemelidir.</p><h2>Bağlantılar</h2><p>Harici bağlantılar bilgi amaçlıdır. Üçüncü taraf içeriklerinden doğacak sorumluluk ilgili yayıncılara aittir.</p>'),
    'MOE Kompozit web sitesi kullanım koşulları ve sorumluluk sınırları.',
    'Kullanım Koşulları | MOE Kompozit',
    'MOE Kompozit web sitesi kullanım koşulları, içerik hakları ve sorumluluk sınırları.',
    'kullanım koşulları, moe kompozit, web sitesi şartları'
  ),
  (
    'bc020004-6004-4004-a004-cccccccc0004',
    'bc010004-5004-4004-9004-cccccccc0004',
    'tr',
    'KVKK Aydınlatma Metni',
    'kvkk-aydinlatma-metni',
    JSON_OBJECT('html', '<p>6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu sıfatıyla, MOE Kompozit tarafından işlenen kişisel verilere ilişkin aydınlatma bu metin ile yapılmaktadır.</p><h2>İşleme Amaçları</h2><ul><li>Teklif ve iletişim taleplerinin yönetimi</li><li>Satış ve satış sonrası süreçlerin yürütülmesi</li><li>Hizmet kalitesinin geliştirilmesi</li><li>Yasal yükümlülüklerin yerine getirilmesi</li></ul><h2>Toplama Yöntemi</h2><p>Kişisel veriler web formları, e-posta, telefon ve fiziksel evrak üzerinden toplanabilir.</p><h2>Başvuru</h2><p>KVKK kapsamındaki taleplerinizi kayıtlı iletişim kanalları üzerinden yazılı olarak iletebilirsiniz.</p>'),
    'KVKK kapsamında kişisel veri işleme ve başvuru esasları.',
    'KVKK Aydınlatma Metni | MOE Kompozit',
    'MOE Kompozit KVKK aydınlatma metni, veri işleme amaçları ve başvuru esasları.',
    'kvkk, aydınlatma metni, kişisel veri'
  ),
  (
    'bc020005-6005-4005-a005-cccccccc0005',
    'bc010005-5005-4005-9005-cccccccc0005',
    'tr',
    'Çerez Politikası',
    'cookies',
    JSON_OBJECT('html', '<p>Bu web sitesinde kullanıcı deneyimini iyileştirmek, temel performans ölçümleri almak ve teknik sorunları tespit etmek amacıyla çerezler kullanılabilir.</p><h2>Çerez Türleri</h2><ul><li>Zorunlu çerezler</li><li>Tercih çerezleri</li><li>Analitik ve performans çerezleri</li></ul><h2>Yönetim</h2><p>Tarayıcı ayarlarınız üzerinden çerez tercihlerinizi değiştirebilir veya mevcut çerezleri silebilirsiniz. Bazı çerezlerin devre dışı bırakılması site fonksiyonlarını etkileyebilir.</p>'),
    'MOE Kompozit web sitesi çerez kullanımı ve tercih yönetimi bilgileri.',
    'Çerez Politikası | MOE Kompozit',
    'MOE Kompozit web sitesi çerez politikası, çerez türleri ve tercih yönetimi bilgileri.',
    'çerez politikası, cookies, web sitesi tercihleri'
  ),
  (
    'bc020006-6006-4006-a006-cccccccc0006',
    'bc010001-5001-4001-9001-cccccccc0001',
    'en',
    'About Us',
    'about',
    JSON_OBJECT('html', '<p>MOE Kompozit is an industrial solutions brand structured to support engineering, prototyping, and series production for carbon fiber, FRP, and fiberglass-based composite parts.</p><h2>How We Work</h2><p>We evaluate each project through application conditions, mechanical requirements, process compatibility, and total cost of ownership. Sample validation, process standardization, and ramp-up planning are handled within a single delivery flow.</p><h2>Focus Areas</h2><ul><li>Carbon fiber structural parts</li><li>FRP and fiberglass industrial body components</li><li>Custom panels, profiles, and protective enclosure solutions</li><li>Engineering support from prototype to serial production</li></ul><p>MOE Kompozit aims to be a disciplined production partner that speaks the same technical language as engineering teams.</p>'),
    'MOE Kompozit engineering approach, production discipline, and composite part development focus.',
    'About Us | MOE Kompozit',
    'Learn about MOE Kompozit’s composite engineering, prototyping, and serial production approach.',
    'about moe kompozit, composite engineering, serial production'
  ),
  (
    'bc020007-6007-4007-a007-cccccccc0007',
    'bc010002-5002-4002-9002-cccccccc0002',
    'en',
    'Privacy Policy',
    'privacy',
    JSON_OBJECT('html', '<p>At MOE Kompozit, we value the privacy of personal data submitted through this website. Information shared in contact and quotation forms is used only for request handling, response management, and customer communication.</p><h2>Collected Data</h2><ul><li>Name, surname, and company details</li><li>Email address and phone number</li><li>Request content, technical files, and attachments</li><li>Basic visit and performance records</li></ul><h2>Use of Data</h2><p>Collected data is not shared with third parties for marketing purposes without consent. Data transfer occurs only where legally required or explicitly authorized.</p><h2>Rights</h2><p>Data subjects may request access, correction, deletion, or objection regarding their personal data via our communication channels.</p>'),
    'MOE Kompozit personal data processing and privacy principles.',
    'Privacy Policy | MOE Kompozit',
    'Read the MOE Kompozit website privacy policy and personal data processing principles.',
    'privacy policy, personal data, moe kompozit'
  ),
  (
    'bc020008-6008-4008-a008-cccccccc0008',
    'bc010003-5003-4003-9003-cccccccc0003',
    'en',
    'Terms of Use',
    'terms',
    JSON_OBJECT('html', '<p>By using this website, visitors are deemed to accept the following terms of use. All content, visuals, and technical statements are provided for information purposes and do not replace a project-specific specification.</p><h2>Content Usage</h2><p>Text, visuals, and brand assets may not be copied, reproduced, or commercially used without prior permission.</p><h2>Limitation of Liability</h2><p>Website content is maintained carefully; however, no project decision should be made solely on website information without technical validation.</p><h2>External Links</h2><p>External links are provided for convenience. Responsibility for third-party content belongs to the respective publishers.</p>'),
    'MOE Kompozit website terms of use and limitation of liability.',
    'Terms of Use | MOE Kompozit',
    'MOE Kompozit website terms of use, content rights, and limitation of liability.',
    'terms of use, website terms, moe kompozit'
  ),
  (
    'bc020009-6009-4009-a009-cccccccc0009',
    'bc010004-5004-4004-9004-cccccccc0004',
    'en',
    'PDPL Information Notice',
    'pdpl-information-notice',
    JSON_OBJECT('html', '<p>In accordance with the Turkish Personal Data Protection Law No. 6698, MOE Kompozit provides this information notice as the data controller regarding the processing of personal data.</p><h2>Processing Purposes</h2><ul><li>Managing quotation and contact requests</li><li>Running sales and after-sales processes</li><li>Improving service quality</li><li>Fulfilling legal obligations</li></ul><h2>Collection Methods</h2><p>Personal data may be collected through web forms, email, phone, and physical documents.</p><h2>Applications</h2><p>You may submit your requests regarding personal data through our registered communication channels.</p>'),
    'Information notice for personal data processing under Turkish PDPL.',
    'PDPL Information Notice | MOE Kompozit',
    'MOE Kompozit PDPL information notice, processing purposes, and application principles.',
    'pdpl, kvkk, personal data notice'
  ),
  (
    'bc020010-6010-4010-a010-cccccccc0010',
    'bc010005-5005-4005-9005-cccccccc0005',
    'en',
    'Cookie Policy',
    'cookies',
    JSON_OBJECT('html', '<p>This website may use cookies to improve user experience, collect essential performance metrics, and identify technical issues.</p><h2>Cookie Types</h2><ul><li>Strictly necessary cookies</li><li>Preference cookies</li><li>Analytics and performance cookies</li></ul><h2>Management</h2><p>You may change your cookie preferences or delete stored cookies through your browser settings. Disabling some cookies may affect certain site functions.</p>'),
    'MOE Kompozit website cookie usage and preference management information.',
    'Cookie Policy | MOE Kompozit',
    'MOE Kompozit website cookie policy, cookie types, and preference management information.',
    'cookie policy, cookies, website preferences'
  )
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `slug` = VALUES(`slug`),
  `content` = VALUES(`content`),
  `summary` = VALUES(`summary`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`),
  `tags` = VALUES(`tags`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;

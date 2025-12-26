-- =============================================================
-- FILE: 054_custom_pages_team.seed.sql
-- TEAM – custom_pages + custom_pages_i18n
-- Bu seed:
--  - Yönetim ve Kurucu Ortaklar (3 kişi) – TR/EN/DE
--  - Mühendislik Ekibi (örnek 1 kişi) – TR/EN/DE
--  - Saha & Servis Ekibi (örnek 1 kişi) – TR/EN/DE
--  - Dış Ticaret (Can Zemheri) (örnek 1 kişi) – TR/EN/DE
-- NOT: Bu dosyada BLOK YORUM (/* */) YOKTUR. Sadece "--" kullanılır.
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- KATEGORİ ID (TEAM)
SET @CAT_TEAM_MAIN := 'aaaa9101-1111-4111-8111-aaaaaaaa9101'; -- EKİBİMİZ

-- ALT KATEGORİLER (TEAM)
SET @SUB_TEAM_MGMT    := 'bbbb9101-1111-4111-8111-bbbbbbbb9101'; -- Yönetim ve Kurucu Ortaklar
SET @SUB_TEAM_ENG     := 'bbbb9102-1111-4111-8111-bbbbbbbb9102'; -- Mühendislik Ekibi
SET @SUB_TEAM_SERVICE := 'bbbb9103-1111-4111-8111-bbbbbbbb9103'; -- Saha ve Servis Ekibi
SET @SUB_TEAM_FT      := 'bbbb9104-1111-4111-8111-bbbbbbbb9104'; -- Dış Ticaret (Yeni ekip)

-- =============================================================
-- SABİT PAGE ID’LERİ (deterministik)
-- =============================================================

-- Yönetim / Kurucu Ortaklar (3 kişi)
SET @TEAM_MGMT_1 := '44440001-4444-4444-8444-444444440001'; -- İbrahim YAĞAR
SET @TEAM_MGMT_2 := '44440004-4444-4444-8444-444444440004'; -- Hamdi YAĞAR
SET @TEAM_MGMT_3 := '44440005-4444-4444-8444-444444440005'; -- Ahmet Gökhan YAĞAR

-- Mühendislik (örnek)
SET @TEAM_ENG_1 := '44440002-4444-4444-8444-444444440002'; -- Senior Project Engineer (örnek)

-- Saha & Servis (örnek)
SET @TEAM_SERVICE_1 := '44440003-4444-4444-8444-444444440003'; -- Field & Service Supervisor (örnek)

-- Dış Ticaret (yeni)
SET @TEAM_FT_1 := '44440006-4444-4444-8444-444444440006'; -- Can Zemheri

-- =============================================================
-- FEATURED IMAGES (random / sonradan değiştirirsin)
-- =============================================================

-- Yönetim
SET @IMG_TEAM_MGMT_1 :=
  'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=1200&h=800&q=80';
SET @IMG_TEAM_MGMT_2 :=
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&h=800&q=80';
SET @IMG_TEAM_MGMT_3 :=
  'https://images.unsplash.com/photo-1522071901873-411886a10004?auto=format&fit=crop&w=1200&h=800&q=80';

-- Mühendislik
SET @IMG_TEAM_ENG_1 :=
  'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&h=800&q=80';

-- Saha & Servis
SET @IMG_TEAM_SERVICE_1 :=
  'https://images.unsplash.com/photo-1581091215367-59ab6c7f3b4b?auto=format&fit=crop&w=1200&h=800&q=80';

-- Dış Ticaret
SET @IMG_TEAM_FT_1 :=
  'https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&h=800&q=80';

-- =============================================================
-- PARENT UPSERT (custom_pages)
-- =============================================================
INSERT INTO `custom_pages`
  (`id`, `is_published`, `display_order`,
   `featured_image`, `featured_image_asset_id`,
   `category_id`, `sub_category_id`,
   `created_at`, `updated_at`)
VALUES
  -- Yönetim / Kurucu Ortaklar
  (
    @TEAM_MGMT_1, 1, 101, @IMG_TEAM_MGMT_1, NULL, @CAT_TEAM_MAIN, @SUB_TEAM_MGMT, NOW(3), NOW(3)
  ),
  (
    @TEAM_MGMT_2, 1, 102, @IMG_TEAM_MGMT_2, NULL, @CAT_TEAM_MAIN, @SUB_TEAM_MGMT, NOW(3), NOW(3)
  ),
  (
    @TEAM_MGMT_3, 1, 103, @IMG_TEAM_MGMT_3, NULL, @CAT_TEAM_MAIN, @SUB_TEAM_MGMT, NOW(3), NOW(3)
  ),

  -- Mühendislik
  (
    @TEAM_ENG_1, 1, 201, @IMG_TEAM_ENG_1, NULL, @CAT_TEAM_MAIN, @SUB_TEAM_ENG, NOW(3), NOW(3)
  ),

  -- Saha & Servis
  (
    @TEAM_SERVICE_1, 1, 301, @IMG_TEAM_SERVICE_1, NULL, @CAT_TEAM_MAIN, @SUB_TEAM_SERVICE, NOW(3), NOW(3)
  ),

  -- Dış Ticaret
  (
    @TEAM_FT_1, 1, 401, @IMG_TEAM_FT_1, NULL, @CAT_TEAM_MAIN, @SUB_TEAM_FT, NOW(3), NOW(3)
  )

ON DUPLICATE KEY UPDATE
  `is_published`    = VALUES(`is_published`),
  `display_order`   = VALUES(`display_order`),
  `category_id`     = VALUES(`category_id`),
  `sub_category_id` = VALUES(`sub_category_id`),
  `featured_image`  = VALUES(`featured_image`),
  `updated_at`      = VALUES(`updated_at`);

-- =============================================================
-- I18N – TEAM (tüm sayfalar) – TR/EN/DE
-- content JSON_OBJECT('html', CONCAT(...)) formatında tutulur.
-- tags: CSV string.
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
-- TEAM_MGMT_1 – İbrahim YAĞAR
-- =============================================================
(
  UUID(), @TEAM_MGMT_1, 'de',
  'İbrahim YAĞAR – Kurucu & Genel Müdür',
  'ibrahim-yagar-kurucu-genel-mudur',
  JSON_OBJECT('html', CONCAT(
    '<h2>Kurucu Liderlik</h2>',
    '<p><strong>İbrahim YAĞAR</strong>, Ensotek Su Soğutma Kuleleri’nin kurucusu ve genel müdürüdür. ',
    'Yaklaşık <strong>36 yıl önce</strong> şirketi kurarak Ensotek’i yerel bir girişimden, global ölçekte bilinen bir marka ve üretim gücüne dönüştürmüştür.</p>',
    '<h3>Odak Alanları</h3>',
    '<ul>',
    '<li><strong>Strateji ve büyüme:</strong> Pazarlara açılım, hedef segmentler ve uzun vadeli büyüme planı</li>',
    '<li><strong>İnovasyon:</strong> Verimlilik, dayanıklılık ve sürdürülebilirlik odaklı ürün yaklaşımı</li>',
    '<li><strong>Kurumsal yönetim:</strong> Kalite kültürü, müşteri memnuniyeti ve marka standardı</li>',
    '</ul>',
    '<p>Ensotek’in rekabetçi konumunu güçlendiren yaklaşımı; mühendislik disiplinini, sahadan gelen deneyimi ve uzun vadeli müşteri ilişkilerini birlikte yönetmektir.</p>'
  )),
  'İbrahim YAĞAR; Ensotek’in kurucusu ve genel müdürü. 36 yıllık liderlik ve inovasyon odağıyla markayı global ölçekte konumlandırmıştır.',
  'Ensotek yönetim ekibi – İbrahim YAĞAR (kurucu ve genel müdür)',
  'İbrahim YAĞAR | Kurucu & Genel Müdür – Ensotek',
  'İbrahim YAĞAR; Ensotek’in kurucusu ve genel müdürü. Strateji, inovasyon ve kurumsal yönetimi 36 yıllık deneyimiyle yönetir.',
  'ensotek,ekibimiz,yönetim,kurucu,genel müdür,ibrahim yagar,su soğutma kuleleri',
  NOW(3), NOW(3)
),
(
  UUID(), @TEAM_MGMT_1, 'en',
  'İbrahim YAĞAR – Founder & Managing Director',
  'ibrahim-yagar-founder-managing-director',
  JSON_OBJECT('html', CONCAT(
    '<h2>Founding Leadership</h2>',
    '<p><strong>İbrahim YAĞAR</strong> is the founder and managing director of Ensotek Cooling Towers. ',
    'He established the company around <strong>36 years ago</strong> and grew Ensotek from a local venture into a globally recognised brand.</p>',
    '<h3>Key Focus Areas</h3>',
    '<ul>',
    '<li><strong>Strategy & growth:</strong> Market expansion, target industries and long-term direction</li>',
    '<li><strong>Innovation:</strong> Efficiency, durability and sustainability-driven product mindset</li>',
    '<li><strong>Corporate leadership:</strong> Quality culture, customer success and brand standards</li>',
    '</ul>',
    '<p>His leadership combines engineering discipline, field experience and long-term customer relationships to deliver consistent value.</p>'
  )),
  'Founder and managing director of Ensotek. With 36 years of leadership, he shaped the brand through strategy, innovation and quality culture.',
  'Ensotek leadership team – İbrahim YAĞAR (Founder & Managing Director)',
  'İbrahim YAĞAR | Founder & Managing Director – Ensotek',
  'İbrahim YAĞAR is the founder and managing director of Ensotek Cooling Towers. He leads strategy, innovation and corporate governance with 36 years of experience.',
  'ensotek,our team,management,founder,managing director,ibrahim yagar,cooling towers',
  NOW(3), NOW(3)
),
(
  UUID(), @TEAM_MGMT_1, 'de',
  'İbrahim YAĞAR – Geschäftsführer und Gründer',
  'ibrahim-yagar-geschaeftsfuehrer-und-gruender',
  JSON_OBJECT('html', CONCAT(
    '<h2>Gründung und Führung</h2>',
    '<p><strong>İbrahim YAĞAR</strong> ist Geschäftsführer und Gründer von Ensotek Su Soğutma Kuleleri. ',
    'Er gründete das Unternehmen vor rund <strong>36 Jahren</strong> und entwickelte Ensotek zu einer international anerkannten Marke im Kühlturmsektor.</p>',
    '<h3>Schwerpunkte</h3>',
    '<ul>',
    '<li><strong>Strategie & Wachstum:</strong> Marktentwicklung, Zielbranchen und langfristige Ausrichtung</li>',
    '<li><strong>Innovation:</strong> Fokus auf Effizienz, Langlebigkeit und Nachhaltigkeit</li>',
    '<li><strong>Unternehmensführung:</strong> Qualitätskultur, Kundenzufriedenheit und Markenstandards</li>',
    '</ul>',
    '<p>Sein Führungsstil verbindet ingenieurtechnische Präzision, praxisnahe Erfahrung und langfristige Kundenbeziehungen – mit dem Ziel, verlässliche Lösungen zu liefern.</p>'
  )),
  'Geschäftsführer und Gründer von Ensotek. Seit rund 36 Jahren prägt er Strategie, Innovation und Qualitätskultur und positioniert Ensotek international.',
  'Ensotek Management – İbrahim YAĞAR (Geschäftsführer und Gründer)',
  'İbrahim YAĞAR | Geschäftsführer & Gründer – Ensotek',
  'İbrahim YAĞAR ist Geschäftsführer und Gründer von Ensotek. Mit rund 36 Jahren Erfahrung verantwortet er Strategie, Innovation und Unternehmensführung im Kühlturmsektor.',
  'ensotek,unser team,management,gruender,geschaeftsfuehrer,ibrahim yagar,kuehltuerme',
  NOW(3), NOW(3)
),

-- =============================================================
-- TEAM_MGMT_2 – Hamdi YAĞAR
-- =============================================================
(
  UUID(), @TEAM_MGMT_2, 'de',
  'Hamdi YAĞAR – Genel Müdür Yardımcısı',
  'hamdi-yagar-genel-mudur-yardimcisi',
  JSON_OBJECT('html', CONCAT(
    '<h2>Operasyon ve Süreç Yönetimi</h2>',
    '<p><strong>Hamdi YAĞAR</strong>, Ensotek’te <strong>Genel Müdür Yardımcısı</strong> olarak görev yapmaktadır. ',
    'Aile şirketlerinin yönetimi alanında <strong>18 yıllık</strong> deneyime sahiptir ve operasyonel süreçlerin verimli şekilde yürütülmesine odaklanır.</p>',
    '<h3>Sorumluluk Alanları</h3>',
    '<ul>',
    '<li><strong>Operasyon yönetimi:</strong> Günlük işleyiş, planlama ve kaynak koordinasyonu</li>',
    '<li><strong>Süreç iyileştirme:</strong> Verimlilik, zaman ve maliyet optimizasyonu</li>',
    '<li><strong>Koordinasyon:</strong> Üretim, satış ve servis ekipleri arasında uyum</li>',
    '</ul>',
    '<p>Ensotek’in sürdürülebilir büyüme hedeflerini destekleyen yönetim yaklaşımı; ölçülebilir performans, düzenli takip ve sürekli iyileştirmedir.</p>'
  )),
  'Hamdi YAĞAR; Ensotek genel müdür yardımcısı. 18 yıllık deneyimiyle operasyon, süreç iyileştirme ve ekip koordinasyonuna odaklanır.',
  'Ensotek yönetim ekibi – Hamdi YAĞAR (genel müdür yardımcısı)',
  'Hamdi YAĞAR | Genel Müdür Yardımcısı – Ensotek',
  'Hamdi YAĞAR; Ensotek’te genel müdür yardımcısıdır. Operasyon yönetimi, süreç iyileştirme ve koordinasyon alanlarında 18 yıllık deneyime sahiptir.',
  'ensotek,ekibimiz,yönetim,genel müdür yardımcısı,operasyon,süreç yönetimi,hamdi yagar',
  NOW(3), NOW(3)
),
(
  UUID(), @TEAM_MGMT_2, 'en',
  'Hamdi YAĞAR – Deputy Managing Director',
  'hamdi-yagar-deputy-managing-director',
  JSON_OBJECT('html', CONCAT(
    '<h2>Operations & Process Management</h2>',
    '<p><strong>Hamdi YAĞAR</strong> serves as the <strong>Deputy Managing Director</strong> at Ensotek. ',
    'He has <strong>18 years</strong> of experience in managing family-run businesses and focuses on efficient operational execution.</p>',
    '<h3>Responsibilities</h3>',
    '<ul>',
    '<li><strong>Operational leadership:</strong> Day-to-day planning and resource coordination</li>',
    '<li><strong>Process improvement:</strong> Efficiency, time and cost optimisation</li>',
    '<li><strong>Cross-team alignment:</strong> Synchronising production, sales and service</li>',
    '</ul>',
    '<p>He supports Ensotek’s sustainable growth through structured execution, measurable performance and continuous improvement.</p>'
  )),
  'Deputy managing director of Ensotek with 18 years of experience, focusing on operations, process improvement and cross-team coordination.',
  'Ensotek leadership team – Hamdi YAĞAR (Deputy Managing Director)',
  'Hamdi YAĞAR | Deputy Managing Director – Ensotek',
  'Hamdi YAĞAR is the deputy managing director at Ensotek. With 18 years of experience, he leads operations, process improvement and organisational coordination.',
  'ensotek,our team,management,deputy managing director,operations,process management,hamdi yagar',
  NOW(3), NOW(3)
),
(
  UUID(), @TEAM_MGMT_2, 'de',
  'Hamdi YAĞAR – Stellvertretender Geschäftsführer',
  'hamdi-yagar-stellvertretender-geschaeftsfuehrer',
  JSON_OBJECT('html', CONCAT(
    '<h2>Operatives Management</h2>',
    '<p><strong>Hamdi YAĞAR</strong> ist <strong>stellvertretender Geschäftsführer</strong> bei Ensotek. ',
    'Er verfügt über <strong>18 Jahre</strong> Erfahrung in der Führung von Familienunternehmen und ist auf die effiziente Steuerung betrieblicher Abläufe spezialisiert.</p>',
    '<h3>Verantwortungsbereiche</h3>',
    '<ul>',
    '<li><strong>Operative Leitung:</strong> Tagesgeschäft, Planung und Ressourcenkoordination</li>',
    '<li><strong>Prozessoptimierung:</strong> Effizienzsteigerung sowie Zeit- und Kostenoptimierung</li>',
    '<li><strong>Koordination:</strong> Abstimmung zwischen Produktion, Vertrieb und Service</li>',
    '</ul>',
    '<p>Sein Fokus liegt auf klaren Prozessen, Transparenz in der Umsetzung und einer leistungsorientierten Organisation – als Basis für nachhaltiges Wachstum.</p>'
  )),
  'Stellvertretender Geschäftsführer bei Ensotek. Mit 18 Jahren Erfahrung verantwortet er operative Abläufe, Prozessoptimierung und die Koordination der Teams.',
  'Ensotek Management – Hamdi YAĞAR (stellvertretender Geschäftsführer)',
  'Hamdi YAĞAR | Stellvertretender Geschäftsführer – Ensotek',
  'Hamdi YAĞAR ist stellvertretender Geschäftsführer bei Ensotek. Mit 18 Jahren Erfahrung steuert er operative Prozesse, Optimierung und Teamkoordination.',
  'ensotek,unser team,management,stellvertretender geschaeftsfuehrer,operativ,prozessmanagement,hamdi yagar',
  NOW(3), NOW(3)
),

-- =============================================================
-- TEAM_MGMT_3 – Ahmet Gökhan YAĞAR
-- =============================================================
(
  UUID(), @TEAM_MGMT_3, 'de',
  'Ahmet Gökhan YAĞAR – Yönetim Kurulu Üyesi & Üretim Müdürü',
  'ahmet-gokhan-yagar-yonetim-kurulu-uyesi-uretim-muduru',
  JSON_OBJECT('html', CONCAT(
    '<h2>Üretim ve Kalite Yönetimi</h2>',
    '<p><strong>Ahmet Gökhan YAĞAR</strong>, Ensotek’te <strong>Yönetim Kurulu Üyesi</strong> ve <strong>Üretim Müdürü</strong> olarak görev yapmaktadır. ',
    'Üretim süreçlerinin tüm aşamalarını uçtan uca planlar, izler ve kalite standartlarının sürekliliğini sağlar.</p>',
    '<h3>Sorumluluk Alanları</h3>',
    '<ul>',
    '<li><strong>Üretim planlama:</strong> Kapasite, termin ve kaynak yönetimi</li>',
    '<li><strong>Süreç kontrol:</strong> Üretim hattı standartları ve operasyonel disiplin</li>',
    '<li><strong>Kalite güvence:</strong> Ürün kalitesi, izlenebilirlik ve sürekli iyileştirme</li>',
    '</ul>',
    '<p>Hedefi; Ensotek’in sahada güven veren, uzun ömürlü ve yüksek performanslı ürünlerini istikrarlı şekilde üretmek ve geliştirmektir.</p>'
  )),
  'Ahmet Gökhan YAĞAR; yönetim kurulu üyesi ve üretim müdürü. Üretim planlama, süreç kontrol ve kalite güvence süreçlerini yönetir.',
  'Ensotek yönetim ekibi – Ahmet Gökhan YAĞAR (üretim müdürü)',
  'Ahmet Gökhan YAĞAR | Üretim Müdürü – Ensotek',
  'Ahmet Gökhan YAĞAR; Ensotek’te yönetim kurulu üyesi ve üretim müdürüdür. Üretim süreçleri, kalite standartları ve sürekli iyileştirmeyi yönetir.',
  'ensotek,ekibimiz,yönetim,üretim müdürü,kalite,üretim süreçleri,ahmet gokhan yagar',
  NOW(3), NOW(3)
),
(
  UUID(), @TEAM_MGMT_3, 'en',
  'Ahmet Gökhan YAĞAR – Board Member & Production Manager',
  'ahmet-gokhan-yagar-board-member-production-manager',
  JSON_OBJECT('html', CONCAT(
    '<h2>Production & Quality Management</h2>',
    '<p><strong>Ahmet Gökhan YAĞAR</strong> serves as a <strong>Board Member</strong> and <strong>Production Manager</strong> at Ensotek. ',
    'He oversees all phases of production, ensuring stable output quality and continuous improvement across manufacturing operations.</p>',
    '<h3>Responsibilities</h3>',
    '<ul>',
    '<li><strong>Production planning:</strong> Capacity, lead times and resource allocation</li>',
    '<li><strong>Process control:</strong> Manufacturing standards and operational discipline</li>',
    '<li><strong>Quality assurance:</strong> Product quality, traceability and continuous improvement</li>',
    '</ul>',
    '<p>His focus is to ensure Ensotek consistently delivers high-performance, long-lasting products that customers can trust in the field.</p>'
  )),
  'Board member and production manager at Ensotek. He leads production planning, process control and quality assurance to deliver consistent product quality.',
  'Ensotek leadership team – Ahmet Gökhan YAĞAR (Production Manager)',
  'Ahmet Gökhan YAĞAR | Production Manager – Ensotek',
  'Ahmet Gökhan YAĞAR is a board member and production manager at Ensotek. He manages production operations, quality standards and continuous improvement.',
  'ensotek,our team,management,production manager,quality,manufacturing,ahmet gokhan yagar',
  NOW(3), NOW(3)
),
(
  UUID(), @TEAM_MGMT_3, 'de',
  'Ahmet Gökhan YAĞAR – Vorstandsmitglied und Produktionsleiter',
  'ahmet-gokhan-yagar-vorstandsmitglied-produktionsleiter',
  JSON_OBJECT('html', CONCAT(
    '<h2>Produktion und Qualitätsmanagement</h2>',
    '<p><strong>Ahmet Gökhan YAĞAR</strong> ist bei Ensotek als <strong>Vorstandsmitglied</strong> und <strong>Produktionsleiter</strong> tätig. ',
    'In dieser Funktion überwacht er alle Phasen des Produktionsprozesses und stellt sicher, dass Ensotek konstant hochwertige Produkte fertigt.</p>',
    '<h3>Verantwortungsbereiche</h3>',
    '<ul>',
    '<li><strong>Produktionsplanung:</strong> Kapazität, Termine und Ressourceneinsatz</li>',
    '<li><strong>Prozesssteuerung:</strong> Standards in der Fertigung und operative Disziplin</li>',
    '<li><strong>Qualitätssicherung:</strong> Produktqualität, Rückverfolgbarkeit und kontinuierliche Verbesserung</li>',
    '</ul>',
    '<p>Sein Ziel ist eine stabile, zuverlässige Produktion – für langlebige und leistungsstarke Lösungen, die im Einsatz überzeugen.</p>'
  )),
  'Vorstandsmitglied und Produktionsleiter bei Ensotek. Verantwortlich für Produktionsplanung, Prozesssteuerung und Qualitätssicherung zur Sicherstellung konstant hoher Produktqualität.',
  'Ensotek Management – Ahmet Gökhan YAĞAR (Vorstandsmitglied und Produktionsleiter)',
  'Ahmet Gökhan YAĞAR | Produktionsleiter – Ensotek',
  'Ahmet Gökhan YAĞAR ist Vorstandsmitglied und Produktionsleiter bei Ensotek. Er verantwortet Produktionsprozesse, Qualitätsstandards und kontinuierliche Verbesserungen.',
  'ensotek,unser team,management,vorstandsmitglied,produktionsleiter,qualitaet,fertigung,ahmet gokhan yagar',
  NOW(3), NOW(3)
),

-- =============================================================
-- TEAM_ENG_1 – Mühendislik Ekibi (örnek profil)
-- =============================================================
(
  UUID(), @TEAM_ENG_1, 'de',
  'Kıdemli Proje Mühendisi',
  'kidemli-proje-muhendisi',
  JSON_OBJECT('html', CONCAT(
    '<h2>Mühendislik ve Proje Tasarımı</h2>',
    '<p>Kıdemli proje mühendisi; FRP soğutma kuleleri, kapalı devre çözümler ve hibrit sistemler için ',
    'ısı transferi hesapları, kule seçimi ve layout tasarımı konularında uzmanlaşmıştır.</p>',
    '<h3>Çalışma Alanları</h3>',
    '<ul>',
    '<li>Kule seçimi, kapasite ve performans hesapları</li>',
    '<li>Yerleşim (layout) ve proje entegrasyonu</li>',
    '<li>Saha verileriyle optimizasyon ve revizyon</li>',
    '</ul>'
  )),
  'Ensotek mühendislik ekibinde görev yapan kıdemli proje mühendisinin teknik uzmanlık alanlarını özetleyen profil.',
  'Mühendislik ekibi – proje tasarım ve hesaplama',
  'Ensotek Kıdemli Proje Mühendisi | Ekibimiz',
  'FRP soğutma kuleleri, kapalı devre ve hibrit soğutma sistemleri için mühendislik ve proje tasarımı alanında görev yapan kıdemli proje mühendisi.',
  'ensotek,ekibimiz,mühendislik,proje mühendisi,ısı transferi,frp soğutma kulesi',
  NOW(3), NOW(3)
),
(
  UUID(), @TEAM_ENG_1, 'en',
  'Senior Project Engineer',
  'senior-project-engineer',
  JSON_OBJECT('html', CONCAT(
    '<h2>Engineering & Project Design</h2>',
    '<p>The senior project engineer is specialised in heat transfer calculations, tower selection and layout design for ',
    'FRP cooling towers, closed circuit solutions and hybrid systems.</p>',
    '<h3>Focus Areas</h3>',
    '<ul>',
    '<li>Tower selection, capacity and performance calculations</li>',
    '<li>Layout planning and project integration</li>',
    '<li>Optimisation and revisions based on field data</li>',
    '</ul>'
  )),
  'Profile of Ensotek’s senior project engineer and key engineering responsibilities.',
  'Engineering team – project design and calculations',
  'Ensotek Senior Project Engineer | Our Team',
  'Senior project engineer responsible for engineering and design of FRP cooling towers, closed circuit and hybrid cooling systems.',
  'ensotek,our team,engineering,senior project engineer,heat transfer,frp towers',
  NOW(3), NOW(3)
),
(
  UUID(), @TEAM_ENG_1, 'de',
  'Senior-Projektingenieur',
  'senior-projektingenieur',
  JSON_OBJECT('html', CONCAT(
    '<h2>Engineering und Projektplanung</h2>',
    '<p>Der Senior-Projektingenieur ist spezialisiert auf Wärmeübertragungsberechnungen, Turmauswahl und Layout-Design für ',
    'FRP-Kühltürme, geschlossene Kreislauflösungen und Hybridsysteme.</p>',
    '<h3>Schwerpunkte</h3>',
    '<ul>',
    '<li>Turmauswahl sowie Kapazitäts- und Leistungsberechnungen</li>',
    '<li>Layout-Planung und Projektintegration</li>',
    '<li>Optimierung und Anpassungen anhand von Felddaten</li>',
    '</ul>'
  )),
  'Kurzprofil des Senior-Projektingenieurs von Ensotek mit den wichtigsten technischen Aufgaben und Verantwortlichkeiten.',
  'Engineering-Team – Projektplanung und Berechnungen',
  'Ensotek Senior-Projektingenieur | Unser Team',
  'Senior-Projektingenieur für Engineering und Projektplanung von FRP-Kühltürmen sowie geschlossenen Kreislauf- und Hybrid-Kühlsystemen.',
  'ensotek,unser team,engineering,senior-projektingenieur,waermeuebertragung,frp kuehltuerme',
  NOW(3), NOW(3)
),

-- =============================================================
-- TEAM_SERVICE_1 – Saha & Servis Ekibi (örnek profil)
-- =============================================================
(
  UUID(), @TEAM_SERVICE_1, 'de',
  'Saha ve Servis Sorumlusu',
  'saha-ve-servis-sorumlusu',
  JSON_OBJECT('html', CONCAT(
    '<h2>Saha Operasyonları ve Servis</h2>',
    '<p>Saha ve servis sorumlusu; yerinde keşif, devreye alma, periyodik bakım, arıza tespiti ve modernizasyon uygulamalarının koordinasyonundan sorumludur.</p>',
    '<h3>Görevler</h3>',
    '<ul>',
    '<li>Devreye alma ve performans kontrolü</li>',
    '<li>Bakım planlama ve saha koordinasyonu</li>',
    '<li>Arıza tespiti ve modernizasyon uygulamaları</li>',
    '</ul>'
  )),
  'Ensotek saha ve servis ekibinin devreye alma, bakım ve modernizasyon süreçlerindeki rolünü özetleyen profil.',
  'Saha ve servis – devreye alma, bakım ve modernizasyon',
  'Ensotek Saha ve Servis Sorumlusu | Ekibimiz',
  'Ensotek soğutma kulesi projelerinde devreye alma, bakım, arıza tespiti ve modernizasyon süreçlerinden sorumlu saha ve servis sorumlusu.',
  'ensotek,ekibimiz,servis,saha,devreye alma,bakım,modernizasyon',
  NOW(3), NOW(3)
),
(
  UUID(), @TEAM_SERVICE_1, 'en',
  'Field & Service Supervisor',
  'field-and-service-supervisor',
  JSON_OBJECT('html', CONCAT(
    '<h2>Field Operations & Service</h2>',
    '<p>The field and service supervisor is responsible for site surveys, commissioning, periodic maintenance, troubleshooting and coordination of modernization works.</p>',
    '<h3>Responsibilities</h3>',
    '<ul>',
    '<li>Commissioning and performance verification</li>',
    '<li>Maintenance planning and on-site coordination</li>',
    '<li>Troubleshooting and modernization works</li>',
    '</ul>'
  )),
  'Profile summarising the role of the field and service supervisor in commissioning, maintenance and modernization projects.',
  'Field service – commissioning, maintenance and modernization',
  'Ensotek Field & Service Supervisor | Our Team',
  'Field and service supervisor responsible for commissioning, maintenance, troubleshooting and modernization on Ensotek cooling tower projects.',
  'ensotek,our team,service,field service,commissioning,maintenance,modernization',
  NOW(3), NOW(3)
),
(
  UUID(), @TEAM_SERVICE_1, 'de',
  'Leiter Außendienst & Service',
  'leiter-aussendienst-service',
  JSON_OBJECT('html', CONCAT(
    '<h2>Außendienst und Service</h2>',
    '<p>Der Leiter für Außendienst und Service ist verantwortlich für Vor-Ort-Begehungen, Inbetriebnahmen, regelmäßige Wartungen, Störungsdiagnosen sowie die Koordination von Modernisierungsarbeiten.</p>',
    '<h3>Aufgaben</h3>',
    '<ul>',
    '<li>Inbetriebnahme und Leistungsprüfung</li>',
    '<li>Wartungsplanung und Vor-Ort-Koordination</li>',
    '<li>Störungsdiagnose und Modernisierungsmaßnahmen</li>',
    '</ul>'
  )),
  'Kurzprofil zur Rolle des Leiters für Außendienst und Service bei Inbetriebnahme, Wartung und Modernisierung.',
  'Außendienst & Service – Inbetriebnahme, Wartung, Modernisierung',
  'Ensotek Leiter Außendienst & Service | Unser Team',
  'Leiter für Außendienst und Service in Ensotek-Kühlturmprojekten, verantwortlich für Inbetriebnahme, Wartung, Störungsdiagnose und Modernisierung.',
  'ensotek,unser team,service,aussendienst,service,inbetriebnahme,wartung,modernisierung',
  NOW(3), NOW(3)
),

-- =============================================================
-- TEAM_FT_1 – Can Zemheri (Dış Ticaret)
-- =============================================================
(
  UUID(), @TEAM_FT_1, 'de',
  'Can Zemheri – Dış Ticaret Uzmanı',
  'can-zemheri-dis-ticaret-uzmani',
  JSON_OBJECT('html', CONCAT(
    '<h2>Küresel Ticaret ve Müşteri İlişkileri</h2>',
    '<p><strong>Can Zemheri</strong>, Ensotek’te dış ticaret süreçlerinin sorunsuz ilerlemesi için çalışır. ',
    'İthalat/ihracat operasyonları ve uluslararası müşteri ilişkileri konusunda uzmanlaşmıştır.</p>',
    '<h3>Sorumluluklar</h3>',
    '<ul>',
    '<li><strong>İthalat/İhracat:</strong> Süreç yönetimi, dokümantasyon ve koordinasyon</li>',
    '<li><strong>Müşteri ilişkileri:</strong> Uluslararası iletişim, takip ve memnuniyet yönetimi</li>',
    '<li><strong>Küresel ağ geliştirme:</strong> Yeni pazarlar ve iş ortaklıkları</li>',
    '</ul>',
    '<p>Can, Ensotek’in global ticaret ağının gelişiminde kilit rol oynar.</p>'
  )),
  'Can Zemheri; Ensotek’te dış ticaret uzmanı. İthalat/ihracat süreçleri ve uluslararası müşteri ilişkileriyle global ağın gelişiminde kilit rol oynar.',
  'Ensotek dış ticaret ekibi – Can Zemheri',
  'Can Zemheri | Dış Ticaret Uzmanı – Ensotek',
  'Can Zemheri, Ensotek’in dış ticaret süreçlerini ve uluslararası müşteri ilişkilerini yönetir; global ticaret ağının gelişimini destekler.',
  'ensotek,ekibimiz,dış ticaret,ihracat,ithalat,uluslararası,can zemheri',
  NOW(3), NOW(3)
),
(
  UUID(), @TEAM_FT_1, 'en',
  'Can Zemheri – Foreign Trade Specialist',
  'can-zemheri-foreign-trade-specialist',
  JSON_OBJECT('html', CONCAT(
    '<h2>Global Trade & Customer Relations</h2>',
    '<p><strong>Can Zemheri</strong> works to ensure smooth international trade operations at Ensotek. ',
    'As a specialist for foreign business, import/export processes and customer relationships, he plays a key role in expanding Ensotek’s global trade network.</p>',
    '<h3>Responsibilities</h3>',
    '<ul>',
    '<li><strong>Import/Export:</strong> Process management, documentation and coordination</li>',
    '<li><strong>Customer relations:</strong> International communication, follow-up and satisfaction</li>',
    '<li><strong>Global network:</strong> New markets and partnerships</li>',
    '</ul>'
  )),
  'Can Zemheri is a foreign trade specialist at Ensotek, focusing on import/export processes and international customer relationships to grow the global trade network.',
  'Ensotek foreign trade team – Can Zemheri',
  'Can Zemheri | Foreign Trade Specialist – Ensotek',
  'Can Zemheri supports Ensotek’s international trade operations by managing import/export processes and global customer relationships.',
  'ensotek,our team,foreign trade,import,export,international,can zemheri',
  NOW(3), NOW(3)
),
(
  UUID(), @TEAM_FT_1, 'de',
  'Can Zemheri – Außenhandelsexperte',
  'can-zemheri-aussenhandelsexperte',
  JSON_OBJECT('html', CONCAT(
    '<h2>Internationaler Handel</h2>',
    '<p><strong>Can Zemheri</strong> arbeitet daran, die internationalen Handelsprozesse reibungslos zu gestalten. ',
    'Als Experte für die Auslandsgeschäfte des Unternehmens, Import-/Exportprozesse und Kundenbeziehungen spielt Can eine Schlüsselrolle bei der Entwicklung des globalen Handelsnetzwerks von Ensotek.</p>'
  )),
  'Can Zemheri ist Außenhandelsexperte bei Ensotek und gestaltet internationale Handelsprozesse, Import/Export und Kundenbeziehungen maßgeblich mit.',
  'Ensotek Außenhandel – Can Zemheri',
  'Can Zemheri | Außenhandelsexperte – Ensotek',
  'Can Zemheri unterstützt Ensotek im internationalen Geschäft: Import-/Exportprozesse, Kundenbeziehungen und Ausbau des globalen Handelsnetzwerks.',
  'ensotek,unser team,aussenhandel,import,export,international,can zemheri',
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

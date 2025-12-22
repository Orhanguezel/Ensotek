-- =============================================================
-- FILE: 054_custom_pages_team.seed.sql
-- Team sayfaları (TEAM modülü) – custom_pages + custom_pages_i18n
-- 011_catalog_categories.sql & 012_catalog_subcategories.sql ile uyumlu
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

/* KATEGORİ ID’LERİ (TEAM) */
SET @CAT_TEAM_MAIN := 'aaaa9101-1111-4111-8111-aaaaaaaa9101'; -- EKİBİMİZ

/* ALT KATEGORİLER (TEAM) */
SET @SUB_TEAM_MGMT    := 'bbbb9101-1111-4111-8111-bbbbbbbb9101'; -- Yönetim ve Kurucu Ortaklar
SET @SUB_TEAM_ENG     := 'bbbb9102-1111-4111-8111-bbbbbbbb9102'; -- Mühendislik Ekibi
SET @SUB_TEAM_SERVICE := 'bbbb9103-1111-4111-8111-bbbbbbbb9103'; -- Saha ve Servis Ekibi

/* SABİT PAGE ID’LERİ (TEAM MEMBERS) */
SET @TEAM_MGMT_1    := '44440001-4444-4444-8444-444444440001';
SET @TEAM_ENG_1     := '44440002-4444-4444-8444-444444440002';
SET @TEAM_SERVICE_1 := '44440003-4444-4444-8444-444444440003';

-- -------------------------------------------------------------
-- PARENT INSERT – custom_pages
-- -------------------------------------------------------------
INSERT INTO `custom_pages`
  (`id`, `is_published`, `display_order`,
   `featured_image`, `featured_image_asset_id`,
   `category_id`, `sub_category_id`,
   `created_at`, `updated_at`)
VALUES
  (
    @TEAM_MGMT_1,
    1,
    101,
    NULL,
    NULL,
    @CAT_TEAM_MAIN,
    @SUB_TEAM_MGMT,
    NOW(3),
    NOW(3)
  ),
  (
    @TEAM_ENG_1,
    1,
    102,
    NULL,
    NULL,
    @CAT_TEAM_MAIN,
    @SUB_TEAM_ENG,
    NOW(3),
    NOW(3)
  ),
  (
    @TEAM_SERVICE_1,
    1,
    103,
    NULL,
    NULL,
    @CAT_TEAM_MAIN,
    @SUB_TEAM_SERVICE,
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
-- I18N – TEAM_MGMT_1 (Yönetim / Management)
-- =============================================================
INSERT INTO `custom_pages_i18n`
  (`id`, `page_id`, `locale`,
   `title`, `slug`, `content`,
   `summary`,
   `featured_image_alt`, `meta_title`, `meta_description`,
   `tags`,
   `created_at`, `updated_at`)
VALUES
-- TR
(
  UUID(),
  @TEAM_MGMT_1,
  'tr',
  'Kurucu Ortak & Genel Müdür',
  'kurucu-ortak-genel-mudur',
  JSON_OBJECT(
    'html',
    '<p>Ensotek''in kurucu ortağı ve genel müdürü, su soğutma kuleleri ve proses soğutma çözümleri alanında 20+ yıllık tecrübeye sahiptir. Yüzlerce endüstriyel projede konsept tasarım, sistem seçimi ve devreye alma süreçlerini yönetmiştir.</p>'
  ),
  'Ensotek kurucu ortağı ve genel müdürünün deneyimi ve sorumluluk alanlarını özetleyen tanıtım metni.',
  NULL,
  'Ensotek Kurucu Ortak & Genel Müdür | Ekibimiz',
  'Ensotek kurucu ortağı ve genel müdürünün, su soğutma kuleleri ve proses soğutma projelerindeki uzmanlığını anlatan kurumsal ekip sayfası.',
  'ensotek,team,management,kurucu ortak,genel mudur,su sogutma kuleleri',
  NOW(3),
  NOW(3)
),
-- EN
(
  UUID(),
  @TEAM_MGMT_1,
  'en',
  'Co-Founder & Managing Director',
  'co-founder-managing-director',
  JSON_OBJECT(
    'html',
    '<p>The co-founder and managing director of Ensotek has more than 20 years of experience in cooling towers and process cooling solutions. He has managed concept design, system selection and commissioning for hundreds of industrial projects.</p>'
  ),
  'Short profile of Ensotek''s co-founder and managing director, summarising key responsibilities and expertise.',
  NULL,
  'Ensotek Co-Founder & Managing Director | Our Team',
  'Corporate team page introducing Ensotek''s co-founder and managing director, with expertise in water cooling towers and process cooling projects.',
  'ensotek,team,management,co-founder,managing director,water cooling towers',
  NOW(3),
  NOW(3)
),
-- DE
(
  UUID(),
  @TEAM_MGMT_1,
  'de',
  'Mitgruender & Geschaeftsfuehrer',
  'mitgruender-geschaeftsfuehrer',
  JSON_OBJECT(
    'html',
    '<p>Der Mitgruender und Geschaeftsfuehrer von Ensotek verfuegt ueber mehr als 20 Jahre Erfahrung im Bereich Wasserkuehltuerme und Prozesskuehlung. Er hat Konzeptentwicklung, Systemauswahl und Inbetriebnahme in hunderten Industrieprojekten verantwortet.</p>'
  ),
  'Kurzprofil des Mitgruenders und Geschaeftsfuehrers von Ensotek mit den wichtigsten Verantwortungsbereichen und Fachkompetenzen.',
  NULL,
  'Ensotek Mitgruender & Geschaeftsfuehrer | Unser Team',
  'Unternehmensprofil des Mitgruenders und Geschaeftsfuehrers von Ensotek mit Expertise in Wasserkuehltuermen und Prozesskuehlungsprojekten.',
  'ensotek,team,management,mitgruender,geschaeftsfuehrer,wasserkuehltuerme',
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

-- =============================================================
-- I18N – TEAM_ENG_1 (Mühendislik Ekibi / Lead Engineer)
-- =============================================================
INSERT INTO `custom_pages_i18n`
  (`id`, `page_id`, `locale`,
   `title`, `slug`, `content`,
   `summary`,
   `featured_image_alt`, `meta_title`, `meta_description`,
   `tags`,
   `created_at`, `updated_at`)
VALUES
-- TR
(
  UUID(),
  @TEAM_ENG_1,
  'tr',
  'Kıdemli Proje Mühendisi',
  'kidemli-proje-muhendisi',
  JSON_OBJECT(
    'html',
    '<p>Kıdemli proje mühendisi, FRP soğutma kuleleri, kapalı devre çözümler ve hibrit sistemler için ısı transferi hesapları, kule seçimi ve layout tasarımı konularında uzmanlaşmıştır.</p>'
  ),
  'Ensotek kıdemli proje mühendisinin teknik uzmanlık alanları ve sorumluluklarını özetleyen tanıtım metni.',
  NULL,
  'Ensotek Kıdemli Proje Mühendisi | Ekibimiz',
  'FRP soğutma kuleleri, kapalı devre ve hibrit soğutma sistemleri için mühendislik ve proje tasarımı alanında görev yapan kıdemli proje mühendisi.',
  'ensotek,team,engineering,kidemli proje muhendisi,isi transferi,frp kule',
  NOW(3),
  NOW(3)
),
-- EN
(
  UUID(),
  @TEAM_ENG_1,
  'en',
  'Senior Project Engineer',
  'senior-project-engineer',
  JSON_OBJECT(
    'html',
    '<p>The senior project engineer is specialised in heat transfer calculations, tower selection and layout design for FRP cooling towers, closed circuit solutions and hybrid systems.</p>'
  ),
  'Short profile introducing Ensotek''s senior project engineer and key engineering responsibilities.',
  NULL,
  'Ensotek Senior Project Engineer | Our Team',
  'Senior project engineer responsible for engineering and design of FRP cooling towers, closed circuit and hybrid cooling systems.',
  'ensotek,team,engineering,senior project engineer,heat transfer,frp towers',
  NOW(3),
  NOW(3)
),
-- DE
(
  UUID(),
  @TEAM_ENG_1,
  'de',
  'Senior-Projektingenieur',
  'senior-projektingenieur',
  JSON_OBJECT(
    'html',
    '<p>Der Senior-Projektingenieur ist spezialisiert auf Waermeuebertragungsberechnungen, Turmauswahl und Layout-Design fuer FRP-Kuehltuerme, geschlossene Kreislaufloesungen und Hybridsysteme.</p>'
  ),
  'Kurzprofil des Senior-Projektingenieurs von Ensotek mit den wichtigsten technischen Aufgaben und Verantwortlichkeiten.',
  NULL,
  'Ensotek Senior-Projektingenieur | Unser Team',
  'Senior-Projektingenieur fuer Engineering und Projektplanung von FRP-Kuehltuermen sowie geschlossenen Kreislauf- und Hybrid-Kuehlsystemen.',
  'ensotek,team,engineering,senior-projektingenieur,waermeuebertragung,frp kuehltuerme',
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

-- =============================================================
-- I18N – TEAM_SERVICE_1 (Saha & Servis Ekibi / Field Service Lead)
-- =============================================================
INSERT INTO `custom_pages_i18n`
  (`id`, `page_id`, `locale`,
   `title`, `slug`, `content`,
   `summary`,
   `featured_image_alt`, `meta_title`, `meta_description`,
   `tags`,
   `created_at`, `updated_at`)
VALUES
-- TR
(
  UUID(),
  @TEAM_SERVICE_1,
  'tr',
  'Saha ve Servis Sorumlusu',
  'saha-ve-servis-sorumlusu',
  JSON_OBJECT(
    'html',
    '<p>Saha ve servis sorumlusu; yerinde keşif, devreye alma, periyodik bakım, arıza tespiti ve modernizasyon uygulamalarının koordinasyonundan sorumludur.</p>'
  ),
  'Ensotek saha ve servis sorumlusunun devreye alma, bakım ve modernizasyon süreçlerindeki rolünü özetleyen tanıtım metni.',
  NULL,
  'Ensotek Saha ve Servis Sorumlusu | Ekibimiz',
  'Ensotek soğutma kulesi projelerinde devreye alma, bakım, arıza tespiti ve modernizasyon süreçlerinden sorumlu saha ve servis sorumlusu.',
  'ensotek,team,service,saha ve servis,devreye alma,bakim,modernizasyon',
  NOW(3),
  NOW(3)
),
-- EN
(
  UUID(),
  @TEAM_SERVICE_1,
  'en',
  'Field & Service Supervisor',
  'field-and-service-supervisor',
  JSON_OBJECT(
    'html',
    '<p>The field and service supervisor is responsible for site surveys, commissioning, periodic maintenance, troubleshooting and coordination of modernization works.</p>'
  ),
  'Short summary of the field and service supervisor''s role in commissioning, maintenance and modernization projects.',
  NULL,
  'Ensotek Field & Service Supervisor | Our Team',
  'Field and service supervisor responsible for commissioning, maintenance, troubleshooting and modernization on Ensotek cooling tower projects.',
  'ensotek,team,service,field service,commissioning,maintenance,modernization',
  NOW(3),
  NOW(3)
),
-- DE
(
  UUID(),
  @TEAM_SERVICE_1,
  'de',
  'Leiter Aussendienst & Service',
  'leiter-aussendienst-service',
  JSON_OBJECT(
    'html',
    '<p>Der Leiter fuer Aussendienst und Service ist verantwortlich fuer Vor-Ort-Begehungen, Inbetriebnahmen, regelmaessige Wartungen, Stoerungsdiagnosen sowie die Koordination von Modernisierungsarbeiten.</p>'
  ),
  'Kurzprofil zur Rolle des Leiters fuer Aussendienst und Service bei Inbetriebnahme, Wartung und Modernisierung.',
  NULL,
  'Ensotek Leiter Aussendienst & Service | Unser Team',
  'Leiter fuer Aussendienst und Service in Ensotek-Kuehlturmprojekten, verantwortlich fuer Inbetriebnahme, Wartung, Stoerungsdiagnose und Modernisierung.',
  'ensotek,team,service,aussendienst service,inbetriebnahme,wartung,modernisierung',
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

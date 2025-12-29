-- =============================================================
-- 049-1.2_site_settings_ui_quality.sql  [FINAL]
-- ui_quality (Quality page UI strings)
--  - Key: ui_quality
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Upsert: ON DUPLICATE KEY UPDATE
--  - NO ALTER / NO PATCH
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- =============================================================
-- ui_quality (TR/EN/DE)
-- =============================================================
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
VALUES
(
  UUID(),
  'ui_quality',
  'tr',
  CAST(
    JSON_OBJECT(
      -- Page/Banner (pages/quality.tsx)
      'ui_quality_page_title',         'Kalite',
      'ui_quality_page_description',   'Ensotek kalite belgeleri ve kalite standartları hakkında bilgiler.',
      'ui_quality_meta_title',         'Kalite Belgelerimiz & Kalite Standartlarımız | Ensotek',
      'ui_quality_meta_description',
        'Ensotek kalite belgeleri, kalite yönetim yaklaşımı ve standartlara uyum süreçleri hakkında bilgiler.',

      -- Titles / fallback
      'ui_quality_title',              'Kalite',

      -- Empty / error / states
      'ui_quality_empty',              'Kalite içeriği bulunamadı.',
      'ui_quality_error',              'İçerik yüklenemedi.',
      'ui_quality_no_certificates',    'Sertifika görseli bulunamadı.',

      -- Certificates block
      'ui_quality_certificates_kicker','Belgeler',
      'ui_quality_certificates_heading','Sertifikalarımız',
      'ui_quality_certificates_desc',  'Görselleri büyütmek için üzerine tıklayın.',
      'ui_quality_certificate_label',  'Sertifika',
      'ui_quality_certificate_open',   'Büyüt',

      -- Sidebar metrics
      'ui_quality_metrics_title',      'Kalite Metrikleri',
      'ui_quality_metric_satisfaction','Müşteri Memnuniyeti',
      'ui_quality_metric_satisfaction_desc','Geri bildirim ortalaması',
      'ui_quality_metric_ontime',      'Zamanında Teslimat',
      'ui_quality_metric_ontime_desc', 'Planlanan termin',
      'ui_quality_metric_control',     'Kalite Kontrol',
      'ui_quality_metric_control_desc','Her işte kontrol',
      'ui_quality_metric_experience',  'Deneyim',
      'ui_quality_metric_experience_desc','Sektör tecrübesi',

      -- Common
      'ui_year',                       '40+Yıl',

      -- Static content (QualityPageContent – intro/sections)
      'ui_quality_intro_title',        'Kalite Belgelerimiz & Kalite Standartlarımız',
      'ui_quality_intro_text',
        'Ensotek, ürün ve hizmet kalitesini uluslararası standartlar ile doğrular. Sertifikasyonlarımız; güvenilirlik, verimlilik ve sürdürülebilirlik odağımızın somut göstergesidir.',

      'ui_quality_standards_title',    'Standartlarımız',
      'ui_quality_standards_lead',
        'Uyguladığımız kalite yönetim yaklaşımı; süreçlerin ölçülebilir yönetimini, risklerin kontrolünü ve sürekli iyileştirmeyi esas alır.',

      'ui_quality_commitment_title',   'Kalite Taahhüdümüz',
      'ui_quality_commitment_text',
        'Ensotek; tasarım, üretim ve saha süreçlerinde standartlara uyum, izlenebilirlik ve sürekli iyileştirme yaklaşımıyla müşterilerine güvenilir çözümler sunmayı taahhüt eder.',

      -- Standards list items (labels)
      'ui_quality_std_iso9001',        'Kalite Yönetim Sistemi',
      'ui_quality_std_iso14001',       'Çevre Yönetim Sistemi',
      'ui_quality_std_iso45001',       'İş Sağlığı ve Güvenliği yaklaşımı',

      'ui_quality_std_compliance_title','Uygunluk & standartlara uyum',
      'ui_quality_std_compliance_desc','Ürün güvenliği ve dokümantasyon disiplinleri',

      'ui_quality_std_trace_title',    'İzlenebilirlik',
      'ui_quality_std_trace_desc',
        'Malzeme/komponent takibi, üretim kayıtları ve kalite kontrol raporları',

      'ui_quality_std_capa_title',     'Sürekli iyileştirme',
      'ui_quality_std_capa_desc',      'Denetimler, DÖF/CAPA ve geri bildirim yönetimi',

      -- Sidebar contact card (InfoContactCard props from ui_quality)
      'ui_quality_info_title',         'İletişim Bilgileri',
      'ui_quality_info_desc',
        'Kalite belgeleri, proses yaklaşımı ve dokümantasyon hakkında bilgi almak için bize ulaşın.',

      -- Generic labels used in QualityPageContent for InfoContactCard
      'ui_phone',                      'Telefon',
      'ui_contact_form',               'İletişim Formu'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_quality',
  'en',
  CAST(
    JSON_OBJECT(
      -- Page/Banner (pages/quality.tsx)
      'ui_quality_page_title',         'Quality',
      'ui_quality_page_description',   'Information about Ensotek quality certificates and quality standards.',
      'ui_quality_meta_title',         'Quality Certificates & Standards | Ensotek',
      'ui_quality_meta_description',
        'Information about Ensotek quality certificates, quality management approach, and compliance with standards.',

      -- Titles / fallback
      'ui_quality_title',              'Quality',

      -- Empty / error / states
      'ui_quality_empty',              'Quality content not found.',
      'ui_quality_error',              'Failed to load content.',
      'ui_quality_no_certificates',    'No certificate images found.',

      -- Certificates block
      'ui_quality_certificates_kicker','Documents',
      'ui_quality_certificates_heading','Our Certificates',
      'ui_quality_certificates_desc',  'Click an image to enlarge.',
      'ui_quality_certificate_label',  'Certificate',
      'ui_quality_certificate_open',   'Open',

      -- Sidebar metrics
      'ui_quality_metrics_title',      'Quality Metrics',
      'ui_quality_metric_satisfaction','Customer Satisfaction',
      'ui_quality_metric_satisfaction_desc','Average feedback score',
      'ui_quality_metric_ontime',      'On-time Delivery',
      'ui_quality_metric_ontime_desc', 'Planned deadline',
      'ui_quality_metric_control',     'Quality Control',
      'ui_quality_metric_control_desc','Checked on every job',
      'ui_quality_metric_experience',  'Experience',
      'ui_quality_metric_experience_desc','Industry expertise',

      -- Common
      'ui_year',                       '40+Years',

      -- Static content
      'ui_quality_intro_title',        'Our Quality Certificates & Standards',
      'ui_quality_intro_text',
        'Ensotek validates product and service quality with international standards. Our certifications are tangible proof of our focus on reliability, efficiency, and sustainability.',

      'ui_quality_standards_title',    'Our Standards',
      'ui_quality_standards_lead',
        'Our quality management approach is based on measurable process control, risk management, and continuous improvement.',

      'ui_quality_commitment_title',   'Our Quality Commitment',
      'ui_quality_commitment_text',
        'Ensotek commits to reliable solutions through standards compliance, traceability, and continuous improvement across design, production, and on-site processes.',

      -- Standards list items
      'ui_quality_std_iso9001',        'Quality Management System',
      'ui_quality_std_iso14001',       'Environmental Management System',
      'ui_quality_std_iso45001',       'Occupational Health & Safety approach',

      'ui_quality_std_compliance_title','Compliance & adherence to standards',
      'ui_quality_std_compliance_desc','Product safety and disciplined documentation',

      'ui_quality_std_trace_title',    'Traceability',
      'ui_quality_std_trace_desc',
        'Material/component tracking, production records, and quality inspection reports',

      'ui_quality_std_capa_title',     'Continuous improvement',
      'ui_quality_std_capa_desc',      'Audits, CAPA management, and feedback handling',

      -- Sidebar contact card
      'ui_quality_info_title',         'Contact Information',
      'ui_quality_info_desc',
        'Contact us for details about quality documents, process approach, and documentation.',

      -- Generic labels
      'ui_phone',                      'Phone',
      'ui_contact_form',               'Contact Form'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_quality',
  'de',
  CAST(
    JSON_OBJECT(
      -- Page/Banner (pages/quality.tsx)
      'ui_quality_page_title',         'Qualität',
      'ui_quality_page_description',   'Informationen zu Ensotek Qualitätszertifikaten und Qualitätsstandards.',
      'ui_quality_meta_title',         'Zertifikate & Qualitätsstandards | Ensotek',
      'ui_quality_meta_description',
        'Informationen zu Ensotek Qualitätszertifikaten, Qualitätsmanagement und zur Einhaltung von Standards.',

      -- Titles / fallback
      'ui_quality_title',              'Qualität',

      -- Empty / error / states
      'ui_quality_empty',              'Qualitätsinhalt nicht gefunden.',
      'ui_quality_error',              'Inhalt konnte nicht geladen werden.',
      'ui_quality_no_certificates',    'Keine Zertifikatsbilder gefunden.',

      -- Certificates block
      'ui_quality_certificates_kicker','Dokumente',
      'ui_quality_certificates_heading','Unsere Zertifikate',
      'ui_quality_certificates_desc',  'Klicken Sie auf ein Bild, um es zu vergrößern.',
      'ui_quality_certificate_label',  'Zertifikat',
      'ui_quality_certificate_open',   'Öffnen',

      -- Sidebar metrics
      'ui_quality_metrics_title',      'Qualitätsmetriken',
      'ui_quality_metric_satisfaction','Kundenzufriedenheit',
      'ui_quality_metric_satisfaction_desc','Durchschnittliches Feedback',
      'ui_quality_metric_ontime',      'Termintreue',
      'ui_quality_metric_ontime_desc', 'Geplanter Termin',
      'ui_quality_metric_control',     'Qualitätskontrolle',
      'ui_quality_metric_control_desc','Kontrolle bei jedem Auftrag',
      'ui_quality_metric_experience',  'Erfahrung',
      'ui_quality_metric_experience_desc','Branchenerfahrung',

      -- Common
      'ui_year',                       '40+Jahre',

      -- Static content
      'ui_quality_intro_title',        'Unsere Qualitätszertifikate & Standards',
      'ui_quality_intro_text',
        'Ensotek bestätigt Produkt- und Servicequalität durch internationale Standards. Unsere Zertifizierungen sind ein konkreter Nachweis für Zuverlässigkeit, Effizienz und Nachhaltigkeit.',

      'ui_quality_standards_title',    'Unsere Standards',
      'ui_quality_standards_lead',
        'Unser Qualitätsmanagement basiert auf messbarer Prozesssteuerung, Risikokontrolle und kontinuierlicher Verbesserung.',

      'ui_quality_commitment_title',   'Unser Qualitätsversprechen',
      'ui_quality_commitment_text',
        'Ensotek verpflichtet sich zu zuverlässigen Lösungen durch Normkonformität, Rückverfolgbarkeit und kontinuierliche Verbesserung in Design-, Produktions- und Vor-Ort-Prozessen.',

      -- Standards list items
      'ui_quality_std_iso9001',        'Qualitätsmanagementsystem',
      'ui_quality_std_iso14001',       'Umweltmanagementsystem',
      'ui_quality_std_iso45001',       'Arbeitsschutz-Ansatz',

      'ui_quality_std_compliance_title','Konformität & Normeinhaltung',
      'ui_quality_std_compliance_desc','Produktsicherheit und konsequente Dokumentation',

      'ui_quality_std_trace_title',    'Rückverfolgbarkeit',
      'ui_quality_std_trace_desc',
        'Material-/Komponentenverfolgung, Produktionsaufzeichnungen und Prüfberichte',

      'ui_quality_std_capa_title',     'Kontinuierliche Verbesserung',
      'ui_quality_std_capa_desc',      'Audits, CAPA-Maßnahmen und Feedback-Management',

      -- Sidebar contact card
      'ui_quality_info_title',         'Kontaktinformationen',
      'ui_quality_info_desc',
        'Kontaktieren Sie uns für Informationen zu Qualitätsdokumenten, Prozessansatz und Dokumentation.',

      -- Generic labels
      'ui_phone',                      'Telefon',
      'ui_contact_form',               'Kontaktformular'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

COMMIT;

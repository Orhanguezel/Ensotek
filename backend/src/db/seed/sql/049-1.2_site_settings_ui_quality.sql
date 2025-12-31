-- =============================================================
-- 049-1.2_site_settings_ui_quality.sql  [FINAL / FULL]
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

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
VALUES

-- =============================================================
-- TR
-- =============================================================
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

      -- Sidebar metrics (legacy keys - kept)
      'ui_quality_metrics_title',      'Kalite Metrikleri',
      'ui_quality_metric_satisfaction','Müşteri Memnuniyeti',
      'ui_quality_metric_satisfaction_desc','Geri bildirim ortalaması',
      'ui_quality_metric_ontime',      'Zamanında Teslimat',
      'ui_quality_metric_ontime_desc', 'Planlanan termin',
      'ui_quality_metric_control',     'Kalite Kontrol',
      'ui_quality_metric_control_desc','Her işte kontrol',
      'ui_quality_metric_experience',  'Deneyim',
      'ui_quality_metric_experience_desc','Sektör tecrübesi',
      'ui_quality_metric_satisfaction_value', '98%',
      'ui_quality_metric_ontime_value',       '95%',
      'ui_quality_metric_control_value',      '100%',
      'ui_quality_metric_experience_value',   '40+Yıl',

      -- NEW metrics list (flat)
      'ui_quality_metric_count', '4',
      'ui_quality_metric_1_title', 'Müşteri Memnuniyeti',
      'ui_quality_metric_1_desc',  'Geri bildirim ortalaması',
      'ui_quality_metric_1_value', '98%',
      'ui_quality_metric_2_title', 'Zamanında Teslimat',
      'ui_quality_metric_2_desc',  'Planlanan termin',
      'ui_quality_metric_2_value', '95%',
      'ui_quality_metric_3_title', 'Kalite Kontrol',
      'ui_quality_metric_3_desc',  'Her işte kontrol',
      'ui_quality_metric_3_value', '100%',
      'ui_quality_metric_4_title', 'Deneyim',
      'ui_quality_metric_4_desc',  'Sektör tecrübesi',
      'ui_quality_metric_4_value', '40+Yıl',

      -- Common
      'ui_year', '40+Yıl',

      -- Static content
      'ui_quality_intro_title',        'Kalite Belgelerimiz & Kalite Standartlarımız',
      'ui_quality_intro_text',
        'Ensotek, ürün ve hizmet kalitesini uluslararası standartlar ile doğrular. Sertifikasyonlarımız; güvenilirlik, verimlilik ve sürdürülebilirlik odağımızın somut göstergesidir.',

      'ui_quality_standards_title',    'Standartlarımız',
      'ui_quality_standards_lead',
        'Uyguladığımız kalite yönetim yaklaşımı; süreçlerin ölçülebilir yönetimini, risklerin kontrolünü ve sürekli iyileştirmeyi esas alır.',

      'ui_quality_commitment_title',   'Kalite Taahhüdümüz',
      'ui_quality_commitment_text',
        'Ensotek; tasarım, üretim ve saha süreçlerinde standartlara uyum, izlenebilirlik ve sürekli iyileştirme yaklaşımıyla müşterilerine güvenilir çözümler sunmayı taahhüt eder.',

      -- Backward compat standards
      'ui_quality_std_iso9001',        'Kalite Yönetim Sistemi',
      'ui_quality_std_iso14001',       'Çevre Yönetim Sistemi',
      'ui_quality_std_iso45001',       'İş Sağlığı ve Güvenliği yaklaşımı',
      'ui_quality_std_compliance_title','Uygunluk & standartlara uyum',
      'ui_quality_std_compliance_desc','Ürün güvenliği ve dokümantasyon disiplinleri',
      'ui_quality_std_trace_title',    'İzlenebilirlik',
      'ui_quality_std_trace_desc','Malzeme/komponent takibi, üretim kayıtları ve kalite kontrol raporları',
      'ui_quality_std_capa_title',     'Sürekli iyileştirme',
      'ui_quality_std_capa_desc',      'Denetimler, DÖF/CAPA ve geri bildirim yönetimi',

      -- NEW standards list (flat)
      'ui_quality_std_item_count', '6',
      'ui_quality_std_item_1_strong', 'ISO 9001',
      'ui_quality_std_item_1_title',  '',
      'ui_quality_std_item_1_text',   'Kalite Yönetim Sistemi',

      'ui_quality_std_item_2_strong', 'ISO 14001',
      'ui_quality_std_item_2_title',  '',
      'ui_quality_std_item_2_text',   'Çevre Yönetim Sistemi',

      'ui_quality_std_item_3_strong', 'ISO 45001 / OHSAS',
      'ui_quality_std_item_3_title',  '',
      'ui_quality_std_item_3_text',   'İş Sağlığı ve Güvenliği yaklaşımı',

      'ui_quality_std_item_4_strong', 'Uygunluk & standartlara uyum',
      'ui_quality_std_item_4_title',  '',
      'ui_quality_std_item_4_text',   'Ürün güvenliği ve dokümantasyon disiplinleri',

      'ui_quality_std_item_5_strong', 'İzlenebilirlik',
      'ui_quality_std_item_5_title',  '',
      'ui_quality_std_item_5_text',   'Malzeme/komponent takibi, üretim kayıtları ve kalite kontrol raporları',

      'ui_quality_std_item_6_strong', 'Sürekli iyileştirme',
      'ui_quality_std_item_6_title',  '',
      'ui_quality_std_item_6_text',   'Denetimler, DÖF/CAPA ve geri bildirim yönetimi',

      -- Sidebar contact card
      'ui_quality_info_title', 'İletişim Bilgileri',
      'ui_quality_info_desc',
        'Kalite belgeleri, proses yaklaşımı ve dokümantasyon hakkında bilgi almak için bize ulaşın.',

      -- Generic labels
      'ui_phone', 'Telefon',
      'ui_contact_form', 'İletişim Formu'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),

-- =============================================================
-- EN
-- =============================================================
(
  UUID(),
  'ui_quality',
  'en',
  CAST(
    JSON_OBJECT(
      'ui_quality_page_title',         'Quality',
      'ui_quality_page_description',   'Information about Ensotek quality certificates and quality standards.',
      'ui_quality_meta_title',         'Quality Certificates & Standards | Ensotek',
      'ui_quality_meta_description',
        'Information about Ensotek quality certificates, quality management approach, and compliance with standards.',

      'ui_quality_title',              'Quality',

      'ui_quality_empty',              'Quality content not found.',
      'ui_quality_error',              'Failed to load content.',
      'ui_quality_no_certificates',    'No certificate images found.',

      'ui_quality_certificates_kicker','Documents',
      'ui_quality_certificates_heading','Our Certificates',
      'ui_quality_certificates_desc',  'Click an image to enlarge.',
      'ui_quality_certificate_label',  'Certificate',
      'ui_quality_certificate_open',   'Open',

      'ui_quality_metrics_title',      'Quality Metrics',
      'ui_quality_metric_satisfaction','Customer Satisfaction',
      'ui_quality_metric_satisfaction_desc','Average feedback score',
      'ui_quality_metric_ontime',      'On-time Delivery',
      'ui_quality_metric_ontime_desc', 'Planned deadline',
      'ui_quality_metric_control',     'Quality Control',
      'ui_quality_metric_control_desc','Checked on every job',
      'ui_quality_metric_experience',  'Experience',
      'ui_quality_metric_experience_desc','Industry expertise',
      'ui_quality_metric_satisfaction_value', '98%',
      'ui_quality_metric_ontime_value',       '95%',
      'ui_quality_metric_control_value',      '100%',
      'ui_quality_metric_experience_value',   '40+Years',

      'ui_quality_metric_count', '4',
      'ui_quality_metric_1_title', 'Customer Satisfaction',
      'ui_quality_metric_1_desc',  'Average feedback score',
      'ui_quality_metric_1_value', '98%',
      'ui_quality_metric_2_title', 'On-time Delivery',
      'ui_quality_metric_2_desc',  'Planned deadline',
      'ui_quality_metric_2_value', '95%',
      'ui_quality_metric_3_title', 'Quality Control',
      'ui_quality_metric_3_desc',  'Checked on every job',
      'ui_quality_metric_3_value', '100%',
      'ui_quality_metric_4_title', 'Experience',
      'ui_quality_metric_4_desc',  'Industry expertise',
      'ui_quality_metric_4_value', '40+Years',

      'ui_year', '40+Years',

      'ui_quality_intro_title', 'Our Quality Certificates & Standards',
      'ui_quality_intro_text',
        'Ensotek validates product and service quality with international standards. Our certifications are tangible proof of our focus on reliability, efficiency, and sustainability.',

      'ui_quality_standards_title', 'Our Standards',
      'ui_quality_standards_lead',
        'Our quality management approach is based on measurable process control, risk management, and continuous improvement.',

      'ui_quality_commitment_title', 'Our Quality Commitment',
      'ui_quality_commitment_text',
        'Ensotek commits to reliable solutions through standards compliance, traceability, and continuous improvement across design, production, and on-site processes.',

      'ui_quality_std_iso9001', 'Quality Management System',
      'ui_quality_std_iso14001','Environmental Management System',
      'ui_quality_std_iso45001','Occupational Health & Safety approach',
      'ui_quality_std_compliance_title','Compliance & adherence to standards',
      'ui_quality_std_compliance_desc','Product safety and disciplined documentation',
      'ui_quality_std_trace_title','Traceability',
      'ui_quality_std_trace_desc','Material/component tracking, production records, and quality inspection reports',
      'ui_quality_std_capa_title','Continuous improvement',
      'ui_quality_std_capa_desc','Audits, CAPA management, and feedback handling',

      'ui_quality_std_item_count', '6',
      'ui_quality_std_item_1_strong', 'ISO 9001',
      'ui_quality_std_item_1_title',  '',
      'ui_quality_std_item_1_text',   'Quality Management System',

      'ui_quality_std_item_2_strong', 'ISO 14001',
      'ui_quality_std_item_2_title',  '',
      'ui_quality_std_item_2_text',   'Environmental Management System',

      'ui_quality_std_item_3_strong', 'ISO 45001 / OHSAS',
      'ui_quality_std_item_3_title',  '',
      'ui_quality_std_item_3_text',   'Occupational Health & Safety approach',

      'ui_quality_std_item_4_strong', 'Compliance & adherence to standards',
      'ui_quality_std_item_4_title',  '',
      'ui_quality_std_item_4_text',   'Product safety and disciplined documentation',

      'ui_quality_std_item_5_strong', 'Traceability',
      'ui_quality_std_item_5_title',  '',
      'ui_quality_std_item_5_text',   'Material/component tracking, production records, and quality inspection reports',

      'ui_quality_std_item_6_strong', 'Continuous improvement',
      'ui_quality_std_item_6_title',  '',
      'ui_quality_std_item_6_text',   'Audits, CAPA management, and feedback handling',

      'ui_quality_info_title', 'Contact Information',
      'ui_quality_info_desc',
        'Contact us for details about quality documents, process approach, and documentation.',

      'ui_phone', 'Phone',
      'ui_contact_form', 'Contact Form'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),

-- =============================================================
-- DE
-- =============================================================
(
  UUID(),
  'ui_quality',
  'de',
  CAST(
    JSON_OBJECT(
      'ui_quality_page_title',         'Qualität',
      'ui_quality_page_description',   'Informationen zu Ensotek Qualitätszertifikaten und Qualitätsstandards.',
      'ui_quality_meta_title',         'Zertifikate & Qualitätsstandards | Ensotek',
      'ui_quality_meta_description',
        'Informationen zu Ensotek Qualitätszertifikaten, Qualitätsmanagement und zur Einhaltung von Standards.',

      'ui_quality_title',              'Qualität',

      'ui_quality_empty',              'Qualitätsinhalt nicht gefunden.',
      'ui_quality_error',              'Inhalt konnte nicht geladen werden.',
      'ui_quality_no_certificates',    'Keine Zertifikatsbilder gefunden.',

      'ui_quality_certificates_kicker','Dokumente',
      'ui_quality_certificates_heading','Unsere Zertifikate',
      'ui_quality_certificates_desc',  'Klicken Sie auf ein Bild, um es zu vergrößern.',
      'ui_quality_certificate_label',  'Zertifikat',
      'ui_quality_certificate_open',   'Öffnen',

      'ui_quality_metrics_title',      'Qualitätsmetriken',
      'ui_quality_metric_satisfaction','Kundenzufriedenheit',
      'ui_quality_metric_satisfaction_desc','Durchschnittliches Feedback',
      'ui_quality_metric_ontime',      'Termintreue',
      'ui_quality_metric_ontime_desc', 'Geplanter Termin',
      'ui_quality_metric_control',     'Qualitätskontrolle',
      'ui_quality_metric_control_desc','Kontrolle bei jedem Auftrag',
      'ui_quality_metric_experience',  'Erfahrung',
      'ui_quality_metric_experience_desc','Branchenerfahrung',
      'ui_quality_metric_satisfaction_value', '98%',
      'ui_quality_metric_ontime_value',       '95%',
      'ui_quality_metric_control_value',      '100%',
      'ui_quality_metric_experience_value',   '40+Jahre',

      'ui_quality_metric_count', '4',
      'ui_quality_metric_1_title', 'Kundenzufriedenheit',
      'ui_quality_metric_1_desc',  'Durchschnittliches Feedback',
      'ui_quality_metric_1_value', '98%',
      'ui_quality_metric_2_title', 'Termintreue',
      'ui_quality_metric_2_desc',  'Geplanter Termin',
      'ui_quality_metric_2_value', '95%',
      'ui_quality_metric_3_title', 'Qualitätskontrolle',
      'ui_quality_metric_3_desc',  'Kontrolle bei jedem Auftrag',
      'ui_quality_metric_3_value', '100%',
      'ui_quality_metric_4_title', 'Erfahrung',
      'ui_quality_metric_4_desc',  'Branchenerfahrung',
      'ui_quality_metric_4_value', '40+Jahre',

      'ui_year', '40+Jahre',

      'ui_quality_intro_title', 'Unsere Qualitätszertifikate & Standards',
      'ui_quality_intro_text',
        'Ensotek bestätigt Produkt- und Servicequalität durch internationale Standards. Unsere Zertifizierungen sind ein konkreter Nachweis für Zuverlässigkeit, Effizienz und Nachhaltigkeit.',

      'ui_quality_standards_title', 'Unsere Standards',
      'ui_quality_standards_lead',
        'Unser Qualitätsmanagement basiert auf messbarer Prozesssteuerung, Risikokontrolle und kontinuierlicher Verbesserung.',

      'ui_quality_commitment_title', 'Unser Qualitätsversprechen',
      'ui_quality_commitment_text',
        'Ensotek verpflichtet sich zu zuverlässigen Lösungen durch Normkonformität, Rückverfolgbarkeit und kontinuierliche Verbesserung in Design-, Produktions- und Vor-Ort-Prozessen.',

      'ui_quality_std_iso9001','Qualitätsmanagementsystem',
      'ui_quality_std_iso14001','Umweltmanagementsystem',
      'ui_quality_std_iso45001','Arbeitsschutz-Ansatz',
      'ui_quality_std_compliance_title','Konformität & Normeinhaltung',
      'ui_quality_std_compliance_desc','Produktsicherheit und konsequente Dokumentation',
      'ui_quality_std_trace_title','Rückverfolgbarkeit',
      'ui_quality_std_trace_desc','Material-/Komponentenverfolgung, Produktionsaufzeichnungen und Prüfberichte',
      'ui_quality_std_capa_title','Kontinuierliche Verbesserung',
      'ui_quality_std_capa_desc','Audits, CAPA-Maßnahmen und Feedback-Management',

      'ui_quality_std_item_count', '6',
      'ui_quality_std_item_1_strong', 'ISO 9001',
      'ui_quality_std_item_1_title',  '',
      'ui_quality_std_item_1_text',   'Qualitätsmanagementsystem',

      'ui_quality_std_item_2_strong', 'ISO 14001',
      'ui_quality_std_item_2_title',  '',
      'ui_quality_std_item_2_text',   'Umweltmanagementsystem',

      'ui_quality_std_item_3_strong', 'ISO 45001 / OHSAS',
      'ui_quality_std_item_3_title',  '',
      'ui_quality_std_item_3_text',   'Arbeitsschutz-Ansatz',

      'ui_quality_std_item_4_strong', 'Konformität & Normeinhaltung',
      'ui_quality_std_item_4_title',  '',
      'ui_quality_std_item_4_text',   'Produktsicherheit und konsequente Dokumentation',

      'ui_quality_std_item_5_strong', 'Rückverfolgbarkeit',
      'ui_quality_std_item_5_title',  '',
      'ui_quality_std_item_5_text',   'Material-/Komponentenverfolgung, Produktionsaufzeichnungen und Prüfberichte',

      'ui_quality_std_item_6_strong', 'Kontinuierliche Verbesserung',
      'ui_quality_std_item_6_title',  '',
      'ui_quality_std_item_6_text',   'Audits, CAPA-Maßnahmen und Feedback-Management',

      'ui_quality_info_title', 'Kontaktinformationen',
      'ui_quality_info_desc',
        'Kontaktieren Sie uns für Informationen zu Qualitätsdokumenten, Prozessansatz und Dokumentation.',

      'ui_phone', 'Telefon',
      'ui_contact_form', 'Kontaktformular'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)

ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = CURRENT_TIMESTAMP(3);

COMMIT;

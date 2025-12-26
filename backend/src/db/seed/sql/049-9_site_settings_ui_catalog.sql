-- =============================================================
-- 049-9_site_settings_ui_catalog.sql
-- Ensotek – UI Catalog (site_settings.ui_catalog)
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Extendable: clone from tr as bootstrap (collation-safe)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_catalog',
  'tr',
  CAST(JSON_OBJECT(
    'ui_catalog_cta_title',          'Katalog Talep Formu',
    'ui_catalog_cta_text',
      'Ürün kataloğunu talep edin. Talebiniz yöneticilere iletilecektir. (Müşteriye mail, admin panelden gönderilir.)',
    'ui_catalog_cta_button',         'Katalog Talep Et',

    'ui_catalog_modal_title',        'Katalog Talebi',
    'ui_catalog_submit_button',      'Talebi Gönder',

    'ui_common_close',               'Kapat',

    'ui_catalog_field_name',         'Ad Soyad *',
    'ui_catalog_field_company',      'Firma (opsiyonel)',
    'ui_catalog_field_email',        'E-posta *',
    'ui_catalog_field_phone',        'Telefon (opsiyonel)',
    'ui_catalog_field_country',      'Ülke Kodu (TR/DE vb.)',
    'ui_catalog_field_message',      'Mesaj (opsiyonel)',

    'ui_catalog_consent_terms',      'KVKK / Şartlar’ı kabul ediyorum. *',
    'ui_catalog_consent_marketing',  'Kampanya e-postaları almak istiyorum.'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_catalog',
  'en',
  CAST(JSON_OBJECT(
    'ui_catalog_cta_title',          'Catalog Request',
    'ui_catalog_cta_text',
      'Request the product catalog. Your request will be forwarded to admins. (Customer email is sent from the admin panel.)',
    'ui_catalog_cta_button',         'Request Catalog',

    'ui_catalog_modal_title',        'Catalog Request',
    'ui_catalog_submit_button',      'Submit Request',

    'ui_common_close',               'Close',

    'ui_catalog_field_name',         'Full Name *',
    'ui_catalog_field_company',      'Company (optional)',
    'ui_catalog_field_email',        'Email *',
    'ui_catalog_field_phone',        'Phone (optional)',
    'ui_catalog_field_country',      'Country Code (TR/DE etc.)',
    'ui_catalog_field_message',      'Message (optional)',

    'ui_catalog_consent_terms',      'I accept the terms/privacy policy. *',
    'ui_catalog_consent_marketing',  'I want to receive marketing emails.'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_catalog',
  'de',
  CAST(JSON_OBJECT(
    'ui_catalog_cta_title',          'Katalog anfordern',
    'ui_catalog_cta_text',
      'Fordern Sie den Produktkatalog an. Ihre Anfrage wird an die Administratoren weitergeleitet. (Die E-Mail an den Kunden wird im Admin-Panel versendet.)',
    'ui_catalog_cta_button',         'Katalog anfordern',

    'ui_catalog_modal_title',        'Kataloganfrage',
    'ui_catalog_submit_button',      'Anfrage senden',

    'ui_common_close',               'Schließen',

    'ui_catalog_field_name',         'Vor- und Nachname *',
    'ui_catalog_field_company',      'Firma (optional)',
    'ui_catalog_field_email',        'E-Mail *',
    'ui_catalog_field_phone',        'Telefon (optional)',
    'ui_catalog_field_country',      'Ländercode (TR/DE usw.)',
    'ui_catalog_field_message',      'Nachricht (optional)',

    'ui_catalog_consent_terms',      'Ich akzeptiere Datenschutz/AGB. *',
    'ui_catalog_consent_marketing',  'Ich möchte Marketing-E-Mails erhalten.'
  ) AS CHAR),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);
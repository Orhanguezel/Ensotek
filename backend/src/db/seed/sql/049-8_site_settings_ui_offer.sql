-- =============================================================
-- 049-8_site_settings_ui_offer.sql
-- Ensotek – UI Offer (site_settings.ui_offer)
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Extendable: clone from tr as bootstrap (collation-safe)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_offer',
  'tr',
  CAST(JSON_OBJECT(
    'ui_offer_page_title',           'Teklif Talep Formu',

    'ui_offer_heading_general',      'Teklif Talep Formu',
    'ui_offer_subtitle',
      'İhtiyacınıza özel soğutma çözümleri ve teknik danışmanlık.',
    'ui_offer_description',
      'Formu doldurun, satış ekibimiz en kısa sürede sizinle iletişime geçsin.',
    'ui_offer_section_label',        'Teknik Teklifler',

    'ui_offer_form_heading',         'Teklif Talep Formu',
    'ui_offer_form_intro',
      'Firmanız ve talebiniz ile ilgili bilgileri paylaşın; en kısa sürede size özel teklif ile dönüş yapalım.',
    'ui_offer_form_radio_general',   'Genel teklif',
    'ui_offer_form_radio_product',   'Ürün / Yedek Parça',
    'ui_offer_form_radio_service',   'Hizmet (Mühendislik / Revizyon)',

    'ui_offer_form_general_text',
      'Genel teklif talebinizi kısaca açıklayınız.',
    'ui_offer_form_product_text',
      'İhtiyaç duyduğunuz kule ile ilgili teknik bilgileri doldurunuz.',
    'ui_offer_form_service_text',
      'Talep ettiğiniz hizmet ile ilgili bilgileri doldurunuz.',

    'ui_offer_form_error',
      'Teklif talebi gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
    'ui_offer_form_success',
      'Teklif talebiniz alındı. Referans numarası: ',
    'ui_offer_form_submit',          'Teklif Talep Et',
    'ui_offer_form_submitting',      'Gönderiliyor...',

    'ui_offer_form_kvkk_label',
      'KVKK / gizlilik politikası ve kullanım şartlarını okudum, kabul ediyorum. (zorunlu)',
    'ui_offer_form_marketing_label',
      'Kampanya ve bilgilendirme e-postaları almak istiyorum. (opsiyonel)',
    'ui_offer_form_kvkk_alert',
      'Lütfen KVKK / şartlar onayını işaretleyin.',

    'ui_offer_heading_product',      'Bu ürün için teklif isteyin',
    'ui_offer_heading_service',      'Bu hizmet için teklif isteyin',
    'ui_offer_intro_product',
      'Bu ürün için özel teklif talebi oluşturabilirsiniz.',
    'ui_offer_intro_service',
      'Bu hizmet için özel teklif talebi oluşturabilirsiniz.',
    'ui_offer_intro_general',
      'İhtiyaçlarınıza özel teklif talep edebilirsiniz.',
    'ui_offer_button_product',       'Teklif sayfasına git',
    'ui_offer_button_service',       'Teklif sayfasına git',
    'ui_offer_button_general',       'Teklif iste',

    'ui_offer_cta_title',
      'Soğutma kuleleriniz için en uygun çözümü birlikte planlayalım.',
    'ui_offer_cta_text',
      'Sisteminizi kısaca anlatın, mühendislik ekibimiz performans ve verimlilik odaklı bir çözüm önersin.',
    'ui_offer_cta_button',           'Teklif iste'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_offer',
  'en',
  CAST(JSON_OBJECT(
    'ui_offer_page_title',           'Request an Offer',

    'ui_offer_heading_general',      'Request an Offer',
    'ui_offer_subtitle',
      'Tailored cooling solutions and technical consulting.',
    'ui_offer_description',
      'Fill in the form and our sales team will contact you as soon as possible.',
    'ui_offer_section_label',        'Technical Offers',

    'ui_offer_form_heading',         'Request an Offer',
    'ui_offer_form_intro',
      'Share details about your company and request; we will get back to you with a tailored quotation.',
    'ui_offer_form_radio_general',   'General quote',
    'ui_offer_form_radio_product',   'Product / Spare Part',
    'ui_offer_form_radio_service',   'Service (Engineering / Retrofit)',

    'ui_offer_form_general_text',
      'Please describe your general quotation request.',
    'ui_offer_form_product_text',
      'Please fill in the technical details of the cooling tower you need.',
    'ui_offer_form_service_text',
      'Please fill in the details for the requested service.',

    'ui_offer_form_error',
      'An error occurred while submitting your request. Please try again later.',
    'ui_offer_form_success',
      'Your request has been received. Reference no: ',
    'ui_offer_form_submit',          'Request an Offer',
    'ui_offer_form_submitting',      'Submitting...',

    'ui_offer_form_kvkk_label',
      'I have read and accept the privacy policy and terms of use (mandatory).',
    'ui_offer_form_marketing_label',
      'I would like to receive promotional and information e-mails (optional).',
    'ui_offer_form_kvkk_alert',
      'Please accept the privacy terms.',

    'ui_offer_heading_product',      'Request a quote for this product',
    'ui_offer_heading_service',      'Request a quote for this service',
    'ui_offer_intro_product',
      'Fill in the form to request a tailored quotation for this product.',
    'ui_offer_intro_service',
      'Fill in the form to request a tailored quotation for this service.',
    'ui_offer_intro_general',
      'Request a tailored quotation for your needs.',
    'ui_offer_button_product',       'Go to offer page',
    'ui_offer_button_service',       'Go to offer page',
    'ui_offer_button_general',       'Request an offer',

    'ui_offer_cta_title',
      'Let’s design the most suitable cooling solution for your plant.',
    'ui_offer_cta_text',
      'Tell us briefly about your system and our engineering team will propose a performance-focused solution.',
    'ui_offer_cta_button',           'Request a quote'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_offer',
  'de',
  CAST(JSON_OBJECT(
    'ui_offer_page_title',           'Angebot anfordern',

    'ui_offer_heading_general',      'Angebot anfordern',
    'ui_offer_subtitle',
      'Maßgeschneiderte Kühllösungen und technische Beratung.',
    'ui_offer_description',
      'Füllen Sie das Formular aus – unser Vertriebsteam meldet sich schnellstmöglich bei Ihnen.',
    'ui_offer_section_label',        'Technische Angebote',

    'ui_offer_form_heading',         'Angebot anfordern',
    'ui_offer_form_intro',
      'Teilen Sie Informationen zu Ihrem Unternehmen und Ihrer Anfrage – wir melden uns zeitnah mit einem individuellen Angebot.',
    'ui_offer_form_radio_general',   'Allgemeines Angebot',
    'ui_offer_form_radio_product',   'Produkt / Ersatzteil',
    'ui_offer_form_radio_service',   'Service (Engineering / Retrofit)',

    'ui_offer_form_general_text',
      'Bitte beschreiben Sie Ihre allgemeine Angebotsanfrage kurz.',
    'ui_offer_form_product_text',
      'Bitte tragen Sie die technischen Daten des benötigten Kühlturms ein.',
    'ui_offer_form_service_text',
      'Bitte tragen Sie die Details zur gewünschten Dienstleistung ein.',

    'ui_offer_form_error',
      'Beim Senden Ihrer Anfrage ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
    'ui_offer_form_success',
      'Ihre Anfrage wurde erhalten. Referenznummer: ',
    'ui_offer_form_submit',          'Angebot anfordern',
    'ui_offer_form_submitting',      'Wird gesendet...',

    'ui_offer_form_kvkk_label',
      'Ich habe die Datenschutzrichtlinie und Nutzungsbedingungen gelesen und akzeptiere sie (erforderlich).',
    'ui_offer_form_marketing_label',
      'Ich möchte Aktions- und Informations-E-Mails erhalten (optional).',
    'ui_offer_form_kvkk_alert',
      'Bitte akzeptieren Sie die Datenschutz-/Nutzungsbedingungen.',

    'ui_offer_heading_product',      'Angebot für dieses Produkt anfordern',
    'ui_offer_heading_service',      'Angebot für diese Dienstleistung anfordern',
    'ui_offer_intro_product',
      'Sie können ein individuelles Angebot für dieses Produkt anfordern.',
    'ui_offer_intro_service',
      'Sie können ein individuelles Angebot für diese Dienstleistung anfordern.',
    'ui_offer_intro_general',
      'Fordern Sie ein individuelles Angebot passend zu Ihren Anforderungen an.',
    'ui_offer_button_product',       'Zur Angebotsseite',
    'ui_offer_button_service',       'Zur Angebotsseite',
    'ui_offer_button_general',       'Angebot anfordern',

    'ui_offer_cta_title',
      'Lassen Sie uns gemeinsam die optimale Lösung für Ihre Kühltürme planen.',
    'ui_offer_cta_text',
      'Beschreiben Sie Ihr System kurz – unser Engineering-Team schlägt Ihnen eine leistungs- und effizienzorientierte Lösung vor.',
    'ui_offer_cta_button',           'Angebot anfordern'
  ) AS CHAR),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);
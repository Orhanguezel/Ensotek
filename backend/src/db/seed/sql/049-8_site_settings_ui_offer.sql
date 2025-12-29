-- =============================================================
-- 049-8_site_settings_ui_offer.sql
-- Ensotek – UI Offer (site_settings.ui_offer)
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - EN-only fallback in code (no locale branching)
--  - Includes ALL strings used by:
--      - pages/offer.tsx
--      - components/containers/offer/OfferPage.tsx
--      - components/containers/offer/OfferSection.tsx
--      - components/containers/offer/OfferPublicForm.tsx
--      - components/containers/offer/OfferWhatsAppButton.tsx
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_offer',
  'tr',
  CAST(JSON_OBJECT(
    -- Page / Banner
    'ui_offer_page_title',              'Teklif Talep Formu',

    -- Section header (OfferPage container)
    'ui_offer_subprefix',               'Ensotek',
    'ui_offer_section_label',           'Teknik Teklifler',
    'ui_offer_heading_general',         'Teklif Talep Formu',
    'ui_offer_subtitle',
      'İhtiyacınıza özel soğutma çözümleri ve teknik danışmanlık.',
    'ui_offer_description',
      'Formu doldurun, satış ekibimiz en kısa sürede sizinle iletişime geçsin.',

    -- SEO overrides (pages/offer.tsx)
    'ui_offer_meta_title',              'Teklif Talep Formu',
    'ui_offer_meta_description',
      'Teklif talep formunu doldurun; satış ekibimiz en kısa sürede sizinle iletişime geçsin.',

    -- OfferSection (context headings + intro + buttons)
    'ui_offer_heading_product',         'Bu ürün için teklif isteyin',
    'ui_offer_heading_service',         'Bu hizmet için teklif isteyin',
    'ui_offer_intro_product',
      'Bu ürün için özel teklif talebi oluşturabilirsiniz.',
    'ui_offer_intro_service',
      'Bu hizmet için özel teklif talebi oluşturabilirsiniz.',
    'ui_offer_intro_general',
      'İhtiyaçlarınıza özel teklif talep edebilirsiniz.',
    'ui_offer_button_product',          'Teklif sayfasına git',
    'ui_offer_button_service',          'Teklif sayfasına git',
    'ui_offer_button_general',          'Teklif iste',

    -- OfferPublicForm: headings & intro
    'ui_offer_form_heading',            'Teklif Talep Formu',
    'ui_offer_form_intro',
      'Firmanız ve talebiniz ile ilgili bilgileri paylaşın; en kısa sürede size özel teklif ile dönüş yapalım.',

    -- Country help
    'ui_offer_country_help',
      'Opsiyonel. Boş bırakabilir veya ISO-2 kodu (örn. TR, DE) girebilirsiniz. Daha uzun bir değer yazarsanız detaylarda yine kaydedilecektir.',

    -- Related type radios
    'ui_offer_form_radio_general',      'Genel teklif',
    'ui_offer_form_radio_product',      'Ürün / Yedek Parça',
    'ui_offer_form_radio_service',      'Hizmet (Mühendislik / Revizyon)',

    -- Related block intros
    'ui_offer_form_general_text',
      'Genel teklif talebinizi kısaca açıklayınız.',
    'ui_offer_form_product_text',
      'İhtiyaç duyduğunuz kule ile ilgili teknik bilgileri doldurunuz.',
    'ui_offer_form_service_text',
      'Talep ettiğiniz hizmet ile ilgili bilgileri doldurunuz.',

    -- Status & submit
    'ui_offer_form_error',
      'Teklif talebi gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
    'ui_offer_form_success',
      'Teklif talebiniz alındı. Referans numarası: ',
    'ui_offer_form_submit',             'Teklif Talep Et',
    'ui_offer_form_submitting',         'Gönderiliyor...',

    -- Consents
    'ui_offer_form_kvkk_label',
      'KVKK / gizlilik politikası ve kullanım şartlarını okudum, kabul ediyorum. (zorunlu)',
    'ui_offer_form_marketing_label',
      'Kampanya ve bilgilendirme e-postaları almak istiyorum. (opsiyonel)',
    'ui_offer_form_kvkk_alert',
      'Lütfen KVKK / şartlar onayını işaretleyin.',

    -- Placeholders (contact)
    'ui_offer_ph_company',              'Firma *',
    'ui_offer_ph_contact_person',       'İlgili Kişi *',
    'ui_offer_ph_position',             'Pozisyon *',
    'ui_offer_ph_email',                'E-posta *',
    'ui_offer_ph_phone',                'Telefon *',
    'ui_offer_ph_country_code',         'Ülke (opsiyonel)',
    'ui_offer_ph_locale',               'Dil',

    -- Placeholders (general / selects)
    'ui_offer_ph_general_notes',
      'İstenen ürün/hizmet, adet, detaylar...',
    'ui_offer_ph_product_select',       'Lütfen bir ürün / yedek parça seçin',
    'ui_offer_ph_service_select',       'Lütfen bir hizmet seçin',

    -- Placeholders (product technical)
    'ui_offer_ph_tower_process',        'Kulenin kullanılacağı proses',
    'ui_offer_ph_city',                 'Şehir',
    'ui_offer_ph_district',             'İlçe',
    'ui_offer_ph_water_flow',           'Su Debisi (m³/h)',
    'ui_offer_ph_inlet_temp',           'Giriş Sıcaklığı (°C)',
    'ui_offer_ph_outlet_temp',          'Çıkış Sıcaklığı (°C)',
    'ui_offer_ph_wet_bulb',             'Yaş Termometre Sıcaklığı (°C)',
    'ui_offer_ph_capacity',             'Kapasite (kcal/h, kW)',
    'ui_offer_ph_water_quality',        'Su Kalitesi',
    'ui_offer_ph_pool_type',            'Havuz (FRP / beton vb.)',
    'ui_offer_ph_tower_location',
      'Kule Konumu (çelik şase / beton kaide)',
    'ui_offer_ph_existing_tower',
      'Mevcut kule var mı? (varsa model/yıl)',
    'ui_offer_ph_referral',             'Bizi nereden duydunuz?',
    'ui_offer_ph_extra_notes',          'Ek Notlar / Yorumlar',

    -- Placeholders (service)
    'ui_offer_ph_service_expectations',
      'Beklentileriniz, planlanan tarih, diğer notlar...',

    -- Lists loading/errors
    'ui_offer_products_loading',        'Yükleniyor...',
    'ui_offer_products_error',          'Ürün listesi yüklenemedi.',
    'ui_offer_services_loading',        'Yükleniyor...',
    'ui_offer_services_error',          'Hizmet listesi yüklenemedi.',

    -- Default subject
    'ui_offer_default_subject',         'Teklif talebi',

    -- WhatsApp CTA
    'ui_offer_whatsapp_default_message',
      'Merhaba, hizmetleriniz hakkında bilgi ve fiyat teklifi almak istiyorum.',
    'ui_offer_whatsapp_button_label',   'WhatsApp ile yazın',

    -- Optional CTA (legacy/other sections)
    'ui_offer_cta_title',
      'Soğutma kuleleriniz için en uygun çözümü birlikte planlayalım.',
    'ui_offer_cta_text',
      'Sisteminizi kısaca anlatın, mühendislik ekibimiz performans ve verimlilik odaklı bir çözüm önersin.',
    'ui_offer_cta_button',              'Teklif iste'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_offer',
  'en',
  CAST(JSON_OBJECT(
    -- Page / Banner
    'ui_offer_page_title',              'Request an Offer',

    -- Section header (OfferPage container)
    'ui_offer_subprefix',               'Ensotek',
    'ui_offer_section_label',           'Technical Offers',
    'ui_offer_heading_general',         'Request an Offer',
    'ui_offer_subtitle',
      'Tailored cooling solutions and technical consulting.',
    'ui_offer_description',
      'Fill in the form and our sales team will contact you as soon as possible.',

    -- SEO overrides (pages/offer.tsx)
    'ui_offer_meta_title',              'Request an Offer',
    'ui_offer_meta_description',
      'Fill in the offer request form and our sales team will contact you as soon as possible.',

    -- OfferSection (context headings + intro + buttons)
    'ui_offer_heading_product',         'Request a quote for this product',
    'ui_offer_heading_service',         'Request a quote for this service',
    'ui_offer_intro_product',
      'Fill in the form to request a tailored quotation for this product.',
    'ui_offer_intro_service',
      'Fill in the form to request a tailored quotation for this service.',
    'ui_offer_intro_general',
      'Request a tailored quotation for your needs.',
    'ui_offer_button_product',          'Go to offer page',
    'ui_offer_button_service',          'Go to offer page',
    'ui_offer_button_general',          'Request an offer',

    -- OfferPublicForm: headings & intro
    'ui_offer_form_heading',            'Request an Offer',
    'ui_offer_form_intro',
      'Share details about your company and request; we will get back to you with a tailored quotation.',

    -- Country help
    'ui_offer_country_help',
      'Optional. You can leave this blank or enter ISO-2 (e.g., TR, DE). If you type a longer value, we will still keep it in the message details.',

    -- Related type radios
    'ui_offer_form_radio_general',      'General quote',
    'ui_offer_form_radio_product',      'Product / Spare Part',
    'ui_offer_form_radio_service',      'Service (Engineering / Retrofit)',

    -- Related block intros
    'ui_offer_form_general_text',
      'Please describe your general quotation request.',
    'ui_offer_form_product_text',
      'Please fill in the technical details.',
    'ui_offer_form_service_text',
      'Please fill in the details for the requested service.',

    -- Status & submit
    'ui_offer_form_error',
      'An error occurred while submitting your request. Please try again later.',
    'ui_offer_form_success',
      'Your request has been received. Reference no: ',
    'ui_offer_form_submit',             'Request an Offer',
    'ui_offer_form_submitting',         'Submitting...',

    -- Consents
    'ui_offer_form_kvkk_label',
      'I have read and accept the privacy policy and terms of use (mandatory).',
    'ui_offer_form_marketing_label',
      'I would like to receive promotional and information e-mails (optional).',
    'ui_offer_form_kvkk_alert',
      'Please accept the privacy terms.',

    -- Placeholders (contact)
    'ui_offer_ph_company',              'Company *',
    'ui_offer_ph_contact_person',       'Contact Person *',
    'ui_offer_ph_position',             'Position *',
    'ui_offer_ph_email',                'E-mail *',
    'ui_offer_ph_phone',                'Phone *',
    'ui_offer_ph_country_code',         'Country (optional)',
    'ui_offer_ph_locale',               'Locale',

    -- Placeholders (general / selects)
    'ui_offer_ph_general_notes',
      'Requested product/service, quantity, details...',
    'ui_offer_ph_product_select',       'Please select a product / spare part',
    'ui_offer_ph_service_select',       'Please select a service',

    -- Placeholders (product technical)
    'ui_offer_ph_tower_process',        'Process where the tower will be used',
    'ui_offer_ph_city',                 'City',
    'ui_offer_ph_district',             'District',
    'ui_offer_ph_water_flow',           'Water Flow Rate (m³/h)',
    'ui_offer_ph_inlet_temp',           'Inlet Temperature (°C)',
    'ui_offer_ph_outlet_temp',          'Outlet Temperature (°C)',
    'ui_offer_ph_wet_bulb',             'Wet Bulb Temperature (°C)',
    'ui_offer_ph_capacity',             'Capacity (kcal/h, kW)',
    'ui_offer_ph_water_quality',        'Water Quality',
    'ui_offer_ph_pool_type',            'Pool (FRP basin / concrete etc.)',
    'ui_offer_ph_tower_location',
      'Tower Location (steel frame / concrete base)',
    'ui_offer_ph_existing_tower',       'Existing tower? (model/year if any)',
    'ui_offer_ph_referral',             'How did you hear about us?',
    'ui_offer_ph_extra_notes',          'Additional Notes / Comments',

    -- Placeholders (service)
    'ui_offer_ph_service_expectations',
      'Your expectations, planned date, other notes...',

    -- Lists loading/errors
    'ui_offer_products_loading',        'Loading...',
    'ui_offer_products_error',          'Failed to load product list.',
    'ui_offer_services_loading',        'Loading...',
    'ui_offer_services_error',          'Failed to load service list.',

    -- Default subject
    'ui_offer_default_subject',         'Quotation request',

    -- WhatsApp CTA
    'ui_offer_whatsapp_default_message',
      'Hello, I would like to get more information and a quotation about your services.',
    'ui_offer_whatsapp_button_label',   'Write via WhatsApp',

    -- Optional CTA (legacy/other sections)
    'ui_offer_cta_title',
      'Let’s design the most suitable cooling solution for your plant.',
    'ui_offer_cta_text',
      'Tell us briefly about your system and our engineering team will propose a performance-focused solution.',
    'ui_offer_cta_button',              'Request a quote'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_offer',
  'de',
  CAST(JSON_OBJECT(
    -- Page / Banner
    'ui_offer_page_title',              'Angebot anfordern',

    -- Section header (OfferPage container)
    'ui_offer_subprefix',               'Ensotek',
    'ui_offer_section_label',           'Technische Angebote',
    'ui_offer_heading_general',         'Angebot anfordern',
    'ui_offer_subtitle',
      'Maßgeschneiderte Kühllösungen und technische Beratung.',
    'ui_offer_description',
      'Füllen Sie das Formular aus – unser Vertriebsteam meldet sich schnellstmöglich bei Ihnen.',

    -- SEO overrides (pages/offer.tsx)
    'ui_offer_meta_title',              'Angebot anfordern',
    'ui_offer_meta_description',
      'Füllen Sie das Angebotsformular aus – unser Vertriebsteam meldet sich schnellstmöglich bei Ihnen.',

    -- OfferSection (context headings + intro + buttons)
    'ui_offer_heading_product',         'Angebot für dieses Produkt anfordern',
    'ui_offer_heading_service',         'Angebot für diese Dienstleistung anfordern',
    'ui_offer_intro_product',
      'Sie können ein individuelles Angebot für dieses Produkt anfordern.',
    'ui_offer_intro_service',
      'Sie können ein individuelles Angebot für diese Dienstleistung anfordern.',
    'ui_offer_intro_general',
      'Fordern Sie ein individuelles Angebot passend zu Ihren Anforderungen an.',
    'ui_offer_button_product',          'Zur Angebotsseite',
    'ui_offer_button_service',          'Zur Angebotsseite',
    'ui_offer_button_general',          'Angebot anfordern',

    -- OfferPublicForm: headings & intro
    'ui_offer_form_heading',            'Angebot anfordern',
    'ui_offer_form_intro',
      'Teilen Sie Informationen zu Ihrem Unternehmen und Ihrer Anfrage – wir melden uns zeitnah mit einem individuellen Angebot.',

    -- Country help
    'ui_offer_country_help',
      'Optional. Sie können das Feld leer lassen oder einen ISO-2 Code (z. B. TR, DE) eingeben. Wenn Sie einen längeren Wert eingeben, wird dieser dennoch in den Details gespeichert.',

    -- Related type radios
    'ui_offer_form_radio_general',      'Allgemeines Angebot',
    'ui_offer_form_radio_product',      'Produkt / Ersatzteil',
    'ui_offer_form_radio_service',      'Service (Engineering / Retrofit)',

    -- Related block intros
    'ui_offer_form_general_text',
      'Bitte beschreiben Sie Ihre allgemeine Angebotsanfrage kurz.',
    'ui_offer_form_product_text',
      'Bitte füllen Sie die technischen Details aus.',
    'ui_offer_form_service_text',
      'Bitte tragen Sie die Details zur gewünschten Dienstleistung ein.',

    -- Status & submit
    'ui_offer_form_error',
      'Beim Senden Ihrer Anfrage ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
    'ui_offer_form_success',
      'Ihre Anfrage wurde erhalten. Referenznummer: ',
    'ui_offer_form_submit',             'Angebot anfordern',
    'ui_offer_form_submitting',         'Wird gesendet...',

    -- Consents
    'ui_offer_form_kvkk_label',
      'Ich habe die Datenschutzrichtlinie und Nutzungsbedingungen gelesen und akzeptiere sie (erforderlich).',
    'ui_offer_form_marketing_label',
      'Ich möchte Aktions- und Informations-E-Mails erhalten (optional).',
    'ui_offer_form_kvkk_alert',
      'Bitte akzeptieren Sie die Datenschutz-/Nutzungsbedingungen.',

    -- Placeholders (contact)
    'ui_offer_ph_company',              'Unternehmen *',
    'ui_offer_ph_contact_person',       'Ansprechpartner *',
    'ui_offer_ph_position',             'Position *',
    'ui_offer_ph_email',                'E-Mail *',
    'ui_offer_ph_phone',                'Telefon *',
    'ui_offer_ph_country_code',         'Land (optional)',
    'ui_offer_ph_locale',               'Sprache',

    -- Placeholders (general / selects)
    'ui_offer_ph_general_notes',
      'Gewünschtes Produkt/Service, Menge, Details...',
    'ui_offer_ph_product_select',       'Bitte wählen Sie ein Produkt / Ersatzteil',
    'ui_offer_ph_service_select',       'Bitte wählen Sie eine Dienstleistung',

    -- Placeholders (product technical)
    'ui_offer_ph_tower_process',        'Prozess, in dem der Kühlturm eingesetzt wird',
    'ui_offer_ph_city',                 'Stadt',
    'ui_offer_ph_district',             'Bezirk',
    'ui_offer_ph_water_flow',           'Wasserdurchfluss (m³/h)',
    'ui_offer_ph_inlet_temp',           'Eintrittstemperatur (°C)',
    'ui_offer_ph_outlet_temp',          'Austrittstemperatur (°C)',
    'ui_offer_ph_wet_bulb',             'Feuchtkugeltemperatur (°C)',
    'ui_offer_ph_capacity',             'Leistung (kcal/h, kW)',
    'ui_offer_ph_water_quality',        'Wasserqualität',
    'ui_offer_ph_pool_type',            'Becken (GFK / Beton usw.)',
    'ui_offer_ph_tower_location',
      'Aufstellort (Stahlrahmen / Betonfundament)',
    'ui_offer_ph_existing_tower',       'Bestehender Kühlturm? (Modell/Jahr falls vorhanden)',
    'ui_offer_ph_referral',             'Wie haben Sie von uns erfahren?',
    'ui_offer_ph_extra_notes',          'Zusätzliche Notizen / Kommentare',

    -- Placeholders (service)
    'ui_offer_ph_service_expectations',
      'Ihre Erwartungen, geplanter Termin, weitere Hinweise...',

    -- Lists loading/errors
    'ui_offer_products_loading',        'Wird geladen...',
    'ui_offer_products_error',          'Produktliste konnte nicht geladen werden.',
    'ui_offer_services_loading',        'Wird geladen...',
    'ui_offer_services_error',          'Dienstleistungsliste konnte nicht geladen werden.',

    -- Default subject
    'ui_offer_default_subject',         'Angebotsanfrage',

    -- WhatsApp CTA
    'ui_offer_whatsapp_default_message',
      'Hallo, ich möchte gerne mehr Informationen und ein Angebot zu Ihren Leistungen erhalten.',
    'ui_offer_whatsapp_button_label',   'Per WhatsApp schreiben',

    -- Optional CTA (legacy/other sections)
    'ui_offer_cta_title',
      'Lassen Sie uns gemeinsam die optimale Lösung für Ihre Kühltürme planen.',
    'ui_offer_cta_text',
      'Beschreiben Sie Ihr System kurz – unser Engineering-Team schlägt Ihnen eine leistungs- und effizienzorientierte Lösung vor.',
    'ui_offer_cta_button',              'Angebot anfordern'
  ) AS CHAR),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

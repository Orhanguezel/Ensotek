-- =============================================================
-- 046_site_settings_ui_library.sql  (Library UI strings)
--  - Key: ui_library
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Extendable: clone from tr as bootstrap (collation-safe)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_library',
  'de',
  CAST(JSON_OBJECT(
    -- Genel Library
    'ui_library_untitled',                  'Başlıksız içerik',
    'ui_library_sample_one',                'Örnek içerik 1',
    'ui_library_sample_two',                'Örnek içerik 2',
    'ui_library_subprefix',                 'Ensotek',
    'ui_library_sublabel',                  'Bilgi Merkezi',
    'ui_library_title_prefix',              'Mühendislik ve',
    'ui_library_title_mark',                'Dokümanlar',
    'ui_library_view_detail_aria',          'detaylarını görüntüle',
    'ui_library_view_detail',               'Detayları gör',
    'ui_library_view_all',                  'Tüm dokümanları görüntüle',
    'ui_library_cover_alt',                 'kütüphane kapak görseli',
    'ui_library_page_title',                'Doküman Kütüphanesi',
    'ui_library_detail_page_title',         'Teknik Doküman Detayı',
    'ui_library_detail_loading',            'Doküman yükleniyor...',
    'ui_library_detail_not_found',          'Doküman bulunamadı',
    'ui_library_detail_not_found_desc',     'İstediğiniz doküman bulunamadı veya yayında değil.',
    'ui_library_back_to_list',              'Kütüphaneye geri dön',
    'ui_library_detail_subtitle',           'Teknik doküman',
    'ui_library_published_at',              'Yayın tarihi',
    'ui_library_files_title',               'İndirilebilir dosyalar',
    'ui_library_files_loading',             'Dosyalar yükleniyor...',

    -- “More documents” carousel
    'ui_library_more_title',                'Diğer dokümanlar',
    'ui_library_more_loading',              'Diğer dokümanlar yükleniyor...',
    'ui_library_more_subprefix',            'Ensotek',
    'ui_library_more_sublabel',             'Bilgi Merkezi',

    -- Wet-Bulb Hesaplayıcı
    'ui_library_wb_temperature_label',      'Hava Sıcaklığı (°C)',
    'ui_library_wb_humidity_label',         'Nem Oranı (%)',
    'ui_library_wb_calculate_button',       'Hesapla',
    'ui_library_wb_title',                  'Yaş Termometre Sıcaklığı Hesaplayıcı',
    'ui_library_wb_subtitle',               'Hava sıcaklığı ve bağıl nemi girerek yaklaşık yaş termometre sıcaklığını hesaplayın.',
    'ui_library_wb_result_label',           'Yaş termometre sıcaklığı:',
    'ui_library_wb_temperature_placeholder','Hava Sıcaklığı (°C)',
    'ui_library_wb_humidity_placeholder',   'Nem Oranı (%)',
    'ui_library_wb_error_invalid_input',    'Lütfen geçerli değerler girin.',
    'ui_library_wb_sublabel',               'Psikrometrik Araçlar'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_library',
  'en',
  CAST(JSON_OBJECT(
    -- General Library
    'ui_library_untitled',                  'Untitled content',
    'ui_library_sample_one',                'Sample article 1',
    'ui_library_sample_two',                'Sample article 2',
    'ui_library_subprefix',                 'Ensotek',
    'ui_library_sublabel',                  'Knowledge Hub',
    'ui_library_title_prefix',              'Engineering and',
    'ui_library_title_mark',                'Documents',
    'ui_library_view_detail_aria',          'view details',
    'ui_library_view_detail',               'View details',
    'ui_library_view_all',                  'View all documents',
    'ui_library_cover_alt',                 'library cover image',
    'ui_library_page_title',                'Document Library',
    'ui_library_detail_page_title',         'Technical Document Detail',
    'ui_library_detail_loading',            'Loading document...',
    'ui_library_detail_not_found',          'Document not found',
    'ui_library_detail_not_found_desc',     'The requested document could not be found or is not available.',
    'ui_library_back_to_list',              'Back to library',
    'ui_library_detail_subtitle',           'Technical document',
    'ui_library_published_at',              'Published',
    'ui_library_files_title',               'Downloadable files',
    'ui_library_files_loading',             'Loading files...',

    -- “More documents” carousel
    'ui_library_more_title',                'More documents',
    'ui_library_more_loading',              'Loading more documents...',
    'ui_library_more_subprefix',            'Ensotek',
    'ui_library_more_sublabel',             'Knowledge Hub',

    -- Wet-Bulb Calculator
    'ui_library_wb_temperature_label',      'Air Temperature (°C)',
    'ui_library_wb_humidity_label',         'Relative Humidity (%)',
    'ui_library_wb_calculate_button',       'Calculate',
    'ui_library_wb_title',                  'Wet-Bulb Temperature Calculator',
    'ui_library_wb_subtitle',               'Enter air temperature and relative humidity to estimate wet-bulb temperature.',
    'ui_library_wb_result_label',           'Wet-bulb temperature:',
    'ui_library_wb_temperature_placeholder','Air temperature (°C)',
    'ui_library_wb_humidity_placeholder',   'Relative humidity (%)',
    'ui_library_wb_error_invalid_input',    'Please enter valid values.',
    'ui_library_wb_sublabel',               'Psychrometric Tools'
  ) AS CHAR),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_library',
  'de',
  CAST(JSON_OBJECT(
    -- Allgemeine Bibliothek
    'ui_library_untitled',                  'Inhalt ohne Titel',
    'ui_library_sample_one',                'Beispielinhalt 1',
    'ui_library_sample_two',                'Beispielinhalt 2',
    'ui_library_subprefix',                 'Ensotek',
    'ui_library_sublabel',                  'Wissenszentrum',
    'ui_library_title_prefix',              'Engineering und',
    'ui_library_title_mark',                'Dokumente',
    'ui_library_view_detail_aria',          'Details anzeigen',
    'ui_library_view_detail',               'Details ansehen',
    'ui_library_view_all',                  'Alle Dokumente anzeigen',
    'ui_library_cover_alt',                 'Titelbild der Bibliothek',
    'ui_library_page_title',                'Dokumentenbibliothek',
    'ui_library_detail_page_title',         'Technisches Dokument – Details',
    'ui_library_detail_loading',            'Dokument wird geladen...',
    'ui_library_detail_not_found',          'Dokument nicht gefunden',
    'ui_library_detail_not_found_desc',     'Das gewünschte Dokument wurde nicht gefunden oder ist nicht verfügbar.',
    'ui_library_back_to_list',              'Zurück zur Bibliothek',
    'ui_library_detail_subtitle',           'Technisches Dokument',
    'ui_library_published_at',              'Veröffentlicht am',
    'ui_library_files_title',               'Download-Dateien',
    'ui_library_files_loading',             'Dateien werden geladen...',

    -- “Weitere Dokumente” Carousel
    'ui_library_more_title',                'Weitere Dokumente',
    'ui_library_more_loading',              'Weitere Dokumente werden geladen...',
    'ui_library_more_subprefix',            'Ensotek',
    'ui_library_more_sublabel',             'Wissenszentrum',

    -- Feuchtkugelrechner
    'ui_library_wb_temperature_label',      'Lufttemperatur (°C)',
    'ui_library_wb_humidity_label',         'Relative Luftfeuchte (%)',
    'ui_library_wb_calculate_button',       'Berechnen',
    'ui_library_wb_title',                  'Feuchtkugeltemperatur-Rechner',
    'ui_library_wb_subtitle',               'Geben Sie Lufttemperatur und relative Luftfeuchte ein, um die Feuchtkugeltemperatur näherungsweise zu berechnen.',
    'ui_library_wb_result_label',           'Feuchtkugeltemperatur:',
    'ui_library_wb_temperature_placeholder','Lufttemperatur (°C)',
    'ui_library_wb_humidity_placeholder',   'Relative Luftfeuchte (%)',
    'ui_library_wb_error_invalid_input',    'Bitte gültige Werte eingeben.',
    'ui_library_wb_sublabel',               'Psychrometrische Tools'
  ) AS CHAR),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- OPTIONAL BOOTSTRAP CLONE (COLLATION-SAFE): TR → TARGET
SET @TARGET_LOCALE := 'de';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
SELECT
  UUID(),
  s.`key`,
  CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci,
  s.`value`,
  NOW(3),
  NOW(3)
FROM site_settings s
WHERE (s.locale COLLATE utf8mb4_unicode_ci) = ('de' COLLATE utf8mb4_unicode_ci)
  AND (s.`key`  COLLATE utf8mb4_unicode_ci) = ('ui_library' COLLATE utf8mb4_unicode_ci)
  AND (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci) <> ('de' COLLATE utf8mb4_unicode_ci)
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE (t.`key`  COLLATE utf8mb4_unicode_ci) = (s.`key` COLLATE utf8mb4_unicode_ci)
      AND (t.locale COLLATE utf8mb4_unicode_ci) = (CONVERT(@TARGET_LOCALE USING utf8mb4) COLLATE utf8mb4_unicode_ci)
  );

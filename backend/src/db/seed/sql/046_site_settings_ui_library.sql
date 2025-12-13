-- =============================================================
-- FILE: 046_site_settings_ui_library.sql  (Library UI metinleri)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
VALUES
(
  UUID(),
  'ui_library',
  'tr',
  JSON_OBJECT(
    -- Genel Library
    'ui_library_untitled',                 'Başlıksız içerik',
    'ui_library_sample_one',               'Örnek içerik 1',
    'ui_library_sample_two',               'Örnek içerik 2',
    'ui_library_subprefix',                'Ensotek',
    'ui_library_sublabel',                 'Bilgi Merkezi',
    'ui_library_title_prefix',             'Mühendislik ve',
    'ui_library_title_mark',               'Dokümanlar',
    'ui_library_view_detail_aria',         'detaylarını görüntüle',
    'ui_library_view_detail',              'Detayları gör',
    'ui_library_view_all',                 'Tüm dokümanları görüntüle',
    'ui_library_cover_alt',                'kütüphane kapak görseli',
    'ui_library_page_title',               'Doküman Kütüphanesi',
    'ui_library_detail_page_title',        'Teknik Doküman Detayı',
    'ui_library_detail_loading',           'Doküman yükleniyor...',
    'ui_library_detail_not_found',         'Doküman bulunamadı',
    'ui_library_detail_not_found_desc',    'İstediğiniz doküman bulunamadı veya yayında değil.',
    'ui_library_back_to_list',             'Kütüphaneye geri dön',
    'ui_library_detail_subtitle',          'Teknik doküman',
    'ui_library_published_at',             'Yayın tarihi',
    'ui_library_files_title',              'İndirilebilir dosyalar',
    'ui_library_files_loading',            'Dosyalar yükleniyor...',

    -- “More documents” carousel
    'ui_library_more_title',               'Diğer dokümanlar',
    'ui_library_more_loading',             'Diğer dokümanlar yükleniyor...',
    'ui_library_more_subprefix',           'Ensotek',
    'ui_library_more_sublabel',            'Bilgi Merkezi',

    -- Wet-Bulb Hesaplayıcı (WetBulbCalculator)
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
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_library',
  'en',
  JSON_OBJECT(
    -- General Library
    'ui_library_untitled',                 'Untitled content',
    'ui_library_sample_one',               'Sample article 1',
    'ui_library_sample_two',               'Sample article 2',
    'ui_library_subprefix',                'Ensotek',
    'ui_library_sublabel',                 'Knowledge Hub',
    'ui_library_title_prefix',             'Engineering and',
    'ui_library_title_mark',               'Documents',
    'ui_library_view_detail_aria',         'view details',
    'ui_library_view_detail',              'View details',
    'ui_library_view_all',                 'View all documents',
    'ui_library_cover_alt',                'library cover image',
    'ui_library_page_title',               'Document Library',
    'ui_library_detail_page_title',        'Library Detail',
    'ui_library_detail_loading',           'Loading document...',
    'ui_library_detail_not_found',         'Document not found',
    'ui_library_detail_not_found_desc',    'The requested document could not be found or is not available.',
    'ui_library_back_to_list',             'Back to library',
    'ui_library_detail_subtitle',          'Technical document',
    'ui_library_published_at',             'Published',
    'ui_library_files_title',              'Downloadable files',
    'ui_library_files_loading',            'Loading files...',

    -- “More documents” carousel
    'ui_library_more_title',               'More documents',
    'ui_library_more_loading',             'Loading more documents...',
    'ui_library_more_subprefix',           'Ensotek',
    'ui_library_more_sublabel',            'Knowledge Hub',

    -- Wet-Bulb Calculator (WetBulbCalculator)
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
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`    = VALUES(`value`),
  updated_at = VALUES(updated_at);

-- TR → DE otomatik kopya (Almanca özel çeviri gelene kadar)
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
SELECT UUID(), s.`key`, 'de', s.`value`, NOW(3), NOW(3)
FROM site_settings s
WHERE s.locale = 'tr'
  AND s.`key` = 'ui_library'
  AND NOT EXISTS (
    SELECT 1
    FROM site_settings t
    WHERE t.`key` = s.`key`
      AND t.locale = 'de'
  );

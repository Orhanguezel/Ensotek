-- =============================================================
-- 049-5_site_settings_ui_spareparts.sql
-- Ensotek – UI Spareparts (site_settings.ui_spareparts) [FINAL]
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Mirrors Product UI keys used by shared components:
--    ProductDetail.tsx, ProductMore.tsx, ProductPageContent.tsx
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at) VALUES
(
  UUID(),
  'ui_spareparts',
  'tr',
  CAST(
    JSON_OBJECT(
      -- Listing / general
      'ui_spareparts_kicker_prefix',              'Ensotek',
      'ui_spareparts_kicker_label',               'Yedek Parçalar',
      'ui_spareparts_page_title',                 'Yedek Parçalar',
      'ui_spareparts_page_intro',                 'Su soğutma kuleleri için seçili yedek parçalar ve bakım bileşenleri.',
      'ui_spareparts_empty',                      'Şu anda görüntülenecek yedek parça bulunmamaktadır.',

      -- /sparepart/[slug] detail
      'ui_spareparts_detail_page_title',          'Yedek Parça',
      'ui_spareparts_back_to_list',               'Tüm yedek parçalara dön',
      'ui_spareparts_loading',                    'Yedek parça yükleniyor...',
      'ui_spareparts_not_found',                  'Yedek parça bulunamadı.',
      'ui_spareparts_specs_title',                'Teknik Özellikler',
      'ui_spareparts_tags_title',                 'Etiketler',
      'ui_spareparts_faqs_title',                 'Sık Sorulan Sorular',
      'ui_spareparts_faqs_empty',                 'Bu yedek parça için kayıtlı SSS bulunmamaktadır.',
      'ui_spareparts_request_quote',              'Teklif isteyiniz',

      -- ✅ Missing equivalents used in ProductDetail.tsx
      'ui_spareparts_gallery_title',              'Galeri',
      'ui_spareparts_share_title',                'Paylaş',
      'ui_spareparts_write_comment',              'Yorum yaz',
      'ui_spareparts_other_title',                'Diğer Yedek Parçalar',
      'ui_spareparts_sidebar_contact_title',      'İletişim Bilgileri',

      -- Detail SEO overrides (optional, used by page)
      'ui_spareparts_detail_meta_title',          'Yedek Parça Detayı',
      'ui_spareparts_detail_meta_description',    'Yedek parça detayları, teknik özellikler ve teklif talebi için inceleyiniz.',

      -- More carousel (ProductMore.tsx)
      'ui_spareparts_more_title',                 'Diğer Yedek Parçalar',
      'ui_spareparts_go_to_item',                 'Yedek parçayı görüntüle'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_spareparts',
  'en',
  CAST(
    JSON_OBJECT(
      -- Listing / general
      'ui_spareparts_kicker_prefix',              'Ensotek',
      'ui_spareparts_kicker_label',               'Spare Parts',
      'ui_spareparts_page_title',                 'Spare Parts',
      'ui_spareparts_page_intro',                 'Selected spare parts and maintenance components for cooling towers.',
      'ui_spareparts_empty',                      'There are no spare parts to display at the moment.',

      -- /sparepart/[slug] detail
      'ui_spareparts_detail_page_title',          'Spare Part',
      'ui_spareparts_back_to_list',               'Back to all spare parts',
      'ui_spareparts_loading',                    'Loading spare part...',
      'ui_spareparts_not_found',                  'Spare part not found.',
      'ui_spareparts_specs_title',                'Technical Specifications',
      'ui_spareparts_tags_title',                 'Tags',
      'ui_spareparts_faqs_title',                 'Frequently Asked Questions',
      'ui_spareparts_faqs_empty',                 'There are no FAQs for this item yet.',
      'ui_spareparts_request_quote',              'Request a quote',

      -- ✅ Missing equivalents used in ProductDetail.tsx
      'ui_spareparts_gallery_title',              'Gallery',
      'ui_spareparts_share_title',                'Share',
      'ui_spareparts_write_comment',              'Write a review',
      'ui_spareparts_other_title',                'Other spare parts',
      'ui_spareparts_sidebar_contact_title',      'Contact Info',

      -- Detail SEO overrides (optional)
      'ui_spareparts_detail_meta_title',          'Spare Part Detail',
      'ui_spareparts_detail_meta_description',    'View spare part details, technical specifications, and request a quote.',

      -- More carousel
      'ui_spareparts_more_title',                 'More Spare Parts',
      'ui_spareparts_go_to_item',                 'View spare part'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_spareparts',
  'de',
  CAST(
    JSON_OBJECT(
      -- Listing / general
      'ui_spareparts_kicker_prefix',              'Ensotek',
      'ui_spareparts_kicker_label',               'Ersatzteile',
      'ui_spareparts_page_title',                 'Ersatzteile',
      'ui_spareparts_page_intro',                 'Ausgewählte Ersatzteile und Wartungskomponenten für Kühltürme.',
      'ui_spareparts_empty',                      'Derzeit sind keine Ersatzteile verfügbar.',

      -- /sparepart/[slug] detail
      'ui_spareparts_detail_page_title',          'Ersatzteil',
      'ui_spareparts_back_to_list',               'Zurück zu allen Ersatzteilen',
      'ui_spareparts_loading',                    'Ersatzteil wird geladen...',
      'ui_spareparts_not_found',                  'Ersatzteil nicht gefunden.',
      'ui_spareparts_specs_title',                'Technische Spezifikationen',
      'ui_spareparts_tags_title',                 'Tags',
      'ui_spareparts_faqs_title',                 'Häufig gestellte Fragen',
      'ui_spareparts_faqs_empty',                 'Für diesen Artikel sind noch keine FAQs vorhanden.',
      'ui_spareparts_request_quote',              'Angebot anfordern',

      -- ✅ Missing equivalents used in ProductDetail.tsx
      'ui_spareparts_gallery_title',              'Galerie',
      'ui_spareparts_share_title',                'Teilen',
      'ui_spareparts_write_comment',              'Bewertung schreiben',
      'ui_spareparts_other_title',                'Weitere Ersatzteile',
      'ui_spareparts_sidebar_contact_title',      'Kontaktinfo',

      -- Detail SEO overrides (optional)
      'ui_spareparts_detail_meta_title',          'Ersatzteil-Details',
      'ui_spareparts_detail_meta_description',    'Ersatzteil-Details ansehen, technische Spezifikationen prüfen und ein Angebot anfordern.',

      -- More carousel
      'ui_spareparts_more_title',                 'Weitere Ersatzteile',
      'ui_spareparts_go_to_item',                 'Ersatzteil ansehen'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);


-- =============================================================
-- FILE: 041_admin_settings.sql (Ensotek)
-- Admin Panel UI Configurations (Theme, Layout, Page Meta)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
-- =============================================================
-- GLOBAL: Admin UI Defaults (Theme/Layout)
-- =============================================================
(
  UUID(),
  'ui_admin_config',
  '*',
  CAST(JSON_OBJECT(
    'default_locale', 'tr',
    'theme', JSON_OBJECT(
      'mode', 'light',
      'preset', 'zinc',
      'font', 'inter'
    ),
    'layout', JSON_OBJECT(
      'sidebar_variant', 'inset',
      'sidebar_collapsible', 'icon',
      'navbar_style', 'sticky',
      'content_layout', 'centered'
    ),
    'branding', JSON_OBJECT(
      'app_name', 'Ensotek Admin Panel',
      'app_copyright', 'Ensotek GmbH',
      'html_lang', 'de',
      'theme_color', '#0066CC',
      'favicon_16', '/favicon/favicon-16.svg',
      'favicon_32', '/favicon/favicon-32.svg',
      'apple_touch_icon', '/favicon/apple-touch-icon.svg',
      'meta', JSON_OBJECT(
        'title', 'Ensotek - Industrielle Kühl- und Klimatechnik | HVAC Lösungen',
        'description', 'Ensotek: Führender Anbieter für industrielle Kühl- und Klimatechnik. Adiabate Kühlung, Verdunstungskühler und maßgeschneiderte HVAC-Lösungen für Industrie und Gewerbe.',
        'og_url', 'https://ensotek.de/',
        'og_title', 'Ensotek - Industrielle Kühl- und Klimatechnik',
        'og_description', 'Professionelle HVAC-Lösungen für Industrie und Gewerbe. Adiabate Kühlung, Verdunstungskühler und energieeffiziente Klimatechnik.',
        'og_image', '/logo/ensotek-logo.svg',
        'twitter_card', 'summary_large_image'
      )
    )
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),

-- =============================================================
-- LOCALIZED: Admin Page Meta (TR)
-- =============================================================
(
  UUID(),
  'ui_admin_pages',
  'tr',
  CAST(JSON_OBJECT(
    'dashboard', JSON_OBJECT(
      'title', 'Özet Paneli',
      'description', 'Sistem genel bakış ve metrikler',
      'metrics', JSON_ARRAY('products', 'services', 'offers', 'contacts', 'catalog_requests', 'references', 'categories', 'subcategories', 'library', 'faqs', 'custom_pages', 'reviews', 'newsletter', 'support', 'chat', 'users', 'email_templates', 'site_settings', 'menu_items', 'sliders', 'footer_sections', 'storage')
    ),
    'users', JSON_OBJECT(
      'title', 'Kullanıcı Yönetimi',
      'description', 'Sistem kullanıcılarını yönet'
    ),
    'offers', JSON_OBJECT(
      'title', 'Teklif Talepleri',
      'description', 'Gelen teklif talepleri ve yönetimi'
    ),
    'catalog_requests', JSON_OBJECT(
      'title', 'Katalog Talepleri',
      'description', 'Katalog indirme ve talep yönetimi'
    ),
    'products', JSON_OBJECT(
      'title', 'Ürünler',
      'description', 'Soğutma ve HVAC ürün kataloğu'
    ),
    'categories', JSON_OBJECT(
      'title', 'Kategoriler',
      'description', 'Ürün kategori yönetimi'
    ),
    'services', JSON_OBJECT(
      'title', 'Hizmetler',
      'description', 'Teknik hizmetler ve destek'
    ),
    'reviews', JSON_OBJECT(
      'title', 'Değerlendirmeler',
      'description', 'Müşteri yorumları ve onaylama'
    ),
    'site_settings', JSON_OBJECT(
      'title', 'Site Ayarları',
      'description', 'Genel site konfigürasyonu'
    )
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),

-- =============================================================
-- LOCALIZED: Admin Page Meta (EN)
-- =============================================================
(
  UUID(),
  'ui_admin_pages',
  'en',
  CAST(JSON_OBJECT(
    'dashboard', JSON_OBJECT(
      'title', 'Dashboard Overview',
      'description', 'System overview and metrics',
      'metrics', JSON_ARRAY('products', 'services', 'offers', 'contacts', 'catalog_requests', 'references', 'categories', 'subcategories', 'library', 'faqs', 'custom_pages', 'reviews', 'newsletter', 'support', 'chat', 'users', 'email_templates', 'site_settings', 'menu_items', 'sliders', 'footer_sections', 'storage')
    ),
    'users', JSON_OBJECT(
      'title', 'User Management',
      'description', 'Manage system users'
    ),
    'offers', JSON_OBJECT(
      'title', 'Offer Requests',
      'description', 'Incoming offer requests and management'
    ),
    'catalog_requests', JSON_OBJECT(
      'title', 'Catalog Requests',
      'description', 'Catalog download and request management'
    ),
    'products', JSON_OBJECT(
      'title', 'Products',
      'description', 'Cooling and HVAC product catalog'
    ),
    'categories', JSON_OBJECT(
      'title', 'Categories',
      'description', 'Product category management'
    ),
    'services', JSON_OBJECT(
      'title', 'Services',
      'description', 'Technical services and support'
    ),
    'reviews', JSON_OBJECT(
      'title', 'Reviews',
      'description', 'Customer reviews and moderation'
    ),
    'site_settings', JSON_OBJECT(
      'title', 'Site Settings',
      'description', 'General site configuration'
    )
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),

-- =============================================================
-- LOCALIZED: Admin Page Meta (DE)
-- =============================================================
(
  UUID(),
  'ui_admin_pages',
  'de',
  CAST(JSON_OBJECT(
    'dashboard', JSON_OBJECT(
      'title', 'Übersicht',
      'description', 'Systemübersicht und Metriken',
      'metrics', JSON_ARRAY('products', 'services', 'offers', 'contacts', 'catalog_requests', 'references', 'categories', 'subcategories', 'library', 'faqs', 'custom_pages', 'reviews', 'newsletter', 'support', 'chat', 'users', 'email_templates', 'site_settings', 'menu_items', 'sliders', 'footer_sections', 'storage')
    ),
    'users', JSON_OBJECT(
      'title', 'Benutzerverwaltung',
      'description', 'Systembenutzer verwalten'
    ),
    'offers', JSON_OBJECT(
      'title', 'Angebotsanfragen',
      'description', 'Eingehende Angebotsanfragen und Verwaltung'
    ),
    'catalog_requests', JSON_OBJECT(
      'title', 'Kataloganfragen',
      'description', 'Katalog-Download und Anfrageverwaltung'
    ),
    'products', JSON_OBJECT(
      'title', 'Produkte',
      'description', 'Kühl- und HVAC-Produktkatalog'
    ),
    'categories', JSON_OBJECT(
      'title', 'Kategorien',
      'description', 'Produktkategorieverwaltung'
    ),
    'services', JSON_OBJECT(
      'title', 'Dienstleistungen',
      'description', 'Technische Dienstleistungen und Support'
    ),
    'reviews', JSON_OBJECT(
      'title', 'Bewertungen',
      'description', 'Kundenbewertungen und Moderation'
    ),
    'site_settings', JSON_OBJECT(
      'title', 'Seiteneinstellungen',
      'description', 'Allgemeine Seitenkonfiguration'
    )
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
)

ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

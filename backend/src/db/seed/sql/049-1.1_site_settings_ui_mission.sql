-- =============================================================
-- 049-1.1_site_settings_ui_mission_vision.sql  [FINAL]
-- ui_mission_vision + ui_mission + ui_vision (Mission/Vision pages UI strings)
--  - Keys: ui_mission_vision, ui_mission, ui_vision
--  - Value: JSON (stored as TEXT)
--  - Localized: tr / en / de
--  - Upsert: ON DUPLICATE KEY UPDATE
--  - NO ALTER / NO PATCH
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- =============================================================
-- ui_mission_vision (TR/EN/DE)
-- =============================================================
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
VALUES
(
  UUID(),
  'ui_mission_vision',
  'tr',
  CAST(
    JSON_OBJECT(
      -- Header / Banner
      'ui_mission_vision_subprefix',                  'Ensotek',
      'ui_mission_vision_sublabel',                   'Misyon & Vizyon',
      'ui_mission_vision_page_title',                 'Misyonumuz - Vizyonumuz',
      'ui_mission_vision_page_lead',
        'Ensotek olarak süreçleri daha anlaşılır, daha güvenli ve daha verimli hale getirmek için çalışıyoruz.',

      -- SEO overrides (pages/mission-vision.tsx)
      'ui_mission_vision_meta_title',                 'Misyonumuz - Vizyonumuz | Ensotek',
      'ui_mission_vision_meta_description',
        'Ensotek misyonu ve vizyonu: şeffaf süreç yönetimi, ölçülebilir kalite ve sürdürülebilir değer üretimi.',

      -- Section labels / badges
      'ui_mission_vision_badge_mission',              'Misyon',
      'ui_mission_vision_badge_vision',               'Vizyon',

      -- Mission/Vision short sub-leads
      'ui_mission_vision_mission_sub',                'Süreç yönetimi, şeffaf iletişim ve ölçülebilir kalite.',
      'ui_mission_vision_vision_sub',                 'Sürdürülebilirlik, güven ve uzun vadeli değer üretimi.',

      -- Empty state
      'ui_mission_vision_empty',                      'Misyon/Vizyon içeriği bulunamadı.',

      -- Values panel
      'ui_mission_vision_values_kicker',              'Değerler',
      'ui_mission_vision_values_title',               'Yaklaşımımız',

      'ui_mission_vision_value_trust_icon',           '🛡️',
      'ui_mission_vision_value_trust_title',          'GÜVEN',
      'ui_mission_vision_value_trust_sub',            'Şeffaf süreç',

      'ui_mission_vision_value_speed_icon',           '⚡',
      'ui_mission_vision_value_speed_title',          'HIZ',
      'ui_mission_vision_value_speed_sub',            'Hızlı dönüş',

      'ui_mission_vision_value_expertise_icon',       '🧭',
      'ui_mission_vision_value_expertise_title',      'UZMANLIK',
      'ui_mission_vision_value_expertise_sub',        'Doğru yönlendirme',

      'ui_mission_vision_value_support_icon',         '🤝',
      'ui_mission_vision_value_support_title',        'DESTEK',
      'ui_mission_vision_value_support_sub',          'Süreç boyunca',

      -- Principles panel
      'ui_mission_vision_principles_kicker',          'İlkeler',
      'ui_mission_vision_principles_title',           'Temel İlkelerimiz',

      'ui_mission_vision_principle_1_title',          'Şeffaflık',
      'ui_mission_vision_principle_1_desc',           'Net bilgi, net süreç.',

      'ui_mission_vision_principle_2_title',          'Doğruluk',
      'ui_mission_vision_principle_2_desc',           'Güncel ve teyitli veriler.',

      'ui_mission_vision_principle_3_title',          'Hızlı İletişim',
      'ui_mission_vision_principle_3_desc',           'Kısa sürede geri dönüş.',

      'ui_mission_vision_principle_4_title',          'Müşteri Odaklılık',
      'ui_mission_vision_principle_4_desc',           'İhtiyaca uygun çözüm.',

      -- Sidebar contact card (InfoContactCard props labels)
      'ui_mission_vision_info_title',                 'İletişim Bilgileri',
      'ui_mission_vision_info_desc',                  'Proje, teklif veya teknik danışmanlık için hızlıca ulaşın.',
      'ui_mission_vision_cta_phone',                  'Telefon',
      'ui_mission_vision_cta_whatsapp',               'WhatsApp',
      'ui_mission_vision_cta_form',                   'İletişim Formu'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_mission_vision',
  'en',
  CAST(
    JSON_OBJECT(
      -- Header / Banner
      'ui_mission_vision_subprefix',                  'Ensotek',
      'ui_mission_vision_sublabel',                   'Mission & Vision',
      'ui_mission_vision_page_title',                 'Our Mission - Our Vision',
      'ui_mission_vision_page_lead',
        'At Ensotek, we work to make processes clearer, safer, and more efficient.',

      -- SEO overrides
      'ui_mission_vision_meta_title',                 'Our Mission - Our Vision | Ensotek',
      'ui_mission_vision_meta_description',
        'Ensotek mission and vision: transparent process management, measurable quality, and sustainable value creation.',

      -- Section labels / badges
      'ui_mission_vision_badge_mission',              'Mission',
      'ui_mission_vision_badge_vision',               'Vision',

      -- Mission/Vision short sub-leads
      'ui_mission_vision_mission_sub',                'Process management, transparent communication, measurable quality.',
      'ui_mission_vision_vision_sub',                 'Sustainability, trust, and long-term value creation.',

      -- Empty state
      'ui_mission_vision_empty',                      'Mission/Vision content not found.',

      -- Values panel
      'ui_mission_vision_values_kicker',              'Values',
      'ui_mission_vision_values_title',               'Our Approach',

      'ui_mission_vision_value_trust_icon',           '🛡️',
      'ui_mission_vision_value_trust_title',          'TRUST',
      'ui_mission_vision_value_trust_sub',            'Transparent process',

      'ui_mission_vision_value_speed_icon',           '⚡',
      'ui_mission_vision_value_speed_title',          'SPEED',
      'ui_mission_vision_value_speed_sub',            'Fast response',

      'ui_mission_vision_value_expertise_icon',       '🧭',
      'ui_mission_vision_value_expertise_title',      'EXPERTISE',
      'ui_mission_vision_value_expertise_sub',        'Right guidance',

      'ui_mission_vision_value_support_icon',         '🤝',
      'ui_mission_vision_value_support_title',        'SUPPORT',
      'ui_mission_vision_value_support_sub',          'Throughout the process',

      -- Principles panel
      'ui_mission_vision_principles_kicker',          'Principles',
      'ui_mission_vision_principles_title',           'Our Core Principles',

      'ui_mission_vision_principle_1_title',          'Transparency',
      'ui_mission_vision_principle_1_desc',           'Clear information, clear process.',

      'ui_mission_vision_principle_2_title',          'Accuracy',
      'ui_mission_vision_principle_2_desc',           'Up-to-date and verified data.',

      'ui_mission_vision_principle_3_title',          'Fast Communication',
      'ui_mission_vision_principle_3_desc',           'Quick turnaround.',

      'ui_mission_vision_principle_4_title',          'Customer Focus',
      'ui_mission_vision_principle_4_desc',           'Solution tailored to needs.',

      -- Sidebar contact card labels
      'ui_mission_vision_info_title',                 'Contact Information',
      'ui_mission_vision_info_desc',                  'Reach us quickly for projects, quotes, or technical consulting.',
      'ui_mission_vision_cta_phone',                  'Phone',
      'ui_mission_vision_cta_whatsapp',               'WhatsApp',
      'ui_mission_vision_cta_form',                   'Contact Form'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_mission_vision',
  'de',
  CAST(
    JSON_OBJECT(
      -- Header / Banner
      'ui_mission_vision_subprefix',                  'Ensotek',
      'ui_mission_vision_sublabel',                   'Mission & Vision',
      'ui_mission_vision_page_title',                 'Unsere Mission - Unsere Vision',
      'ui_mission_vision_page_lead',
        'Bei Ensotek arbeiten wir daran, Prozesse verständlicher, sicherer und effizienter zu machen.',

      -- SEO overrides
      'ui_mission_vision_meta_title',                 'Unsere Mission - Unsere Vision | Ensotek',
      'ui_mission_vision_meta_description',
        'Ensotek Mission und Vision: transparentes Prozessmanagement, messbare Qualität und nachhaltige Wertschöpfung.',

      -- Section labels / badges
      'ui_mission_vision_badge_mission',              'Mission',
      'ui_mission_vision_badge_vision',               'Vision',

      -- Mission/Vision short sub-leads
      'ui_mission_vision_mission_sub',                'Prozessmanagement, transparente Kommunikation, messbare Qualität.',
      'ui_mission_vision_vision_sub',                 'Nachhaltigkeit, Vertrauen und langfristige Wertschöpfung.',

      -- Empty state
      'ui_mission_vision_empty',                      'Mission/Vision-Inhalt nicht gefunden.',

      -- Values panel
      'ui_mission_vision_values_kicker',              'Werte',
      'ui_mission_vision_values_title',               'Unser Ansatz',

      'ui_mission_vision_value_trust_icon',           '🛡️',
      'ui_mission_vision_value_trust_title',          'VERTRAUEN',
      'ui_mission_vision_value_trust_sub',            'Transparenter Prozess',

      'ui_mission_vision_value_speed_icon',           '⚡',
      'ui_mission_vision_value_speed_title',          'SCHNELLIGKEIT',
      'ui_mission_vision_value_speed_sub',            'Schnelle Rückmeldung',

      'ui_mission_vision_value_expertise_icon',       '🧭',
      'ui_mission_vision_value_expertise_title',      'KOMPETENZ',
      'ui_mission_vision_value_expertise_sub',        'Richtige Einordnung',

      'ui_mission_vision_value_support_icon',         '🤝',
      'ui_mission_vision_value_support_title',        'SUPPORT',
      'ui_mission_vision_value_support_sub',          'Während des Prozesses',

      -- Principles panel
      'ui_mission_vision_principles_kicker',          'Prinzipien',
      'ui_mission_vision_principles_title',           'Unsere Grundprinzipien',

      'ui_mission_vision_principle_1_title',          'Transparenz',
      'ui_mission_vision_principle_1_desc',           'Klare Informationen, klarer Prozess.',

      'ui_mission_vision_principle_2_title',          'Genauigkeit',
      'ui_mission_vision_principle_2_desc',           'Aktuelle und verifizierte Daten.',

      'ui_mission_vision_principle_3_title',          'Schnelle Kommunikation',
      'ui_mission_vision_principle_3_desc',           'Rasche Rückmeldung.',

      'ui_mission_vision_principle_4_title',          'Kundenorientierung',
      'ui_mission_vision_principle_4_desc',           'Lösung passend zum Bedarf.',

      -- Sidebar contact card labels
      'ui_mission_vision_info_title',                 'Kontaktinformationen',
      'ui_mission_vision_info_desc',                  'Kontaktieren Sie uns schnell für Projekte, Angebote oder technische Beratung.',
      'ui_mission_vision_cta_phone',                  'Telefon',
      'ui_mission_vision_cta_whatsapp',               'WhatsApp',
      'ui_mission_vision_cta_form',                   'Kontaktformular'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- ui_mission (TR/EN/DE) - minimum keys used as fallbacks in component
-- =============================================================
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
VALUES
(
  UUID(),
  'ui_mission',
  'tr',
  CAST(
    JSON_OBJECT(
      'ui_mission_fallback_title', 'Misyonumuz',
      'ui_mission_empty_text',     'Misyon içeriği yakında burada yayınlanacaktır.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_mission',
  'en',
  CAST(
    JSON_OBJECT(
      'ui_mission_fallback_title', 'Our Mission',
      'ui_mission_empty_text',     'Mission content will be published here soon.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_mission',
  'de',
  CAST(
    JSON_OBJECT(
      'ui_mission_fallback_title', 'Unsere Mission',
      'ui_mission_empty_text',     'Der Mission-Inhalt wird hier in Kürze veröffentlicht.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- ui_vision (TR/EN/DE) - minimum keys used as fallbacks in component
-- =============================================================
INSERT INTO site_settings (id, `key`, locale, `value`, created_at, updated_at)
VALUES
(
  UUID(),
  'ui_vision',
  'tr',
  CAST(
    JSON_OBJECT(
      'ui_vision_fallback_title',  'Vizyonumuz',
      'ui_vision_empty_text',      'Vizyon içeriği yakında burada yayınlanacaktır.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_vision',
  'en',
  CAST(
    JSON_OBJECT(
      'ui_vision_fallback_title',  'Our Vision',
      'ui_vision_empty_text',      'Vision content will be published here soon.'
    )
    AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'ui_vision',
  'de',
  CAST(
    JSON_OBJECT(
      'ui_vision_fallback_title',  'Unsere Vision',
      'ui_vision_empty_text',      'Der Vision-Inhalt wird hier in Kürze veröffentlicht.'
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

-- =============================================================
-- 181_newsletter_subscribers_seed.sql
-- Newsletter subscribers seed (Demo: TR + EN + DE)
-- Idempotent: requires UNIQUE(email) (or equivalent)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

INSERT INTO `newsletter_subscribers`
(`id`, `email`, `is_verified`, `locale`, `meta`, `unsubscribed_at`, `created_at`, `updated_at`)
VALUES

-- 1) Active, verified TR subscriber (demo)
(
  UUID(),
  'demo.tr.user@example.com',
  1,
  'tr',
  JSON_OBJECT(
    'source', 'seed',
    'tags', JSON_ARRAY('campaign', 'welcome'),
    'note', 'Örnek: TR abonesi (doğrulanmış)'
  ),
  NULL,
  '2025-01-05 10:00:00.000',
  '2025-01-05 10:00:00.000'
),

-- 2) Active, not verified EN subscriber (demo)
(
  UUID(),
  'demo.en.user@example.com',
  0,
  'en',
  JSON_OBJECT(
    'source', 'seed',
    'tags', JSON_ARRAY('newsletter'),
    'note', 'Verification pending'
  ),
  NULL,
  '2025-01-06 11:30:00.000',
  '2025-01-06 11:30:00.000'
),

-- 3) Former DE subscriber (unsubscribed)
(
  UUID(),
  'demo.de.user@example.com',
  1,
  'de',
  JSON_OBJECT(
    'source', 'seed',
    'tags', JSON_ARRAY('unsubscribed'),
    'note', 'Nutzer hat das Newsletter-Abonnement gekündigt'
  ),
  '2025-01-10 15:45:00.000',
  '2025-01-03 09:00:00.000',
  '2025-01-10 15:45:00.000'
)

ON DUPLICATE KEY UPDATE
  `is_verified`     = VALUES(`is_verified`),
  `locale`          = VALUES(`locale`),
  `meta`            = VALUES(`meta`),
  `unsubscribed_at` = VALUES(`unsubscribed_at`),
  `updated_at`      = CURRENT_TIMESTAMP(3);

COMMIT;

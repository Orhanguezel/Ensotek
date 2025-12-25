-- =============================================================
-- 030.1_audit_seed.sql
-- Seed:
--   - audit_request_logs
--   - audit_auth_events
--   - audit_events
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------------------------
-- audit_request_logs
-- -------------------------------------------------------------
INSERT INTO `audit_request_logs` (
  `req_id`,
  `method`,
  `url`,
  `path`,
  `status_code`,
  `response_time_ms`,
  `ip`,
  `user_agent`,
  `referer`,
  `user_id`,
  `is_admin`,
  `country`,
  `city`,
  `created_at`
) VALUES
(
  'req-1uz',
  'GET',
  '/api/profiles/me',
  '/api/profiles/me',
  200,
  2,
  '127.0.0.1',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/142.0.0.0 Safari/537.36',
  NULL,
  'user-0001',
  1,
  'DE',
  'Grevenbroich',
  '2025-12-24 16:05:00.123'
),
(
  'req-1v1',
  'GET',
  '/api/admin/site-settings/list?locale=tr',
  '/api/admin/site-settings/list',
  200,
  5,
  '127.0.0.1',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/142.0.0.0 Safari/537.36',
  'http://localhost:3000/admin/site-settings',
  'user-0001',
  1,
  'DE',
  'Grevenbroich',
  '2025-12-24 16:05:01.994'
),
(
  'req-1uy',
  'OPTIONS',
  '/api/admin/site-settings/list?locale=tr',
  '/api/admin/site-settings/list',
  204,
  1,
  '127.0.0.1',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/142.0.0.0 Safari/537.36',
  NULL,
  'user-0001',
  1,
  'DE',
  'Grevenbroich',
  '2025-12-24 16:05:01.986'
);

-- -------------------------------------------------------------
-- audit_auth_events
-- -------------------------------------------------------------
INSERT INTO `audit_auth_events` (
  `event`,
  `user_id`,
  `email`,
  `ip`,
  `user_agent`,
  `country`,
  `city`,
  `created_at`
) VALUES
(
  'login_success',
  'user-0001',
  'admin@example.com',
  '127.0.0.1',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/142.0.0.0 Safari/537.36',
  'DE',
  'Grevenbroich',
  '2025-12-24 15:58:10.000'
),
(
  'login_failed',
  NULL,
  'admin@example.com',
  '141.136.36.40',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  'TR',
  'Istanbul',
  '2025-12-24 15:59:22.500'
),
(
  'logout',
  'user-0001',
  'admin@example.com',
  '127.0.0.1',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/142.0.0.0 Safari/537.36',
  'DE',
  'Grevenbroich',
  '2025-12-24 16:10:00.000'
);

-- -------------------------------------------------------------
-- audit_events (domain/system events)
-- -------------------------------------------------------------
INSERT INTO `audit_events` (
  `ts`,
  `level`,
  `topic`,
  `message`,
  `actor_user_id`,
  `ip`,
  `entity_type`,
  `entity_id`,
  `meta_json`
) VALUES
(
  '2025-12-24 15:58:10.010',
  'info',
  'auth.login_success',
  'login_success',
  'user-0001',
  '127.0.0.1',
  'user',
  'user-0001',
  '{"email":"admin@example.com"}'
),
(
  '2025-12-24 15:59:22.510',
  'warn',
  'auth.login_failed',
  'login_failed',
  NULL,
  '141.136.36.40',
  NULL,
  NULL,
  '{"email":"admin@example.com"}'
),
(
  '2025-12-24 16:05:02.100',
  'info',
  'audit.request',
  'request_logged',
  'user-0001',
  '127.0.0.1',
  'request',
  'req-1v1',
  '{"path":"/api/admin/site-settings/list","status_code":200}'
),
(
  '2025-12-24 16:06:10.000',
  'error',
  'mail.failed',
  'smtp_send_failed',
  'user-0001',
  '127.0.0.1',
  'mail',
  NULL,
  '{"err":"ECONNREFUSED","provider":"smtp"}'
);

SET FOREIGN_KEY_CHECKS = 1;

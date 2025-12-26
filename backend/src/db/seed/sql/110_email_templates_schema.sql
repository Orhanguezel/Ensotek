-- ============================================================
-- 110_email_templates_schema.sql + 111_email_templates_seed.sql
-- EMAIL_TEMPLATES (i18n) + SEED (tr/en/de)
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

-- ============================================================
-- 1) SCHEMA
-- ============================================================

CREATE TABLE IF NOT EXISTS `email_templates` (
  `id`           CHAR(36)     NOT NULL,
  `template_key` VARCHAR(100) NOT NULL,

  `variables` LONGTEXT
    CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
    DEFAULT NULL,
  CONSTRAINT `ck_email_templates_variables_json`
    CHECK (`variables` IS NULL OR JSON_VALID(`variables`)),

  `is_active`  TINYINT(1)  NOT NULL DEFAULT 1,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
               ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_email_tpl_key` (`template_key`),
  KEY `ix_email_tpl_active` (`is_active`),
  KEY `ix_email_tpl_updated_at` (`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `email_templates_i18n` (
  `id`            CHAR(36)     NOT NULL,
  `template_id`   CHAR(36)     NOT NULL,
  `locale`        VARCHAR(10)  NOT NULL,
  `template_name` VARCHAR(150) NOT NULL,
  `subject`       VARCHAR(255) NOT NULL,
  `content`       LONGTEXT     NOT NULL,

  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
               ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_email_tpl_key_locale` (`template_id`, `locale`),
  KEY `ix_email_tpl_i18n_locale` (`locale`),
  KEY `ix_email_tpl_i18n_name` (`template_name`),

  CONSTRAINT `fk_email_tpl_i18n_template`
    FOREIGN KEY (`template_id`) REFERENCES `email_templates` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 2) SEED: PARENT (email_templates)
-- ============================================================

INSERT INTO `email_templates`
(`id`, `template_key`, `variables`, `is_active`, `created_at`, `updated_at`)
VALUES
('4290e3d9-d5b8-4423-aab2-1cbc85bee59b',
 'ticket_replied',
 JSON_ARRAY('user_name','ticket_id','ticket_subject','reply_message','site_name'),
 1, '2025-10-09 19:38:58.000', '2025-10-13 20:28:47.000'),

('da91f94a-bfe1-46b7-83fc-b4152e27c65e',
 'password_reset',
 JSON_ARRAY('reset_link','site_name'),
 1, '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

('c0bb0c00-1a2b-4c5d-9e8f-001122334455',
 'password_changed',
 JSON_ARRAY('user_name','site_name'),
 1, '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

('11112222-3333-4444-5555-666677778888',
 'contact_admin_notification',
 JSON_ARRAY('name','email','phone','subject','message','ip','user_agent'),
 1, '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

('99990000-aaaa-bbbb-cccc-ddddeeee0000',
 'contact_user_autoreply',
 JSON_ARRAY('name','subject'),
 1, '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

('e7fae474-c1cf-4600-8466-2f915146cfb9',
 'welcome',
 JSON_ARRAY('user_name','user_email','site_name'),
 1, '2025-10-09 19:38:58.000', '2025-10-13 15:06:38.000'),

('1111aaaa-2222-3333-4444-555566667777',
 'offer_sent_customer',
 JSON_ARRAY(
   'customer_name',
   'company_name',
   'offer_no',
   'email',
   'phone',
   'currency',
   'net_total',
   'vat_total',
   'gross_total',
   'valid_until',
   'pdf_url'
 ),
 1, '2025-10-10 10:00:00.000', '2025-10-10 10:00:00.000'),

('2222bbbb-2222-3333-4444-555566667777',
 'offer_sent_admin',
 JSON_ARRAY(
   'customer_name',
   'company_name',
   'offer_no',
   'email',
   'phone',
   'currency',
   'net_total',
   'vat_total',
   'gross_total',
   'valid_until',
   'pdf_url'
 ),
 1, '2025-10-10 10:00:00.000', '2025-10-10 10:00:00.000'),

('3333cccc-2222-3333-4444-555566667777',
 'offer_request_received_admin',
 JSON_ARRAY(
   'customer_name',
   'company_name',
   'email',
   'phone',
   'offer_id',
   'message'
 ),
 1, '2025-10-10 10:00:00.000', '2025-10-10 10:00:00.000'),

('4444dddd-2222-3333-4444-555566667777',
 'catalog_request_received_admin',
 JSON_ARRAY(
   'site_title',
   'site_name',
   'customer_name',
   'company_name',
   'email',
   'phone',
   'message',
   'locale',
   'country_code',
   'catalog_url',
   'catalog_request_id'
 ),
 1, '2025-12-14 00:00:00.000', '2025-12-14 00:00:00.000'),

('5555eeee-2222-3333-4444-555566667777',
 'catalog_sent_customer',
 JSON_ARRAY(
   'site_title',
   'site_name',
   'customer_name',
   'company_name',
   'email',
   'phone',
   'catalog_url',
   'catalog_filename'
 ),
 1, '2025-12-14 00:00:00.000', '2025-12-14 00:00:00.000')
ON DUPLICATE KEY UPDATE
  `variables`  = VALUES(`variables`),
  `is_active`  = VALUES(`is_active`),
  `updated_at` = VALUES(`updated_at`);


-- ============================================================
-- 3) SEED: I18N (email_templates_i18n) TR + EN + DE (FULL)
-- ============================================================

INSERT INTO `email_templates_i18n`
(`id`, `template_id`, `locale`, `template_name`, `subject`, `content`, `created_at`, `updated_at`)
VALUES

-- ===================== ticket_replied =====================

-- TR
('7290e3d9-d5b8-4423-aab2-1cbc85bee59b',
 '4290e3d9-d5b8-4423-aab2-1cbc85bee59b',
 'tr',
 'Ticket Yanıtlandı',
 'Destek Talebiniz Yanıtlandı - {{site_name}}',
 '<h1 class="ql-align-center">Destek Talebiniz Yanıtlandı</h1><p>Merhaba <strong>{{user_name}}</strong>,</p><p>Destek talebiniz yanıtlandı.</p><p><br></p><p>Detayları görüntülemek için kullanıcı paneline giriş yapabilirsiniz.</p><p>Saygılarımızla,</p><p>{{site_name}} Ekibi</p>',
 '2025-10-09 19:38:58.000', '2025-10-13 20:28:47.000'),

-- EN
('8290e3d9-d5b8-4423-aab2-1cbc85bee59b',
 '4290e3d9-d5b8-4423-aab2-1cbc85bee59b',
 'en',
 'Ticket Replied',
 'Your Support Ticket Has Been Answered - {{site_name}}',
 '<h1 class="ql-align-center">Your Support Ticket Has Been Answered</h1><p>Hello <strong>{{user_name}}</strong>,</p><p>Your support ticket has been answered.</p><p><br></p><p>You can log in to your account to view the full details.</p><p>Best regards,</p><p>{{site_name}} Team</p>',
 '2025-10-09 19:38:58.000', '2025-10-13 20:28:47.000'),

-- DE
('9290e3d9-d5b8-4423-aab2-1cbc85bee59b',
 '4290e3d9-d5b8-4423-aab2-1cbc85bee59b',
 'de',
 'Ticket beantwortet',
 'Ihre Support-Anfrage wurde beantwortet - {{site_name}}',
 '<h1 style="text-align:center;">Ihre Support-Anfrage wurde beantwortet</h1><p>Hallo <strong>{{user_name}}</strong>,</p><p>Ihre Support-Anfrage wurde beantwortet.</p><p><br></p><p>Bitte melden Sie sich in Ihrem Konto an, um die vollständigen Details zu sehen.</p><p>Mit freundlichen Grüßen,</p><p>{{site_name}} Team</p>',
 '2025-10-09 19:38:58.000', '2025-10-13 20:28:47.000'),


-- ===================== password_reset =====================

-- TR
('fa91f94a-bfe1-46b7-83fc-b4152e27c65e',
 'da91f94a-bfe1-46b7-83fc-b4152e27c65e',
 'tr',
 'Şifre Sıfırlama',
 'Şifre Sıfırlama Talebi - {{site_name}}',
 '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #333; text-align: center;">Şifre Sıfırlama</h1>
    <p style="color: #666; font-size: 16px;">Merhaba,</p>
    <p style="color: #666; font-size: 16px;">Hesabınız için şifre sıfırlama talebi aldık.</p>
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
      <a href="{{reset_link}}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Şifremi Sıfırla</a>
    </div>
    <p style="color: #666; font-size: 14px;">Bu linkin geçerlilik süresi 1 saattir.</p>
    <p style="color: #666; font-size: 14px;">Bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
    <p style="color: #666; font-size: 16px;">Saygılarımızla,<br>{{site_name}} Ekibi</p>
  </div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- EN
('ea91f94a-bfe1-46b7-83fc-b4152e27c65e',
 'da91f94a-bfe1-46b7-83fc-b4152e27c65e',
 'en',
 'Password Reset',
 'Password Reset Request - {{site_name}}',
 '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #333; text-align: center;">Password Reset</h1>
    <p style="color: #666; font-size: 16px;">Hello,</p>
    <p style="color: #666; font-size: 16px;">We received a password reset request for your account.</p>
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
      <a href="{{reset_link}}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset My Password</a>
    </div>
    <p style="color: #666; font-size: 14px;">This link is valid for 1 hour.</p>
    <p style="color: #666; font-size: 14px;">If you did not request this, you can safely ignore this email.</p>
    <p style="color: #666; font-size: 16px;">Best regards,<br>{{site_name}} Team</p>
  </div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- DE
('0a91f94a-bfe1-46b7-83fc-b4152e27c65e',
 'da91f94a-bfe1-46b7-83fc-b4152e27c65e',
 'de',
 'Passwort zurücksetzen',
 'Passwort zurücksetzen - {{site_name}}',
 '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #333; text-align: center;">Passwort zurücksetzen</h1>
    <p style="color: #666; font-size: 16px;">Hallo,</p>
    <p style="color: #666; font-size: 16px;">wir haben eine Anfrage zum Zurücksetzen Ihres Passworts erhalten.</p>
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
      <a href="{{reset_link}}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Passwort zurücksetzen</a>
    </div>
    <p style="color: #666; font-size: 14px;">Dieser Link ist 1 Stunde gültig.</p>
    <p style="color: #666; font-size: 14px;">Wenn Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren.</p>
    <p style="color: #666; font-size: 16px;">Mit freundlichen Grüßen,<br>{{site_name}} Team</p>
  </div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),


-- ===================== password_changed =====================

-- TR
('d0bb0c00-1a2b-4c5d-9e8f-554433221100',
 'c0bb0c00-1a2b-4c5d-9e8f-001122334455',
 'tr',
 'Şifre Güncellendi',
 'Şifreniz Güncellendi - {{site_name}}',
 '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="font-size:20px; text-align:center;">Şifreniz Güncellendi</h1>
    <p>Merhaba <strong>{{user_name}}</strong>,</p>
    <p>Hesap şifreniz başarıyla değiştirildi.</p>
    <p>Eğer bu işlemi siz yapmadıysanız lütfen en kısa sürede bizimle iletişime geçin.</p>
    <p>Saygılarımızla,</p>
    <p>{{site_name}} Ekibi</p>
</div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- EN
('e0bb0c00-1a2b-4c5d-9e8f-554433221100',
 'c0bb0c00-1a2b-4c5d-9e8f-001122334455',
 'en',
 'Password Changed',
 'Your Password Has Been Updated - {{site_name}}',
 '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="font-size:20px; text-align:center;">Your Password Has Been Updated</h1>
    <p>Hello <strong>{{user_name}}</strong>,</p>
    <p>Your account password has been successfully changed.</p>
    <p>If you did not perform this action, please contact us as soon as possible.</p>
    <p>Best regards,</p>
    <p>{{site_name}} Team</p>
</div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- DE
('f0bb0c00-1a2b-4c5d-9e8f-554433221100',
 'c0bb0c00-1a2b-4c5d-9e8f-001122334455',
 'de',
 'Passwort geändert',
 'Ihr Passwort wurde aktualisiert - {{site_name}}',
 '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="font-size:20px; text-align:center;">Ihr Passwort wurde aktualisiert</h1>
    <p>Hallo <strong>{{user_name}}</strong>,</p>
    <p>Ihr Kontopasswort wurde erfolgreich geändert.</p>
    <p>Wenn Sie diese Aktion nicht durchgeführt haben, kontaktieren Sie uns bitte so schnell wie möglich.</p>
    <p>Mit freundlichen Grüßen,</p>
    <p>{{site_name}} Team</p>
</div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),


-- ===================== contact_admin_notification =====================

-- TR
('21112222-3333-4444-5555-666677778888',
 '11112222-3333-4444-5555-666677778888',
 'tr',
 'İletişim Formu (Admin Bildirimi)',
 'Yeni İletişim Mesajı - {{subject}}',
 '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,''Segoe UI'',sans-serif;font-size:14px;line-height:1.5;color:#111827;">
  <h1 style="font-size:18px;margin-bottom:12px;">Yeni iletişim formu mesajı</h1>
  <p><strong>Ad Soyad:</strong> {{name}}</p>
  <p><strong>E-posta:</strong> {{email}}</p>
  <p><strong>Telefon:</strong> {{phone}}</p>
  <p><strong>Konu:</strong> {{subject}}</p>
  <p><strong>IP:</strong> {{ip}}</p>
  <p><strong>User-Agent:</strong> {{user_agent}}</p>
  <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb;" />
  <p><strong>Mesaj:</strong></p>
  <pre style="white-space:pre-wrap;word-break:break-word;background:#f9fafb;padding:12px;border-radius:8px;border:1px solid #e5e7eb;">{{message}}</pre>
</div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- EN
('31112222-3333-4444-5555-666677778888',
 '11112222-3333-4444-5555-666677778888',
 'en',
 'Contact Admin Notification',
 'New Contact Message - {{subject}}',
 '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,''Segoe UI'',sans-serif;font-size:14px;line-height:1.5;color:#111827;">
  <h1 style="font-size:18px;margin-bottom:12px;">New contact form message</h1>
  <p><strong>Name:</strong> {{name}}</p>
  <p><strong>Email:</strong> {{email}}</p>
  <p><strong>Phone:</strong> {{phone}}</p>
  <p><strong>Subject:</strong> {{subject}}</p>
  <p><strong>IP:</strong> {{ip}}</p>
  <p><strong>User-Agent:</strong> {{user_agent}}</p>
  <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb;" />
  <p><strong>Message:</strong></p>
  <pre style="white-space:pre-wrap;word-break:break-word;background:#f9fafb;padding:12px;border-radius:8px;border:1px solid #e5e7eb;">{{message}}</pre>
</div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- DE
('41112222-3333-4444-5555-666677778888',
 '11112222-3333-4444-5555-666677778888',
 'de',
 'Kontaktformular Admin-Benachrichtigung',
 'Neue Kontaktanfrage - {{subject}}',
 '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,''Segoe UI'',sans-serif;font-size:14px;line-height:1.5;color:#111827;">
  <h1 style="font-size:18px;margin-bottom:12px;">Neue Nachricht über das Kontaktformular</h1>
  <p><strong>Name:</strong> {{name}}</p>
  <p><strong>E-Mail:</strong> {{email}}</p>
  <p><strong>Telefon:</strong> {{phone}}</p>
  <p><strong>Betreff:</strong> {{subject}}</p>
  <p><strong>IP:</strong> {{ip}}</p>
  <p><strong>User-Agent:</strong> {{user_agent}}</p>
  <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb;" />
  <p><strong>Nachricht:</strong></p>
  <pre style="white-space:pre-wrap;word-break:break-word;background:#f9fafb;padding:12px;border-radius:8px;border:1px solid #e5e7eb;">{{message}}</pre>
</div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),


-- ===================== contact_user_autoreply =====================

-- TR
('99990000-bbbb-cccc-dddd-eeeeffff0000',
 '99990000-aaaa-bbbb-cccc-ddddeeee0000',
 'tr',
 'İletişim Otomatik Yanıt',
 'Mesajınızı Aldık - {{subject}}',
 '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,''Segoe UI'',sans-serif;font-size:14px;line-height:1.5;color:#111827;">
  <h1 style="font-size:18px;margin-bottom:12px;">Mesajınızı Aldık</h1>
  <p>Merhaba <strong>{{name}}</strong>,</p>
  <p>İletişim formu üzerinden göndermiş olduğunuz mesaj bize ulaştı.</p>
  <p>En kısa süre içinde size dönüş yapacağız.</p>
  <p>İyi günler dileriz.</p>
</div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- EN
('99990000-cccc-dddd-eeee-ffff11110000',
 '99990000-aaaa-bbbb-cccc-ddddeeee0000',
 'en',
 'Contact User Autoreply',
 'We''ve Received Your Message - {{subject}}',
 '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,''Segoe UI'',sans-serif;font-size:14px;line-height:1.5;color:#111827;">
  <h1 style="font-size:18px;margin-bottom:12px;">We''ve received your message</h1>
  <p>Hello <strong>{{name}}</strong>,</p>
  <p>Your message sent via our contact form has reached us.</p>
  <p>We will get back to you as soon as possible.</p>
  <p>Have a nice day.</p>
</div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- DE
('99990000-dddd-eeee-ffff-222233330000',
 '99990000-aaaa-bbbb-cccc-ddddeeee0000',
 'de',
 'Kontakt Auto-Antwort',
 'Wir haben Ihre Nachricht erhalten - {{subject}}',
 '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,''Segoe UI'',sans-serif;font-size:14px;line-height:1.5;color:#111827;">
  <h1 style="font-size:18px;margin-bottom:12px;">Wir haben Ihre Nachricht erhalten</h1>
  <p>Hallo <strong>{{name}}</strong>,</p>
  <p>Ihre Nachricht über unser Kontaktformular ist bei uns eingegangen.</p>
  <p>Wir melden uns so schnell wie möglich bei Ihnen.</p>
  <p>Freundliche Grüße</p>
</div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),


-- ===================== welcome =====================

-- TR
('f7fae474-c1cf-4600-8466-2f915146cfb9',
 'e7fae474-c1cf-4600-8466-2f915146cfb9',
 'tr',
 'Hoş Geldiniz',
 'Hesabınız Oluşturuldu - {{site_name}}',
 '<h1 class="ql-align-center">Hesabınız Oluşturuldu</h1><p>Merhaba <strong>{{user_name}}</strong>,</p><p>{{site_name}} ailesine hoş geldiniz! Hesabınız başarıyla oluşturuldu.</p><p><br></p><p>E-posta: <strong>{{user_email}}</strong></p><p>Herhangi bir sorunuz olursa bizimle iletişime geçmekten çekinmeyin.</p><p>Saygılarımızla,</p><p>{{site_name}} Ekibi</p>',
 '2025-10-09 19:38:58.000', '2025-10-13 15:06:38.000'),

-- EN
('07fae474-c1cf-4600-8466-2f915146cfb9',
 'e7fae474-c1cf-4600-8466-2f915146cfb9',
 'en',
 'Welcome',
 'Your Account Has Been Created - {{site_name}}',
 '<h1 class="ql-align-center">Your Account Has Been Created</h1><p>Hello <strong>{{user_name}}</strong>,</p><p>Welcome to {{site_name}}! Your account has been successfully created.</p><p><br></p><p>Email: <strong>{{user_email}}</strong></p><p>If you have any questions, feel free to contact us anytime.</p><p>Best regards,</p><p>{{site_name}} Team</p>',
 '2025-10-09 19:38:58.000', '2025-10-13 15:06:38.000'),

-- DE
('17fae474-c1cf-4600-8466-2f915146cfb9',
 'e7fae474-c1cf-4600-8466-2f915146cfb9',
 'de',
 'Willkommen',
 'Ihr Konto wurde erstellt - {{site_name}}',
 '<h1 style="text-align:center;">Ihr Konto wurde erstellt</h1><p>Hallo <strong>{{user_name}}</strong>,</p><p>Willkommen bei {{site_name}}! Ihr Konto wurde erfolgreich erstellt.</p><p><br></p><p>E-Mail: <strong>{{user_email}}</strong></p><p>Wenn Sie Fragen haben, kontaktieren Sie uns jederzeit.</p><p>Mit freundlichen Grüßen,</p><p>{{site_name}} Team</p>',
 '2025-10-09 19:38:58.000', '2025-10-13 15:06:38.000'),


-- ===================== offer_sent_customer =====================

-- TR
('1111aaaa-2222-3333-4444-aaaabbbb0001',
 '1111aaaa-2222-3333-4444-555566667777',
 'tr',
 'Teklif Gönderildi (Müşteri)',
 'Teklifiniz Hazır - Teklif No: {{offer_no}}',
 '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,''Segoe UI'',sans-serif;font-size:14px;line-height:1.5;color:#111827;max-width:640px;margin:0 auto;">
  <h1 style="font-size:20px;margin-bottom:12px;">Teklifiniz Hazır</h1>
  <p>Merhaba <strong>{{customer_name}}</strong>,</p>
  <p>Talebiniz doğrultusunda hazırladığımız teklif bilgilerini aşağıda bulabilirsiniz.</p>
  <ul style="padding-left:18px;margin:12px 0;">
    <li><strong>Teklif No:</strong> {{offer_no}}</li>
    <li><strong>Müşteri:</strong> {{customer_name}} ({{company_name}})</li>
    <li><strong>E-posta:</strong> {{email}}</li>
    <li><strong>Telefon:</strong> {{phone}}</li>
    <li><strong>Para Birimi:</strong> {{currency}}</li>
    <li><strong>Ara Toplam (Net):</strong> {{net_total}}</li>
    <li><strong>KDV:</strong> {{vat_total}}</li>
    <li><strong>Genel Toplam (Brüt):</strong> {{gross_total}}</li>
    <li><strong>Geçerlilik Tarihi:</strong> {{valid_until}}</li>
  </ul>
  <p>Teklif detaylarını PDF olarak görüntülemek için aşağıdaki bağlantıyı kullanabilirsiniz:</p>
  <p><a href="{{pdf_url}}" style="display:inline-block;padding:10px 18px;border-radius:6px;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;">PDF Teklifi Görüntüle</a></p>
  <p style="margin-top:20px;">Herhangi bir sorunuz olması durumunda bu e-postayı yanıtlayarak veya telefonla bizimle iletişime geçebilirsiniz.</p>
  <p>Saygılarımızla,<br>Satış Ekibi</p>
</div>',
 '2025-10-10 10:00:00.000', '2025-10-10 10:00:00.000'),

-- EN
('1111aaaa-2222-3333-4444-aaaabbbb0002',
 '1111aaaa-2222-3333-4444-555566667777',
 'en',
 'Offer Sent (Customer)',
 'Your Quotation is Ready - Offer No: {{offer_no}}',
 '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,''Segoe UI'',sans-serif;font-size:14px;line-height:1.5;color:#111827;max-width:640px;margin:0 auto;">
  <h1 style="font-size:20px;margin-bottom:12px;">Your Quotation is Ready</h1>
  <p>Hello <strong>{{customer_name}}</strong>,</p>
  <p>We have prepared your quotation based on your request. You can find the summary below.</p>
  <ul style="padding-left:18px;margin:12px 0;">
    <li><strong>Offer No:</strong> {{offer_no}}</li>
    <li><strong>Customer:</strong> {{customer_name}} ({{company_name}})</li>
    <li><strong>Email:</strong> {{email}}</li>
    <li><strong>Phone:</strong> {{phone}}</li>
    <li><strong>Currency:</strong> {{currency}}</li>
    <li><strong>Net Total:</strong> {{net_total}}</li>
    <li><strong>VAT:</strong> {{vat_total}}</li>
    <li><strong>Gross Total:</strong> {{gross_total}}</li>
    <li><strong>Valid Until:</strong> {{valid_until}}</li>
  </ul>
  <p>You can view the full quotation as a PDF using the link below:</p>
  <p><a href="{{pdf_url}}" style="display:inline-block;padding:10px 18px;border-radius:6px;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;">View PDF Quotation</a></p>
  <p style="margin-top:20px;">If you have any questions, simply reply to this email or call us.</p>
  <p>Best regards,<br>Sales Team</p>
</div>',
 '2025-10-10 10:00:00.000', '2025-10-10 10:00:00.000'),

-- DE
('1111aaaa-2222-3333-4444-aaaabbbb0003',
 '1111aaaa-2222-3333-4444-555566667777',
 'de',
 'Angebot versendet (Kunde)',
 'Ihr Angebot ist bereit - Angebotsnr.: {{offer_no}}',
 '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,''Segoe UI'',sans-serif;font-size:14px;line-height:1.5;color:#111827;max-width:640px;margin:0 auto;">
  <h1 style="font-size:20px;margin-bottom:12px;">Ihr Angebot ist bereit</h1>
  <p>Hallo <strong>{{customer_name}}</strong>,</p>
  <p>wir haben Ihr Angebot basierend auf Ihrer Anfrage erstellt. Eine Zusammenfassung finden Sie unten.</p>
  <ul style="padding-left:18px;margin:12px 0;">
    <li><strong>Angebotsnr.:</strong> {{offer_no}}</li>
    <li><strong>Kunde:</strong> {{customer_name}} ({{company_name}})</li>
    <li><strong>E-Mail:</strong> {{email}}</li>
    <li><strong>Telefon:</strong> {{phone}}</li>
    <li><strong>Währung:</strong> {{currency}}</li>
    <li><strong>Netto Zwischensumme:</strong> {{net_total}}</li>
    <li><strong>MwSt.:</strong> {{vat_total}}</li>
    <li><strong>Brutto Gesamt:</strong> {{gross_total}}</li>
    <li><strong>Gültig bis:</strong> {{valid_until}}</li>
  </ul>
  <p>Das vollständige Angebot als PDF finden Sie unter folgendem Link:</p>
  <p><a href="{{pdf_url}}" style="display:inline-block;padding:10px 18px;border-radius:6px;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;">PDF-Angebot anzeigen</a></p>
  <p style="margin-top:20px;">Bei Fragen antworten Sie einfach auf diese E-Mail oder rufen Sie uns an.</p>
  <p>Mit freundlichen Grüßen,<br/>Sales Team</p>
</div>',
 '2025-10-10 10:00:00.000', '2025-10-10 10:00:00.000'),

-- ===================== offer_sent_admin =====================

-- TR
('2222bbbb-2222-3333-4444-aaaabbbb0001',
 '2222bbbb-2222-3333-4444-555566667777',
 'tr',
 'Teklif Gönderildi (Admin)',
 'Yeni Teklif Gönderildi - Teklif No: {{offer_no}}',
 '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,''Segoe UI'',sans-serif;font-size:14px;line-height:1.5;color:#111827;max-width:640px;margin:0 auto;">
  <h1 style="font-size:20px;margin-bottom:12px;">Yeni Teklif Gönderildi</h1>
  <p>Bir teklif müşteriye gönderildi. Özet:</p>
  <ul style="padding-left:18px;margin:12px 0;">
    <li><strong>Teklif No:</strong> {{offer_no}}</li>
    <li><strong>Müşteri:</strong> {{customer_name}} ({{company_name}})</li>
    <li><strong>E-posta:</strong> {{email}}</li>
    <li><strong>Telefon:</strong> {{phone}}</li>
    <li><strong>Para Birimi:</strong> {{currency}}</li>
    <li><strong>Ara Toplam (Net):</strong> {{net_total}}</li>
    <li><strong>KDV:</strong> {{vat_total}}</li>
    <li><strong>Genel Toplam (Brüt):</strong> {{gross_total}}</li>
    <li><strong>Geçerlilik Tarihi:</strong> {{valid_until}}</li>
  </ul>
  <p>PDF:</p>
  <p><a href="{{pdf_url}}" style="display:inline-block;padding:10px 18px;border-radius:6px;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;">PDF Teklifi Görüntüle</a></p>
</div>',
 '2025-10-10 10:00:00.000', '2025-10-10 10:00:00.000'),

-- EN
('2222bbbb-2222-3333-4444-aaaabbbb0002',
 '2222bbbb-2222-3333-4444-555566667777',
 'en',
 'Offer Sent (Admin)',
 'Quotation Sent - Offer No: {{offer_no}}',
 '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,''Segoe UI'',sans-serif;font-size:14px;line-height:1.5;color:#111827;max-width:640px;margin:0 auto;">
  <h1 style="font-size:20px;margin-bottom:12px;">Quotation Sent</h1>
  <p>A quotation has been sent to the customer. Summary:</p>
  <ul style="padding-left:18px;margin:12px 0;">
    <li><strong>Offer No:</strong> {{offer_no}}</li>
    <li><strong>Customer:</strong> {{customer_name}} ({{company_name}})</li>
    <li><strong>Email:</strong> {{email}}</li>
    <li><strong>Phone:</strong> {{phone}}</li>
    <li><strong>Currency:</strong> {{currency}}</li>
    <li><strong>Net Total:</strong> {{net_total}}</li>
    <li><strong>VAT:</strong> {{vat_total}}</li>
    <li><strong>Gross Total:</strong> {{gross_total}}</li>
    <li><strong>Valid Until:</strong> {{valid_until}}</li>
  </ul>
  <p>PDF:</p>
  <p><a href="{{pdf_url}}" style="display:inline-block;padding:10px 18px;border-radius:6px;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;">View PDF Quotation</a></p>
</div>',
 '2025-10-10 10:00:00.000', '2025-10-10 10:00:00.000'),

-- DE
('2222bbbb-2222-3333-4444-aaaabbbb0003',
 '2222bbbb-2222-3333-4444-555566667777',
 'de',
 'Angebot versendet (Admin)',
 'Angebot versendet - Angebotsnr.: {{offer_no}}',
 '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,''Segoe UI'',sans-serif;font-size:14px;line-height:1.5;color:#111827;max-width:640px;margin:0 auto;">
  <h1 style="font-size:20px;margin-bottom:12px;">Angebot versendet</h1>
  <p>Ein Angebot wurde an den Kunden versendet. Zusammenfassung:</p>
  <ul style="padding-left:18px;margin:12px 0;">
    <li><strong>Angebotsnr.:</strong> {{offer_no}}</li>
    <li><strong>Kunde:</strong> {{customer_name}} ({{company_name}})</li>
    <li><strong>E-Mail:</strong> {{email}}</li>
    <li><strong>Telefon:</strong> {{phone}}</li>
    <li><strong>Währung:</strong> {{currency}}</li>
    <li><strong>Netto:</strong> {{net_total}}</li>
    <li><strong>MwSt.:</strong> {{vat_total}}</li>
    <li><strong>Brutto:</strong> {{gross_total}}</li>
    <li><strong>Gültig bis:</strong> {{valid_until}}</li>
  </ul>
  <p>PDF:</p>
  <p><a href="{{pdf_url}}" style="display:inline-block;padding:10px 18px;border-radius:6px;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;">PDF-Angebot anzeigen</a></p>
</div>',
 '2025-10-10 10:00:00.000', '2025-10-10 10:00:00.000'),

-- ===================== offer_request_received_admin =====================

-- TR
('3333cccc-2222-3333-4444-aaaabbbb0001',
 '3333cccc-2222-3333-4444-555566667777',
 'tr',
 'Teklif Talebi (Admin)',
 'Yeni Teklif Talebi Alındı',
 '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,''Segoe UI'',sans-serif;font-size:14px;line-height:1.5;color:#111827;max-width:640px;margin:0 auto;">
  <h1 style="font-size:20px;margin-bottom:12px;">Yeni Teklif Talebi</h1>
  <p>Yeni bir teklif talebi alındı.</p>
  <ul style="padding-left:18px;margin:12px 0;">
    <li><strong>Müşteri:</strong> {{customer_name}} ({{company_name}})</li>
    <li><strong>E-posta:</strong> {{email}}</li>
    <li><strong>Telefon:</strong> {{phone}}</li>
    <li><strong>Teklif ID:</strong> {{offer_id}}</li>
  </ul>
  <p><strong>Mesaj:</strong></p>
  <pre style="white-space:pre-wrap;word-break:break-word;background:#f9fafb;padding:12px;border-radius:8px;border:1px solid #e5e7eb;">{{message}}</pre>
</div>',
 '2025-10-10 10:00:00.000', '2025-10-10 10:00:00.000'),

-- EN
('3333cccc-2222-3333-4444-aaaabbbb0002',
 '3333cccc-2222-3333-4444-555566667777',
 'en',
 'Offer Request (Admin)',
 'New Offer Request Received',
 '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,''Segoe UI'',sans-serif;font-size:14px;line-height:1.5;color:#111827;max-width:640px;margin:0 auto;">
  <h1 style="font-size:20px;margin-bottom:12px;">New Offer Request</h1>
  <p>A new offer request has been received.</p>
  <ul style="padding-left:18px;margin:12px 0;">
    <li><strong>Customer:</strong> {{customer_name}} ({{company_name}})</li>
    <li><strong>Email:</strong> {{email}}</li>
    <li><strong>Phone:</strong> {{phone}}</li>
    <li><strong>Offer ID:</strong> {{offer_id}}</li>
  </ul>
  <p><strong>Message:</strong></p>
  <pre style="white-space:pre-wrap;word-break:break-word;background:#f9fafb;padding:12px;border-radius:8px;border:1px solid #e5e7eb;">{{message}}</pre>
</div>',
 '2025-10-10 10:00:00.000', '2025-10-10 10:00:00.000'),

-- DE
('3333cccc-2222-3333-4444-aaaabbbb0003',
 '3333cccc-2222-3333-4444-555566667777',
 'de',
 'Angebotsanfrage (Admin)',
 'Neue Angebotsanfrage eingegangen',
 '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,''Segoe UI'',sans-serif;font-size:14px;line-height:1.5;color:#111827;max-width:640px;margin:0 auto;">
  <h1 style="font-size:20px;margin-bottom:12px;">Neue Angebotsanfrage</h1>
  <p>Es ist eine neue Angebotsanfrage eingegangen.</p>
  <ul style="padding-left:18px;margin:12px 0;">
    <li><strong>Kunde:</strong> {{customer_name}} ({{company_name}})</li>
    <li><strong>E-Mail:</strong> {{email}}</li>
    <li><strong>Telefon:</strong> {{phone}}</li>
    <li><strong>Anfrage/Offer-ID:</strong> {{offer_id}}</li>
  </ul>
  <p><strong>Nachricht:</strong></p>
  <pre style="white-space:pre-wrap;word-break:break-word;background:#f9fafb;padding:12px;border-radius:8px;border:1px solid #e5e7eb;">{{message}}</pre>
</div>',
 '2025-10-10 10:00:00.000', '2025-10-10 10:00:00.000'),

-- ===================== catalog_request_received_admin =====================

-- TR
('4444dddd-2222-3333-4444-aaaabbbb0001',
 '4444dddd-2222-3333-4444-555566667777',
 'tr',
 'Katalog Talebi (Admin)',
 'Yeni Katalog Talebi Alındı',
 '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,''Segoe UI'',sans-serif;font-size:14px;line-height:1.5;color:#111827;max-width:640px;margin:0 auto;">
  <h1 style="font-size:20px;margin-bottom:12px;">Yeni Katalog Talebi</h1>
  <p>{{site_title}} ({{site_name}}) üzerinden yeni bir katalog talebi alındı.</p>
  <ul style="padding-left:18px;margin:12px 0;">
    <li><strong>Müşteri:</strong> {{customer_name}} ({{company_name}})</li>
    <li><strong>E-posta:</strong> {{email}}</li>
    <li><strong>Telefon:</strong> {{phone}}</li>
    <li><strong>Locale:</strong> {{locale}}</li>
    <li><strong>Ülke Kodu:</strong> {{country_code}}</li>
    <li><strong>Katalog:</strong> <a href="{{catalog_url}}">{{catalog_url}}</a></li>
    <li><strong>Katalog Talep ID:</strong> {{catalog_request_id}}</li>
  </ul>
  <p><strong>Mesaj:</strong></p>
  <pre style="white-space:pre-wrap;word-break:break-word;background:#f9fafb;padding:12px;border-radius:8px;border:1px solid #e5e7eb;">{{message}}</pre>
</div>',
 '2025-12-14 00:00:00.000', '2025-12-14 00:00:00.000'),

-- EN
('4444dddd-2222-3333-4444-aaaabbbb0002',
 '4444dddd-2222-3333-4444-555566667777',
 'en',
 'Catalog Request (Admin)',
 'New Catalog Request Received',
 '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,''Segoe UI'',sans-serif;font-size:14px;line-height:1.5;color:#111827;max-width:640px;margin:0 auto;">
  <h1 style="font-size:20px;margin-bottom:12px;">New Catalog Request</h1>
  <p>A new catalog request has been received via {{site_title}} ({{site_name}}).</p>
  <ul style="padding-left:18px;margin:12px 0;">
    <li><strong>Customer:</strong> {{customer_name}} ({{company_name}})</li>
    <li><strong>Email:</strong> {{email}}</li>
    <li><strong>Phone:</strong> {{phone}}</li>
    <li><strong>Locale:</strong> {{locale}}</li>
    <li><strong>Country Code:</strong> {{country_code}}</li>
    <li><strong>Catalog:</strong> <a href="{{catalog_url}}">{{catalog_url}}</a></li>
    <li><strong>Catalog Request ID:</strong> {{catalog_request_id}}</li>
  </ul>
  <p><strong>Message:</strong></p>
  <pre style="white-space:pre-wrap;word-break:break-word;background:#f9fafb;padding:12px;border-radius:8px;border:1px solid #e5e7eb;">{{message}}</pre>
</div>',
 '2025-12-14 00:00:00.000', '2025-12-14 00:00:00.000'),

-- DE
('4444dddd-2222-3333-4444-aaaabbbb0003',
 '4444dddd-2222-3333-4444-555566667777',
 'de',
 'Kataloganfrage (Admin)',
 'Neue Kataloganfrage eingegangen',
 '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,''Segoe UI'',sans-serif;font-size:14px;line-height:1.5;color:#111827;max-width:640px;margin:0 auto;">
  <h1 style="font-size:20px;margin-bottom:12px;">Neue Kataloganfrage</h1>
  <p>Über {{site_title}} ({{site_name}}) ist eine neue Kataloganfrage eingegangen.</p>
  <ul style="padding-left:18px;margin:12px 0;">
    <li><strong>Kunde:</strong> {{customer_name}} ({{company_name}})</li>
    <li><strong>E-Mail:</strong> {{email}}</li>
    <li><strong>Telefon:</strong> {{phone}}</li>
    <li><strong>Sprache:</strong> {{locale}}</li>
    <li><strong>Ländercode:</strong> {{country_code}}</li>
    <li><strong>Katalog:</strong> <a href="{{catalog_url}}">{{catalog_url}}</a></li>
    <li><strong>Kataloganfrage-ID:</strong> {{catalog_request_id}}</li>
  </ul>
  <p><strong>Nachricht:</strong></p>
  <pre style="white-space:pre-wrap;word-break:break-word;background:#f9fafb;padding:12px;border-radius:8px;border:1px solid #e5e7eb;">{{message}}</pre>
</div>',
 '2025-12-14 00:00:00.000', '2025-12-14 00:00:00.000'),

-- ===================== catalog_sent_customer =====================

-- TR
('5555eeee-2222-3333-4444-aaaabbbb0001',
 '5555eeee-2222-3333-4444-555566667777',
 'tr',
 'Katalog Gönderildi (Müşteri)',
 'Kataloğunuz Hazır - {{site_name}}',
 '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,''Segoe UI'',sans-serif;font-size:14px;line-height:1.5;color:#111827;max-width:640px;margin:0 auto;">
  <h1 style="font-size:20px;margin-bottom:12px;">Kataloğunuz Hazır</h1>
  <p>Merhaba <strong>{{customer_name}}</strong>,</p>
  <p>{{site_title}} ({{site_name}}) için talep ettiğiniz katalog hazır.</p>
  <ul style="padding-left:18px;margin:12px 0;">
    <li><strong>Firma:</strong> {{company_name}}</li>
    <li><strong>E-posta:</strong> {{email}}</li>
    <li><strong>Telefon:</strong> {{phone}}</li>
    <li><strong>Dosya:</strong> {{catalog_filename}}</li>
  </ul>
  <p>Kataloğu indirmek/görüntülemek için:</p>
  <p><a href="{{catalog_url}}" style="display:inline-block;padding:10px 18px;border-radius:6px;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;">Kataloğu Görüntüle</a></p>
  <p style="margin-top:20px;">Saygılarımızla,<br>{{site_name}}</p>
</div>',
 '2025-12-14 00:00:00.000', '2025-12-14 00:00:00.000'),

-- EN
('5555eeee-2222-3333-4444-aaaabbbb0002',
 '5555eeee-2222-3333-4444-555566667777',
 'en',
 'Catalog Sent (Customer)',
 'Your Catalog Is Ready - {{site_name}}',
 '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,''Segoe UI'',sans-serif;font-size:14px;line-height:1.5;color:#111827;max-width:640px;margin:0 auto;">
  <h1 style="font-size:20px;margin-bottom:12px;">Your Catalog Is Ready</h1>
  <p>Hello <strong>{{customer_name}}</strong>,</p>
  <p>The catalog you requested for {{site_title}} ({{site_name}}) is ready.</p>
  <ul style="padding-left:18px;margin:12px 0;">
    <li><strong>Company:</strong> {{company_name}}</li>
    <li><strong>Email:</strong> {{email}}</li>
    <li><strong>Phone:</strong> {{phone}}</li>
    <li><strong>File:</strong> {{catalog_filename}}</li>
  </ul>
  <p>Use the link below to view/download the catalog:</p>
  <p><a href="{{catalog_url}}" style="display:inline-block;padding:10px 18px;border-radius:6px;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;">View Catalog</a></p>
  <p style="margin-top:20px;">Best regards,<br>{{site_name}}</p>
</div>',
 '2025-12-14 00:00:00.000', '2025-12-14 00:00:00.000'),

-- DE
('5555eeee-2222-3333-4444-aaaabbbb0003',
 '5555eeee-2222-3333-4444-555566667777',
 'de',
 'Katalog versendet (Kunde)',
 'Ihr Katalog ist bereit - {{site_name}}',
 '<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,''Segoe UI'',sans-serif;font-size:14px;line-height:1.5;color:#111827;max-width:640px;margin:0 auto;">
  <h1 style="font-size:20px;margin-bottom:12px;">Ihr Katalog ist bereit</h1>
  <p>Hallo <strong>{{customer_name}}</strong>,</p>
  <p>Der von Ihnen angeforderte Katalog für {{site_title}} ({{site_name}}) ist bereit.</p>
  <ul style="padding-left:18px;margin:12px 0;">
    <li><strong>Firma:</strong> {{company_name}}</li>
    <li><strong>E-Mail:</strong> {{email}}</li>
    <li><strong>Telefon:</strong> {{phone}}</li>
    <li><strong>Datei:</strong> {{catalog_filename}}</li>
  </ul>
  <p>Über den folgenden Link können Sie den Katalog anzeigen/herunterladen:</p>
  <p><a href="{{catalog_url}}" style="display:inline-block;padding:10px 18px;border-radius:6px;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;">Katalog anzeigen</a></p>
  <p style="margin-top:20px;">Mit freundlichen Grüßen,<br>{{site_name}}</p>
</div>',
 '2025-12-14 00:00:00.000', '2025-12-14 00:00:00.000')

ON DUPLICATE KEY UPDATE
  `template_name` = VALUES(`template_name`),
  `subject`       = VALUES(`subject`),
  `content`       = VALUES(`content`),
  `updated_at`    = VALUES(`updated_at`);

COMMIT;

-- 111_email_templates_seed.sql

-- EMAIL_TEMPLATES SEED (i18n'li)
SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ============================================================
-- 1) PARENT KAYITLAR (email_templates)
--    (locale'den bağımsız, sadece key + variables)
-- ============================================================

INSERT IGNORE INTO `email_templates`
(`id`, `template_key`, `variables`, `is_active`, `created_at`, `updated_at`)
VALUES
-- ticket_replied
('4290e3d9-d5b8-4423-aab2-1cbc85bee59b',
 'ticket_replied',
 JSON_ARRAY('user_name','ticket_id','ticket_subject','reply_message','site_name'),
 1, '2025-10-09 19:38:58.000', '2025-10-13 20:28:47.000'),

-- password_reset
('da91f94a-bfe1-46b7-83fc-b4152e27c65e',
 'password_reset',
 JSON_ARRAY('reset_link','site_name'),
 1, '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- password_changed
('c0bb0c00-1a2b-4c5d-9e8f-001122334455',
 'password_changed',
 JSON_ARRAY('user_name','site_name'),
 1, '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- contact_admin_notification
('11112222-3333-4444-5555-666677778888',
 'contact_admin_notification',
 JSON_ARRAY('name','email','phone','subject','message','ip','user_agent'),
 1, '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- contact_user_autoreply
('99990000-aaaa-bbbb-cccc-ddddeeee0000',
 'contact_user_autoreply',
 JSON_ARRAY('name','subject'),
 1, '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- welcome
('e7fae474-c1cf-4600-8466-2f915146cfb9',
 'welcome',
 JSON_ARRAY('user_name','user_email','site_name'),
 1, '2025-10-09 19:38:58.000', '2025-10-13 15:06:38.000')
ON DUPLICATE KEY UPDATE
  `variables`   = VALUES(`variables`),
  `is_active`   = VALUES(`is_active`),
  `updated_at`  = VALUES(`updated_at`);

-- ============================================================
-- 2) I18N KAYITLAR (email_templates_i18n)
--    Aynı template_id için birden fazla locale: tr + en
-- ============================================================

INSERT IGNORE INTO `email_templates_i18n`
(`id`, `template_id`, `locale`, `template_name`, `subject`, `content`, `created_at`, `updated_at`)
VALUES
-- ticket_replied (tr)
('7290e3d9-d5b8-4423-aab2-1cbc85bee59b',
 '4290e3d9-d5b8-4423-aab2-1cbc85bee59b',
 'tr',
 'Ticket Replied',
 'Destek Talebiniz Yanıtlandı - {{site_name}}',
 '<h1 class=\"ql-align-center\">Destek Talebiniz Yanıtlandı</h1><p>Merhaba <strong>{{user_name}}</strong>,</p><p>Destek talebiniz yanıtlandı.</p><p><br></p><p>Detayları görüntülemek için kullanıcı paneline giriş yapabilirsiniz.</p><p>Saygılarımızla,</p><p>{{site_name}} Ekibi</p>',
 '2025-10-09 19:38:58.000', '2025-10-13 20:28:47.000'),

-- ticket_replied (en)
('8290e3d9-d5b8-4423-aab2-1cbc85bee59b',
 '4290e3d9-d5b8-4423-aab2-1cbc85bee59b',
 'en',
 'Ticket Replied',
 'Your Support Ticket Has Been Answered - {{site_name}}',
 '<h1 class=\"ql-align-center\">Your Support Ticket Has Been Answered</h1><p>Hello <strong>{{user_name}}</strong>,</p><p>Your support ticket has been answered.</p><p><br></p><p>You can log in to your account to view the full details.</p><p>Best regards,</p><p>{{site_name}} Team</p>',
 '2025-10-09 19:38:58.000', '2025-10-13 20:28:47.000'),

-- password_reset (tr)
('fa91f94a-bfe1-46b7-83fc-b4152e27c65e',
 'da91f94a-bfe1-46b7-83fc-b4152e27c65e',
 'tr',
 'Password Reset',
 'Şifre Sıfırlama Talebi - {{site_name}}',
 '<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;\">\n    <h1 style=\"color: #333; text-align: center;\">Şifre Sıfırlama</h1>\n    <p style=\"color: #666; font-size: 16px;\">Merhaba,</p>\n    <p style=\"color: #666; font-size: 16px;\">Hesabınız için şifre sıfırlama talebi aldık.</p>\n    <div style=\"background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;\">\n      <a href=\"{{reset_link}}\" style=\"display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;\">Şifremi Sıfırla</a>\n    </div>\n    <p style=\"color: #666; font-size: 14px;\">Bu linkin geçerlilik süresi 1 saattir.</p>\n    <p style=\"color: #666; font-size: 14px;\">Bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>\n    <p style=\"color: #666; font-size: 16px;\">Saygılarımızla,<br>{{site_name}} Ekibi</p>\n  </div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- password_reset (en)
('ea91f94a-bfe1-46b7-83fc-b4152e27c65e',
 'da91f94a-bfe1-46b7-83fc-b4152e27c65e',
 'en',
 'Password Reset',
 'Password Reset Request - {{site_name}}',
 '<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;\">\n    <h1 style=\"color: #333; text-align: center;\">Password Reset</h1>\n    <p style=\"color: #666; font-size: 16px;\">Hello,</p>\n    <p style=\"color: #666; font-size: 16px;\">We received a password reset request for your account.</p>\n    <div style=\"background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;\">\n      <a href=\"{{reset_link}}\" style=\"display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;\">Reset My Password</a>\n    </div>\n    <p style=\"color: #666; font-size: 14px;\">This link is valid for 1 hour.</p>\n    <p style=\"color: #666; font-size: 14px;\">If you did not request this, you can safely ignore this email.</p>\n    <p style=\"color: #666; font-size: 16px;\">Best regards,<br>{{site_name}} Team</p>\n  </div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- password_changed (tr)
('d0bb0c00-1a2b-4c5d-9e8f-554433221100',
 'c0bb0c00-1a2b-4c5d-9e8f-001122334455',
 'tr',
 'Password Changed',
 'Şifreniz Güncellendi - {{site_name}}',
 '<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;\">\n    <h1 style=\"font-size:20px; text-align:center;\">Şifreniz Güncellendi</h1>\n    <p>Merhaba <strong>{{user_name}}</strong>,</p>\n    <p>Hesap şifreniz başarıyla değiştirildi.</p>\n    <p>Eğer bu işlemi siz yapmadıysanız lütfen en kısa sürede bizimle iletişime geçin.</p>\n    <p>Saygılarımızla,</p>\n    <p>{{site_name}} Ekibi</p>\n</div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- password_changed (en)
('e0bb0c00-1a2b-4c5d-9e8f-554433221100',
 'c0bb0c00-1a2b-4c5d-9e8f-001122334455',
 'en',
 'Password Changed',
 'Your Password Has Been Updated - {{site_name}}',
 '<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;\">\n    <h1 style=\"font-size:20px; text-align:center;\">Your Password Has Been Updated</h1>\n    <p>Hello <strong>{{user_name}}</strong>,</p>\n    <p>Your account password has been successfully changed.</p>\n    <p>If you did not perform this action, please contact us as soon as possible.</p>\n    <p>Best regards,</p>\n    <p>{{site_name}} Team</p>\n</div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- contact_admin_notification (tr)
('21112222-3333-4444-5555-666677778888',
 '11112222-3333-4444-5555-666677778888',
 'tr',
 'Contact Admin Notification',
 'Yeni İletişim Mesajı - {{subject}}',
 '<div style=\"font-family:system-ui,-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif;font-size:14px;line-height:1.5;color:#111827;\">\n  <h1 style=\"font-size:18px;margin-bottom:12px;\">Yeni iletişim formu mesajı</h1>\n  <p><strong>Ad Soyad:</strong> {{name}}</p>\n  <p><strong>E-posta:</strong> {{email}}</p>\n  <p><strong>Telefon:</strong> {{phone}}</p>\n  <p><strong>Konu:</strong> {{subject}}</p>\n  <p><strong>IP:</strong> {{ip}}</p>\n  <p><strong>User-Agent:</strong> {{user_agent}}</p>\n  <hr style=\"margin:16px 0;border:none;border-top:1px solid #e5e7eb;\" />\n  <p><strong>Mesaj:</strong></p>\n  <pre style=\"white-space:pre-wrap;word-break:break-word;background:#f9fafb;padding:12px;border-radius:8px;border:1px solid #e5e7eb;\">{{message}}</pre>\n</div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- contact_admin_notification (en)
('31112222-3333-4444-5555-666677778888',
 '11112222-3333-4444-5555-666677778888',
 'en',
 'Contact Admin Notification',
 'New Contact Message - {{subject}}',
 '<div style=\"font-family:system-ui,-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif;font-size:14px;line-height:1.5;color:#111827;\">\n  <h1 style=\"font-size:18px;margin-bottom:12px;\">New contact form message</h1>\n  <p><strong>Name:</strong> {{name}}</p>\n  <p><strong>Email:</strong> {{email}}</p>\n  <p><strong>Phone:</strong> {{phone}}</p>\n  <p><strong>Subject:</strong> {{subject}}</p>\n  <p><strong>IP:</strong> {{ip}}</p>\n  <p><strong>User-Agent:</strong> {{user_agent}}</p>\n  <hr style=\"margin:16px 0;border:none;border-top:1px solid #e5e7eb;\" />\n  <p><strong>Message:</strong></p>\n  <pre style=\"white-space:pre-wrap;word-break:break-word;background:#f9fafb;padding:12px;border-radius:8px;border:1px solid #e5e7eb;\">{{message}}</pre>\n</div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- contact_user_autoreply (tr)
('99990000-bbbb-cccc-dddd-eeeeffff0000',
 '99990000-aaaa-bbbb-cccc-ddddeeee0000',
 'tr',
 'Contact User Autoreply',
 'Mesajınızı Aldık - {{subject}}',
 '<div style=\"font-family:system-ui,-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif;font-size:14px;line-height:1.5;color:#111827;\">\n  <h1 style=\"font-size:18px;margin-bottom:12px;\">Mesajınızı Aldık</h1>\n  <p>Merhaba <strong>{{name}}</strong>,</p>\n  <p>İletişim formu üzerinden göndermiş olduğunuz mesaj bize ulaştı.</p>\n  <p>En kısa süre içinde size dönüş yapacağız.</p>\n  <p>İyi günler dileriz.</p>\n</div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- contact_user_autoreply (en)
('99990000-cccc-dddd-eeee-ffff11110000',
 '99990000-aaaa-bbbb-cccc-ddddeeee0000',
 'en',
 'Contact User Autoreply',
 'We\'ve Received Your Message - {{subject}}',
 '<div style=\"font-family:system-ui,-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif;font-size:14px;line-height:1.5;color:#111827;\">\n  <h1 style=\"font-size:18px;margin-bottom:12px;\">We\'ve received your message</h1>\n  <p>Hello <strong>{{name}}</strong>,</p>\n  <p>Your message sent via our contact form has reached us.</p>\n  <p>We will get back to you as soon as possible.</p>\n  <p>Have a nice day.</p>\n</div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- welcome (tr)
('f7fae474-c1cf-4600-8466-2f915146cfb9',
 'e7fae474-c1cf-4600-8466-2f915146cfb9',
 'tr',
 'Welcome',
 'Hesabiniz Oluşturuldu - {{site_name}}',
 '<h1 class=\"ql-align-center\">Hesabınız Oluşturuldu</h1><p>Merhaba <strong>{{user_name}}</strong>,</p><p>{{site_name}} ailesine hoş geldiniz! Hesabınız başarıyla oluşturuldu.</p><p><br></p><p>E-posta: <strong>{{user_email}}</strong></p><p>Herhangi bir sorunuz olursa bizimle iletişime geçmekten çekinmeyin.</p><p>Saygılarımızla,</p><p>{{site_name}} Ekibi</p>',
 '2025-10-09 19:38:58.000', '2025-10-13 15:06:38.000'),

-- welcome (en)
('07fae474-c1cf-4600-8466-2f915146cfb9',
 'e7fae474-c1cf-4600-8466-2f915146cfb9',
 'en',
 'Welcome',
 'Your Account Has Been Created - {{site_name}}',
 '<h1 class=\"ql-align-center\">Your Account Has Been Created</h1><p>Hello <strong>{{user_name}}</strong>,</p><p>Welcome to {{site_name}}! Your account has been successfully created.</p><p><br></p><p>Email: <strong>{{user_email}}</strong></p><p>If you have any questions, feel free to contact us anytime.</p><p>Best regards,</p><p>{{site_name}} Team</p>',
 '2025-10-09 19:38:58.000', '2025-10-13 15:06:38.000')
ON DUPLICATE KEY UPDATE
  `template_name` = VALUES(`template_name`),
  `subject`       = VALUES(`subject`),
  `content`       = VALUES(`content`),
  `updated_at`    = VALUES(`updated_at`);

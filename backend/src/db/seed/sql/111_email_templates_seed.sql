-- 111_email_templates_seed.sql

-- EMAIL_TEMPLATES SEED (i18n'li)
SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ============================================================
-- 1) PARENT KAYITLAR (email_templates)
-- ============================================================

INSERT IGNORE INTO `email_templates`
(`id`, `template_key`, `variables`, `is_active`, `created_at`, `updated_at`)
VALUES
-- ticket_replied
('4290e3d9-d5b8-4423-aab2-1cbc85bee59b',
 'ticket_replied',
 JSON_ARRAY('user_name','ticket_id','ticket_subject','reply_message','site_name'),
 1, '2025-10-09 19:38:58.000', '2025-10-13 20:28:47.000'),

-- order_item_delivery
('4f85350b-c082-4677-bd9f-ad1e7d9bd038',
 'order_item_delivery',
 JSON_ARRAY('customer_name','order_number','product_name','delivery_content','site_name'),
 1, '2025-10-16 08:13:25.000', '2025-10-16 08:13:25.000'),

-- order_completed
('547e8ec8-2746-4bb8-9be3-3db4d186697d',
 'order_completed',
 JSON_ARRAY('customer_name','order_number','final_amount','site_name'),
 1, '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- order_received
('5adeb7c9-e07b-4a36-9e49-460cd626cf8c',
 'order_received',
 JSON_ARRAY('customer_name','order_number','final_amount','status','site_name'),
 1, '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- deposit_success
('d75ec05a-bac7-446a-ac2a-cfc7b7f2dd07',
 'deposit_success',
 JSON_ARRAY('user_name','amount','new_balance','site_name'),
 1, '2025-10-09 19:38:58.000', '2025-10-09 19:49:38.000'),

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

-- ✅ contact_admin_notification (YENİ)
('11112222-3333-4444-5555-666677778888',
 'contact_admin_notification',
 JSON_ARRAY('name','email','phone','subject','message','ip','user_agent'),
 1, '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- ✅ contact_user_autoreply (YENİ)
('99990000-aaaa-bbbb-cccc-ddddeeee0000',
 'contact_user_autoreply',
 JSON_ARRAY('name','subject'),
 1, '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- order_cancelled
('dd5ecc0c-ab34-499a-8103-7a435472794a',
 'order_cancelled',
 JSON_ARRAY('customer_name','order_number','final_amount','cancellation_reason','site_name'),
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

-- order_item_delivery (tr)
('8f85350b-c082-4677-bd9f-ad1e7d9bd038',
 '4f85350b-c082-4677-bd9f-ad1e7d9bd038',
 'tr',
 'Order Item Delivery',
 'Ürününüz Teslim Edildi - {{product_name}}',
 '<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;\">\n  <h1 style=\"color: #10b981; text-align: center;\">✓ Ürününüz Teslim Edildi</h1>\n  <p style=\"color: #666; font-size: 16px;\">Merhaba <strong>{{customer_name}}</strong>,</p>\n  <p style=\"color: #666; font-size: 16px;\">Siparişinize ait ürününüz teslim edilmiştir.</p>\n  \n  <div style=\"background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;\">\n    <p style=\"margin: 0 0 10px 0; color: #666;\"><strong>Sipariş No:</strong> {{order_number}}</p>\n    <p style=\"margin: 0 0 10px 0; color: #666;\"><strong>Ürün:</strong> {{product_name}}</p>\n  </div>\n  \n  <div style=\"background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #10b981;\">\n    <h3 style=\"margin-top: 0; color: #10b981;\">Teslimat Bilgileri:</h3>\n    <pre style=\"background: white; padding: 15px; border-radius: 5px; color: #333; white-space: pre-wrap; word-wrap: break-word;\">{{delivery_content}}</pre>\n  </div>\n  \n  <p style=\"color: #666; font-size: 14px; margin-top: 20px;\">\n    <strong>Not:</strong> Bu bilgileri güvenli bir şekilde saklayınız. Hesabınızdan tüm siparişlerinizi görüntüleyebilirsiniz.\n  </p>\n  \n  <p style=\"color: #666; font-size: 16px;\">Saygılarımızla,<br>{{site_name}} Ekibi</p>\n</div>',
 '2025-10-16 08:13:25.000', '2025-10-16 08:13:25.000'),

-- order_completed (tr)
('647e8ec8-2746-4bb8-9be3-3db4d186697d',
 '547e8ec8-2746-4bb8-9be3-3db4d186697d',
 'tr',
 'Order Completed',
 'Siparişiniz Tamamlandı - {{site_name}}',
 '<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;\">\n    <h1 style=\"color: #10b981; text-align: center;\">✓ Siparişiniz Tamamlandı</h1>\n    <p style=\"color: #666; font-size: 16px;\">Merhaba <strong>{{customer_name}}</strong>,</p>\n    <p style=\"color: #666; font-size: 16px;\">Siparişiniz başarıyla tamamlandı ve ürünleriniz teslim edildi.</p>\n    <div style=\"background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;\">\n      <p style=\"margin: 0 0 10px 0; color: #666;\"><strong>Sipariş No:</strong> {{order_number}}</p>\n      <p style=\"margin: 0; color: #666;\"><strong>Toplam Tutar:</strong> {{final_amount}} TL</p>\n    </div>\n    <p style=\"color: #666; font-size: 16px;\">Ürünlerinizi hesabınızdan görüntüleyebilirsiniz.</p>\n    <p style=\"color: #666; font-size: 16px;\">Deneyiminizi paylaşmak isterseniz değerlendirme yapabilirsiniz.</p>\n    <p style=\"color: #666; font-size: 16px;\">Saygılarımızla,<br>{{site_name}} Ekibi</p>\n  </div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- order_received (tr)
('7adeb7c9-e07b-4a36-9e49-460cd626cf8c',
 '5adeb7c9-e07b-4a36-9e49-460cd626cf8c',
 'tr',
 'Order Received',
 'Siparişiniz Alındı - {{site_name}}',
 '<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;\">\n    <h1 style=\"color: #333; text-align: center;\">Siparişiniz Alındı</h1>\n    <p style=\"color: #666; font-size: 16px;\">Merhaba <strong>{{customer_name}}</strong>,</p>\n    <p style=\"color: #666; font-size: 16px;\">Siparişiniz başarıyla alındı ve işleme alındı.</p>\n    <div style=\"background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;\">\n      <p style=\"margin: 0 0 10px 0; color: #666;\"><strong>Sipariş No:</strong> {{order_number}}</p>\n      <p style=\"margin: 0 0 10px 0; color: #666;\"><strong>Toplam Tutar:</strong> {{final_amount}} TL</p>\n      <p style=\"margin: 0; color: #666;\"><strong>Durum:</strong> {{status}}</p>\n    </div>\n    <p style=\"color: #666; font-size: 16px;\">Siparişinizin durumunu hesabınızdan takip edebilirsiniz.</p>\n    <p style=\"color: #666; font-size: 16px;\">Saygılarımızla,<br>{{site_name}} Ekibi</p>\n  </div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- deposit_success (tr)
('f75ec05a-bac7-446a-ac2a-cfc7b7f2dd07',
 'd75ec05a-bac7-446a-ac2a-cfc7b7f2dd07',
 'tr',
 'Deposit Success',
 'Bakiye Yükleme Onaylandı - {{site_name}}',
 '<h1 class=\"ql-align-center\">✓ Bakiye Yükleme Başarılı</h1><p>Merhaba <strong>{{user_name}}</strong>,</p><p>Bakiye yükleme talebiniz onaylandı ve hesabınıza eklendi.</p><p><br></p><p><strong>Yüklenen Tutar:</strong> {{amount}} TL</p><p><strong>Yeni Bakiye:</strong> {{new_balance}} TL</p><p>Artık alışverişe başlayabilirsiniz!</p><p>Saygılarımızla,</p><p>{{site_name}} Ekibi</p>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:49:38.000'),

-- password_reset (tr)
('fa91f94a-bfe1-46b7-83fc-b4152e27c65e',
 'da91f94a-bfe1-46b7-83fc-b4152e27c65e',
 'tr',
 'Password Reset',
 'Şifre Sıfırlama Talebi - {{site_name}}',
 '<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;\">\n    <h1 style=\"color: #333; text-align: center;\">Şifre Sıfırlama</h1>\n    <p style=\"color: #666; font-size: 16px;\">Merhaba,</p>\n    <p style=\"color: #666; font-size: 16px;\">Hesabınız için şifre sıfırlama talebi aldık.</p>\n    <div style=\"background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;\">\n      <a href=\"{{reset_link}}\" style=\"display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;\">Şifremi Sıfırla</a>\n    </div>\n    <p style=\"color: #666; font-size: 14px;\">Bu linkin geçerlilik süresi 1 saattir.</p>\n    <p style=\"color: #666; font-size: 14px;\">Bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>\n    <p style=\"color: #666; font-size: 16px;\">Saygılarımızla,<br>{{site_name}} Ekibi</p>\n  </div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- password_changed (tr)
('d0bb0c00-1a2b-4c5d-9e8f-554433221100',
 'c0bb0c00-1a2b-4c5d-9e8f-001122334455',
 'tr',
 'Password Changed',
 'Şifreniz Güncellendi - {{site_name}}',
 '<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;\">\n    <h1 style=\"font-size:20px; text-align:center;\">Şifreniz Güncellendi</h1>\n    <p>Merhaba <strong>{{user_name}}</strong>,</p>\n    <p>Hesap şifreniz başarıyla değiştirildi.</p>\n    <p>Eğer bu işlemi siz yapmadıysanız lütfen en kısa sürede bizimle iletişime geçin.</p>\n    <p>Saygılarımızla,</p>\n    <p>{{site_name}} Ekibi</p>\n</div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- ✅ contact_admin_notification (tr)
('21112222-3333-4444-5555-666677778888',
 '11112222-3333-4444-5555-666677778888',
 'tr',
 'Contact Admin Notification',
 'Yeni İletişim Mesajı - {{subject}}',
 '<div style=\"font-family:system-ui,-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif;font-size:14px;line-height:1.5;color:#111827;\">\n  <h1 style=\"font-size:18px;margin-bottom:12px;\">Yeni iletişim formu mesajı</h1>\n  <p><strong>Ad Soyad:</strong> {{name}}</p>\n  <p><strong>E-posta:</strong> {{email}}</p>\n  <p><strong>Telefon:</strong> {{phone}}</p>\n  <p><strong>Konu:</strong> {{subject}}</p>\n  {{#if ip}}<p><strong>IP:</strong> {{ip}}</p>{{/if}}\n  {{#if user_agent}}<p><strong>User-Agent:</strong> {{user_agent}}</p>{{/if}}\n  <hr style=\"margin:16px 0;border:none;border-top:1px solid #e5e7eb;\" />\n  <p><strong>Mesaj:</strong></p>\n  <pre style=\"white-space:pre-wrap;word-break:break-word;background:#f9fafb;padding:12px;border-radius:8px;border:1px solid #e5e7eb;\">{{message}}</pre>\n</div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- ✅ contact_user_autoreply (tr)
('99990000-bbbb-cccc-dddd-eeeeffff0000',
 '99990000-aaaa-bbbb-cccc-ddddeeee0000',
 'tr',
 'Contact User Autoreply',
 'Mesajınızı Aldık - {{subject}}',
 '<div style=\"font-family:system-ui,-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif;font-size:14px;line-height:1.5;color:#111827;\">\n  <h1 style=\"font-size:18px;margin-bottom:12px;\">Mesajınızı Aldık</h1>\n  <p>Merhaba <strong>{{name}}</strong>,</p>\n  <p>İletişim formu üzerinden göndermiş olduğunuz mesaj bize ulaştı.</p>\n  <p>En kısa süre içinde size dönüş yapacağız.</p>\n  <p>İyi günler dileriz.</p>\n</div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- order_cancelled (tr)
('ed5ecc0c-ab34-499a-8103-7a435472794a',
 'dd5ecc0c-ab34-499a-8103-7a435472794a',
 'tr',
 'Order Cancelled',
 'Sipariş İptali - {{site_name}}',
 '<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;\">\n    <h1 style=\"color: #ef4444; text-align: center;\">Siparişiniz İptal Edildi</h1>\n    <p style=\"color: #666; font-size: 16px;\">Merhaba <strong>{{customer_name}}</strong>,</p>\n    <p style=\"color: #666; font-size: 16px;\">Siparişiniz iptal edildi.</p>\n    <div style=\"background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;\">\n      <p style=\"margin: 0 0 10px 0; color: #666;\"><strong>Sipariş No:</strong> {{order_number}}</p>\n      <p style=\"margin: 0 0 10px 0; color: #666;\"><strong>Tutar:</strong> {{final_amount}} TL</p>\n      <p style=\"margin: 0; color: #666;\"><strong>İptal Nedeni:</strong> {{cancellation_reason}}</p>\n    </div>\n    <p style=\"color: #666; font-size: 16px;\">Ödemeniz varsa iade işlemi başlatılacaktır.</p>\n    <p style=\"color: #666; font-size: 16px;\">Sorularınız için bizimle iletişime geçebilirsiniz.</p>\n    <p style=\"color: #666; font-size: 16px;\">Saygılarımızla,<br>{{site_name}} Ekibi</p>\n  </div>',
 '2025-10-09 19:38:58.000', '2025-10-09 19:38:58.000'),

-- welcome (tr)
('f7fae474-c1cf-4600-8466-2f915146cfb9',
 'e7fae474-c1cf-4600-8466-2f915146cfb9',
 'tr',
 'Welcome',
 'Hesabiniz Oluşturuldu - {{site_name}}',
 '<h1 class=\"ql-align-center\">Hesabınız Oluşturuldu</h1><p>Merhaba <strong>{{user_name}}</strong>,</p><p>{{site_name}} ailesine hoş geldiniz! Hesabınız başarıyla oluşturuldu.</p><p><br></p><p>E-posta: <strong>{{user_email}}</strong></p><p>Herhangi bir sorunuz olursa bizimle iletişime geçmekten çekinmeyin.</p><p>Saygılarımızla,</p><p>{{site_name}} Ekibi</p>',
 '2025-10-09 19:38:58.000', '2025-10-13 15:06:38.000')
ON DUPLICATE KEY UPDATE
  `template_name` = VALUES(`template_name`),
  `subject`       = VALUES(`subject`),
  `content`       = VALUES(`content`),
  `updated_at`    = VALUES(`updated_at`);

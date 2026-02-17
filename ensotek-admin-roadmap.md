# Ensotek Admin Panel — Frontend Yol Haritası
## Sadece Admin | Swagger API Eşlemeli

---

## 1. Admin API Endpoint Haritası (Swagger'dan)

### AUDIT / LOG

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/audit/request-logs` | İstek logları |
| GET | `/api/admin/audit/auth-events` | Auth olayları (login, logout, fail) |
| GET | `/api/admin/audit/metrics/daily` | Günlük metrikler |
| GET | `/api/admin/audit/stream` | Canlı log stream (SSE) |

### DASHBOARD

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/dashboard/summary` | Özet istatistikler |

### KULLANICI YÖNETİMİ

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/users` | Kullanıcı listesi |
| GET | `/api/admin/users/{id}` | Kullanıcı detay |
| PATCH | `/api/admin/users/{id}` | Kullanıcı güncelle |
| DELETE | `/api/admin/users/{id}` | Kullanıcı sil |
| POST | `/api/admin/users/{id}/active` | Aktif/pasif toggle |
| POST | `/api/admin/users/{id}/roles` | Rol ata |
| POST | `/api/admin/users/{id}/password` | Şifre değiştir |

### SİTE AYARLARI

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/site-settings` | Tüm ayarlar |
| PUT | `/api/admin/site-settings` | Toplu güncelle |
| POST | `/api/admin/site-settings` | Yeni ayar ekle |
| DELETE | `/api/admin/site-settings` | Ayar sil |
| GET | `/api/admin/site-settings/list` | Ayar listesi |
| GET | `/api/admin/site-settings/app-locales` | Desteklenen diller |
| GET | `/api/admin/site-settings/default-locale` | Varsayılan dil |
| GET | `/api/admin/site-settings/{key}` | Tek ayar getir |
| PUT | `/api/admin/site-settings/{key}` | Tek ayar güncelle |
| DELETE | `/api/admin/site-settings/{key}` | Tek ayar sil |
| POST | `/api/admin/site-settings/bulk-upsert` | Toplu upsert |

### DİNAMİK SAYFALAR

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/custom_pages` | Sayfa listesi |
| POST | `/api/admin/custom_pages` | Yeni sayfa |
| GET | `/api/admin/custom_pages/{id}` | Sayfa detay |
| PATCH | `/api/admin/custom_pages/{id}` | Sayfa güncelle |
| DELETE | `/api/admin/custom_pages/{id}` | Sayfa sil |
| GET | `/api/admin/custom_pages/by-slug/{slug}` | Slug ile getir |
| POST | `/api/admin/custom_pages/reorder` | Sıralama güncelle |

### SSS

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/faqs` | SSS listesi |
| POST | `/api/admin/faqs` | Yeni SSS |
| GET | `/api/admin/faqs/{id}` | SSS detay |
| PATCH | `/api/admin/faqs/{id}` | SSS güncelle |
| DELETE | `/api/admin/faqs/{id}` | SSS sil |
| GET | `/api/admin/faqs/by-slug/{slug}` | Slug ile getir |

### HİZMETLER

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/services` | Hizmet listesi |
| POST | `/api/admin/services` | Yeni hizmet |
| GET | `/api/admin/services/{id}` | Hizmet detay |
| PATCH | `/api/admin/services/{id}` | Hizmet güncelle |
| DELETE | `/api/admin/services/{id}` | Hizmet sil |
| GET | `/api/admin/services/by-slug/{slug}` | Slug ile getir |
| GET | `/api/admin/services/{id}/images` | Hizmet görselleri |
| POST | `/api/admin/services/{id}/images` | Görsel ekle |
| PATCH | `/api/admin/services/{id}/images/{imageId}` | Görsel güncelle |
| DELETE | `/api/admin/services/{id}/images/{imageId}` | Görsel sil |
| POST | `/api/admin/services/reorder` | Sıralama güncelle |

### REFERANSLAR

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/references` | Referans listesi |
| POST | `/api/admin/references` | Yeni referans |
| GET | `/api/admin/references/{id}` | Referans detay |
| PATCH | `/api/admin/references/{id}` | Referans güncelle |
| DELETE | `/api/admin/references/{id}` | Referans sil |
| GET | `/api/admin/references/by-slug/{slug}` | Slug ile getir |

### DOSYA YÖNETİMİ (STORAGE)

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/storage/assets` | Asset listesi |
| POST | `/api/admin/storage/assets` | Asset yükle |
| GET | `/api/admin/storage/assets/{id}` | Asset detay |
| PATCH | `/api/admin/storage/assets/{id}` | Asset güncelle (meta) |
| DELETE | `/api/admin/storage/assets/{id}` | Asset sil |
| POST | `/api/admin/storage/assets/bulk` | Toplu yükleme |
| POST | `/api/admin/storage/assets/bulk-delete` | Toplu silme |
| GET | `/api/admin/storage/folders` | Klasör listesi |
| GET | `/api/admin/storage/_diag/cloud` | Cloud diagnostik |

### MENÜ YÖNETİMİ

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/menu_items` | Menü listesi |
| POST | `/api/admin/menu_items` | Yeni menü item |
| GET | `/api/admin/menu_items/{id}` | Menü item detay |
| PATCH | `/api/admin/menu_items/{id}` | Menü item güncelle |
| DELETE | `/api/admin/menu_items/{id}` | Menü item sil |
| POST | `/api/admin/menu_items/reorder` | Sıralama güncelle |

### SLIDER

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/sliders` | Slider listesi |
| POST | `/api/admin/sliders` | Yeni slider |
| GET | `/api/admin/sliders/{id}` | Slider detay |
| PATCH | `/api/admin/sliders/{id}` | Slider güncelle |
| DELETE | `/api/admin/sliders/{id}` | Slider sil |
| POST | `/api/admin/sliders/reorder` | Sıralama güncelle |
| POST | `/api/admin/sliders/{id}/status` | Aktif/pasif toggle |
| PATCH | `/api/admin/sliders/{id}/image` | Görsel güncelle |

### KATEGORİLER

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/categories/list` | Kategori listesi |
| POST | `/api/admin/categories` | Yeni kategori |
| GET | `/api/admin/categories/{id}` | Kategori detay |
| PUT | `/api/admin/categories/{id}` | Kategori güncelle (full) |
| PATCH | `/api/admin/categories/{id}` | Kategori güncelle (partial) |
| DELETE | `/api/admin/categories/{id}` | Kategori sil |
| GET | `/api/admin/categories/by-slug/{slug}` | Slug ile getir |
| POST | `/api/admin/categories/reorder` | Sıralama güncelle |
| PATCH | `/api/admin/categories/{id}/active` | Aktif/pasif toggle |
| PATCH | `/api/admin/categories/{id}/featured` | Öne çıkan toggle |
| PATCH | `/api/admin/categories/{id}/image` | Görsel güncelle |

### ALT KATEGORİLER

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/sub-categories/list` | Alt kategori listesi |
| POST | `/api/admin/sub-categories` | Yeni alt kategori |
| GET | `/api/admin/sub-categories/{id}` | Alt kategori detay |
| PUT | `/api/admin/sub-categories/{id}` | Alt kategori güncelle (full) |
| PATCH | `/api/admin/sub-categories/{id}` | Alt kategori güncelle (partial) |
| DELETE | `/api/admin/sub-categories/{id}` | Alt kategori sil |
| GET | `/api/admin/sub-categories/by-slug/{slug}` | Slug ile getir |
| POST | `/api/admin/sub-categories/reorder` | Sıralama güncelle |
| PATCH | `/api/admin/sub-categories/{id}/active` | Aktif/pasif toggle |
| PATCH | `/api/admin/sub-categories/{id}/featured` | Öne çıkan toggle |
| PATCH | `/api/admin/sub-categories/{id}/image` | Görsel güncelle |

### İLETİŞİM MESAJLARI

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/contacts` | Mesaj listesi |
| GET | `/api/admin/contacts/{id}` | Mesaj detay |
| PATCH | `/api/admin/contacts/{id}` | Mesaj güncelle (okundu vb.) |
| DELETE | `/api/admin/contacts/{id}` | Mesaj sil |

### VERİTABANI YÖNETİMİ

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/db/export` | Tam DB export |
| POST | `/api/admin/db/import-sql` | SQL import |
| POST | `/api/admin/db/import-url` | URL'den import |
| POST | `/api/admin/db/import-file` | Dosyadan import |
| GET | `/api/admin/db/export-module` | Modül bazlı export |
| POST | `/api/admin/db/import-module` | Modül bazlı import |
| GET | `/api/admin/db/site-settings/ui-export` | UI ayarları export |
| POST | `/api/admin/db/site-settings/ui-bootstrap` | UI ayarları bootstrap |
| GET | `/api/admin/db/modules/validate` | Modül validation |
| GET | `/api/admin/db/snapshots` | Snapshot listesi |
| POST | `/api/admin/db/snapshots` | Yeni snapshot |
| POST | `/api/admin/db/snapshots/{id}/restore` | Snapshot geri yükle |
| DELETE | `/api/admin/db/snapshots/{id}` | Snapshot sil |

### E-POSTA ŞABLONLARI

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/email_templates` | Şablon listesi |
| POST | `/api/admin/email_templates` | Yeni şablon |
| GET | `/api/admin/email_templates/{id}` | Şablon detay |
| PATCH | `/api/admin/email_templates/{id}` | Şablon güncelle |
| DELETE | `/api/admin/email_templates/{id}` | Şablon sil |

### FOOTER BÖLÜMLERİ

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/footer_sections` | Footer bölüm listesi |
| POST | `/api/admin/footer_sections` | Yeni bölüm |
| GET | `/api/admin/footer_sections/{id}` | Bölüm detay |
| PATCH | `/api/admin/footer_sections/{id}` | Bölüm güncelle |
| DELETE | `/api/admin/footer_sections/{id}` | Bölüm sil |
| GET | `/api/admin/footer_sections/by-slug/{slug}` | Slug ile getir |

### KÜTÜPHANE

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/library` | Kütüphane listesi |
| POST | `/api/admin/library` | Yeni item |
| GET | `/api/admin/library/{id}` | Item detay |
| PATCH | `/api/admin/library/{id}` | Item güncelle |
| DELETE | `/api/admin/library/{id}` | Item sil |
| GET | `/api/admin/library/by-slug/{slug}` | Slug ile getir |
| GET | `/api/admin/library/{id}/images` | Item görselleri |
| POST | `/api/admin/library/{id}/images` | Görsel ekle |
| PATCH | `/api/admin/library/{id}/images/{imageId}` | Görsel güncelle |
| DELETE | `/api/admin/library/{id}/images/{imageId}` | Görsel sil |
| POST | `/api/admin/library/reorder` | Sıralama güncelle |
| GET | `/api/admin/library/{id}/files` | Item dosyaları |
| POST | `/api/admin/library/{id}/files` | Dosya ekle |
| PATCH | `/api/admin/library/{id}/files/{fileId}` | Dosya güncelle |
| DELETE | `/api/admin/library/{id}/files/{fileId}` | Dosya sil |

### NEWSLETTER

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/newsletter` | Abone listesi |
| GET | `/api/admin/newsletter/{id}` | Abone detay |
| PATCH | `/api/admin/newsletter/{id}` | Abone güncelle |
| DELETE | `/api/admin/newsletter/{id}` | Abone sil |

### ÜRÜNLER

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/products` | Ürün listesi |
| POST | `/api/admin/products` | Yeni ürün |
| GET | `/api/admin/products/{id}` | Ürün detay |
| PATCH | `/api/admin/products/{id}` | Ürün güncelle |
| DELETE | `/api/admin/products/{id}` | Ürün sil |
| GET | `/api/admin/products/{id}/images` | Ürün görselleri |
| POST | `/api/admin/products/{id}/images` | Görsel ekle |
| DELETE | `/api/admin/products/{id}/images/{imageId}` | Görsel sil |
| PUT | `/api/admin/products/{id}/images/replace` | Görselleri değiştir |
| POST | `/api/admin/products/reorder` | Sıralama güncelle |
| GET | `/api/admin/products/categories` | Ürün kategorileri |
| GET | `/api/admin/products/subcategories` | Ürün alt kategorileri |
| GET | `/api/admin/products/{id}/faqs` | Ürün SSS'leri |
| POST | `/api/admin/products/{id}/faqs` | SSS ekle |
| PUT | `/api/admin/products/{id}/faqs` | SSS toplu güncelle |
| PATCH | `/api/admin/products/{id}/faqs/{faqId}` | SSS güncelle |
| DELETE | `/api/admin/products/{id}/faqs/{faqId}` | SSS sil |
| PATCH | `/api/admin/products/{id}/faqs/{faqId}/active` | SSS aktif/pasif |
| GET | `/api/admin/products/{id}/specs` | Ürün özellikleri |
| POST | `/api/admin/products/{id}/specs` | Özellik ekle |
| PUT | `/api/admin/products/{id}/specs` | Özellik toplu güncelle |
| PATCH | `/api/admin/products/{id}/specs/{specId}` | Özellik güncelle |
| DELETE | `/api/admin/products/{id}/specs/{specId}` | Özellik sil |
| GET | `/api/admin/products/{id}/reviews` | Ürün yorumları |
| POST | `/api/admin/products/{id}/reviews` | Yorum ekle |
| PATCH | `/api/admin/products/{id}/reviews/{reviewId}` | Yorum güncelle |
| DELETE | `/api/admin/products/{id}/reviews/{reviewId}` | Yorum sil |
| PATCH | `/api/admin/products/{id}/reviews/{reviewId}/active` | Yorum aktif/pasif |

### YORUMLAR (Global)

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/reviews` | Tüm yorumlar |
| POST | `/api/admin/reviews` | Yorum ekle |
| GET | `/api/admin/reviews/{id}` | Yorum detay |
| PATCH | `/api/admin/reviews/{id}` | Yorum güncelle |
| DELETE | `/api/admin/reviews/{id}` | Yorum sil |

### DESTEK TALEPLERİ

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/support_tickets` | Talep listesi |
| GET | `/api/admin/support_tickets/{id}` | Talep detay |
| PATCH | `/api/admin/support_tickets/{id}` | Talep güncelle |
| DELETE | `/api/admin/support_tickets/{id}` | Talep sil |
| POST | `/api/admin/support_tickets/{id}/{action}` | Aksiyon (close, reopen vb.) |
| GET | `/api/admin/ticket_replies/by-ticket/{ticketId}` | Yanıtlar |
| POST | `/api/admin/ticket_replies` | Yanıt ekle |
| DELETE | `/api/admin/ticket_replies/{id}` | Yanıt sil |

### CHAT (AI DESTEK + ADMIN HANDOFF)

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/chat/threads` | Chat thread listesi |
| GET | `/api/admin/chat/threads/{id}/messages` | Thread mesajları |
| POST | `/api/admin/chat/threads/{id}/takeover` | Admin takeover |
| POST | `/api/admin/chat/threads/{id}/release-to-ai` | AI moda geri al |
| PATCH | `/api/admin/chat/threads/{id}/ai-provider` | AI provider seç |
| GET | `/api/admin/chat/knowledge` | AI bilgi tabanı listesi |
| GET | `/api/admin/chat/knowledge/{id}` | AI bilgi kaydı detay |
| POST | `/api/admin/chat/knowledge` | AI bilgi kaydı oluştur |
| PATCH | `/api/admin/chat/knowledge/{id}` | AI bilgi kaydı güncelle |
| DELETE | `/api/admin/chat/knowledge/{id}` | AI bilgi kaydı sil |

### TELEGRAM

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/telegram/inbound` | Gelen Telegram mesajları |
| GET | `/api/admin/telegram/autoreply` | Auto-reply ayarı getir |
| POST | `/api/admin/telegram/autoreply` | Auto-reply ayarı güncelle |
| POST | `/api/admin/telegram/test` | Telegram test mesajı |
| POST | `/api/admin/telegram/send` | Telegram mesaj gönder |
| POST | `/api/admin/telegram/event` | Sistem olayı bildirimi gönder |

### TEKLİFLER

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/offers` | Teklif listesi |
| POST | `/api/admin/offers` | Yeni teklif |
| GET | `/api/admin/offers/{id}` | Teklif detay |
| PATCH | `/api/admin/offers/{id}` | Teklif güncelle |
| DELETE | `/api/admin/offers/{id}` | Teklif sil |
| POST | `/api/admin/offers/{id}/pdf` | PDF oluştur |
| POST | `/api/admin/offers/{id}/email` | E-posta gönder |
| POST | `/api/admin/offers/{id}/send` | Teklif gönder |

### KATALOG İSTEKLERİ

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/catalog-requests` | İstek listesi |
| GET | `/api/admin/catalog-requests/{id}` | İstek detay |
| PATCH | `/api/admin/catalog-requests/{id}` | İstek güncelle |
| DELETE | `/api/admin/catalog-requests/{id}` | İstek sil |
| POST | `/api/admin/catalog-requests/{id}/resend` | Tekrar gönder |

---

**Toplam: ~126 admin endpoint**

---

## 2. Admin Frontend Modül Yapısı

```
src/modules/admin/
├── dashboard/
│   ├── dashboard.service.ts       # 1 endpoint: GET /admin/dashboard/summary
│   ├── dashboard.action.ts        # useDashboardSummary
│   └── dashboard.type.ts          # DashboardSummary
│
├── users/
│   ├── users.service.ts           # 7 endpoint
│   ├── users.action.ts            # useAdminUsers, useAdminUser, useToggleActive, useAssignRole...
│   ├── users.type.ts              # AdminUser, UserListParams
│   └── users.schema.ts            # userUpdateSchema, passwordChangeSchema
│
├── site-settings/
│   ├── siteSettings.service.ts    # 11 endpoint
│   ├── siteSettings.action.ts     # useAdminSettings, useUpdateSetting, useBulkUpsert...
│   ├── siteSettings.type.ts       # Setting { key, value, type }
│   └── siteSettings.schema.ts     # settingSchema
│
├── custom-pages/
│   ├── customPages.service.ts     # 7 endpoint (CRUD + reorder + by-slug)
│   ├── customPages.action.ts      # useAdminPages, useCreatePage, useUpdatePage, useReorder...
│   ├── customPages.type.ts        # AdminCustomPage
│   └── customPages.schema.ts      # pageSchema
│
├── faqs/
│   ├── faqs.service.ts            # 6 endpoint (CRUD + by-slug)
│   ├── faqs.action.ts             # useAdminFaqs, useCreateFaq, useUpdateFaq...
│   ├── faqs.type.ts               # AdminFaq
│   └── faqs.schema.ts             # faqSchema
│
├── services/
│   ├── services.service.ts        # 11 endpoint (CRUD + images + reorder)
│   ├── services.action.ts         # useAdminServices, image CRUD hooks...
│   ├── services.type.ts           # AdminService, ServiceImage
│   └── services.schema.ts         # serviceSchema
│
├── references/
│   ├── references.service.ts      # 6 endpoint (CRUD + by-slug)
│   ├── references.action.ts       # useAdminReferences, useCreateRef...
│   ├── references.type.ts         # AdminReference
│   └── references.schema.ts       # referenceSchema
│
├── storage/
│   ├── storage.service.ts         # 9 endpoint (assets CRUD + bulk + folders)
│   ├── storage.action.ts          # useAdminAssets, useBulkUpload, useBulkDelete, useFolders...
│   └── storage.type.ts            # Asset, Folder
│
├── menu-items/
│   ├── menuItems.service.ts       # 6 endpoint (CRUD + reorder)
│   ├── menuItems.action.ts        # useAdminMenuItems, useReorderMenu...
│   ├── menuItems.type.ts          # AdminMenuItem
│   └── menuItems.schema.ts        # menuItemSchema
│
├── sliders/
│   ├── sliders.service.ts         # 8 endpoint (CRUD + reorder + status + image)
│   ├── sliders.action.ts          # useAdminSliders, useToggleStatus, useUpdateImage...
│   ├── sliders.type.ts            # AdminSlider
│   └── sliders.schema.ts          # sliderSchema
│
├── categories/
│   ├── categories.service.ts      # 11 endpoint (CRUD + reorder + active + featured + image)
│   ├── categories.action.ts       # useAdminCategories, useToggleActive, useToggleFeatured...
│   ├── categories.type.ts         # AdminCategory
│   └── categories.schema.ts       # categorySchema
│
├── subcategories/
│   ├── subcategories.service.ts   # 11 endpoint (aynı pattern)
│   ├── subcategories.action.ts    # useAdminSubCategories...
│   ├── subcategories.type.ts      # AdminSubCategory
│   └── subcategories.schema.ts    # subCategorySchema
│
├── contacts/
│   ├── contacts.service.ts        # 4 endpoint (list, detail, update, delete)
│   ├── contacts.action.ts         # useAdminContacts, useMarkRead, useDeleteContact
│   └── contacts.type.ts           # AdminContact
│
├── db-admin/
│   ├── dbAdmin.service.ts         # 13 endpoint (export, import, snapshots)
│   ├── dbAdmin.action.ts          # useExportDB, useImportSQL, useSnapshots, useRestore...
│   └── dbAdmin.type.ts            # Snapshot, ModuleValidation
│
├── email-templates/
│   ├── emailTemplates.service.ts  # 5 endpoint (CRUD)
│   ├── emailTemplates.action.ts   # useAdminTemplates, useCreateTemplate...
│   ├── emailTemplates.type.ts     # AdminEmailTemplate
│   └── emailTemplates.schema.ts   # templateSchema
│
├── footer-sections/
│   ├── footerSections.service.ts  # 6 endpoint (CRUD + by-slug)
│   ├── footerSections.action.ts   # useAdminFooterSections...
│   ├── footerSections.type.ts     # AdminFooterSection
│   └── footerSections.schema.ts   # footerSectionSchema
│
├── library/
│   ├── library.service.ts         # 15 endpoint (CRUD + images + files + reorder)
│   ├── library.action.ts          # useAdminLibrary, image/file CRUD hooks...
│   ├── library.type.ts            # AdminLibraryItem, LibraryImage, LibraryFile
│   └── library.schema.ts          # librarySchema
│
├── newsletter/
│   ├── newsletter.service.ts      # 4 endpoint (list, detail, update, delete)
│   ├── newsletter.action.ts       # useAdminSubscribers, useDeleteSubscriber...
│   └── newsletter.type.ts         # AdminSubscriber
│
├── products/
│   ├── products.service.ts        # 27 endpoint (CRUD + images + faqs + specs + reviews)
│   ├── products.action.ts         # useAdminProducts, image/faq/spec/review CRUD hooks...
│   ├── products.type.ts           # AdminProduct, AdminProductFaq, AdminProductSpec...
│   └── products.schema.ts         # productSchema, faqSchema, specSchema
│
├── reviews/
│   ├── reviews.service.ts         # 5 endpoint (global review CRUD)
│   ├── reviews.action.ts          # useAdminReviews, useApproveReview...
│   ├── reviews.type.ts            # AdminReview
│   └── reviews.schema.ts          # reviewSchema
│
├── support/
│   ├── support.service.ts         # 8 endpoint (tickets + replies + actions)
│   ├── support.action.ts          # useAdminTickets, useTicketAction, useAdminReply...
│   ├── support.type.ts            # AdminTicket, AdminTicketReply
│   └── support.schema.ts          # replySchema
│
├── chat/
│   ├── chat.service.ts            # 10 endpoint (threads + messages + handoff + ai knowledge CRUD)
│   ├── chat.action.ts             # useAdminChatThreads, useTakeover, useReleaseToAi, useAiKnowledge...
│   ├── chat.type.ts               # AdminChatThread, AdminChatMessage, AdminAiKnowledge
│   └── chat.schema.ts             # aiKnowledgeSchema, threadFilterSchema
│
├── telegram/
│   ├── telegram.service.ts        # 6 endpoint (inbound + autoreply + send/test/event)
│   ├── telegram.action.ts         # useTelegramInbound, useAutoReply, useTelegramSend...
│   ├── telegram.type.ts           # TelegramInbound, TelegramAutoReplyConfig
│   └── telegram.schema.ts         # telegramAutoReplySchema
│
├── offers/
│   ├── offers.service.ts          # 8 endpoint (CRUD + pdf + email + send)
│   ├── offers.action.ts           # useAdminOffers, useGeneratePdf, useSendOffer...
│   ├── offers.type.ts             # AdminOffer
│   └── offers.schema.ts           # offerSchema
│
├── catalog-requests/
│   ├── catalogRequests.service.ts # 5 endpoint (CRUD + resend)
│   ├── catalogRequests.action.ts  # useAdminCatalogRequests, useResend...
│   └── catalogRequests.type.ts    # AdminCatalogRequest
│
└── audit/
    ├── audit.service.ts           # 4 endpoint (logs, auth-events, metrics, stream)
    ├── audit.action.ts            # useRequestLogs, useAuthEvents, useDailyMetrics
    └── audit.type.ts              # RequestLog, AuthEvent, DailyMetric
```

**Toplam: 24 admin modül, ~126 endpoint**

---

## 3. Admin Sayfa Yapısı

```
SAYFA                              ROUTE                                    MODÜLLER                           TİP
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Dashboard                          /admin                                   dashboard                          Özet kartlar + grafikler
Kullanıcılar                       /admin/users                             users                              DataTable + CRUD
Kullanıcı Detay                    /admin/users/[id]                        users                              Form + rol atama
Ürünler                            /admin/products                          products                           DataTable + CRUD
Ürün Oluştur/Düzenle               /admin/products/new | /admin/products/[id]  products                       Tab form: bilgi, görseller, SSS, spec, yorum
Kategoriler                        /admin/categories                        categories                         DataTable + drag reorder
Alt Kategoriler                    /admin/subcategories                     subcategories                      DataTable + drag reorder
Slider                             /admin/sliders                           sliders                            DataTable + drag reorder + görsel
Menü Yönetimi                      /admin/menu-items                        menu-items                         Tree view + drag reorder
Sayfalar                           /admin/pages                             custom-pages                       DataTable + rich editor
Sayfa Düzenle                      /admin/pages/[id]                        custom-pages                       WYSIWYG editor
Hizmetler                          /admin/services                          services                           DataTable + görsel yönetimi
Referanslar                        /admin/references                        references                         DataTable + logo upload
SSS                                /admin/faqs                              faqs                               DataTable + CRUD
Footer Bölümleri                   /admin/footer-sections                   footer-sections                    DataTable + CRUD
Kütüphane                          /admin/library                           library                            DataTable + görsel + dosya yönetimi
Yorumlar                           /admin/reviews                           reviews                            DataTable + onay/red
İletişim Mesajları                 /admin/contacts                          contacts                           DataTable + okundu/sil
Newsletter Aboneleri               /admin/newsletter                        newsletter                         DataTable + sil
Destek Talepleri                   /admin/support                           support                            DataTable + durum
Destek Detay                       /admin/support/[id]                      support                            Mesajlaşma UI + aksiyon
AI Chat Threadleri                 /admin/chat                              chat                               Thread listesi + handoff + provider
AI Chat Detay                      /admin/chat/[id]                         chat                               Mesaj akışı + takeover/release
AI Bilgi Tabanı                    /admin/chat/knowledge                    chat                               Dil bazlı AI eğitim kayıtları (CRUD)
Telegram Mesajları                 /admin/telegram                          telegram                           Inbound list + manuel gönderim
Telegram Auto-Reply                /admin/telegram/autoreply                telegram                           Auto-reply metin/aktiflik ayarı
Teklifler                          /admin/offers                            offers                             DataTable + PDF + e-posta
Teklif Detay                       /admin/offers/[id]                       offers                             Detay + PDF oluştur + gönder
Katalog İstekleri                  /admin/catalog-requests                  catalog-requests                   DataTable + tekrar gönder
Site Ayarları                      /admin/settings                          site-settings                      Key-value form + bulk
E-posta Şablonları                 /admin/email-templates                   email-templates                    DataTable + HTML editor
Dosya Yöneticisi                   /admin/storage                           storage                            Grid/list + upload + klasör
DB Yönetimi                        /admin/database                          db-admin                           Export/import + snapshots
Audit Logları                      /admin/audit                             audit                              Log tablosu + canlı stream
```

---

## 4. Ortak Admin Componentler

```
src/components/admin/
├── layout/
│   ├── AdminLayout.tsx            # Sidebar + topbar + content area
│   ├── AdminSidebar.tsx           # Navigasyon menüsü (collapsible)
│   ├── AdminTopbar.tsx            # Arama, bildirimler, kullanıcı menü
│   └── AdminBreadcrumb.tsx
│
├── data/
│   ├── DataTable.tsx              # TanStack Table wrapper
│   │   ├── Sıralama (sort)
│   │   ├── Filtreleme (column filters)
│   │   ├── Pagination (server-side)
│   │   ├── Satır seçimi (bulk actions)
│   │   └── Responsive (mobile scroll)
│   ├── DataTableToolbar.tsx       # Arama + filtre + bulk action bar
│   ├── DataTablePagination.tsx
│   └── ColumnHeader.tsx           # Sortable header
│
├── form/
│   ├── FormField.tsx              # react-hook-form + Shadcn wrapper
│   ├── ImageUpload.tsx            # Tek/çoklu görsel yükleme (storage module)
│   ├── FileUpload.tsx             # Dosya yükleme
│   ├── RichTextEditor.tsx         # WYSIWYG (Tiptap veya Plate)
│   ├── SlugField.tsx              # Auto-slug generator
│   ├── SortableList.tsx           # Drag & drop sıralama (dnd-kit)
│   └── ConfirmDialog.tsx          # Silme onay dialog
│
├── common/
│   ├── StatusBadge.tsx            # Aktif/Pasif/Bekliyor badge
│   ├── DateDisplay.tsx            # Tarih formatlama
│   ├── EmptyState.tsx
│   └── LoadingSkeleton.tsx
│
└── charts/
    ├── SummaryCard.tsx            # Dashboard istatistik kartı
    ├── LineChart.tsx              # Recharts wrapper
    └── BarChart.tsx
```

---

## 5. Yol Haritası (Admin)

---

### FAZ A0 — Admin Altyapı (1 hafta)

```
Gün 1-2: Admin Layout
├── /admin layout.tsx → AdminLayout (sidebar + topbar)
├── AdminSidebar → navigasyon menüsü (22 sayfa)
├── AdminTopbar → kullanıcı bilgisi, çıkış
├── Admin auth guard → middleware: role === 'admin' kontrolü
└── Admin route group: app/[locale]/(admin)/admin/

Gün 3-4: Ortak Componentler
├── DataTable.tsx → TanStack Table v8 (server-side pagination, sort, filter)
├── DataTableToolbar.tsx → arama + filtre bar
├── FormField.tsx → react-hook-form + Shadcn
├── ImageUpload.tsx → storage module entegrasyonu
├── RichTextEditor.tsx → Tiptap (customPages, services, products description)
├── SortableList.tsx → dnd-kit (reorder endpoint'leri için)
└── ConfirmDialog.tsx → silme onayı

Gün 5: Dashboard
├── 🔌 admin/dashboard module
│   └── GET /admin/dashboard/summary
├── /admin/page.tsx → Dashboard
│   ├── SummaryCards (toplam ürün, kullanıcı, sipariş, mesaj)
│   ├── Günlük trafik grafiği (audit metrics)
│   └── Son aktiviteler
```

---

### FAZ A1 — İçerik Yönetimi (2 hafta)

```
Sprint A1.1: Ürünler (Gün 1-5) — En karmaşık modül
│
├── 🔌 admin/products module (27 endpoint)
│   ├── products.service.ts
│   │   ├── CRUD: GET list, POST create, GET/{id}, PATCH/{id}, DELETE/{id}
│   │   ├── Images: GET/{id}/images, POST/{id}/images, DELETE/{id}/images/{imageId},
│   │   │           PUT/{id}/images/replace
│   │   ├── FAQs: GET/{id}/faqs, POST/{id}/faqs, PUT/{id}/faqs,
│   │   │         PATCH/{id}/faqs/{faqId}, DELETE/{id}/faqs/{faqId},
│   │   │         PATCH/{id}/faqs/{faqId}/active
│   │   ├── Specs: GET/{id}/specs, POST/{id}/specs, PUT/{id}/specs,
│   │   │          PATCH/{id}/specs/{specId}, DELETE/{id}/specs/{specId}
│   │   ├── Reviews: GET/{id}/reviews, POST/{id}/reviews,
│   │   │            PATCH/{id}/reviews/{reviewId}, DELETE/{id}/reviews/{reviewId},
│   │   │            PATCH/{id}/reviews/{reviewId}/active
│   │   ├── Reorder: POST /reorder
│   │   └── Helpers: GET /categories, GET /subcategories
│   │
│   └── products.action.ts → 20+ hook
│
├── Sayfalar
│   ├── /admin/products/page.tsx → DataTable
│   │   ├── Kolonlar: görsel, ad, kategori, fiyat, aktif, sıra
│   │   ├── Filtre: kategori, aktif, öne çıkan
│   │   └── Bulk: sil, aktif/pasif
│   ├── /admin/products/new/page.tsx → Oluşturma formu
│   └── /admin/products/[id]/page.tsx → Tab layout:
│       ├── Tab: Genel Bilgiler (ad, slug, açıklama, kategori, fiyat)
│       ├── Tab: Görseller (drag reorder, upload, sil)
│       ├── Tab: Teknik Özellikler (key-value CRUD)
│       ├── Tab: SSS (soru-cevap CRUD + aktif/pasif)
│       └── Tab: Yorumlar (liste + onay/red + sil)

Sprint A1.2: Kategoriler + Alt Kategoriler (Gün 6-7)
│
├── 🔌 admin/categories module (11 endpoint)
│   └── CRUD + reorder + active toggle + featured toggle + image update
├── 🔌 admin/subcategories module (11 endpoint)
│   └── Aynı pattern
│
├── /admin/categories/page.tsx → DataTable + drag reorder
│   ├── Aktif/pasif toggle (PATCH /{id}/active)
│   ├── Öne çıkan toggle (PATCH /{id}/featured)
│   └── Görsel güncelleme (PATCH /{id}/image)
└── /admin/subcategories/page.tsx → aynı pattern + parent kategori filtre

Sprint A1.3: Slider + Menü + Footer (Gün 8-9)
│
├── 🔌 admin/sliders module (8 endpoint)
│   └── CRUD + reorder + status toggle + image update
├── 🔌 admin/menu-items module (6 endpoint)
│   └── CRUD + reorder (tree structure)
├── 🔌 admin/footer-sections module (6 endpoint)
│   └── CRUD + by-slug
│
├── /admin/sliders/page.tsx → Görsel ağırlıklı DataTable + drag reorder
├── /admin/menu-items/page.tsx → Tree view + drag-drop sıralama
└── /admin/footer-sections/page.tsx → DataTable + CRUD

Sprint A1.4: Sayfalar + Hizmetler + Referanslar + SSS (Gün 10-12)
│
├── 🔌 admin/custom-pages module (7 endpoint) → CRUD + reorder + WYSIWYG
├── 🔌 admin/services module (11 endpoint) → CRUD + images + reorder
├── 🔌 admin/references module (6 endpoint) → CRUD + logo upload
├── 🔌 admin/faqs module (6 endpoint) → CRUD
│
├── /admin/pages/page.tsx → DataTable
├── /admin/pages/[id]/page.tsx → RichTextEditor (Tiptap)
├── /admin/services/page.tsx → DataTable + görsel yönetimi
├── /admin/references/page.tsx → DataTable + logo upload
└── /admin/faqs/page.tsx → DataTable + inline edit
```

---

### FAZ A2 — İletişim + CRM + Kütüphane (1 hafta)

```
Sprint A2.1: Mesajlar + Abone + Yorum (Gün 1-3)
│
├── 🔌 admin/contacts module (4 endpoint)
├── 🔌 admin/newsletter module (4 endpoint)
├── 🔌 admin/reviews module (5 endpoint) → global yorum moderasyonu
│
├── /admin/contacts/page.tsx → DataTable (okundu/okunmadı badge, sil)
├── /admin/newsletter/page.tsx → DataTable (abone listesi, sil)
└── /admin/reviews/page.tsx → DataTable (onay/red toggle, sil)

Sprint A2.2: Kütüphane + Dosya Yönetimi (Gün 4-5)
│
├── 🔌 admin/library module (15 endpoint) → en zengin alt kaynak yapısı
│   └── CRUD + images(CRUD) + files(CRUD) + reorder
├── 🔌 admin/storage module (9 endpoint)
│   └── Assets CRUD + bulk upload/delete + folders
│
├── /admin/library/page.tsx → DataTable
├── /admin/library/[id]/page.tsx → Tab layout:
│   ├── Tab: Genel Bilgiler
│   ├── Tab: Görseller (CRUD)
│   └── Tab: Dosyalar (CRUD, indirme linki)
└── /admin/storage/page.tsx → File manager UI
    ├── Grid/List view toggle
    ├── Klasör navigasyonu
    ├── Drag-drop upload
    └── Bulk seçim + silme
```

---

### FAZ A3 — CRM + Teklif + Destek + Sistem (1.5 hafta)

```
Sprint A3.1: Teklifler + Katalog İstekleri (Gün 1-3)
│
├── 🔌 admin/offers module (8 endpoint)
│   └── CRUD + PDF oluştur + e-posta gönder + teklif gönder
├── 🔌 admin/catalog-requests module (5 endpoint)
│   └── CRUD + tekrar gönder
│
├── /admin/offers/page.tsx → DataTable (durum, tarih, firma)
├── /admin/offers/[id]/page.tsx
│   ├── Teklif detay + düzenleme
│   ├── "PDF Oluştur" butonu → POST /{id}/pdf
│   ├── "E-posta Gönder" butonu → POST /{id}/email
│   └── "Teklifi Gönder" butonu → POST /{id}/send
└── /admin/catalog-requests/page.tsx → DataTable + "Tekrar Gönder" aksiyon

Sprint A3.2: Destek + Kullanıcılar (Gün 4-6)
│
├── 🔌 admin/support module (8 endpoint)
│   └── Tickets CRUD + aksiyon (close/reopen) + replies
├── 🔌 admin/users module (7 endpoint)
│   └── List, detail, update, delete, active toggle, role assign, password
│
├── /admin/support/page.tsx → DataTable (durum badge, öncelik)
├── /admin/support/[id]/page.tsx
│   ├── Mesajlaşma UI (chat-style)
│   ├── Aksiyon butonları: Kapat, Yeniden Aç
│   ├── Yanıt ekle
│   └── Durum değiştir
├── /admin/users/page.tsx → DataTable (aktif/pasif, rol)
└── /admin/users/[id]/page.tsx
    ├── Kullanıcı bilgileri düzenleme
    ├── Rol atama → POST /{id}/roles
    ├── Aktif/pasif → POST /{id}/active
    └── Şifre değiştir → POST /{id}/password

Sprint A3.3: Sistem Yönetimi (Gün 7-8)
│
├── 🔌 admin/site-settings module (11 endpoint)
├── 🔌 admin/email-templates module (5 endpoint)
├── 🔌 admin/db-admin module (13 endpoint)
├── 🔌 admin/audit module (4 endpoint)
│
├── /admin/settings/page.tsx
│   ├── Key-value ayar listesi
│   ├── Inline düzenleme
│   ├── Bulk upsert
│   └── Dil ayarları (locales, default-locale)
├── /admin/email-templates/page.tsx → DataTable
├── /admin/email-templates/[id]/page.tsx → HTML editor + preview
├── /admin/database/page.tsx
│   ├── Export butonu → GET /db/export
│   ├── Import formları (SQL, URL, dosya)
│   ├── Modül export/import
│   ├── Snapshot listesi + oluştur + geri yükle + sil
│   └── Modül validation → GET /db/modules/validate
└── /admin/audit/page.tsx
    ├── Request logları → GET /audit/request-logs
    ├── Auth olayları → GET /audit/auth-events
    ├── Günlük metrikler → GET /audit/metrics/daily (grafik)
    └── Canlı stream → GET /audit/stream (SSE → real-time log)
```

---

## 6. Özet Timeline (Admin)

```
FAZ A0: Admin Altyapı          ██░░░░░░░░░░░░  1 hafta      → layout, DataTable, ortak comp, dashboard
FAZ A1: İçerik Yönetimi        ░░████░░░░░░░░  2 hafta      → products, categories, sliders, menu, pages...
FAZ A2: İletişim + Kütüphane   ░░░░░░██░░░░░░  1 hafta      → contacts, newsletter, reviews, library, storage
FAZ A3: CRM + Sistem           ░░░░░░░░███░░░  1.5 hafta    → offers, support, users, settings, db, audit
────────────────────────────────────────────────────────────
Toplam:                                         ~5.5 hafta
```

---

## 7. Birleşik Timeline (Public + Admin)

```
Hafta 1-2:    Public Faz 0-1 (altyapı + vitrin)
Hafta 3:      Public Faz 2 (içerik sayfaları)
Hafta 4-5:    Public Faz 3 (auth + kullanıcı)
Hafta 5:      Public Faz 4 (i18n + deploy) ← PUBLIC SITE CANLI

Hafta 6:      Admin Faz A0 (altyapı + dashboard)
Hafta 7-8:    Admin Faz A1 (içerik yönetimi)
Hafta 9:      Admin Faz A2 (iletişim + kütüphane)
Hafta 10-11:  Admin Faz A3 (CRM + sistem)

─────────────────────────────────────────
Public:  ~6.5 hafta
Admin:   ~5.5 hafta
Toplam:  ~12 hafta (kısmen paralel çalışılırsa ~10 hafta)
```

---

## 8. Endpoint Karmaşıklık Sıralaması

En karmaşık modülden basitine:

```
1. products      27 endpoint  (CRUD + images + faqs + specs + reviews + reorder)
2. library       15 endpoint  (CRUD + images + files + reorder)
3. db-admin      13 endpoint  (export/import/snapshot)
4. site-settings 11 endpoint  (CRUD + bulk + locales)
5. categories    11 endpoint  (CRUD + reorder + active + featured + image)
6. subcategories 11 endpoint  (aynı)
7. services      11 endpoint  (CRUD + images + reorder)
8. storage        9 endpoint  (assets + bulk + folders)
9. sliders        8 endpoint  (CRUD + reorder + status + image)
10. offers        8 endpoint  (CRUD + pdf + email + send)
11. support       8 endpoint  (tickets + replies + actions)
12. custom-pages  7 endpoint  (CRUD + reorder + by-slug)
13. users         7 endpoint  (CRUD + active + roles + password)
14. references    6 endpoint  (CRUD + by-slug)
15. faqs          6 endpoint  (CRUD + by-slug)
16. menu-items    6 endpoint  (CRUD + reorder)
17. footer        6 endpoint  (CRUD + by-slug)
18. email-tpl     5 endpoint  (CRUD)
19. catalog-req   5 endpoint  (CRUD + resend)
20. reviews       5 endpoint  (CRUD)
21. contacts      4 endpoint  (list + detail + update + delete)
22. newsletter    4 endpoint  (list + detail + update + delete)
23. audit         4 endpoint  (logs + events + metrics + stream)
24. dashboard     1 endpoint  (summary)
```

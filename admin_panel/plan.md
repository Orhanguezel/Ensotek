# Ensotek Admin Panel — AI-Destekli Modül Standardizasyonu Planı

> Referans: bereketfide/admin_panel AI-assisted module pattern
> Tarih: 2026-03-23
> Önceki plan (Vista uyarlama) tamamlandı — bu plan onun devamıdır.

---

## Mevcut Durum Analizi

### Zaten AI-Destekli Olan Modüller
| Modül | AI Assist | Images Tab | SEO Tab | JSON Tab | Locale Switch |
|-------|-----------|------------|---------|----------|---------------|
| **Products** | ✅ full | ✅ inner tab | ✅ inner tab | ✅ outer tab | ✅ |
| **Services** | ✅ full | ✅ inner tab | ✅ inner tab | ✅ outer tab | ✅ |
| **Custom Pages** (blog/news) | ✅ full | ✅ sidebar | ✅ kısmi | ✅ | ✅ |

### Altyapı Durumu
| Bileşen | Dosya | Durum |
|---------|-------|-------|
| AI Hook | `_components/common/useAIContentAssist.ts` | ✅ Hazır |
| AI API Route | `app/api/admin/ai/content/route.ts` | ✅ Hazır |
| Backend AI | `backend/src/modules/ai/content.ts` | ✅ Hazır (Groq LLM) |
| Locale Hook | `_components/common/useAdminLocales.ts` | ✅ Hazır |
| Image Upload | `_components/common/AdminImageUploadField.tsx` | ✅ Hazır |
| JSON Editor | `_components/common/AdminJsonEditor.tsx` | ✅ Hazır |
| Locale Select | `_components/common/AdminLocaleSelect.tsx` | ✅ Hazır |

### Spare Parts (Yedek Parça)
Products modülünün `itemType=sparepart` filtresi ile çalışıyor — ayrı modül yok.
Products'taki her iyileştirme otomatik olarak spare parts'a da yansır.

### Blog / News
Custom Pages modülü altında `module_key=blog` ve `module_key=news` ile yönetiliyor.
Custom Pages'teki iyileştirmeler otomatik olarak blog/news'e de yansır.

---

## Eksiklikler ve Hedefler

### Her Modülde Olması Gereken Standart

```
Outer Tabs:
├── Form Tab
│   ├── Inner Tab: Content (başlık, slug, açıklama, rich text, tags)
│   ├── Inner Tab: Images (kapak + galeri yönetimi, çoklu resim)
│   └── Inner Tab: SEO (meta_title, meta_description, og_image, Google Preview)
├── [Module-Specific Tabs] (Specs, FAQs, Reviews vb.)
└── JSON Tab (tüm formData + image sidebar)
```

### Header Standardı
```
[← Back] [Başlık: Create/Edit] .................. [AI ▼] [Locale] [Save]
                                                    ├ Tam İçerik Oluştur
                                                    ├ İçeriği Geliştir
                                                    ├ Çevir
                                                    └ SEO Meta Oluştur
```

### Modül Bazlı Eksikler

| Eksik Özellik | Products | Services | Custom Pages |
|---------------|----------|----------|--------------|
| AI Action Dropdown (4 aksiyon) | ❌ sadece full | ❌ sadece full | ❌ sadece full |
| AI Results Panel (locale kartları) | ⚠️ var ama standart dışı | ⚠️ var ama standart dışı | ⚠️ var ama standart dışı |
| Google Preview (SEO tab) | ❌ | ❌ | ❌ |
| Çoklu resim galeri (Images tab) | ⚠️ temel | ⚠️ zayıf | ❌ tek resim |
| Blog/News sidebar kısayolları | — | — | ❌ |

---

## Uygulama Fazları

### Faz A: Ortak Bileşenler (4 yeni dosya)

#### A1. `AIActionDropdown.tsx`
- **Dosya**: `admin/_components/common/AIActionDropdown.tsx`
- DropdownMenu ile 4 aksiyon: full, enhance, translate, generate_meta
- Loading state (spinner + disabled)
- `onAction(action)` callback
- i18n destekli label'lar
- Disabled when no title

#### A2. `AIResultsPanel.tsx`
- **Dosya**: `admin/_components/common/AIResultsPanel.tsx`
- Locale kartları responsive grid
- Her kart: flag/label, title preview, summary preview, "Uygula" butonu
- "Tümünü kapat" butonu
- Props: `results: LocaleContent[]`, `currentLocale`, `onApply(lc)`, `onClose()`

#### A3. `GooglePreview.tsx`
- **Dosya**: `admin/_components/common/GooglePreview.tsx`
- Google SERP benzeri preview box
- Karakter sayacı (title: 60, desc: 155)
- Props: `title`, `url`, `description`
- Uyarı renkleri (limit aşımında sarı/kırmızı)

#### A4. `ImagesGalleryTab.tsx`
- **Dosya**: `admin/_components/common/ImagesGalleryTab.tsx`
- Kapak resmi seçimi + galeri (çoklu resim)
- Grid gösterim + silme + alt text inline edit
- AdminImageUploadField entegrasyonu
- Props: `coverUrl`, `images[]`, `onCoverChange`, `onImagesChange`, `onAltChange`

### Faz B: Products Modülü Güncelleme

- `product-detail-client.tsx` refactor:
  - Header'a `AIActionDropdown` entegre et (4 aksiyon)
  - AI sonuçları → `AIResultsPanel` bileşeni
  - SEO inner tab → `GooglePreview` widget ekle
  - Images inner tab → `ImagesGalleryTab` ile güçlendir
- Locale dosyalarına AI aksiyon label'ları ekle

### Faz C: Services Modülü Güncelleme

- `admin-services-detail-client.tsx` refactor:
  - Header'a `AIActionDropdown` entegre et
  - AI sonuçları → `AIResultsPanel` bileşeni
  - SEO inner tab → `GooglePreview` widget ekle
  - Images inner tab → `ImagesGalleryTab` ile güçlendir
  - Service-specific alanları düzenle (area, duration vb. → Specs inner tab)
- Locale dosyalarına AI aksiyon label'ları ekle

### Faz D: Custom Pages (Blog/News) Güncelleme

- `custom-page-form.tsx` refactor:
  - Mevcut tek-form → inner tabs: Content / Images / SEO
  - Images → `ImagesGalleryTab` (kapak + galeri)
  - SEO → `GooglePreview` + meta alanları
  - Header'a `AIActionDropdown` entegre et
  - AI sonuçları → `AIResultsPanel` bileşeni
- `sidebar-items.ts` → blog/news kısayolları ekle
- Locale dosyalarına blog/news label'ları + AI aksiyon label'ları ekle

### Faz E: Test ve Doğrulama

- `npx tsc --noEmit` → 0 hata
- Biome lint → 0 hata
- Her modülde AI 4 aksiyon test (full/enhance/translate/generate_meta)
- Locale switching test (de/en/tr)
- Image upload/gallery test
- SEO Google Preview test
- JSON tab bidirectional sync test

---

## Öncelik Sırası

```
Faz A (Ortak bileşenler)    → Tek seferde, tüm modüller faydalanır
Faz B (Products)             → En gelişmiş, minimal değişiklik
Faz C (Services)             → Orta düzey refactor
Faz D (Custom Pages/Blog)    → En büyük refactor
Faz E (Test)                 → Son kontrol
```

## Dosya Değişiklik Özeti

### Yeni Dosyalar (4)
- `admin/_components/common/AIActionDropdown.tsx`
- `admin/_components/common/AIResultsPanel.tsx`
- `admin/_components/common/GooglePreview.tsx`
- `admin/_components/common/ImagesGalleryTab.tsx`

### Güncellenecek Dosyalar (~10)
- `products/_components/product-detail-client.tsx`
- `services/_components/admin-services-detail-client.tsx`
- `custompage/_components/custom-page-form.tsx`
- `custompage/admin-custom-pages-detail-client.tsx`
- `navigation/sidebar/sidebar-items.ts`
- `locale/tr.json`
- `locale/en.json`
- `locale/de.json`

---

## Teknik Notlar

- **de_frontend yapısına DOKUNULMAYACAK** — sadece admin panel
- Backend AI altyapısı hazır — değişiklik gerekmez
- Frontend AI hook hazır — değişiklik gerekmez
- Spare parts = products `type=sparepart` — ayrı modül yok
- Blog/News = custom_pages `module_key=blog|news` — ayrı modül yok
- Tüm yeni bileşenler `'use client'` directive kullanacak
- Stil: Sadece tema tokenları — hardcoded renk YOK
- i18n: Tüm metinler `useAdminT` ile — hardcoded metin YOK

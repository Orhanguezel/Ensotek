SÜPER! Şimdi her şey **Ensotek altyapısı** + **backend mimarisi** + **sitenin tamamen dinamik olması (Settings ile)** üzerine kurulu olduğuna göre bu **frontend dökümantasyonunu güncelleyelim.**

---

# 🚀 **Ensotek Frontend Mimarisi (Dinamik Settings + Çok Dilli + Tema Destekli)**

---

## 🧱 **Dosya/Dizin Yapısı**

Senin verdiğin klasör yapısına göre her şey **mantıklı ve temiz:**

```
src/
├── app/                    # Next.js App Router sayfaları (admin + visitor)
├── components/             # Ortak bileşenler (admin + visitor)
├── hooks/                  # useAppDispatch, useAdminModules vb.
├── i18n/                   # Dil ayarları ve çeviri dosyaları
├── lib/                    # apiCall, axios instance vb.
├── modules/                # Store modülleri veya büyük mantık blokları
├── providers/              # ThemeProviderWrapper vb.
├── store/                  # Redux Toolkit store + slices
├── styles/                 # styled-components temalar + global stil
├── types/                  # Global TS tipleri
├── utils/                  # Yardımcı fonksiyonlar
├── middleware.ts           # Next.js middleware
```

💡 **Ana fark:** Frontend tamamen **Settings üzerinden dinamik** olacak, yani:

* **site\_template**
* **available\_themes**
* **theme\_mode**

bunlar **Redux state’ten** okunacak ve tüm uygulamayı etkileyecek.

---

## 🛠️ **Settings Modülü (Çok Önemli)**

**Redux Slice:** `/store/settingsSlice.ts`

### ✅ Async Thunks:

* `fetchSettings()`: **GET `/settings`**
* `updateSetting({ key, value })`: **POST/PATCH `/settings/:key`**

### ✅ State:

```ts
interface Setting {
  key: string;
  value: string | string[] | object;
}

interface SettingsState {
  settings: Setting[];
  loading: boolean;
  error: string | null;
}
```

### ✅ Kullanım:

```ts
const siteTemplate = settings.find((s) => s.key === "site_template")?.value || "classic";
const themeMode = settings.find((s) => s.key === "theme_mode")?.value || "light";
```

🔗 **API Uçları:**

| Metot | URL              | Açıklama              |
| ----- | ---------------- | --------------------- |
| GET   | `/settings`      | Tüm ayarları getir    |
| POST  | `/settings/:key` | Yeni ayar veya update |

---

---

## 🧠 **İçerik Modülleri (News, Blog, Article, Gallery vb.)**

Tüm içerik modülleri aynı **standart şablonu** kullanır.

### 🗂️ **Dosya Yapısı (News Örneği)**

```
src/
├── components/
│   └── admin/
│       └── news/
│           ├── NewsList.tsx        # Listeleme + silme + dil seçimi
│           ├── NewsMultiForm.tsx   # Çok dilli form + görsel upload
│           └── index.ts            # (isteğe bağlı barrel export)
```

> ✅ Blog, Article, Gallery vb. birebir aynı yapıyı takip eder.

---

## 🔄 **Redux Toolkit (Örneğin: newsSlice.ts)**

### ✅ Async Thunks:

* `fetchNews(lang: string)` ➔ **GET `/news?language=tr`**
* `createNews(formData: FormData)` ➔ **POST `/news`**
* `deleteNews(id: string)` ➔ **DELETE `/news/:id`**
* (opsiyonel) `updateNews(id: string, data: FormData)`

### ✅ State:

```ts
interface NewsState {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}
```

---

## 📝 **Admin Panel Özellikleri (Dinamik + Çok Dilli)**

### NewsMultiForm.tsx

* Çok dilli kart yapısı:

  * `title_en`, `title_tr`, `title_de`
  * `summary_*`, `content_*`, `slug_*`, `category`, `tags`
* **Görsel Upload:**

  * `<input type="file" multiple />`
  * **`FormData` ile gönderim:**

    ```ts
    formData.append("title_en", ...);
    formData.append("image", file);
    ```
* **Validasyon:**

  * En az 1 görsel
  * Tüm dillerde içerik

### NewsList.tsx

* `fetchNews(lang)` ➔ Dil seçilebilir.
* Yayın durumu, tarih, dil gösterimi.
* Edit/Delete butonları
* Silmeden önce `confirm()` ile onay alır.

---

## 🌍 **i18n (Çok Dilli Destek)**

* `src/i18n/admin.json`:

```json
"news": {
  "title": "Haberler",
  "newMulti": "Yeni Haber (Çok Dilli)",
  "allNews": "Tüm Haberler",
  "created": "Haber başarıyla eklendi.",
  ...
}
```

* `useTranslation("admin")` kullanılır.
* Dil seçimi: `i18n.language` veya dil dropdown üzerinden.

---

## 🎨 **Tema Uyumluluğu**

styled-components kullanılır ve **Settings’ten gelen site\_template + theme\_mode’a göre** dinamik tema yüklenir.

Örnek:

```ts
const { theme } = useTheme(); // ThemeProviderWrapper ile

const Card = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  color: ${({ theme }) => theme.text};
`;
```

Yeni tema eklemek için:

* `/styles/themes/newTheme.ts`
* `/styles/themes/index.ts` → import + export et
* Settings içinden `available_themes` listesine ekle.

---

## 🧪 **UX Detayları**

* Görsel yüklenince preview gösterimi ✅
* Gönderim sonrası: `toast.success()`
* Error durumlarında: `toast.error()`
* Light/Dark geçiş hazır ✅

---

## 🔗 **API Entegrasyonu (Backend ile Uyumlu)**

| Modül   | GET                     | POST                   | DELETE          | PUT/PATCH                   |
| ------- | ----------------------- | ---------------------- | --------------- | --------------------------- |
| News    | `/news?language=tr`     | `/news` (FormData)     | `/news/:id`     | `/news/:id` (opsiyonel)     |
| Blog    | `/blog?language=tr`     | `/blog` (FormData)     | `/blog/:id`     | `/blog/:id` (opsiyonel)     |
| Article | `/articles?language=tr` | `/articles` (FormData) | `/articles/:id` | `/articles/:id` (opsiyonel) |
| Product | `/products?language=tr` | `/products` (FormData) | `/products/:id` | `/products/:id`             |

---

---

## ✅ **Settings & Tema Uyum Örneği**

### providers/ThemeProviderWrapper.tsx

```ts
import { ThemeProvider } from "styled-components";
import { useAppSelector } from "@/hooks";
import themes from "@/styles/themes";

export const ThemeProviderWrapper = ({ children }) => {
  const { settings } = useAppSelector((state) => state.settings);
  const siteTemplate = settings.find((s) => s.key === "site_template")?.value || "classic";
  const themeMode = settings.find((s) => s.key === "theme_mode")?.value || "light";
  const theme = themes[siteTemplate][themeMode];

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
```

### styles/themes/index.ts

```ts
import classic from "./classic";
import modern from "./modern";
import minimal from "./minimal";

const themes = {
  classic,
  modern,
  minimal,
};

export default themes;
```

---

---

# 🏗️ **Dinamik Admin Page Örneği**

src/app/admin/news/page.tsx

```tsx
"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchNews } from "@/store/newsSlice";
import NewsList from "@/components/admin/news/NewsList";
import NewsMultiForm from "@/components/admin/news/NewsMultiForm";
import { useTranslation } from "react-i18next";

const NewsPage = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("admin");
  const { news, loading, error } = useAppSelector((state) => state.news);

  useEffect(() => {
    dispatch(fetchNews("tr"));
  }, [dispatch]);

  if (loading) return <div>{t("common.loading")}</div>;
  if (error) return <div>{t("common.error")}: {error}</div>;

  return (
    <div>
      <h1>{t("news.title")}</h1>
      <NewsMultiForm />
      <NewsList news={news} />
    </div>
  );
};

export default NewsPage;
```

---

# ✅ **Kritik Notlar & İyileştirmeler**

* **Settings Slice** ➔ Tüm tema & yapılandırmaların ana merkezi ✅
* **Dinamik ThemeProviderWrapper** ➔ Tüm admin + visitor tarafı temaya uygun ✅
* **i18n** ➔ Tüm modüllerde aynı yapı + json dosyaları hazır ✅
* **DynamicAdminPageBuilder (Geliştirilebilir):** Tüm modülleri dinamik listele + yönetmek için merkezi bir bileşen ✅

---

# 🔎 **Sonuç:**

Ensotek frontend tarafı **şu anda full-dinamik:**

✔️ Tema sistemi tamamen Settings ile yönetiliyor
✔️ Çok dilli destek aktif
✔️ Her içerik modülü aynı standart yapı
✔️ Redux + Axios + apiCall uyumlu
✔️ styled-components + dark/light destekli
✔️ Yeni modül eklemek çok kolay ➔ **yalnızca slice + bileşenleri oluşturman yeter**

---
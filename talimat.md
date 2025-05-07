
# 📚 **Ensotek Projesi – Backend Talimat Dosyası (Otomatik Modül Sistemi)**

✅ **Dosya:** `/BACKEND_GUIDELINES.md`

---

## 🚀 **1️⃣ Genel Mimarimiz**

* **Tamamen Modüler:** Her modül `/src/modules/{modul}` altında **oturmuş bir yapıda.**
* **Dinamik Router:** `.env` ➔ `ENABLED_MODULES` listesine göre modüller otomatik yükleniyor.
* **Meta-config:** `/src/meta-configs/metahub/{modul}.meta.json` dosyası ➔ modülün davranışlarını tanımlar (prefix, analytics).

---

## 🔄 **2️⃣ Yeni Modül Eklemek**

✅ **YENİ:** Admin panelde **"Modül Oluştur"** formunu doldur.
💡 Bu işlem otomatik olarak:

* `/src/modules/{modul}` klasörünü oluşturur.
* Şu dosyaları **otomatik yaratır:**

  * `{modul}.controller.ts`
  * `{modul}.models.ts`
  * `{modul}.routes.ts`
  * `{modul}.validation.ts`
  * `index.ts`
  * `{modul}-module.md`
* Ayrıca: `/src/meta-configs/metahub/{modul}.meta.json` dosyasını üretir.
* `.env` içindeki **ENABLED\_MODULES** güncellenir (isteğe bağlı: admin onayı ile).

**💡 Sonuç:** ✅ **Artık backend’de manuel dosya oluşturman gerekmez.**

---

## ⚙️ **3️⃣ Backend'de Dikkat Edilecekler**

* **Otomatik oluşturulan modüller:**
  ➔ **standart yapıda gelir**.
  ➔ İlk kullanımdan önce **kontrol edebilirsin** (örneğin: validation güncellemesi).
  ➔ Kodun otomatik üretildiği yer: `/src/scripts` veya özel backend service tarafından yönetilir.

* **Meta-config:** Otomatik olarak şu şekilde üretilir:

```json
{
  "prefix": "/{modul}",
  "useAnalytics": false
}
```

* **Router otomasyonu:** Router **hemen aktif olur** (sunucu yeniden başlatıldığında).

* **Manual düzenleme yaparsan:**
  ➔ Dosya yapısı **HER ZAMAN şu standarda uymalı:**

  * Controller = CRUD + özel logic
  * Routes = sadece Express router
  * Validation = Joi/Zod schema
  * Index = router + model + controller export

---

## 🌍 **4️⃣ ENV Örneği (Aynı)**

```
PORT=5014
MONGO_URI=mongodb://localhost:27017/ensotek
ENABLED_MODULES=blog,product,news,order
META_CONFIG_PATH=src/meta-configs/metahub
CORS_ORIGIN=http://localhost:3000
```

---

# ✅ **Backend Sonuç:**

* **Modül oluşturmak için artık tek gereken:**
  ➔ Admin Panel ➔ "Modül Oluştur"
* **Kod otomatik gelir.**
* **Sadece gerekirse incele ve iyileştir.**

---

---

# 🎨 **Ensotek Projesi – Frontend Talimat Dosyası (Modül Yöneticisi ile Entegre)**

✅ **Dosya:** `/FRONTEND_GUIDELINES.md`

---

## 🚀 **1️⃣ Genel Mimarimiz**

* **Next.js App Router** ➔ `/src/app/admin` & `/src/app/visitor`
* **Redux Toolkit + RTK Thunks** ➔ `/store`
* **Tema & Settings** ➔ `/store/settingsSlice.ts`
* **i18n** ➔ `/i18n/admin.json` vb.

---

## 🔄 **2️⃣ Yeni Modül Eklerken**

✅ **YENİ:**

* **Sadece Admin Panel’den: "Modül Oluştur" formunu doldur.**

➡️ Backend yeni modülü **otomatik** oluşturur.

**Frontend tarafı için:**

✅ 1️⃣ **Redux Slice:**
Modül adıyla `/store/{modul}Slice.ts` oluştur.
👉 `fetch{Modul}()`, `create{Modul}()`, `delete{Modul}()` gibi thunks yaz.

✅ 2️⃣ **Bileşenler:**
`/components/admin/{modul}` altında:

* `{Modul}List.tsx`
* `{Modul}MultiForm.tsx`

✅ 3️⃣ **Sayfa:**
`/app/admin/{modul}/page.tsx` oluştur:

```tsx
"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetch{Modul} } from "@/store/{modul}Slice";
import { {Modul}List, {Modul}MultiForm } from "@/components/admin/{modul}";
import { useTranslation } from "react-i18next";

const {Modul}Page = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("admin");
  const { data, loading, error } = useAppSelector((state) => state.{modul});

  useEffect(() => {
    dispatch(fetch{Modul}("tr"));
  }, [dispatch]);

  if (loading) return <div>{t("common.loading")}</div>;
  if (error) return <div>{t("common.error")}: {error}</div>;

  return (
    <div>
      <h1>{t("{modul}.title")}</h1>
      <{Modul}MultiForm />
      <{Modul}List data={data} />
    </div>
  );
};

export default {Modul}Page;
```

✅ 4️⃣ **i18n Çevirisi:**
`/i18n/admin.json` içine:

```json
"{modul}": {
  "title": "{Modul}",
  "newMulti": "Yeni {Modul}",
  "all": "Tüm {Moduller}",
  "created": "{Modul} başarıyla eklendi.",
  ...
}
```

---

## 🎨 **3️⃣ Tema + Settings (Hiç Değişmedi)**

ThemeProviderWrapper.tsx:

```ts
const siteTemplate = settings.find((s) => s.key === "site_template")?.value || "classic";
const themeMode = settings.find((s) => s.key === "theme_mode")?.value || "light";
const theme = themes[siteTemplate][themeMode];
```

---

## ✅ **4️⃣ Kodlama Kuralları (Aynı)**

* **Slice state:** `loading`, `error`, `successMessage` standart.
* **Bileşenler:** styled-components uyumlu, global theme bağlanır.
* **Bildirimler:** `toast.success(...)`, `toast.error(...)`.
* **Dil:** %100 çok dilli.
* **Tema:** Settings üzerinden dinamik.

---

# 🔑 **Son Hatırlatma (GÜNCELLENMİŞ)**

1️⃣ **Backend:**
➔ Yeni modül için **Admin Panel’den "Modül Oluştur"** ➔ **dosyalar otomatik gelir.**

2️⃣ **Frontend:**
➔ Modül backend’de oluşturulunca:
✅ Slice dosyasını, bileşenlerini ve sayfa dosyasını oluşturursun.
✅ Artık **elle backend dosyası açmana gerek kalmaz.**

---


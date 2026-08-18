# ANALİZ-06 · Mimari İskelet ve Modül Kayıt Sistemi

> **Karar (2026-08-18):** *"Her şeyi bir anda değil, modül modül ilerleyeceğiz. **Ama
> iskeleti baştan beri kurabiliriz.** Modülleri de 'yakında' diyerek hazır olmayanlar
> açılmaz."*

Bu belge iki şeyi tanımlar:
1. **İskelet** — ilk günden kurulan, hiç değişmeyen taban
2. **Modül kayıt sistemi** — modüllerin tek tek açılmasını sağlayan, hazır olmayanı
   **tamamen görünmez kılan** mekanizma

---

## 1. "Yakında" yasağı — kesin kural

> ❌ Gri menü öğesi · ❌ "Yakında" rozeti · ❌ Tıklanınca "bu modül hazır değil" ekranı
> · ❌ Boş sayfa · ❌ Devre dışı buton

**Hazır olmayan modül, sistemde yokmuş gibi davranır:**

| Katman | Davranış |
|---|---|
| Menü / navigasyon | Öğe **hiç render edilmez** |
| Route | `/admin/<modul>` → **404**, yönlendirme yok |
| API | Rotalar Fastify'a **register edilmez** → 404 |
| Arama / global komut | Sonuçlarda **çıkmaz** |
| Dashboard widget | **Yerleştirilmez** |
| Yetki matrisi | Rol atansa bile modül `hidden` ise **görünmez** |

**Neden:** Kullanıcı ekranda gördüğü ama açamadığı her şeyi "eksik yazılım" olarak
algılar. Ensotek ERP'yi Faz 1'de yalnız satış ekibi kullanmaya başlayacak; onlara
kullanamayacakları 15 menü göstermek sistemi güvenilmez gösterir.

---

## 2. Modül kayıt defteri (Module Registry)

Tek bir kaynak dosya modüllerin varlığını yönetir. Desen workspace'te zaten var:
`transpalet-crm/admin_panel/src/navigation/permissions.ts` (`AdminNavKey` + `NAV_ROLES`).
Üzerine **`status`** eklenir.

```ts
// packages/erp-core/src/modules/registry.ts
export type ModuleStatus =
  | 'ready'      // canlıda, kullanıcıya açık
  | 'internal'   // yalnız admin/yazilimci görür (kabul testi)
  | 'hidden';    // sistemde YOK gibi davranır — menü yok, route 404, API kapalı

export type ModuleKey =
  | 'talep' | 'crm' | 'teklif' | 'maliyet' | 'urun_agaci'
  | 'stok'  | 'satin_alma' | 'siparis' | 'muhendislik' | 'uretim'
  | 'kalite'| 'sevkiyat' | 'servis' | 'firma_bulma' | 'navlun'
  | 'personel' | 'bakim' | 'fabrika' | 'satis' | 'muhasebe' | 'yonetim';

export const MODULE_REGISTRY: Record<ModuleKey, {
  status: ModuleStatus;
  faz: 1 | 2 | 3 | 4 | 5;
  roles: PanelRole[];
  navLabel: string;
  routeBase: string;
}> = { /* ... */ };
```

**Tek anahtar, üç yerde okunur:**

```
MODULE_REGISTRY
   ├─ backend/src/app.ts       → status !== 'hidden' ise route register et
   ├─ admin_panel/navigation   → status === 'ready' ise menüye koy
   └─ admin_panel/middleware   → hidden route'a istek gelirse 404
```

Bir modül açılırken tek satır değişir: `status: 'hidden' → 'ready'`.
Kapatmak da aynı şekilde tek satır — riskli bir modül anında geri alınabilir.

> ⚠️ Bu bir **feature-flag değil**. Feature flag "özellik var ama kapalı" demektir;
> burada modül **yok**. API rotaları hiç kayıt edilmediği için yetkisiz erişim yüzeyi de
> oluşmaz.

---

## 3. İskelet — ilk günden kurulacaklar

Modüllerden bağımsız, hepsinin üzerine oturduğu taban. **Faz 0.**

### 3.1 Depo yapısı
```
ensotek-erp/
├── backend/            Fastify + TypeScript
│   └── src/
│       ├── modules/    her modül: controller|repository|router|schema|service|validation
│       ├── db/
│       │   ├── schema/         Drizzle
│       │   └── seed/sql/       0XX_*_schema.sql  ← ALTER TABLE YASAK
│       ├── core/       config, hata, log, requireEnv
│       └── app.ts      registry'den route kaydı
├── admin_panel/        Next.js 16 — asıl ERP arayüzü
├── frontend/           (opsiyonel) müşteri portalı — ileride
├── packages/
│   ├── erp-core/       MODULE_REGISTRY, roller, numaralandırma, para/kur
│   ├── erp-types/      paylaşılan tipler
│   └── erp-ui/         ortak bileşenler, tablo, form, PDF şablon taban
└── docs/
```
Kaynak: `sablon_proje/` + `Ensotek/packages/` deseni.

### 3.2 Çekirdek servisler (modül değil, altyapı)

| # | Servis | Kaynak | Neden ilk gün |
|---|---|---|---|
| I-01 | Kimlik doğrulama + oturum | Ensotek `shared-backend/auth` | Her modül buna bağlı |
| I-02 | Rol ve yetki matrisi | `userRoles` + registry | Modül açıldıkça genişler |
| I-03 | **Proje/İş numarası üreteci** | Yeni | ENK/ENB + teklif no + PRJ — sonradan değişmez |
| I-04 | Dosya deposu | `shared-backend/storage` | PDF, DWG, fotoğraf |
| I-05 | PDF üretim tabanı | **TeklifRota** `document-service`, `proforma-document`, `packing-document`, `workbook-export`, `streaming-export` | 3 şablon: teknik / ticari / iç maliyet |
| I-06 | Mail gönderimi + şablon | `mail`, `emailTemplates`, `mailAccounts` | Teklif gönderimi |
| I-07 | Bildirim | `notifications` | Stok uyarısı, görev, hatırlatma |
| I-08 | **Denetim izi (audit)** | `admin_audit` | "Kim ne zaman değiştirdi" — maliyet için şart |
| I-09 | **Para birimi ve kur** | Yeni + `fixed-decimal` | EUR bazlı fiyat, kur okuma |
| I-10 | **Ek/dosya + arşiv motoru** | `storage` üstüne | Teklif no bazlı otomatik klasör |
| I-11 | Arama | Yeni | Modül eklendikçe beslenir |
| I-12 | Ayarlar / tanımlar | `tanimlar`, `siteSettings` | Atölye, birim, vergi, sabitler |
| I-13 | **Excel içe aktarma altyapısı** | TeklifRota `customer-import`, `import.ts`, `264_product_catalog_import.sql`, `270_product_import_audit.sql` | [Veri göçü](07-excel-veri-gocu.md) |
| I-15 | **Müşteri portalı tabanı** (token'lı genel bağlantı) | TeklifRota `public-link-service`, `quote_delivery_public_links` | Teklifin müşteriye açılması — MOD-02 |
| I-16 | **Navlun motoru paketi** | **`@teklifrota/freight-engine`** — bağımsız paket, 5.515 satır | `packages/` altına olduğu gibi taşınır |
| I-14 | Yedekleme + db_admin | `db_admin` | Tek ERP → veri kaybı kabul edilemez |

### 3.3 İlk günden kurulacak veri çekirdeği

Bunlar modül değil, **tüm modüllerin paylaştığı tablolar**. Sonradan değiştirmek pahalı:

```
kullanicilar · roller · yetkiler
firmalar (müşteri + tedarikçi + taşeron aynı tabloda, tip alanıyla)
kisiler (firma yetkilileri)
projeler          ← sistemin merkezi nesnesi
urunler           ← mamul | yarı mamul | hammadde | ticari mal | hizmet
birimler · para_birimleri · kurlar
dosyalar · audit_log · bildirimler · gorevler
numaralandirma_sayaclari
```

> **Proje tablosu ilk gün kurulur** — Faz 1'de yalnız teklif alanları dolar, ama
> üretim/sevkiyat/servis alanları şemada baştan yer alır. Böylece Faz 2'de tablo
> yeniden yapılandırılmaz.

### 3.4 Numaralandırma — ilk gün sabitlenir

| Tip | Format | Kaynak |
|---|---|---|
| Proje | `PRJ-2026-00158` | Yeni |
| Teklif | `TKF-2026-00452` | Bugün Excel sırası |
| **Küçük iş / malzeme** | **`ENK-5715`** | **Mevcut Excel sırasından devam eder** |
| **Büyük iş** | **`ENB-####`** | **Mevcut Excel sırasından devam eder** |
| Sipariş | `SIP-2026-00112` | Yeni |
| İş emri | `IEM-2026-00087` | Yeni |
| Satın alma | `SAT-2026-00045` | Yeni |
| Servis | `SRV-2027-00012` | Yeni |

> ENK/ENB sayaçları **mevcut Excel'deki son numaradan devam etmelidir** — Ensotek'in
> geçmiş iş numaraları canlıda kullanılıyor, sıfırlanamaz.

---

## 3.5 Çok kiracılılık — devralınan şemanın kararı

TeklifRota'dan gelen 73 seed-SQL şemasının **45'inde `tenant_key` var**.
Ensotek ERP tek kiracılıdır ama **`tenant_key` sökülmeyecek**:

- Sabit tek değere bağlanır (`tenant_key = 'ensotek'`), sorgular ve testler olduğu gibi çalışır
- Sökmek yüzlerce dokunuş demek; kazancı yok, kırma riski yüksek
- İleride Ensotek'in dört sitesi/şirketi (ensotek.de, ensotek.com.tr, kompozit, kuhlturm)
  ayrı kiracı olarak ayrışmak isterse altyapı hazır olur

**Alınmayacak SaaS modülleri:** `billing`, `payments`, `entitlements`, `tenants`,
`tenant-settings`, `auth-onboarding`, `partner-api`, `cloud-costs`.
**Alınacaklar:** `tenant-audit` (denetim izi), `privacy` (KVKK yaşam döngüsü).

---

## 4. Teknoloji — karar verildi

> *"Teknoloji bizim teknoloji olacak."* ChatGPT'nin önerdiği ASP.NET Core + MSSQL
> **kullanılmayacak.**

| Katman | Seçim |
|---|---|
| Backend | **Fastify + TypeScript + Bun** |
| ORM / DB | **Drizzle ORM + MySQL** (seed-SQL disiplini, `ALTER TABLE` yasak) |
| Admin arayüz | **Next.js 16 + React 19 + TypeScript** |
| State | Redux Toolkit / React Query (workspace standardı) |
| UI | Tailwind CSS v4 + Shadcn/Radix |
| PDF | Sunucu tarafı üretim — 3 şablon |
| Dosya | Yerel disk + (gerekirse) Cloudinary |
| Auth | JWT — **`requireEnv`, fallback secret YASAK** (workspace güvenlik kuralı) |
| Deploy | Docker + Nginx + PM2, VPS |
| Mobil | PWA (saha: iş emri, kalite, sevkiyat, servis) |

---

## 5. Faz 0 — İskelet çıktısı

Faz 0 bittiğinde ortada **hiçbir iş modülü olmayan ama çalışan** bir sistem olur:

- ✅ Giriş yapılabilir, roller çalışır
- ✅ Boş bir dashboard ve **yalnız `ready` modülleri gösteren** menü
- ✅ Firma/kişi/ürün/proje tabloları kurulu
- ✅ Dosya yükleme, PDF üretimi, mail gönderimi çalışır
- ✅ Numaralandırma üreteci çalışır (ENK/ENB Excel'den devralınmış)
- ✅ Audit log yazıyor
- ✅ Excel içe aktarma altyapısı ayakta
- ✅ Deploy hattı kurulu, VPS'te ayakta

Bu noktada menüde **hiçbir modül görünmez** — ilk `ready` modül Faz 1'in sonunda
Teklif olur. Bu, "yakında" yasağının doğal sonucudur ve doğru davranıştır.

---

## 6. Modül açılış kontrol listesi

Bir modül `hidden → ready` olmadan önce hepsi ✅ olmalı:

- [ ] Şema `seed/sql` içinde, `db:seed:fresh` ile sıfırdan kuruluyor
- [ ] Rotalar registry üzerinden kayıtlı, yetki kontrolü var
- [ ] **Gerçek Ensotek verisi** yüklendi (test verisi değil)
- [ ] Ensotek'ten en az bir kullanıcı gerçek bir işi baştan sona yaptı
- [ ] Yerini aldığı **Excel/Word artık kullanılmıyor** — paralel çalışma yok
- [ ] Audit log yazıyor
- [ ] Yedekleme kapsamında
- [ ] Kullanıcı eğitimi verildi

> Son iki madde kritik: *"Mevcut Excel sistemlerini bir daha kullanmayacaklar."*
> Bir modül açıldıysa eski dosya **kapanır**. Paralel çalışma, verinin iki yerde
> ayrışması demektir.

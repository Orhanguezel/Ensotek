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

**Marka boyutu ile karıştırılmaz:** `status` modülün sistemde var olup olmadığını,
marka (Ensotek / MOE Kompozit) ise ürünün hangi aileye ait olduğunu belirler. İkisi ayrı
eksendir; marka bir yetki mekanizması değildir.

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
personel · departmanlar · atolyeler
makineler · vardiyalar · durus_nedenleri · tatil_takvimi
firmalar (müşteri + tedarikçi + taşeron, tip alanıyla) · kisiler
projeler                  ← sistemin merkezi nesnesi
urunler                   ← tip: mamul | yarı mamul | hammadde | ticari mal | hizmet
                            marka: ensotek | moe_kompozit      ← ürün ailesi ekseni
urun_agaclari · maliyet_kayitlari
talepler · teklifler · siparisler · is_emirleri
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

## 3.5 Tek kiracı, iki marka

> **Karar (2026-08-18, Orhan):** *"Kompozit kısmı ayrı bir ürün olacak. **MOE Kompozit**
> markası olacak. Faturalarda şu an Ensotek kullanılıyor. Yani ayrı bir tenant olmayacak."*

**Ensotek ERP tek kiracılıdır.** Karbonkompozit ayrı bir şirket değil, Ensotek'in
**ikinci ürün ailesi ve markası**dır. Fatura, cari, personel, fabrika ve muhasebe tek
tüzel kişilik altında yürür.

### 3.5.1 Doğrulanan ürün yapısı

| Marka | Siteler | Ürünler |
|---|---|---|
| **Ensotek** | ensotek.de · ensotek.com.tr · kuhlturm.com | Soğutma kulesi: CC-CTP (kapalı devre), CTP tek hücre, DCTP çift hücre, TCTP üç hücre + **9 yedek parça** (motor-redüktör-fan grubu, titreşim şalteri, fan, servis penceresi, su dağıtım sistemi, nozul, FRP pultruzyon profil, damla tutucu, PVC film dolgu) |
| **MOE Kompozit** | karbonkompozit.com.tr | Lunapark ve tema parkı kompozit ürünleri: kızak araç setleri, amusement ride kabini, tema parkı dekoru |

İki ürün ailesinin **imalat altyapısı büyük ölçüde aynı** — polyester atölyesi, reçine,
cam elyaf, jelkot. Ayrışan tek şey ürün ve reçetedir.

### 3.5.2 Kiracı değil, **marka / ürün ailesi ekseni**

Ayrım tek bir alanla çözülür: ürün kartında **marka (ürün ailesi)**.

```
urunler
  ...
  marka   enum('ensotek','moe_kompozit')
```

Bu alan şuraları besler:
- **Ürün ve ürün ağacı listeleri** — marka filtresi
- **Teklif ve teklif belgeleri** — hangi markanın antetiyle çıkacağı
- **Satış ve kârlılık raporları** — marka bazında ciro ve kâr
- **Fuar ve firma bulma** — MOE Kompozit'in hedef kitlesi farklı
- **Web sitesi eşlemesi** — hangi ürün hangi siteye ait

**Ayrılmayanlar** (tek şirket olduğu için): cari hesap · fatura ve irsaliye · muhasebe ·
personel · atölyeler · makineler · bakım · vardiya · depo · tedarikçiler · kullanıcılar ·
iş numarası serisi *(ENK/ENB her iki ürün ailesi için de kullanılır)*.

> **Belge anteti ayrı olabilir:** Teklif PDF'inde MOE Kompozit logosu ve markası
> kullanılırken, **fatura Ensotek adına** kesilir. Bu bir belge şablonu ayarıdır,
> ayrı bir muhasebe yapısı değil → [S-13](04-acik-sorular.md)

### 3.5.3 Devralınan `tenant_key` ne olacak

TeklifRota'dan gelen 73 seed-SQL'in 45'inde `tenant_key` var.

**Karar: sökülmez, sabit tek değere bağlanır** (`tenant_key = 'ensotek'`).

| | |
|---|---|
| ✅ Sorgular ve izolasyon testleri olduğu gibi çalışır | Sökmek yüzlerce dokunuş, kazancı yok |
| ✅ İleride MOE Kompozit ayrı tüzel kişiliğe dönerse altyapı hazır | Bugün için maliyeti sıfır |
| ❌ Kullanıcıya kiracı seçici gösterilmez | Tek şirket — arayüzde böyle bir kavram yok |

**Alınmayacak SaaS modülleri:** `billing`, `payments`, `entitlements`, `tenants`,
`tenant-settings`, `auth-onboarding`, `partner-api`, `cloud-costs`.
**Alınacaklar:** `tenant-audit` (denetim izi), `privacy` (KVKK yaşam döngüsü).

### 3.5.4 Efor etkisi

Marka ekseni, kiracı ekseninden **belirgin şekilde ucuz**: bir enum alanı, listelerde
filtre, belge şablonunda marka seçimi ve raporlarda kırılım. **+2 – 4 adam-gün**,
tamamı S1'de.

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

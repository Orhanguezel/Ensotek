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

**Kiracı boyutu:** `status` sisteme, kiracı yetkisi kullanıcıya bakar. Bir modül `ready`
olsa bile kullanıcının o kiracıda yetkisi yoksa görünmez. İkisi ayrı eksendir ve
karıştırılmaz.

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
ORTAK (kiracısız)
  kiracilar                        ← ensotek · kompozit
  kullanicilar · roller · yetkiler · kullanici_kiraci_yetkileri
  personel · departmanlar · atolyeler
  makineler · vardiyalar · durus_nedenleri · tatil_takvimi
  tedarikciler
  birimler · para_birimleri · kurlar
  dosyalar · audit_log · bildirimler

KİRACIYA ÖZEL (tenant_key)
  firmalar (müşteri) · kisiler
  projeler                         ← sistemin merkezi nesnesi
  urunler                          ← mamul | yarı mamul | hammadde | ticari mal | hizmet
  urun_agaclari · maliyet_kayitlari
  talepler · teklifler · siparisler · is_emirleri
  gorevler · numaralandirma_sayaclari
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

## 3.5 Çok kiracılılık — **gerçek ihtiyaç, gün birden**

> **Güncelleme (2026-08-18):** Önceki sürümde "Ensotek tek kiracılıdır, `tenant_key`
> sabit değere bağlanır" yazıyordu. **Bu yanlıştı.** Ensotek iki ayrı ürün ailesi
> yönetiyor ve çok kiracılılık **gerçek bir gereksinim**.

### 3.5.1 Doğrulanan durum

Ensotek'in dört sitesi/reposu incelendi:

| Repo | Alan adı | Veritabanındaki ürünler |
|---|---|---|
| `ensotek_de` | ensotek.de | **Soğutma kulesi:** CC-CTP (kapalı devre), CTP tek hücre, DCTP çift hücre, TCTP üç hücre + **9 yedek parça** (motor-redüktör-fan grubu, titreşim şalteri, fan, servis penceresi, su dağıtım sistemi, nozul, FRP pultruzyon profil, damla tutucu, PVC film dolgu) |
| `ensotek_com_tr` | ensotek.com.tr | Aynı ürün ailesi — TR pazarı |
| `kuhlturm` | kuhlturm.com | Aynı ürün ailesi — DE/EN pazarı, **ensotek DB'sini paylaşıyor** |
| `kompozit` | karbonkompozit.com.tr | **Tamamen farklı ürün ailesi:** lunapark ve tema parkı kompozit ürünleri — kızak araç setleri, amusement ride kabini, tema park dekoru |

**Karbonkompozit, Ensotek'in yeni firmasıdır.** CTP/kompozit imalat bilgisini farklı bir
pazara taşıyor. Ürün ailesi soğutma kulesiyle **hiç örtüşmüyor**, ama üretim altyapısı
(polyester atölyesi, reçine, cam elyaf, jelkot) büyük ölçüde **aynı**.

### 3.5.2 Karar — kiracı ekseni korunur ve kullanılır

`tenant_key` sabitlenmeyecek; **canlı kiracı ekseni** olarak çalışacak.
Bu, devralınacak kod için **iyi haber**: TeklifRota zaten çok kiracılı ve
`tenant-isolation.test.ts` dahil izolasyon testleriyle geliyor. Kodu kısıtlamak yerine
**tasarlandığı gibi** kullanıyoruz.

Başlangıç kiracıları:
```
ensotek     → soğutma kulesi (ensotek.de · ensotek.com.tr · kuhlturm.com)
kompozit    → karbonkompozit (lunapark / tema parkı kompozit ürünleri)
```

### 3.5.3 Ortak mı, kiracıya özel mi

Asıl tasarım kararı budur. Yanlış tarafa koyulan her tablo sonradan pahalıya patlar.

**Kiracıdan bağımsız — tek havuz (fabrika bir tane)**

| Alan | Gerekçe |
|---|---|
| Kullanıcılar, roller, yetkiler | Aynı kişi iki kiracıda da çalışıyor; kiracı bazlı yetki verilir |
| **Personel** | Aynı fabrika, aynı insanlar |
| **Atölyeler ve kapasite** | Polyester atölyesi hem kule hem lunapark ürünü üretiyor |
| **Makine/ekipman ve bakım** | Tek fabrika ekipmanı |
| Vardiya, duruş nedenleri, tatil takvimi | Fabrika geneli |
| Tedarikçiler | Ortak satın alma gücü |
| Birim tanımları, para birimleri, kur | Sistem sabitleri |
| Doküman deposu, bildirim, denetim izi | Altyapı |

**Kiracıya özel — ayrı**

| Alan | Gerekçe |
|---|---|
| **Ürünler ve ürün ağaçları** | CTP-5 ile lunapark kızağının ortak noktası yok |
| Müşteriler | Farklı pazarlar, farklı satış ekipleri |
| Talepler, teklifler, maliyet, snapshot | Fiyatlandırma mantığı ayrı |
| **İş numarası serileri** | ENK/ENB Ensotek'e özgü; kompozit kendi serisini kullanır |
| İş emirleri, sevkiyat, ihracat evrakı | İşin sahibi kiracı |
| Satış, fuar, firma bulma | Ayrı pazar, ayrı hedef kitle |
| Cari hesap ve muhasebe | Ayrı tüzel kişilik olabilir → [S-13](04-acik-sorular.md) |

### 3.5.4 Kritik nokta — atölye kuyruğu birleşik olmalı

> İş emri **kiracıya özeldir**, ama **atölye kuyruğu ve kapasite kiracılar arası
> birleşiktir.**

Polyester atölyesi aynı hafta hem bir CTP gövde hem bir lunapark kabini üretiyorsa,
kapasite planlaması ikisini **birden** görmek zorundadır. Aksi halde iki ayrı sistem aynı
atölye için birbirinden habersiz plan yapar ve termin tarihleri tutmaz.

Aynı şey **stok** için de geçerli olabilir: reçine, cam elyaf ve jelkot her iki üründe de
kullanılıyor. Ortak malzeme havuzu mu, ayrı depo mu → [S-15](04-acik-sorular.md).

### 3.5.5 Efor etkisi

| Kaynak | Durum | Etki |
|---|---|---|
| **TeklifRota** modülleri | Zaten çok kiracılı, izolasyon testli | ✅ Kazanç — kısıtlamaya gerek yok |
| **paspas / transpalet / osgb** modülleri | Tek kiracılı | 🟡 `tenant_key` eklenecek, sorgular kapsanacak |
| Ortak tablolar (personel, atölye, makine, tedarikçi) | — | ✅ Zaten kiracısız; olduğu gibi kalır |

Net etki **küçük ve mekanik**: kiracıya özel tablolara kolon + sorgu kapsamı + kiracı
seçici arayüz. Mimari bir dönüşüm değil, çünkü eksen devralınan kodda zaten var.

**Alınmayacak SaaS modülleri:** `billing`, `payments`, `entitlements`, `auth-onboarding`,
`partner-api`, `cloud-costs` — abonelik/faturalandırma işidir.
**Alınacaklar:** `tenants` ve `tenant-settings` *(artık gerekli)*, `tenant-audit`, `privacy`.

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

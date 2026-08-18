# Ensotek ERP — Analiz ve Kapsam Çalışması

> **Durum: KAPSAM BELİRLEME. Geliştirme başlamadı. Fiyat verilmedi.**

Su soğutma kulesi üretimi için proje bazlı teklif, maliyet, üretim, sevkiyat ve servis
yönetim sistemi. Bu klasör, projenin **analiz ve kapsam** aşamasını tutar — kod değil.

---

## Dosyalar

### 📥 Kaynak — ham, değiştirilmez

| Dosya | İçerik |
|---|---|
| [kaynak/01-hamdi-gorusme-tam-dokum.md](kaynak/01-hamdi-gorusme-tam-dokum.md) | Hamdi Bey ↔ ChatGPT görüşmesinin **tam dökümü** (14 soru / 14 cevap, ~69.000 karakter) |
| [kaynak/02-hamdi-anlatimi-ham-kayit.md](kaynak/02-hamdi-anlatimi-ham-kayit.md) | **Yalnız Hamdi Bey'in yazdıkları**, birebir. Gereksinimlerin tek doğruluk kaynağı. |

### 📊 Analiz — bizim ürettiğimiz

| Dosya | İçerik |
|---|---|
| [analiz/01-mevcut-durum-as-is.md](analiz/01-mevcut-durum-as-is.md) | Ensotek'in bugünkü süreci: teklif, üretim, ürün ağacı, stok, darboğazlar |
| [analiz/02-ihtiyac-listesi.md](analiz/02-ihtiyac-listesi.md) | **111 gereksinim**, her biri kaynağına bağlı (teyitli / çıkarım / öneri / hariç) |
| [analiz/03-kapsam-taslagi.md](analiz/03-kapsam-taslagi.md) | Modül haritası, 4 faz, opsiyon listesi, teknoloji önerisi, sistem ne DEĞİL |
| [analiz/04-acik-sorular.md](analiz/04-acik-sorular.md) | **Fiyat vermeden önce cevaplanması gereken sorular** |

---

## Kaynak etiketleri — bu ayrım kritik

İhtiyaç listesindeki her madde kaynağıyla işaretlidir:

| Etiket | Anlamı |
|---|---|
| **[H]** | Hamdi Bey açıkça söyledi → **75 madde**, kapsama girer |
| **[H-ç]** | Anlatımdan doğrudan çıkarım → **9 madde**, teyit edilecek |
| **[Ö]** | ChatGPT önerisi, Ensotek onayı **yok** → **26 madde**, ayrı opsiyon olarak fiyatlanır |
| **[X]** | Açıkça hariç tutuldu → **1 madde** (prim hesabı) |

> ⚠️ ChatGPT görüşmede çok sayıda özellik önerdi. Bunlar **müşteri talebi değildir**.
> Fiyat, `[H] + [H-ç]` üzerinden verilir; `[Ö]` kalemleri opsiyon listesi olarak sunulur.

---

## Kısa tablo — Ensotek bugün nasıl çalışıyor

| Alan | Bugün |
|---|---|
| Teklif numarası | Excel sırası |
| İş numarası | Excel sırası — **ENK** (küçük iş + malzeme) / **ENB** (büyük iş) |
| Teklif şablonu | Word / Excel |
| Kule seçimi | Basılı tablolar + harici web seçim yazılımı |
| Ürün ağaçları | Excel — açık tip ~100 model, kapalı tip 30–40 model |
| Birim fiyatlar | Ayrı Excel; ürün ağaçları oradan okur |
| Serpantin maliyeti | Ayrı Excel — model × kat sayısı |
| CTP gövde maliyeti | Ayrı Excel — **kg bazlı** (örn. 270 kg × 10 $/kg) |
| Pano fiyatı | Ayrı Excel, otomasyoncu hesaplar |
| Fiyatlandırma | Maliyet × çarpan × pazarlık payı (%3–5) × Euro kuru |
| Teklif İnceleme Formu | Word — çıktısı **elden** imalata teslim edilir |
| Stok kodu | **Yok** |
| Stok takibi | Gözle; bazı kalemler Excel'de |
| Arşiv | Teklif no adlı klasörde PDF'ler |
| Takip | Manuel, "ara ara" |

---

## Beyan edilen darboğazlar → faz sırası

| Darboğaz | Faz |
|---|---|
| Teklif hazırlama · maliyet analizi · gönderme | **Faz 1** — Teklif + Maliyet + BOM |
| Malzeme listesi oluşturma ("uzun zaman alıyor") | **Faz 2** — Mühendislik + Satın Alma |
| İş emri hazırlama/dağıtma · evrak işleri | **Faz 3** — Üretim + Kalite + Sevkiyat |
| Servis takibi | **Faz 4** — Süpervizörlük + Servis |

Faz sırası modül numarasına göre değil, **Ensotek'in kaybettiği zamana göre** kuruldu.

---

## Sonraki adımlar

- [ ] Kapsam taslağının Ensotek ile gözden geçirilmesi
- [ ] 🔴 işaretli 4 sorunun cevaplanması ([S-01…S-04](analiz/04-acik-sorular.md)) — **fiyatı bunlar belirler**
- [ ] Efor tahmini
- [ ] Fiyat teklifi
- [ ] *(onay sonrası)* Veritabanı tasarımı ve geliştirme

---

## Not — teknoloji

ChatGPT görüşmede ASP.NET Core + MSSQL önerdi. **Bizim önerimiz workspace standardıdır:**
Next.js 16 + Fastify + Drizzle ORM + MySQL, Docker/Nginx/PM2 ile VPS'te.
Gerekçe: [analiz/03-kapsam-taslagi.md §6](analiz/03-kapsam-taslagi.md).

---

*Kaynak alındı: 2026-08-18 · https://chatgpt.com/share/6a74d01b-9d04-83ed-a7d2-1fb546d194fa*

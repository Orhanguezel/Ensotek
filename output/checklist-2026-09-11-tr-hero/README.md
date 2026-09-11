# TR11 — ensotek.com.tr hero ürün mozaiği (11 Eylül 2026)

**İstek (kullanıcı):** MOE'de yaptığımız gibi ensotek.com.tr hero'sunda da ürünler gösterilsin.

**Tasarım:** Sol kolon (rozet, başlık, alt başlık, CTA'lar, istatistikler) korundu; büyük ekranda sağa `HeroProductShowcase` eklendi:
farklı kategorilerden 3 kule (1 büyük + 2 kart: görsel, kategori, ad, sıra numarası, ok), üstte "Our Product Range / See all 17 products",
altta çipler: kategori adları + "Spare Parts (13)" → `/products#spare-parts` (ürünler sayfasına anchor eklendi). Sunucu bileşeni, JS yok;
ilk görsel `priority`; Cloudinary görselleri Next optimizer ile. Veri: `products?item_type=product` (limit 24) + yedek parça sayısı;
ürün/marka adı kodda yok; 2'den az ürün varsa hero tek kolon kalır. Başlık mozaikli düzende yarım kolona göre küçültüldü (`.hero--with-showcase h1`).
Mobil: büyük kart 16/10 + iki kare kart; CTA–istatistik boşluğu azaltıldı; uzun adlar 3/4 satırda kırpılır.

**Kabul (`scripts/accept-tr-hero-showcase.py`) — yerel aday ve canlı, EN/TR × masaüstü/mobil PASS (`candidate-acceptance.json`, `live-acceptance.json`):**
3 kart, ilk görsel `fetchpriority=high`, tüm görseller yüklü, 6 bağlantı 200, yatay taşma yok, JS hatası yok, "17 ürünün tümünü gör".
Ekran görüntüleri `live-{desktop,mobile}-{en,tr}-dark.png`, masaüstü açık tema `live-desktop-*-light.png`.

**Mobil Lighthouse 12.8.2 (`/en`, iki koşu):** performans **94 / 95**, LCP 2,7 sn (LCP elementi H1), TBT 170 / 90 ms, CLS 0,003 / 0; A11y/BP/SEO 100. Laboratuvar örneğidir.

Kapılar: `build-checklist-production.sh ensotek_com_tr` (78 URL), tsc temiz. Rollback `.next.before-checklist-20260911T170554Z`;
8 kaynak dosya canlı checkout ile hash eşit. Commit `ensotek_com_tr` `0388f71`.

**Not:** Bir ürünün TR `alt` metni İngilizce ("Open circuit cooling t…") — veri eksiği, admin panelden düzeltilebilir; kod değişikliği gerekmez.

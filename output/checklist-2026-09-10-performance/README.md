# DE16 — 10 Eylül 2026 devam kabulü

Canlı ürün: https://ensotek.de/de/product/offene-kuehltuerme-einzelzelle-ctp-serie

- `settings-equivalence.json`: DE/EN/TR tam ve filtrelenmiş layout değerlerinin eşitliği; DE 83.965 → 2.377 bayt.
- `build.log`: başarılı TypeScript, production build, 1.165 sitemap URL ve origin kontrolü.
- `deploy.txt`: canlı frontend değişimi ve rollback yolu.
- `browser.txt`, `browser-summary.json`: mobil/masaüstü/azaltılmış hareket kontrolleri. AOS chunk yalnızca masaüstü; logo, footer, taşma, JS hata kabulü.
- `lighthouse.json`, `summary.json`: 09:10 UTC tek yeni mobil koşu, performans 70, LCP 4,386 sn, TBT 471 ms, CLS 0; A11y/BP/SEO 100.

Önceki koşu `../checklist-2026-09-10-cookie/de-product-lighthouse.json`: 65 / 4,860 sn / 453 ms / 0. TBT iyileşmedi. Gerçek kullanıcı CWV kanıtı yok; DE16 açık tutuldu. Dış mesaj veya form gönderilmedi.

CLI tarayıcı oturumu iki kez kapandı; kabul aynı Playwright motoruyla ayrı Node sürecinde yapıldı. İlk masaüstü kontrolü logo yüklenmesini beklemiyordu; gerçek görsel yükleme koşulu eklendi ve üç profil tamamlandı.

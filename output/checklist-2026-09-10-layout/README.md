# DE16 sunucu Layout kabulü — 10 Eylül 2026

Layout ve locale not-found sunucuda render ediliyor; menü/footer etkileşimleri kendi istemci bileşenlerinde kalıyor.

- `build.log`: TypeScript, üretim derleme, 1.165 sitemap ve origin kontrolü.
- `browser.json`: mobil menüden iletişime geçiş, footer tercihi; DE/EN/TR bilinmeyen ürünlerde 390/1440 px HTTP 404 + noindex + taşma/hata kontrolü.
- `deploy.txt`, `source-sync.json`: canlı rollback ve iki dosyanın hash eşitliği.
- `lighthouse.json`, `summary.json`: 09:36 UTC tek yeni koşu; performans 83, LCP 3,721 sn, TBT 168,5 ms, CLS 0; A11y/BP/SEO 100. JS aktarımı 279.281 bayt / 17 dosya.

Önceki `../checklist-2026-09-10-icons/lighthouse.json`: 65 / 4,309 sn / 645 ms; JS 349.337 bayt / 22 dosya. Ölçümde build/arşivleme/tarayıcı otomasyonu eşzamanlı çalıştırılmadı. Laboratuvar sonucu gerçek kullanıcı CWV kanıtı değildir; DE16 açık.

Tarayıcı kontrolü: `PLAYWRIGHT_MODULE=<kurulu-playwright-core> node scripts/verify-de-layout-boundary.cjs`.

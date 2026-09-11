# DE16 ikon CSS kabulü — 10 Eylül 2026

- `css-build.json`: 470.470 → 29.531 bayt, kaynak ikon kuralları korunuyor.
- `browser-before.json` / `browser-after.json`: beş canlı sayfanın ikon karakter/font/sınıf karşılaştırması aynı. Dinamik CMS ikonu tam CSS'yi bir kez yükledi; yalnızca tarayıcı DOM'una test elemanı eklendi.
- `build.log`: TypeScript, üretim origin kontrolü, 1.165 sitemap URL.
- `deploy.txt`, `source-sync.json`: canlı dağıtım/rollback ve üç kaynak dosyasının hash eşitliği.
- `lighthouse.json`, `summary.json`: ilk açılış ikon CSS aktarımı 4.277 bayt; tam dosya yüklenmedi. Son mobil skor 65, LCP 4,309 sn, TBT 645 ms, CLS 0; A11y/BP/SEO 100.

Önceki `../checklist-2026-09-10-performance/lighthouse.json` koşusu 70 / 4,386 sn / 471 ms. Toplam skor/TBT kötüleşti; payload azaltımı toplam performans başarısı olarak sunulmadı. DE16 ve gerçek kullanıcı CWV kabulü açık. Ölçüm sırasında build, arşivleme veya tarayıcı otomasyonu çalıştırılmadı.

Tekrar üretim: `python3 scripts/build-de-icon-css.py` (üretim build yardımcısında otomatik). Tarayıcı kontrolü: `PLAYWRIGHT_MODULE=<kurulu-playwright-core-yolu> node scripts/verify-de-icon-css.cjs --after`.

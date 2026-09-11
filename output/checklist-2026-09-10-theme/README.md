# DE16 kullanılmayan tema CSS — 10 Eylül 2026

Aktif route'larda kullanılmayan `.fourth-page` tema kuralları global importtan ayrıldı. Orijinal SCSS kaynağı korunuyor; ortak root değişkenleri ve farklı global keyframe küçük `bootstrap-theme.scss` içinde tutuldu.

- `build.log`: üretim/TypeScript, 1.165 sitemap ve origin kontrolü.
- `browser-before.json`, `browser-after.json`, `browser-summary.json`: 10 ekran, 562 öğe, hesaplanmış renk/font/yerleşim stilleri aynı; taşma ve JS hatası yok. İlk snapshot'taki otomatik margin zamanlama farkı, capture öncesi layout hesabının tamamlatılmasıyla çözüldü.
- `deploy.txt`, `source-sync.json`: canlı rollback ve iki kaynak hash eşitliği.
- `lighthouse.json`, `summary.json`: CSS 84.413 → 58.062 bayt aktarım. Son performans 90, LCP 2,186 sn, TBT 369 ms, CLS 0,00038; A11y/BP/SEO 100.

Önceki `../checklist-2026-09-10-layout/lighthouse.json` 83 / 3,721 sn / 168,5 ms idi. TBT kötüleşti; laboratuvar LCP hedefi bu koşuda sağlansa da DE16 saha CWV ve TBT kabulü açık. Tek yeni Lighthouse koşusu; build/arşivleme/tarayıcı otomasyonuyla eşzamanlı değildi.

Kontrol: `PLAYWRIGHT_MODULE=<kurulu-playwright-core> node scripts/verify-de-theme-css.cjs --after`.

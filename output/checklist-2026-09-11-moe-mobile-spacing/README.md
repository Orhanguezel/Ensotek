# K23 ek — MOE mobil boşluk ve tema düğmesi (kullanıcı geri bildirimi, 11 Eylül 2026)

**Geri bildirim:** Mobilde çok fazla boşluk var; tema (dark/light) düğmesi menüde üstte olsun.

**Düzeltme (`Header.tsx`, `home-hero.module.css`):**
- Mobil hero: `section.hero` üst padding 12→0, `.copy` 32→8 px, eyebrow alt boşluk 24→14, alt başlık 24→18, CTA 28→24, kolon aralığı 32→24, mozaik alt boşluk 36→28.
  Header'ın altındaki mesafe yalnız `main` padding'inden gelir. Ölçüm: header alt kenarı → eyebrow üstü **44 px → 7 px**; CTA → "Ürün Gruplarımız" 24 px.
- Tema ve dil düğmeleri mobil menünün üst şeridine (logo ile kapat düğmesi arasına) taşındı; alttaki "Tema / Dil" kutuları kaldırıldı.

**Kabul (`scripts/accept-moe-mobile-spacing.py`, 390 px):** yerel aday ve canlı — boşluk 7 px, menü üst şeridinde tema düğmesi dark→light çalışıyor
(`candidate-*.png`, `live-*.png`, `live-acceptance.json`). K13 odak/klavye ve K22 kaydırılmış menü kabulleri canlıda tekrar geçti.
Not: kapanış animasyonu 700 ms olduğu için hemen sonra alınan ekran görüntüsünde menü şeridi soluk görünebilir; hata değildir.

Build 72 URL, tsc/lint/tema kapıları geçti. Rollback `.next/standalone.before-checklist-20260911T164747Z`; iki kaynak dosya canlıyla hash eşit. Commit `kompozit` `[skip ci]`.

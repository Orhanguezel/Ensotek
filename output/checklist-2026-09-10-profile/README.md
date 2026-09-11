# DE16 CPU profili ve teklif sorguları — 10 Eylül 2026

- `startup.cpuprofile`: Chrome DevTools CPU örneklemi (4× CPU, mobil viewport, reddedilmiş analytics). Süre ağırlıkla paket başlatma/React kodunda; belirli bir uygulama bileşenine kesin TBT nedeni atfedilmedi. Bu profil Lighthouse ağ simülasyonuyla aynı değildir.
- `browser.json`: DE/EN/TR genel teklif açılışında 0 ürün/hizmet isteği; ürün/hizmet seçimiyle ilgili liste bir kez, doğru locale ile gelir. Yeniden seçimde cache kullanılır, girilen e-posta korunur. Ürün detayında hazır ürün seçimi korunur ve hizmet listesi istenmez. POST gönderimi 0.
- `build.log`: TypeScript, üretim build, 1.165 sitemap ve origin kabulü.
- `deploy.txt`, `source-sync.json`: canlı rollback ve üç kaynak hash eşitliği.
- `lighthouse.json`, `lighthouse-2.json`, `lighthouse-3.json`: aynı sürümde art arda üç mobil ölçüm. LCP dalgalanmasını değerlendirmek için ilk koşuya iki doğrulama eklendi; en iyi koşu seçilmedi. `repeatability.json` ortanca/aralık ve tüm koşuları içerir.

Sorgu hook'larının mevcut çağrılarında varsayılan enabled=true korundu. Sadece OfferForm ilgili tipe göre sorguyu etkinleştirir; ürün query key locale içerir. Form gönderim sözleşmesi değiştirilmedi.

Lighthouse koşularında build, arşivleme veya tarayıcı otomasyonu eşzamanlı çalıştırılmadı. Gerçek kullanıcı INP/CWV kabulü verilmedi; DE16 açık.

# Canlı runtime kabulü — 10 Eylül 2026

Sunucu `vps-Ensotek`, kök `/var/www/Ensotek`. Kaynak düzeltmelerinde native backend `dist` dosyaları ve çalışan süreç birlikte doğrulanır; yalnız TS dosyasını kopyalamak deploy değildir.

| Proje | Veritabanı | API / PM2 | Frontend / PM2 | Admin |
|---|---|---|---|---|
| ensotek_de | ensotek | 8086 / ensotek-backend | 3011 / ensotek-frontend | Statik admin; port bu kabulde doğrulanmadı |
| ensotek_com_tr | ensotek_com_tr_db | 8087 / ensotek-com-tr-backend | 3021 / ensotek-com-tr-frontend | 3024 |
| kuhlturm | kuhlturm_live | 8089 / kuhlturm-backend | 3025 / kuhlturm-frontend | 3023 |
| kompozit | kompozit | 8186 / kompozit-backend | 3020 / kompozit-frontend | Statik admin; port bu kabulde doğrulanmadı |

Backendler Bun `dist/index.js`; ortak TS modülleri restart ile yenilenir. Backend ortamı her uygulamanın sunucudaki `.env` dosyasıdır. Frontend derlemesinde doğru HTTPS public origin gerekir. Sunucu ortam dosyaları yerel arşivle değiştirilmez.

DE/Kühlturm/MOE standalone, TR `.next` dağıtımı kullanır. `scripts/deploy-checklist-frontend.sh` ve `scripts/deploy-checklist-tr-frontend.sh` yedekle/sağlık kontrolü/rollback akışlarını içerir. Image optimizer cache korunur; eski sayfa/veri cache'i yeni build'e taşınmaz. `scripts/warm-public-hero-images.py` hero varyantlarını ısıtır. Sağlık yolu `/api/health`.

Kühlturm artık Ensotek DB'sini veya API'sini kullanmaz; `kuhlturm_runtime` yalnız `kuhlturm_live` yetkilidir. Eski DB arşivleri silinmedi. Sonraki geri dönüşte yeni kayıt farkı değerlendirilmelidir.

Secret içeriği bu belgeye yazılmaz. `.env`, OAuth ve istemci sırları Git'e alınmaz; özel yedekler `/var/backups` altında tutulur. ERP bu kabulün dışında ve yeniden başlatılmadı.

MOE DB hesabı `kompozit_runtime`; yalnız `kompozit` veritabanına yetkilidir. Eski ortak hesabın MOE erişimi kaldırıldı.

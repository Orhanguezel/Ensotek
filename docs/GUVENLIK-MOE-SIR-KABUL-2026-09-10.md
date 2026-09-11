# MOE ortam dosyası bulgusu — 10 Eylül 2026

**Sonuç: kısmen giderildi; sağlayıcı anahtar iptali nedeniyle tam kapanış engelli.** ORT14 açık tutulur. Değerler bu belgede veya kanıt çıktılarında bulunmaz.

Git'te izlenen `kompozit/backend/.env.production`, aktif sunucu ortamıyla eşleşen DB, JWT, cookie ve Cloudinary sırları içeriyordu. Saldırı yolu kaynak deposunu okuyabilen kişinin canlı DB/oturum/sağlayıcı kimliği elde etmesiydi. Ayrıca MOE'nin eski DB hesabı DE/TR ile ortaktı.

Uygulanan düzeltmeler:

- Üç MOE `.env.production` dosyası Git indeksinden çıkarıldı; çalışma kopyaları korundu. Ignore kuralı ve sır alanları boş örnekler eklendi. Backend örneği yeni `kompozit_runtime` hesabını kullanır.
- Eski ortak `ensotek` DB parolası DE/TR tüketicileriyle birlikte yenilendi. MOE ayrı `kompozit_runtime` hesabına alındı; eski hesabın MOE şeması yetkisi kaldırıldı.
- MOE JWT/cookie sırları yenilendi; 147 iptal edilmemiş refresh token iptal edildi. Mevcut kullanıcılar yeniden giriş yapmalıdır. JWT'den türeyen Google şifreleme anahtarını kullanan tabloda 0 kayıt olduğu için veri taşıma gerekmedi.
- Geçici giriş kapalı tutuldu; kullanılmayan geçici parola ve MOE yerel depolama sürücüsündeki Cloudinary ortam fallback sırları kaldırıldı. Ortam/yedek dosyası izinleri 0600 yapıldı.
- ERP DB hesabı farklıydı; süreç veya ayarları değiştirilmedi.

Doğrulama sırası:

1. Kaynak/çağıran incelemesi: auth refresh akışı, Google AES-GCM anahtar bağımlılığı, PM2 override'ları, DB hesap tüketicileri ve sağlayıcı config önceliği kontrol edildi. Ayrı salt-okunur inceleme ve aday incelemesi yapıldı.
2. `python3 scripts/contain-moe-exposed-secrets.py` sunucuda çalıştı: eski DB parolası reddedildi; MOE kendi DB'sini okudu, Ensotek DB'sini okuyamadı; eski hesap MOE DB'sini okuyamadı. Eski JWT 401, yeni JWT ile gerçek admin offers okuması 200; aktif refresh token 0.
3. DE/TR/MOE backend sağlık HTTP 200; tüm dört backend PM2 online. DE/TR/K JWT ve cookie değerleri eski MOE değerleriyle eşleşmiyor. PM2'de eski sırları geri yükleyen env override yok. MOE DB'de Cloudinary override satırı yok.
4. İncelemenin bulduğu örnek dosya DB_USER uyumsuzluğu düzeltildi. Kullanıcı çalışma değişiklikleri sıfırlanmadı.

Kanıtlar: `output/checklist-2026-09-09/continuation/moe-secret-containment.json`, `moe-tracked-env-exposure.json`, `secret-hygiene-scan.json`, `secret-hygiene-repos.json`. Tarama güncel izlenen metin dosyalarında yüksek güvenilirlikli sır biçimleri ve ortam dosyalarını kapsar; eksiksiz Git geçmişi temizliği iddiası değildir.

**Kalan:** Eski Cloudinary sırrı DE/TR/K ortamlarında da eşleşiyor. MOE'den kaldırmak veya Git indeksini temizlemek sağlayıcı anahtarını iptal etmez. Cloudinary yönetim erişimiyle eski API anahtarı iptal edilmeli/yenilenmeli, üç tüketicide yeni yapılandırma uygulanıp depolama kabulü yapılmalı. Sağlayıcı anahtarının geçerli olduğunu görmek için zarar verebilecek API işlemi denenmedi. Geçmiş commit'ler yeniden yazılmadı; canlı DB ve MOE oturum sırlarının eski değerleri artık çalışmıyor.

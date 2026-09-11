# Kimlik doğrulama güvenlik kabulü — 10 Eylül 2026

**Sonuç: fixed — aşağıda sınırlandırılan kayıt ve şifre sıfırlama açıkları.** MOE'nin Git geçmişindeki ortak Cloudinary anahtarının sağlayıcıda iptali ayrı açık iştir; bu belge o olayı tamamen kapatmaz.

## Bulgu ve düzeltme

Anonim ortak `/api/auth/signup` ve `/api/auth/register`, varsayılan olarak yönetici rolü üretebiliyordu. TR/Kühlturm/MOE ortamlarında `AUTH_PUBLIC_SIGNUP_ROLE=user` zorunlu kılındı; istekten gelen rol ve allowlist e-postası yükseltme yapmıyor. Var olan DB enumunun `user` değeri kullanıldı, tablo ALTER edilmedi. Diğer ortak backend tüketicileri bu kapsamda yeniden yapılandırılmadı. DE yerel parola kaydı daima `user`; doğrulanmamış Google e-postası kullanıcı aranmadan reddedilir. Gerçek mevcut admin giriş davranışı korunur.

Ortak ve DE native `/api/auth/password-reset/request`, e-posta sahibini doğrulamadan geçerli reset JWT'sini HTTP yanıtına koyuyordu. Aynı JWT bir saat boyunca tekrar kullanılabiliyor, normal oturum kontrolünde ve `/api/auth/user` güncellemesinde de kabul ediliyordu.

Yeni istek yanıtı bilinen/bilinmeyen e-posta için aynı genel nesnedir; gizli kod yalnız sunucudaki mevcut SMTP yardımcısına verilir. Reset kodu access JWT'sinden ayrı `reset-v2` biçiminde, sunucu sırrıyla HMAC imzalı, bir saatlik ve mevcut parola hash'i/e-postaya bağlıdır. Parola değişimi eski hash ve e-posta üzerinde koşullu DB güncellemesiyle yalnız bir kez gerçekleşir. Başarıdan sonra refresh tokenlar iptal edilir. Eski reset JWT'leri confirm, bearer/cookie oturum ve kullanıcı güncelleme sınırlarında reddedilir.

Dört sitede `/api/auth/password-reset` gerçek formu vardır. E-posta bağlantısı güvenilir `FRONTEND_URL` üzerinden kurulur; istek Host başlığı kullanılmaz. Kod URL fragmentindedir, sunucu loguna query olarak gitmez; ekran açıldığında adres çubuğundan temizlenir. Sayfa no-store/noindex/no-referrer ve statik script hash'li CSP kullanır, izleyici içermez. TR/EN/DE form metni ve mevcut altı karakterlik parola sözleşmesi korunur. DE girişteki eski iletişim yönlendirmesi bu ekrana bağlanmıştır.

## Dosyalar

- Ortak `packages/shared-backend/modules/auth/{controller,repository,router,password-reset,password-reset-page}.ts`; ortak auth middleware/plugin; rol tipleri ve ilgili üç backend env örnekleri.
- DE `backend/src/modules/auth/{controller,google.controller,router,password-reset,password-reset-page}.ts`, auth middleware/plugin ve aynı dosyaların derlenmiş `dist` karşılıkları.
- Kühlturm/MOE mevcut native auth middleware kopyaları, Kühlturm auth plugin; eski reset JWT'sine alternatif giriş kalmaması için aynı amaç kontrolü.
- DE `frontend/src/app/login/login-client.tsx`; DE/Kühlturm auth service endpoint düzeltmesi. Kullanılmayan K servis export'u yeni bir kullanıcı akışı oluşturmaz.

## Kabul kapıları ve komutlar

1. Dört backend `bun run --cwd <proje>/backend build`: **PASS**. DE frontend `bash scripts/build-checklist-production.sh ensotek_de`: **PASS**, 1165 sitemap URL'si ve üretim origin kapısı.
2. `python3 scripts/verify-password-reset-isolated.py` (VPS): **PASS**, özgün seed ile geçici DB, gerçek yerel HTTP sunucusu ve gerçek sorgular. Bilinen/bilinmeyen yanıt eşitliği, eski/bozulmuş/süresi geçmiş kod, email/hash bağı, bearer ve cookie, profile update, eşzamanlı `[200,400]`, tekrar `400`, eski parola `401`, yeni altı karakterli parola `200`, SMTP başarısızlığında genel yanıt, yerel geliştirme linki.
3. `bun ../../scripts/verify-live-signup-role.ts <proje>`: dört canlı DB'de **PASS**. Sentetik hesap `user`, sonraki giriş `user`, gerçek admin uç noktası `403`; eski reset JWT'siyle GET/PUT kullanıcı `401`, reset confirm `400`. Sentetik kullanıcılar silindi.
4. Playwright: dört gerçek public reset ekranı **200**, mobil taşma yok, bir H1, fragment temiz, minimum 6, JS hatası yok. Form POST'u tarayıcıda yakalandı; gerçek müşterinin parolası değiştirilmedi. DE giriş bağlantısı doğru.
5. Önce bağımsız salt-okunur sınır incelemesi, sonra tek bağımsız aday incelemesi yapıldı. Somut geliştirme URL'si ve parola uzunluğu uyumsuzlukları düzeltildi ve kontroller yeniden geçti. İlk `inject`/async hook test düzeneğinin çift yanıt hatası gerçek localhost HTTP sunucusu kullanılarak giderildi; uygulama bu test aracının davranışına göre değiştirilmedi.

## Canlı dağıtım ve kanıtlar

`output/checklist-2026-09-09/continuation/` altında:

- `signup-role-isolated.jsonl`, `de-google-email-acceptance.jsonl`, `signup-role-deploy.json`.
- `password-reset-isolated.jsonl`, `password-reset-live-source-isolated.jsonl`.
- `signup-live-{de,tr,kuhl,moe}.jsonl`.
- `password-reset-deploy.json`: 30 incelenmiş kaynak/derlenmiş dosya ve dört gerçek reset ekranı kabulü.
- `password-reset-browser.txt`, `de-reset-link-deploy.txt`, `reset-source-sync.txt`.

İlk dağıtım kabul kapısı tamamlanmadığında dosyalar geri alındı. Son dağıtımda dört endpoint ayrı HTTP durum/header kontrolüyle geçti. Son auth yedeği `/var/backups/password-reset-20260910T081107Z`; frontend yedeği `standalone.before-checklist-20260910T081301Z`. Eski çalışan dosyaların geri dönüş kopyaları korunur; güvensiz sürüme dönüş ayrıca güvenlik değerlendirmesi gerektirir.

**Sınırlar:** Testlerde e-posta ve Telegram süreç içinde yakalandı; gerçek alıcılara ileti gönderilmedi. SMTP transport doğrulaması ayrı kanıttır; gerçek gelen kutusu teslimi bu kabulde denenmedi. Önceden istismar olup olmadığına dair adli inceleme sonucu çıkarılmadı. Ortak Cloudinary anahtarı iptali ve tam Git geçmişi temizliği ayrı açık takip edilir.

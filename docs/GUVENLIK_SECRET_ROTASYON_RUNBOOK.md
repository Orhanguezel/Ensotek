# Ensotek — Secret Rotasyon & Fail-Closed Deploy Runbook

**Hazirlayan:** Claude Code, 2026-07-19. **Calistirma karari sende.**

Kod tarafi HAZIR ve commit'li (her site kendi reposunda):

| Site | commit | backend PM2 app | port |
|---|---|---|---|
| ensotek_de | `21da56b` | `ensotek-backend` | 8086 |
| ensotek_com_tr | `f3ac56c` | `ensotek-com-tr-backend` | (kendi) |
| kompozit | `c66929f` | `kompozit-backend` | (kendi) |
| kuhlturm | `d9896fa` | `kuhlturm-backend` | (kendi) |

Degisiklik: `JWT_SECRET` ve `COOKIE_SECRET` artik `requireEnv` — **fail-closed**.
Env'de yoksa backend acilmaz. Bu yuzden **once secret, sonra kod** sirasi zorunlu.

VPS cwd deseni: `/var/www/Ensotek/<site>/backend`.

---

## NEDEN bu sira

Kod once deploy edilirse: yeni kod `requireEnv('JWT_SECRET')` cagirir, canli `.env`'de
gecerli bir deger yoksa **backend crash → site down**. Onlemek icin secret'i koda
gecmeden ONCE .env'e yaziyoruz. Zaten calisan eski kod da bu yeni secret'i sorunsuz
kullanir (eskisi de `process.env.JWT_SECRET`'i okuyordu, sadece fallback'i vardi).

Secret degistigi an mevcut tum JWT'ler gecersizlesir → **kullanicilar yeniden login olur.**
Bu beklenen ve istenen davranis (eski zayif secret'la uretilmis token'lar da olur).

---

## ADIM ADIM — her site icin ayni, TEK TEK yap

Asagida `ensotek_de` ornegi. Digerleri icin `<site>` ve PM2 app adini degistir.
**Bir siteyi bitir, dogrula, sonra digerine gec.** Hepsini birden yapma.

### 0. VPS'e baglan
```bash
ssh <ensotek-vps>            # host bilgisini sen biliyorsun; ekleyince buraya not dus
cd /var/www/Ensotek/ensotek_de/backend
```

### 1. Mevcut .env'i yedekle (rollback icin)
```bash
cp .env .env.bak-$(date +%Y%m%d-%H%M%S)
ls -la .env.bak-*        # yedegin olustugunu gor
```

### 2. Guclu secret uret ve .env'e yaz
```bash
NEW_JWT=$(openssl rand -hex 40)
NEW_COOKIE=$(openssl rand -hex 40)

# Once mevcut satirlari kaldir (varsa), sonra yenilerini ekle:
sed -i '/^JWT_SECRET=/d; /^COOKIE_SECRET=/d' .env
printf 'JWT_SECRET=%s\nCOOKIE_SECRET=%s\n' "$NEW_JWT" "$NEW_COOKIE" >> .env

# Dogrula (deger uzunlugu 80 olmali):
grep -E '^(JWT_SECRET|COOKIE_SECRET)=' .env | sed -E 's/=(.{8}).*/=\1... /'
```
> Her site FARKLI secret alir. Yukaridaki blogu her sitede ayri calistir —
> `openssl rand` her seferinde yeni deger uretir, siteler arasi paylasma.

### 3. Once secret'i canliya al (kod deploy'undan ONCE)
```bash
pm2 restart ensotek-backend --update-env
pm2 logs ensotek-backend --lines 30 --nostream    # hata var mi bak
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8086/health || \
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8086/
```
Site hala AYAKTA olmali (eski kod, yeni secret). 200/301/302 → devam.

### 4. Kodu deploy et
```bash
cd /var/www/Ensotek/ensotek_de       # veya backend, deploy scriptinin oldugu yer
git pull origin main
cd backend
bun install
bun run build
pm2 restart ensotek-backend --update-env
```

### 5. Dogrula
```bash
pm2 logs ensotek-backend --lines 40 --nostream
# "Missing env var" HATASI OLMAMALI. Olursa: .env'de secret eksik (Adim 2'ye don).
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8086/
```
Tarayicidan giris yap → eski oturum dusmus olmali, yeni login calismali.

### 6. Sonraki siteye gec
`ensotek_com_tr` → `kompozit` → `kuhlturm`. Her birinde app adi ve cwd farkli
(yukaridaki tablo). Port bilgisini `ecosystem.config.cjs`'ten dogrula.

---

## ROLLBACK (bir sey bozulursa)

```bash
cd /var/www/Ensotek/ensotek_de/backend
cp .env.bak-<TARIH> .env             # yedegi geri koy
git -C /var/www/Ensotek/ensotek_de checkout HEAD~1 -- backend/src/core/env.ts backend/src/app.ts
cd backend && bun run build
pm2 restart ensotek-backend --update-env
```
Bu, hem secret'i hem kodu degisiklik oncesine dondurur. Site eski haliyle acilir.

> Not: rollback sonrasi eski zayif fallback geri gelir (guvenlik acigi yeniden acilir).
> Sadece acil "site down" durumunda kullan, sonra sorunu cozup ileri git.

---

## Kontrol listesi

- [ ] ensotek_de: secret yazildi → restart → kod deploy → dogrulandi
- [ ] ensotek_com_tr: ...
- [ ] kompozit: ...
- [ ] kuhlturm: ...
- [ ] 4 sitede de `pm2 logs` temiz (Missing env var yok)
- [ ] 4 sitede de tarayicidan login calisiyor
- [ ] `.env.bak-*` yedekleri birkac gun sonra silinebilir

## Ilgili
- Kok neden ve tum baseline: `../.claude/loop-raporlari/guvenlik-baseline-2026-07-19.md`
- Guvenlik sistemi: `../docs/GUVENLIK_SISTEMI.md`
- Ayni is bekleyen diger canlilar: hal-fiyatlari (newsletter/token.ts)

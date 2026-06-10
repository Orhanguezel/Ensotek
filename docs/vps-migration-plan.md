# VPS Migration Planı — Poly-repo Yapısına Geçiş

> Durum: **BEKLEMEDE** — canlı sunucuya henüz dokunulmadı.
> Hazırlandığı tarih: 2026-05-22

Amaç: `/var/www/Ensotek/` canlı sunucuda, yerel workspace ile birebir aynı
poly-repo klasör yapısına geçirmek.

## Mevcut Durum (VPS — flat)

```
/var/www/Ensotek/
├── .git                  → Orhanguezel/Ensotek.git (eski commit'te)
├── backend/              → PM2: ensotek-backend (8086)        [DE site]
├── de_frontend/          → PM2: ensotek-frontend (3011)       [DE site]
├── admin_panel/          → PM2: ensotek-admin-panel (3022)    [DE site]
├── frontend → de_frontend  (symlink)
├── kuhlturm-frontend/    → PM2: kuhlturm-frontend
├── ensotek_com_tr/       → PM2: ensotek-com-tr-*   (zaten nested ✓)
├── kompozit/frontend     → PM2: kompozit-frontend (3020)
├── kompozit/admin_panel  → PM2: kompozit-admin-panel
├── kompozit_backend/     → PM2: kompozit-backend   (AYRI — kompozit/backend olmalı)
├── packages/
├── uploads/              → DE backend uploads
├── _com.tr_frontend/, karbonkompozit/, *.bak-*  → eski/ölü, temizlenecek
└── (dağınık kök dosyaları)
```

## Hedef Durum

```
/var/www/Ensotek/
├── .git                  → Orhanguezel/Ensotek.git (re-sync: packages/ + docs/ + meta)
├── packages/
├── ensotek_de/           → clone: ensotek_de.git
│   ├── frontend/  ← de_frontend
│   ├── backend/   ← backend
│   └── admin_panel/ ← admin_panel
├── ensotek_com_tr/       → clone: ensotek_com_tr.git  (zaten uygun)
├── kompozit/             → clone: kompozit.git
│   ├── frontend/
│   ├── backend/   ← kompozit_backend
│   └── admin_panel/
├── kuhlturm/             → clone: kuhlturm.git
│   └── frontend/  ← kuhlturm-frontend
└── docs/
```

## Genel Yöntem (her proje için)

1. Per-proje repo'yu temiz klonla (`<proje>_new`).
2. VPS'teki **git-dışı** dosyaları aktar: `.env*` üretim dosyaları, backend `uploads/`.
3. Her uygulamayı build et (`bun install && bun run build`).
4. İlgili PM2 process'lerini durdur.
5. Eski dizini `.old` olarak yeniden adlandır, `<proje>_new` → `<proje>`.
6. PM2 process'lerini yeni `cwd` ile yeniden tanımla (`pm2 delete` + `pm2 start`), `pm2 save`.
7. Health check (port dinleniyor mu + HTTP 200).
8. Sorun yoksa `.old` dizinleri birkaç gün sonra sil.

## Önerilen Sıra (riski düşükten yükseğe)

### 1) kuhlturm  (en basit — tek uygulama)

```bash
cd /var/www/Ensotek
git clone https://github.com/Orhanguezel/kuhlturm.git kuhlturm_new
cp kuhlturm-frontend/.env* kuhlturm_new/frontend/ 2>/dev/null || true
cd kuhlturm_new/frontend && bun install && bun run build && cd /var/www/Ensotek
pm2 stop kuhlturm-frontend
mv kuhlturm-frontend kuhlturm-frontend.old
mv kuhlturm_new kuhlturm
pm2 delete kuhlturm-frontend
cd kuhlturm/frontend && pm2 start "bun run start" --name kuhlturm-frontend   # cwd doğrula
pm2 save
```
> Not: kuhlturm-frontend'in `ecosystem.config.cjs` dosyası yok — PM2 start komutu/portu
> mevcut process tanımından teyit edilmeli (`pm2 describe kuhlturm-frontend`).

### 2) kompozit  (backend yeniden konumlandırma)

`kompozit/` zaten `kompozit.git` klonu olabilir; `kompozit_backend/` ise ayrı.
```bash
cd /var/www/Ensotek/kompozit
git fetch origin main && git reset --hard origin/main   # backend/ klasörünü repodan getirir
cp /var/www/Ensotek/kompozit_backend/.env* backend/ 2>/dev/null || true
cd backend && bun install && bun run build && cd /var/www/Ensotek
pm2 stop kompozit-backend
pm2 delete kompozit-backend
cd kompozit/backend && pm2 start ecosystem.config.cjs   # cwd doğrula
pm2 save
mv /var/www/Ensotek/kompozit_backend /var/www/Ensotek/kompozit_backend.old
```
> Not: `kompozit/` git remote'u `kompozit.git` mi, teyit et. Frontend/admin zaten nested.

### 3) ensotek_com_tr  (zaten uygun — sadece doğrulama)

- Yapı zaten `ensotek_com_tr/{frontend,backend,admin_panel}` — taşıma gerekmez.
- Doğrula: `git -C ensotek_com_tr remote -v` → `ensotek_com_tr.git` olmalı.
- Gerekirse `git fetch && git reset --hard origin/main` + rebuild + PM2 restart.

### 4) ensotek_de  (en kritik — ensotek.de canlı)

```bash
cd /var/www/Ensotek
git clone https://github.com/Orhanguezel/ensotek_de.git ensotek_de_new
# .env üretim dosyaları
cp backend/.env*      ensotek_de_new/backend/      2>/dev/null || true
cp de_frontend/.env*  ensotek_de_new/frontend/     2>/dev/null || true
cp admin_panel/.env*  ensotek_de_new/admin_panel/  2>/dev/null || true
# uploads — DE backend hangi dizini kullanıyor, teyit et (backend/uploads veya /var/www/Ensotek/uploads)
cp -a backend/uploads ensotek_de_new/backend/ 2>/dev/null || true
# build
for a in backend frontend admin_panel; do (cd ensotek_de_new/$a && bun install && bun run build); done
# geçiş
pm2 stop ensotek-backend ensotek-frontend ensotek-admin-panel
mv backend backend.old; mv de_frontend de_frontend.old; mv admin_panel admin_panel.old
mv ensotek_de_new ensotek_de
rm -f frontend   # eski symlink
# PM2 — yeni cwd ile
pm2 delete ensotek-backend ensotek-frontend ensotek-admin-panel
cd ensotek_de/backend     && pm2 start ecosystem.config.cjs
cd ../frontend            && pm2 start ecosystem.config.cjs
cd ../admin_panel         && pm2 start ecosystem.config.cjs
pm2 save
```
Health check:
```bash
for P in 8086 3011 3022; do ss -ltn | grep -q ":$P" && echo "OK $P" || echo "FAIL $P"; done
curl -sI https://ensotek.de | head -1
```

### 5) Root repo re-sync (en son)

Flat dizinler güvenle taşındıktan sonra:
```bash
cd /var/www/Ensotek
git fetch origin main && git reset --hard origin/main   # artık packages/ + docs/ + meta
```

## Riskler & Rollback

- **ensotek.de kesintisi:** PM2 restart sırasında saniyeler. `.old` dizinleri rollback için durur.
- **Rollback:** sorun çıkarsa `mv ensotek_de ensotek_de.broken; mv backend.old backend; ...` + PM2 eski cwd.
- **`.env` kaybı:** üretim sırları git'te yok — kopyalamadan eski dizini SİLME.
- **`ecosystem.config.cjs` `cwd`:** dosya içindeki mutlak yollar yeni konuma göre güncellenmeli.
- **PM2 `pm2 save`:** her projeden sonra çalıştırılmalı, yoksa reboot'ta eski tanım döner.
- **Port çakışması:** yeni process eski process tam durmadan başlatılırsa port çakışır — `pm2 delete` sonrası başlat.

## Migration Sonrası

- `Ensotek/CLAUDE.md` "VPS migration bekliyor" uyarısı kaldırılır.
- `.github/workflows/deploy.yml` artık çalışır durumda (ön koşul `.git` kontrolü geçer).
- Eski `.old`, `.bak-*`, `_com.tr_frontend/`, `karbonkompozit/` dizinleri temizlenir.

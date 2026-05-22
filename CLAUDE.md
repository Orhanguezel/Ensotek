# CLAUDE.md — Ensotek

## Proje Özeti

Ensotek, soğutma kulesi çözümleri için geliştirilen bir B2B platform ailesidir. Workspace **poly-repo** modelindedir: her site kendi git reposu ve kendi veritabanı ile çalışır; ortak kod `packages/` altında durur.

## Workspace Haritası

- `packages/` — ortak paketler: `shared-backend`, `shared-config`, `shared-types`, `shared-ui`, `core` (root `Ensotek` reposunda)
- `ensotek_de/` — ensotek.de — `frontend` + `backend` + `admin_panel` — repo: `Orhanguezel/ensotek_de`
- `ensotek_com_tr/` — ensotek.com.tr — `frontend` + `backend` + `admin_panel` — repo: `Orhanguezel/ensotek_com_tr`
- `kompozit/` — karbonkompozit.com.tr — `frontend` + `backend` + `admin_panel` — repo: `Orhanguezel/kompozit`
- `kuhlturm/` — kuhlturm.com — `frontend` (backend planlanıyor) — repo: `Orhanguezel/kuhlturm`
- `ensotek_com/` — ensotek.com — planlanıyor
- `docs/` — workspace dökümantasyonu, planlar, görseller

Her site projesi kendi git reposudur ve **kendi veritabanına** sahiptir. Eski flat yapı (`backend/`, `de_frontend/`, `admin_panel/`, `kuhlturm-frontend/`) kaldırıldı. Root `Ensotek` reposu yalnızca `packages/` + meta dosyaları izler; nested proje repoları `.gitignore` ile hariç tutulur.

## Çalışma Kuralları

- README, `CLAUDE.md` ve `project.portfolio.json` birbiriyle uyumlu tutulur — her projenin kendi kopyaları vardır, ayrıca workspace kökünde de bulunur.
- Stack / domain / servis kapsamında değişiklik varsa önce repo içinden teyit et.
- Çalıştırma komutları `package.json` scriptleri esas alınarak yazılır.
- **Yerel ve canlı server aynı klasör yapısını korur.**

## Server / Deploy

- **VPS:** `ssh vps-Ensotek` (187.124.8.172, Hostinger, Ubuntu)
- **Kök dizin:** `/var/www/Ensotek`
- **Hedef dizin yapısı** (yerel ile birebir aynı):
  - `/var/www/Ensotek/ensotek_de/{frontend,backend,admin_panel}` — PM2: `ensotek-frontend` (3011), `ensotek-backend` (8086), `ensotek-admin-panel` (3022)
  - `/var/www/Ensotek/ensotek_com_tr/{frontend,backend,admin_panel}` — PM2: `ensotek-com-tr-frontend` / `-backend` / `-admin-panel`
  - `/var/www/Ensotek/kompozit/{frontend,backend,admin_panel}` — PM2: `kompozit-frontend` (3020) / `-backend` / `-admin-panel`
  - `/var/www/Ensotek/kuhlturm/frontend` — PM2: `kuhlturm-frontend`
  - `/var/www/Ensotek/packages/` — ortak paketler
- **Domainler:** ensotek.de, ensotek.com.tr, karbonkompozit.com.tr, kuhlturm.com (nginx reverse proxy)
- **Deploy:** Her proje kendi reposundan deploy edilir. `.github/workflows/deploy.yml` poly-repo modeline göre güncellendi (`workflow_dispatch`).
- **GitHub Secrets:** `VPS_HOST`, `VPS_USER`, `VPS_KEY`

> ⚠️ **VPS migration bekliyor:** Canlı server hâlâ eski flat yapıda (`backend/`, `de_frontend/`, `admin_panel/`, `kuhlturm-frontend/` + `kompozit_backend/`). Yeni poly-repo yapısına taşınması, PM2 `cwd` değerlerinin güncellenmesi ve her dizinin ilgili proje reposuna bağlanması gerekiyor. Migration tamamlanana kadar eski deploy mantığı çalıştırılmamalı.

## DB Schema Kuralı

- `ALTER TABLE` lokalde kullanılmaz. İlgili `src/db/seed/sql/0XX_*_schema.sql` dosyası güncellenir, `bun run build && bun run db:seed:*:fresh` ile DB sıfırdan kurulur.

## Portfolio Metadata Kuralı

- Her proje kökünde `project.portfolio.json` zorunludur (ayrıca workspace kökünde de bulunur).
- B2B özeti, stack, servisler veya domain bilgisi değişirse önce bu dosya güncellenir.
- Portfolio seedleri bu metadata dosyasına bağlıdır; metadata güncellenmeden iş tamamlanmış sayılmaz.

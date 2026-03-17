# CLAUDE.md — Ensotek

## Proje Ozeti

Ensotek, sogutma kulesi cozumleri icin gelistirilen bir B2B platformdur. Mevcut workspace icinde backend, admin panel ve birden fazla frontend varyanti bulunur.

## Workspace Haritasi

- `backend/`: Fastify API, Drizzle ORM, MySQL
- `admin_panel/`: yonetim paneli
- `de_frontend/`, `kuhlturm-frontend/`: aktif frontend varyantlari
- `com_frontend/`, `com.tr_frontend/`, `prime-frontend-nextjs/`, `packages/`: diger workspace bileşenleri

## Calisma Kurallari

- README, `CLAUDE.md` ve `project.portfolio.json` birbiriyle uyumlu tutulur.
- Frontend varyantlari, domain, stack veya servis kapsaminda degisiklik varsa once repo icinden teyit et.
- Calistirma komutlari yazilirken `package.json` scriptleri esas alinir.

## Server / Deploy

- **VPS**: `ssh vps-Ensotek` (187.124.8.172, Hostinger, Ubuntu)
- **Deploy dizinleri**:
  - Backend: `/var/www/Ensotek/backend` (PM2: `ensotek-backend`, port 8086)
  - Frontend (de): `/var/www/Ensotek/frontend` (PM2: `ensotek-frontend`, port 3011)
  - Admin Panel: `/var/www/Ensotek/admin_panel` (PM2: `ensotek-admin-panel`, port 3022)
  - Karbonkompozit: `/var/www/Ensotek/karbonkompozit` (PM2: `karbonkompozit`, port 3020)
- **Domain**: ensotek.de (nginx reverse proxy)
- **CI/CD**: `.github/workflows/deploy.yml` — push to main triggers build + deploy
- **GitHub Secrets**: `VPS_HOST`, `VPS_USER`, `VPS_KEY`

## Portfolio Metadata Rule

- Proje kokunde `project.portfolio.json` dosyasi zorunludur.
- B2B platform ozeti, stack, servisler ve domain bilgisi degisirse once bu dosya guncellenir.
- Portfolio seedleri bu metadata dosyasina baglidir; metadata guncellenmeden is tamamlanmis sayilmaz.

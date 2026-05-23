#!/usr/bin/env bash
# =============================================================================
# Ensotek VPS Migration — eski flat yapıdan poly-repo yapıya geçiş
# Hedef: /var/www/Ensotek yerel workspace ile birebir aynı yapı
# =============================================================================
#
# KULLANIM:
#   1. Bu dosyayı VPS'e kopyala (scp veya wget)
#   2. chmod +x vps-migration.sh
#   3. Faz faz çalıştır: ./vps-migration.sh phase1
#      veya hepsi: ./vps-migration.sh all
#
# ⚠️ ÜRETİM SUNUCUSU — ensotek.de canlı. Restart sırasında ~saniyeler kesinti.
# =============================================================================

set -euo pipefail

# ----------------------------------------------------------------------------
# DEĞİŞKENLER
# ----------------------------------------------------------------------------
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="/root/migration-backup-${TIMESTAMP}"
WWW_DIR="/var/www"
ENSOTEK_DIR="${WWW_DIR}/Ensotek"
GITHUB_USER="Orhanguezel"

# Repo URL'leri
ROOT_REPO="https://github.com/${GITHUB_USER}/Ensotek.git"
PROJECTS=("ensotek_de" "ensotek_com_tr" "kompozit" "kuhlturm")

# Korunacak top-level klasörler (silinmeyecek)
PRESERVE=("_acme-challenge" "html")

# MySQL credentials (root'la çalışıyoruz, .my.cnf veya socket auth)
MYSQL_CMD="mysql"
MYSQLDUMP_CMD="mysqldump --single-transaction --routines --triggers"

# Renkler
R='\033[0;31m'; G='\033[0;32m'; Y='\033[1;33m'; B='\033[1;34m'; NC='\033[0m'
log()    { echo -e "${B}[$(date +%H:%M:%S)]${NC} $*"; }
ok()     { echo -e "${G}✓${NC} $*"; }
warn()   { echo -e "${Y}⚠${NC} $*"; }
err()    { echo -e "${R}✗${NC} $*"; }

confirm() {
  read -p "$(echo -e ${Y}$* [y/N]${NC}) " -n 1 -r
  echo
  [[ $REPLY =~ ^[Yy]$ ]] || { err "İptal"; exit 1; }
}

# ----------------------------------------------------------------------------
# PHASE 0 — Pre-flight (CPU/disk/tools check)
# ----------------------------------------------------------------------------
phase0_preflight() {
  log "PHASE 0 — Pre-flight kontrolleri"
  for cmd in git bun node pm2 mysql mysqldump rsync; do
    command -v "$cmd" >/dev/null 2>&1 && ok "$cmd VAR" || { err "$cmd YOK"; exit 1; }
  done
  df -h / | tail -1 | awk '{print "  Disk: kullanılan="$3", boş="$4", kullanım="$5}'
  free -h | awk 'NR==2{print "  RAM: total="$2", kullanılan="$3", boş="$4}'
  uptime | sed 's/^/  /'
  ok "Pre-flight OK"
}

# ----------------------------------------------------------------------------
# PHASE 1 — Backup (KRİTİK)
# ----------------------------------------------------------------------------
phase1_backup() {
  log "PHASE 1 — Üretim verilerini yedekle → ${BACKUP_DIR}"
  mkdir -p "${BACKUP_DIR}"/{envs,uploads,mysql,pm2,nginx,full-tar}

  # 1.1 .env dosyaları (üretim sırları)
  log "  .env dosyaları toplanıyor..."
  find "${WWW_DIR}" -type f \( -name ".env" -o -name ".env.production" -o -name ".env.local" \) \
    -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/dist/*" 2>/dev/null \
    | while read -r f; do
        rel="${f#${WWW_DIR}/}"
        mkdir -p "${BACKUP_DIR}/envs/$(dirname "$rel")"
        cp "$f" "${BACKUP_DIR}/envs/$rel"
        echo "    + $rel"
      done

  # 1.2 uploads/ klasörleri (kullanıcı yüklemeleri — git'te yok)
  log "  uploads/ klasörleri kopyalanıyor..."
  find "${WWW_DIR}" -type d -name "uploads" -not -path "*/node_modules/*" 2>/dev/null | while read -r d; do
    rel="${d#${WWW_DIR}/}"
    sz=$(du -sh "$d" 2>/dev/null | cut -f1)
    echo "    + $rel ($sz)"
    mkdir -p "${BACKUP_DIR}/uploads/$(dirname "$rel")"
    rsync -a "$d/" "${BACKUP_DIR}/uploads/$rel/"
  done

  # 1.3 MySQL dump (her DB ayrı)
  log "  MySQL veritabanları dump ediliyor..."
  ${MYSQL_CMD} -e "SHOW DATABASES;" 2>/dev/null \
    | grep -vE "^(information_schema|mysql|performance_schema|sys|Database)$" \
    | while read -r db; do
        out="${BACKUP_DIR}/mysql/${db}.sql.gz"
        echo "    + $db -> ${db}.sql.gz"
        ${MYSQLDUMP_CMD} "$db" 2>/dev/null | gzip > "$out"
      done

  # 1.4 PM2 dump (process listesi)
  log "  PM2 state kaydediliyor..."
  pm2 save 2>/dev/null || true
  cp "${HOME}/.pm2/dump.pm2" "${BACKUP_DIR}/pm2/dump.pm2" 2>/dev/null || true
  pm2 jlist > "${BACKUP_DIR}/pm2/jlist.json" 2>/dev/null || true

  # 1.5 nginx configs (defansif yedek)
  log "  nginx site-configs kopyalanıyor..."
  cp -a /etc/nginx/sites-available "${BACKUP_DIR}/nginx/" 2>/dev/null || true
  cp -a /etc/nginx/sites-enabled "${BACKUP_DIR}/nginx/" 2>/dev/null || true

  # 1.6 FULL TAR (node_modules/dist/.next hariç) — son çare
  log "  Full tarball oluşturuluyor (node_modules hariç)..."
  cd "${WWW_DIR}"
  tar czf "${BACKUP_DIR}/full-tar/var-www-${TIMESTAMP}.tar.gz" \
    --exclude='node_modules' --exclude='.next' --exclude='dist' \
    --exclude='*.tsbuildinfo' --exclude='.git' \
    . 2>/dev/null || warn "  tar bazı dosyaları atladı"

  log "Backup boyutu: $(du -sh ${BACKUP_DIR} | cut -f1)"
  ok "PHASE 1 tamam — yedek: ${BACKUP_DIR}"
}

# ----------------------------------------------------------------------------
# PHASE 2 — PM2 durdur
# ----------------------------------------------------------------------------
phase2_stop() {
  log "PHASE 2 — PM2 process'leri durdur"
  pm2 stop all 2>/dev/null || true
  pm2 delete all 2>/dev/null || true
  pm2 save --force 2>/dev/null || true
  ok "PM2 durduruldu"
}

# ----------------------------------------------------------------------------
# PHASE 3 — Wipe (preserve _acme-challenge + html + backup)
# ----------------------------------------------------------------------------
phase3_wipe() {
  log "PHASE 3 — /var/www temizle (preserve: ${PRESERVE[*]})"
  confirm "TÜM /var/www içeriği silinecek (preserve hariç). Devam?"
  cd "${WWW_DIR}"
  for item in *; do
    keep=0
    for p in "${PRESERVE[@]}"; do [[ "$item" == "$p" ]] && keep=1; done
    if [[ $keep -eq 1 ]]; then
      ok "preserve: $item"
    else
      log "  rm -rf $item ($(du -sh "$item" 2>/dev/null | cut -f1))"
      rm -rf "$item"
    fi
  done
  ls -la "${WWW_DIR}"
  ok "PHASE 3 tamam"
}

# ----------------------------------------------------------------------------
# PHASE 4 — Yeni yapıyı git'ten klonla
# ----------------------------------------------------------------------------
phase4_clone() {
  log "PHASE 4 — Repolar klonlanıyor"
  cd "${WWW_DIR}"
  log "  git clone Ensotek (root workspace)"
  git clone "${ROOT_REPO}" Ensotek
  cd "${ENSOTEK_DIR}"
  for proj in "${PROJECTS[@]}"; do
    log "  git clone ${proj}"
    git clone "https://github.com/${GITHUB_USER}/${proj}.git" "${proj}"
  done
  ls -la "${ENSOTEK_DIR}"
  ok "PHASE 4 tamam"
}

# ----------------------------------------------------------------------------
# PHASE 5 — Yedekleri geri yükle (.env + uploads)
# ----------------------------------------------------------------------------
phase5_restore() {
  log "PHASE 5 — .env ve uploads geri yükle"

  # 5.1 .env dosyaları — eski path'lerden yeni path'lere mapping
  log "  .env dosyaları restore ediliyor (yeni path mapping)..."
  # Eski: /var/www/Ensotek/backend/.env  -> Yeni: /var/www/Ensotek/ensotek_de/backend/.env
  # Eski: /var/www/Ensotek/de_frontend/.env* -> Yeni: /var/www/Ensotek/ensotek_de/frontend/.env*
  # Eski: /var/www/Ensotek/admin_panel/.env -> Yeni: /var/www/Ensotek/ensotek_de/admin_panel/.env
  # Eski: /var/www/Ensotek/kuhlturm-frontend/.env* -> Yeni: /var/www/Ensotek/kuhlturm/frontend/.env*
  # Eski: /var/www/Ensotek/ensotek_com_tr/* -> aynı path
  # Eski: /var/www/Ensotek/kompozit/* -> aynı path
  # Eski: /var/www/Ensotek/kompozit_backend/.env -> Yeni: /var/www/Ensotek/kompozit/backend/.env

  declare -A ENV_MAP=(
    ["Ensotek/backend"]="Ensotek/ensotek_de/backend"
    ["Ensotek/de_frontend"]="Ensotek/ensotek_de/frontend"
    ["Ensotek/admin_panel"]="Ensotek/ensotek_de/admin_panel"
    ["Ensotek/kuhlturm-frontend"]="Ensotek/kuhlturm/frontend"
    ["Ensotek/kompozit_backend"]="Ensotek/kompozit/backend"
    ["Ensotek/ensotek_com_tr/backend"]="Ensotek/ensotek_com_tr/backend"
    ["Ensotek/ensotek_com_tr/frontend"]="Ensotek/ensotek_com_tr/frontend"
    ["Ensotek/ensotek_com_tr/admin_panel"]="Ensotek/ensotek_com_tr/admin_panel"
    ["Ensotek/kompozit/frontend"]="Ensotek/kompozit/frontend"
    ["Ensotek/kompozit/admin_panel"]="Ensotek/kompozit/admin_panel"
  )

  for old_rel in "${!ENV_MAP[@]}"; do
    new_rel="${ENV_MAP[$old_rel]}"
    src_dir="${BACKUP_DIR}/envs/${old_rel}"
    dst_dir="${WWW_DIR}/${new_rel}"
    if [[ -d "$src_dir" && -d "$dst_dir" ]]; then
      cp "$src_dir"/.env* "$dst_dir"/ 2>/dev/null && ok "  $old_rel/.env -> $new_rel/"
    fi
  done

  # 5.2 uploads — DE backend
  if [[ -d "${BACKUP_DIR}/uploads/Ensotek/backend/uploads" ]]; then
    log "  uploads -> ensotek_de/backend/uploads"
    mkdir -p "${ENSOTEK_DIR}/ensotek_de/backend/uploads"
    rsync -a "${BACKUP_DIR}/uploads/Ensotek/backend/uploads/" "${ENSOTEK_DIR}/ensotek_de/backend/uploads/"
  fi
  if [[ -d "${BACKUP_DIR}/uploads/Ensotek/uploads" ]]; then
    log "  /var/www/Ensotek/uploads -> ensotek_de/backend/uploads (top-level uploads)"
    mkdir -p "${ENSOTEK_DIR}/ensotek_de/backend/uploads"
    rsync -a "${BACKUP_DIR}/uploads/Ensotek/uploads/" "${ENSOTEK_DIR}/ensotek_de/backend/uploads/"
  fi
  # ensotek_com_tr, kompozit, kuhlturm uploads (aynı path mapping)
  for proj in ensotek_com_tr kompozit kuhlturm; do
    for app in backend; do
      src="${BACKUP_DIR}/uploads/Ensotek/${proj}/${app}/uploads"
      [[ -d "$src" ]] && rsync -a "$src/" "${ENSOTEK_DIR}/${proj}/${app}/uploads/" && ok "  $proj/$app/uploads"
    done
  done

  ok "PHASE 5 tamam"
}

# ----------------------------------------------------------------------------
# PHASE 6 — bun install + build
# ----------------------------------------------------------------------------
phase6_install_build() {
  log "PHASE 6 — bun install + build"

  cd "${ENSOTEK_DIR}"
  log "  Workspace root: bun install"
  bun install || warn "  bun install warning'lerle bitti"

  for proj in "${PROJECTS[@]}"; do
    for app in backend admin_panel frontend; do
      pkg="${ENSOTEK_DIR}/${proj}/${app}/package.json"
      if [[ -f "$pkg" ]]; then
        log "  Build: ${proj}/${app}"
        cd "${ENSOTEK_DIR}/${proj}/${app}"
        bun run build 2>&1 | tail -5 || warn "  build hata"
      fi
    done
  done
  cd "${ENSOTEK_DIR}"
  ok "PHASE 6 tamam"
}

# ----------------------------------------------------------------------------
# PHASE 7 — MySQL DB hazır mı (kuhlturm yeni olabilir)
# ----------------------------------------------------------------------------
phase7_mysql() {
  log "PHASE 7 — MySQL DB kontrol"
  for db in ensotek ensotek_com_tr_db kompozit kuhlturm; do
    if ${MYSQL_CMD} -e "USE \`${db}\`;" 2>/dev/null; then
      ok "  DB ${db} mevcut"
    else
      warn "  DB ${db} yok — oluşturuluyor"
      ${MYSQL_CMD} -e "CREATE DATABASE \`${db}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    fi
  done

  # Backup'tan DB restore? Sadece kuhlturm yeni — diğerleri zaten dolu
  warn "  Eğer MySQL dump'tan restore gerekirse:"
  warn "    zcat ${BACKUP_DIR}/mysql/<db>.sql.gz | mysql <db>"

  ok "PHASE 7 tamam"
}

# ----------------------------------------------------------------------------
# PHASE 8 — PM2 başlat
# ----------------------------------------------------------------------------
phase8_pm2_start() {
  log "PHASE 8 — PM2 process'leri başlat (yeni ecosystem)"

  # Her projenin her uygulamasında ecosystem.config.cjs varsa başlat
  for proj in "${PROJECTS[@]}"; do
    for app in backend frontend admin_panel; do
      eco="${ENSOTEK_DIR}/${proj}/${app}/ecosystem.config.cjs"
      if [[ -f "$eco" ]]; then
        log "  pm2 start ${proj}/${app}"
        cd "${ENSOTEK_DIR}/${proj}/${app}"
        pm2 start ecosystem.config.cjs || warn "  start hata: ${proj}/${app}"
      fi
    done
  done

  cd "${ENSOTEK_DIR}"
  pm2 save
  pm2 list
  ok "PHASE 8 tamam"
}

# ----------------------------------------------------------------------------
# PHASE 9 — Health check
# ----------------------------------------------------------------------------
phase9_health() {
  log "PHASE 9 — Health check"
  sleep 5
  for port in 8086 8087 8088 8089 3010 3011 3020 3021 3022 3023 3024; do
    if ss -ltn 2>/dev/null | grep -q ":${port} "; then
      ok "  port ${port} dinleniyor"
    fi
  done

  log "  nginx config test"
  nginx -t

  log "  Domain health curls:"
  for url in https://ensotek.de https://www.ensotek.de https://ensotek.com.tr https://karbonkompozit.com.tr; do
    code=$(curl -sk -o /dev/null -w '%{http_code}' --max-time 10 "$url" 2>/dev/null || echo "FAIL")
    echo "    ${url} -> ${code}"
  done

  ok "PHASE 9 tamam"
}

# ----------------------------------------------------------------------------
# MAIN
# ----------------------------------------------------------------------------
case "${1:-}" in
  phase0)  phase0_preflight ;;
  phase1)  phase1_backup ;;
  phase2)  phase2_stop ;;
  phase3)  phase3_wipe ;;
  phase4)  phase4_clone ;;
  phase5)  phase5_restore ;;
  phase6)  phase6_install_build ;;
  phase7)  phase7_mysql ;;
  phase8)  phase8_pm2_start ;;
  phase9)  phase9_health ;;
  all)
    phase0_preflight
    phase1_backup
    confirm "Backup tamam. Migration'ı sürdürmek istiyor musun? (PM2 duracak, /var/www temizlenecek)"
    phase2_stop
    phase3_wipe
    phase4_clone
    phase5_restore
    phase7_mysql
    phase6_install_build
    phase8_pm2_start
    phase9_health
    ;;
  *)
    cat <<EOF
Ensotek VPS Migration Script

Kullanım:
  $0 phase0   → Pre-flight (tool/disk kontrol)
  $0 phase1   → Backup (.env, uploads, MySQL, pm2, nginx, full tarball)
  $0 phase2   → PM2 stop + delete
  $0 phase3   → /var/www wipe (preserve _acme-challenge + html)
  $0 phase4   → Repolar klonla (Ensotek + 4 proje)
  $0 phase5   → .env + uploads geri yükle
  $0 phase6   → bun install + build
  $0 phase7   → MySQL DB hazırlık (yoksa create)
  $0 phase8   → PM2 yeni ecosystem'lerle başlat
  $0 phase9   → Health check
  $0 all      → Hepsini sırayla (önce backup, sonra onay, sonra migration)

⚠️ ÖNCE phase0 + phase1 çalıştır, backup'ı kontrol et, SONRA phase2-9.
   phase2 ile başlayan kesinti başlar.

Backup konumu: ${BACKUP_DIR}
EOF
    ;;
esac

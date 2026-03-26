// =============================================================
// Ensotek - de_frontend PM2 config
// cwd: /var/www/Ensotek/de_frontend (source + build live here)
// =============================================================

module.exports = {
  apps: [
    {
      name: 'ensotek-frontend',
      cwd: '/var/www/Ensotek/de_frontend',
      script: '/usr/local/bin/bun',
      args: 'run start -- -p 3011 -H 127.0.0.1',
      exec_mode: 'fork',
      instances: 1,
      watch: false,
      autorestart: true,
      max_memory_restart: '450M',
      min_uptime: '30s',
      max_restarts: 10,
      restart_delay: 5000,
      kill_timeout: 8000,
      listen_timeout: 10000,
      env: {
        NODE_ENV: 'production',
        PORT: '3011',
        HOSTNAME: '127.0.0.1',
        NEXT_TELEMETRY_DISABLED: '1',
      },
      combine_logs: true,
      time: true,
    },
  ],
};

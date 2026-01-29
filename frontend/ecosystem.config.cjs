// =============================================================
// FILE: /var/www/Ensotek/frontend/ecosystem.config.cjs
// FINAL — Ensotek Frontend (Next.js via Bun)
// - binds to 127.0.0.1:3011 (nginx reverse proxy only)
// - crash-loop protection + graceful shutdown
// - logs under /home/orhan/.pm2/logs
// =============================================================

module.exports = {
  apps: [
    {
      name: 'ensotek-frontend',
      cwd: '/var/www/Ensotek/frontend',

      // ✅ Next start via bun (no "run file" issue)
      script: '/home/orhan/.bun/bin/bun',
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

      out_file: '/home/orhan/.pm2/logs/ensotek-frontend.out.log',
      error_file: '/home/orhan/.pm2/logs/ensotek-frontend.err.log',
      combine_logs: true,
      time: true,
    },
  ],
};

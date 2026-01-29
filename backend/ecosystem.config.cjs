// =============================================================
// FILE: /var/www/Ensotek/backend/ecosystem.config.cjs
// FINAL — Ensotek Backend (Bun)
// - binds to 127.0.0.1:8086 (nginx reverse proxy only)
// - crash-loop protection + graceful shutdown
// - logs under /home/orhan/.pm2/logs
// =============================================================

module.exports = {
  apps: [
    {
      name: 'ensotek-backend',
      cwd: '/var/www/Ensotek/backend',

      // ✅ run bun directly (deterministic)
      script: '/home/orhan/.bun/bin/bun',
      args: 'dist/index.js',

      exec_mode: 'fork',
      instances: 1,

      watch: false,
      autorestart: true,

      // resource protection
      max_memory_restart: '350M',

      // crash-loop protection (calm)
      min_uptime: '30s',
      max_restarts: 10,
      restart_delay: 5000,

      // graceful shutdown
      kill_timeout: 8000,
      listen_timeout: 10000,

      env: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: '8086',
      },

      out_file: '/home/orhan/.pm2/logs/ensotek-backend.out.log',
      error_file: '/home/orhan/.pm2/logs/ensotek-backend.err.log',
      combine_logs: true,
      time: true,
    },
  ],
};

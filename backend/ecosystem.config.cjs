// =============================================================
// Ensotek - Backend PM2 config (Bun + Fastify)
// cwd: /var/www/Ensotek/backend
// =============================================================

module.exports = {
  apps: [
    {
      name: 'ensotek-backend',
      cwd: '/var/www/Ensotek/backend',
      script: '/usr/local/bin/bun',
      args: 'dist/index.js',
      exec_mode: 'fork',
      instances: 1,
      watch: false,
      autorestart: true,
      max_memory_restart: '350M',
      min_uptime: '30s',
      max_restarts: 10,
      restart_delay: 5000,
      kill_timeout: 8000,
      listen_timeout: 10000,
      env: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: '8086',
      },
      combine_logs: true,
      time: true,
    },
  ],
};

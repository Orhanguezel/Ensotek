// =============================================================
// FILE: ecosystem.config.cjs
// MOE Kompozit (karbonkompozit.com.tr) — PM2 config
// =============================================================

module.exports = {
  apps: [
    {
      name: 'karbonkompozit',
      cwd: '/var/www/Ensotek/karbonkompozit',
      script: '/home/orhan/.bun/bin/bun',
      args: 'run start -- -p 3020 -H 127.0.0.1',
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
        PORT: '3020',
        HOSTNAME: '127.0.0.1',
        NEXT_TELEMETRY_DISABLED: '1',
      },
      out_file: '/home/orhan/.pm2/logs/karbonkompozit.out.log',
      error_file: '/home/orhan/.pm2/logs/karbonkompozit.err.log',
      combine_logs: true,
      time: true,
    },
  ],
};

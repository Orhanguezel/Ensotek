/**
 * /var/www/Ensotek/frontend/ecosystem.config.cjs
 * Ensotek — Frontend (Next.js) PM2 config (orhan-safe)
 * - binds to 127.0.0.1:3011 (nginx reverse proxy only)
 * - logs under /home/orhan/.pm2/logs
 */
module.exports = {
  apps: [
    {
      name: 'ensotek-frontend',
      cwd: '/var/www/Ensotek/frontend',

      // En stabil yöntem: package.json "start" script’i
      script: 'npm',
      args: 'run start -- -p 3011 -H 127.0.0.1',

      exec_mode: 'fork',
      instances: 1,
      watch: false,
      autorestart: true,
      max_memory_restart: '500M',

      min_uptime: '20s',
      max_restarts: 10,
      restart_delay: 3000,

      env: {
        NODE_ENV: 'production',
        PORT: 3011,
        HOSTNAME: '127.0.0.1',
      },

      out_file: '/home/orhan/.pm2/logs/ensotek-frontend.out.log',
      error_file: '/home/orhan/.pm2/logs/ensotek-frontend.err.log',
      combine_logs: true,
      time: true,
    },
  ],
};

module.exports = {
  apps: [
    {
      name: 'ensotek-backend',
      cwd: '/var/www/Ensotek/backend',

      // Bun path: orhan kullanıcısının home altında olmalı
      interpreter: '/home/orhan/.bun/bin/bun',
      script: 'dist/index.js',

      exec_mode: 'fork',
      instances: 1,
      watch: false,
      autorestart: true,
      max_memory_restart: '300M',

      // crash loop koruması
      min_uptime: '20s',
      max_restarts: 10,
      restart_delay: 3000,

      env: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: 8086, // number da olur
        // (varsa) TRUST_PROXY: '1'
      },

      // logları /var/log/pm2 yerine orhan home altında tutmak daha az sürtüşme yaratır
      out_file: '/home/orhan/.pm2/logs/ensotek-backend.out.log',
      error_file: '/home/orhan/.pm2/logs/ensotek-backend.err.log',
      combine_logs: true,
      time: true,
    },
  ],
};

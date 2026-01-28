module.exports = {
  apps: [
    {
      name: 'gzltemizlik-backend',
      cwd: '/var/www/GZLTemizlik/backend',

      interpreter: '/home/orhan/.bun/bin/bun',
      script: 'dist/index.js',

      exec_mode: 'fork',
      instances: 1,

      watch: false,
      autorestart: true,

      max_memory_restart: '300M',

      // crash-loop koruması (daha sakin)
      min_uptime: '30s',
      max_restarts: 10,
      restart_delay: 5000,

      // graceful
      kill_timeout: 8000,
      listen_timeout: 10000,

      env: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: 8071,
      },

      out_file: '/home/orhan/.pm2/logs/gzltemizlik-backend.out.log',
      error_file: '/home/orhan/.pm2/logs/gzltemizlik-backend.err.log',
      combine_logs: true,
      time: true,
    },
  ],
};

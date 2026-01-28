module.exports = {
  apps: [
    {
      name: 'gzltemizlik-frontend',
      cwd: '/var/www/GZLTemizlik/frontend',

      // bun ile Next start
      interpreter: '/home/orhan/.bun/bin/bun',
      script: 'run',
      args: 'start -- -p 3033 -H 127.0.0.1',

      exec_mode: 'fork',
      instances: 1,

      watch: false,
      autorestart: true,

      max_memory_restart: '400M',

      // crash-loop koruması (daha sakin)
      min_uptime: '30s',
      max_restarts: 10,
      restart_delay: 5000,

      kill_timeout: 8000,
      listen_timeout: 10000,

      env: {
        NODE_ENV: 'production',
        PORT: '3033',
        HOSTNAME: '127.0.0.1',
        NEXT_TELEMETRY_DISABLED: '1',
      },

      out_file: '/home/orhan/.pm2/logs/gzltemizlik-frontend.out.log',
      error_file: '/home/orhan/.pm2/logs/gzltemizlik-frontend.err.log',
      combine_logs: true,
      time: true,
    },
  ],
};

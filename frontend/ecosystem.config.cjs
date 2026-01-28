// /var/www/GZLTemizlik/frontend/ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'gzltemizlik-frontend',
      cwd: '/var/www/GZLTemizlik/frontend',

      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3033 -H 127.0.0.1',

      exec_mode: 'fork',
      instances: 1,
      watch: false,
      autorestart: true,

      max_memory_restart: '400M',

      min_uptime: '20s',
      max_restarts: 10,
      restart_delay: 3000,

      kill_timeout: 8000,
      listen_timeout: 10000,

      env: {
        NODE_ENV: 'production',
      },

      out_file: '/home/orhan/.pm2/logs/gzltemizlik-frontend.out.log',
      error_file: '/home/orhan/.pm2/logs/gzltemizlik-frontend.err.log',
      combine_logs: true,
      time: true,
      
    },
  ],
};

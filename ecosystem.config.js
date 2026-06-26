module.exports = {
  apps: [
    {
      name: 'restaurant-erp-pro',
      script: 'backend/server.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3104
      },
      max_memory_restart: '512M',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z'
    }
  ]
};

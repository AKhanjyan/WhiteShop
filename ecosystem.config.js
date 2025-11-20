/**
 * PM2 Ecosystem Configuration
 * 
 * Production configuration for WhiteShop
 * 
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 save
 *   pm2 startup
 */

module.exports = {
  apps: [
    {
      name: 'whiteshop-api',
      script: './apps/api/src/server.js',
      cwd: '/var/www/WhiteShop',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      log_file: './logs/api-combined.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      // Restart on file changes (only in development)
      // watch: ['apps/api/src'],
      // ignore_watch: ['node_modules', 'logs'],
    },
    {
      name: 'whiteshop-web',
      script: 'npm',
      args: 'run start:web',
      cwd: '/var/www/WhiteShop',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/web-error.log',
      out_file: './logs/web-out.log',
      log_file: './logs/web-combined.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      // Restart on file changes (only in development)
      // watch: ['apps/web'],
      // ignore_watch: ['node_modules', '.next', 'logs'],
    },
  ],
};


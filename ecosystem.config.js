// ecosystem.config.js — PM2 process manager config
// Usage:
//   npm install -g pm2
//   pm2 start ecosystem.config.js --env production
//   pm2 save && pm2 startup   (auto-restart on reboot)

module.exports = {
  apps: [
    {
      name: "knowledge-hub",
      script: "server/index.js",
      instances: "max",          // Use all CPU cores
      exec_mode: "cluster",      // Cluster mode for load balancing
      watch: false,
      env: {
        NODE_ENV: "development",
        PORT: 4000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 4000,
      },
      error_file: "logs/error.log",
      out_file: "logs/out.log",
      log_file: "logs/combined.log",
      time: true,
      max_memory_restart: "500M",
      restart_delay: 4000,
      autorestart: true,
    },
  ],
};

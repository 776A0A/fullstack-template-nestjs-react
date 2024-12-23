module.exports = {
  apps: [
    {
      name: 'oxygen-admin-backend',
      script: './packages/server/dist/main.js',
      node_args: '--env-file=.env --env-file=.env.production',
      env: {
        NODE_ENV: 'production',
        TZ: 'Asia/Shanghai',
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      max_size: '10M',
      max_memory_restart: '1G',
      merge_logs: true,
      log_rotate: true,
      log_rotate_interval: '1d',
      log_rotate_max: 30,
    },
  ],
};

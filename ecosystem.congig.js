module.exports = {
  apps: [
    {
      name: 'marketing-landing',
      script: 'app.js',

      exec_mode: 'fork',
      instances: 1,

      autorestart: true,
      watch: false,
      max_memory_restart: '2000M',

      env: {
        NODE_ENV: 'production',
      },

      time: true,
    },
  ],
};

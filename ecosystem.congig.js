module.exports = {
  apps: [
    {
      name: 'fisg-landing-api',
      script: 'npm',
      args: 'start',

      // run mode
      exec_mode: 'fork', // Egg ไม่จำเป็นต้อง cluster
      instances: 1,

      // auto restart
      autorestart: true,
      watch: false,
      max_memory_restart: '2000M',

      // env
      env: {
        NODE_ENV: 'production',
      },

      time: true,
    },
  ],
};
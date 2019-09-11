module.exports = {
  apps : [{
    name: 'bullepling web',
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      PUBLIC_VAPID_KEY: process.env.PUBLIC_VAPID_KEY,
      PRIVATE_VAPID_KEY: process.env.PRIVATE_VAPID_KEY,
    },
  }],
};

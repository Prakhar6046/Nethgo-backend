module.exports = {
  apps: [
    {
      name: 'ncc-backend',
      script: './build/index.js',
      cwd: '/home/ubuntu/orbix/orbix-backend/NCC-Backend-',
      instances: 1,
      env_file: '.env',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};

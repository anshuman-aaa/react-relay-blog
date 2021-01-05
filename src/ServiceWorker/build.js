const workboxBuild = require('workbox-build');

const buildSW = () => {
  return workboxBuild
    .injectManifest({
      swSrc: 'src/ServiceWorker/config.js',
      swDest: 'build/service-worker.js',
      globDirectory: 'build',
      globPatterns: ['**/*.{js,css,html,png,jpg,svg,ico}'],
    })
    .then(({ count, size }) => {
      console.log(`${count} files will be precached, totalling ${size} bytes.`);
    });
};

buildSW();

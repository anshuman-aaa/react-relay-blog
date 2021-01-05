/* eslint-disable no-useless-escape */
/* eslint-disable no-undef,no-restricted-globals */

const imageCachingStrategy = strategy =>
  new strategy({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 120 * 24 * 60 * 60,
      }),
    ],
  });

if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js',
  );

  if (workbox) {
    const {
      core,
      precaching,
      routing,
      strategies: { StaleWhileRevalidate },
    } = workbox;

    core.skipWaiting();
    core.clientsClaim();

    precaching.precacheAndRoute([]);

    routing.registerNavigationRoute('/index.html', {
      blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/],
    });

    routing.registerRoute(
      /\.(?:png|gif|jpg|jpeg)$/,
      imageCachingStrategy(StaleWhileRevalidate),
    );
  } else {
    console.log('Workbox could not be loaded. No offline support.');
  }
}

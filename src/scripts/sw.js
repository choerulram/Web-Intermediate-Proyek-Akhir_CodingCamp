import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { BASE_URL } from './config';
 
// Do precaching
const manifest = self.__WB_MANIFEST;
precacheAndRoute(manifest);

// Runtime caching
registerRoute(
  ({ url }) => {
    return url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com';
  },
  new CacheFirst({
    cacheName: 'google-fonts',
  }),
);

registerRoute(
  ({ url }) => {
    return url.origin === 'https://cdnjs.cloudflare.com' || url.origin.includes('fontawesome');
  },
  new CacheFirst({
    cacheName: 'fontawesome',
  }),
);

registerRoute(
  ({ url }) => {
    return url.origin === 'https://ui-avatars.com';
  },
  new CacheFirst({
    cacheName: 'avatars-api',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(BASE_URL);
    return baseUrl.origin === url.origin && request.destination !== 'image';
  },
  new NetworkFirst({
    cacheName: 'storyapp-api',
  }),
);

registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(BASE_URL);
    return baseUrl.origin === url.origin && request.destination === 'image';
  },
  new StaleWhileRevalidate({
    cacheName: 'storyapp-api-images',
  }),
);

registerRoute(
  ({ url }) => {
    return url.origin.includes('maptiler');
  },
  new CacheFirst({
    cacheName: 'maptiler-api',
  }),
);

self.addEventListener('push', (event) => {
  let title = 'Story berhasil dibuat';
  let options = {
    body: 'Anda telah membuat story baru',
    icon: '/images/logo.png',
    badge: '/images/logo.png',
  };
  if (event.data) {
    try {
      // Parse data dari server
      const dataText = event.data.text();
      const data = JSON.parse(dataText);

      // Update title dan options jika data tersedia
      if (data) {
        if (typeof data === 'string') {
          // Jika data adalah string, gunakan sebagai body
          options.body = data;
        } else {
          // Jika data adalah objek, ekstrak title dan body
          if (data.title) title = data.title;
          if (data.options && data.options.body) options.body = data.options.body;
        }
      }
    } catch (error) {
      // Jika parsing gagal, gunakan data mentah sebagai body
      options.body = event.data.text();
      console.error('Error parsing notification data:', error);
    }
  }
  event.waitUntil(self.registration.showNotification(title, options));
});

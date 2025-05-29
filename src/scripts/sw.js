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

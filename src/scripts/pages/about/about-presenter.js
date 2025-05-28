export default class AboutPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  // Method untuk menampilkan informasi about
  async showAboutInformation() {
    try {
      const aboutData = {
        title: 'Story App',
        description: 'Platform berbagi cerita dan pengalaman',
        features: [
          {
            icon: 'fas fa-user-plus',
            name: 'Daftar dan Login',
            description:
              'Bikin akun cepat dengan email unik dan password. Setelah itu, kamu bisa akses profil dan atur cerita kamu sendiri.',
          },
          {
            icon: 'fas fa-pen-nib',
            name: 'Bagikan Cerita',
            description:
              'Dengan beberapa klik aja, cerita kamu lengkap dengan foto dan deskripsi siap dibagikan. Bisa pakai multimedia juga, supaya lebih ekspresif.',
          },
          {
            icon: 'fas fa-search',
            name: 'Jelajahi Cerita',
            description:
              'Temukan berbagai cerita keren dari pengguna lain. Kamu bisa pilih berdasarkan lokasi atau kategori favoritmu.',
          },
          {
            icon: 'fas fa-bell',
            name: 'Notifikasi',
            description:
              'Jangan ketinggalan cerita terbaru dan aktivitas komunitas lewat notifikasi yang langsung masuk ke perangkatmu.',
          },
        ],
        vision:
          'Kami percaya, setiap cerita itu berharga dan layak didengar. Story App hadir sebagai ruang aman buat kamu untuk berbagi tanpa takut dinilai.',
        joinMessage:
          'Ayo gabung di komunitas storyteller kami! Daftar sekarang dan mulai bagikan kisah unikmu ke dunia.',
      };

      this.#view.showAboutContent(aboutData);
    } catch (error) {
      console.error('showAboutInformation: error:', error);
    }
  }
}

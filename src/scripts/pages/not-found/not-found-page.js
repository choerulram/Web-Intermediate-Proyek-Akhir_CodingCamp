export default class NotFoundPage {
  async render() {
    return `
      <section class="not-found-container">
        <div class="not-found-content">
          <h1>404</h1>
          <h2>Halaman Tidak Ditemukan</h2>
          <p>Maaf, halaman yang Anda cari tidak ditemukan.</p>
          <div class="not-found-actions">
            <a href="#/" class="btn">Kembali ke Beranda</a>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Not needed, but required for consistency
  }
}

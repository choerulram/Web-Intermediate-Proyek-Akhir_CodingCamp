import AboutPresenter from './about-presenter';

export default class AboutPage {
  #presenter;
  #aboutData = null;

  async render() {
    return `
      <section class="about-container">
        <div id="about-content">
          <div class="loading">Loading about content...</div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new AboutPresenter({
      view: this,
      model: null, // We don't need a model for static content
    });

    await this.#presenter.showAboutInformation();
  }

  showAboutContent(data) {
    this.#aboutData = data;
    const aboutContainer = document.getElementById('about-content');

    aboutContainer.innerHTML = `
      <h1 class="about-title"><i class="fas fa-book-open"></i> Tentang ${data.title}</h1>
      <p class="about-description">${data.description}</p>
      
      <h2 class="about-subtitle"><i class="fas fa-info-circle"></i> Apa itu ${data.title}?</h2>
      <p class="about-description">${data.title} adalah aplikasi yang gampang banget dipakai. Kamu bisa daftar, login, dan mulai berbagi cerita pribadi kamu kapan saja.</p>
      
      <h2 class="about-subtitle"><i class="fas fa-star"></i> Fitur Utama</h2>
      <ul class="about-features">
        ${data.features
          .map(
            (feature) => `
          <li><i class="${feature.icon}"></i> <strong>${feature.name}</strong>: ${feature.description}</li>
        `,
          )
          .join('')}
      </ul>
      
      <h2 class="about-subtitle"><i class="fas fa-eye"></i> Visi Kami</h2>
      <p class="about-description">${data.vision}</p>
      
      <h2 class="about-subtitle"><i class="fas fa-handshake"></i> Yuk, Bergabung!</h2>
      <p class="about-description">${data.joinMessage}</p>
    `;
  }
}

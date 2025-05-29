import { showFormattedDate } from './utils';

export function generateLoaderTemplate() {
  return `
    <div class="loader"></div>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute"></div>
  `;
}

export function generateMainNavigationListTemplate() {
  return `
    <li><a id="story-list-button" class="story-list-button" href="#/">Beranda</a></li>
    <li><a id="about-button" class="about-button" href="#/about">About</a></li>
  `;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="story-list-button" class="story-list-button" href="#/">Beranda</a></li>
    <li><a id="about-button" class="about-button" href="#/about">About</a></li>
    <li><a id="login-button" href="#/login">Login</a></li>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="new-story-button" class="btn new-story-button" href="#/new">Buat Cerita <i class="fas fa-plus"></i></a></li>
    <li><a id="logout-button" class="logout-button" href="#/logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
  `;
}

export function generateStoriesListEmptyTemplate() {
  return `
    <div id="stories-list-empty" class="stories-list__empty">
      <h2>Tidak ada cerita yang tersedia</h2>
      <p>Saat ini, tidak ada cerita yang dapat ditampilkan.</p>
    </div>
  `;
}
export function generateStoriesListErrorTemplate(message) {
  return `
    <div id="stories-list-error" class="stories-list__error">
      <h2>Terjadi kesalahan pengambilan daftar cerita</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function generateStoryItemTemplate({
  id,
  name,
  description,
  photoUrl,
  createdAt,
  lat,
  lon,
}) {
  return `
    <div tabindex="0" class="story-item" data-storyid="${id}">
      <img class="story-item__image" src="${photoUrl}" alt="Foto cerita: ${name}">
      <div class="story-item__body">
        <h2 id="story-title" class="story-item__title">${name}</h2>
        <div class="story-item__description">
          ${description}
        </div>
        <div class="story-item__more-info">
          <div class="story-item__createdat">
            <i class="fas fa-calendar-alt"></i> ${showFormattedDate(createdAt, 'id-ID')}
          </div>
          <div class="story-item__location">
            <i class="fas fa-map"></i> ${lat}, ${lon}
          </div>
          <div id="map-${id}" class="story-item__map" style="height: 200px; width: 100%; margin-top: 10px;"></div>
        </div>          <div class="story-item__actions">
            <a class="story-item__read-more" href="#/stories/${id}">
              <span class="story-item__read-more-text">Detail</span>
              <span class="story-item__read-more-icon">
                <i class="fas fa-arrow-right"></i>
              </span>
            </a>
          </div>
      </div>
    </div>
  `;
}

export function generateStoryDetailModalTemplate({
  id,
  name,
  description,
  photoUrl,
  createdAt,
  lat,
  lon,
}) {
  return `
    <div id="modal-${id}" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>${name}</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <img class="modal-story-image" src="${photoUrl}" alt="Foto cerita: ${name}">
          <div class="modal-story-info">
            <div class="modal-story-meta">
              <div class="modal-story-date">
                <i class="fas fa-calendar-alt"></i> ${showFormattedDate(createdAt, 'id-ID')}
              </div>
              <div class="modal-story-location">
                <i class="fas fa-map"></i> ${lat}, ${lon}
              </div>
            </div>
            <div class="modal-story-description">
              ${description}
            </div>
            <div id="modal-map-${id}" class="modal-story-map" style="height: 300px; width: 100%; margin-top: 20px;"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

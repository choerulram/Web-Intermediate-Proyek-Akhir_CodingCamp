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

export function generateStoryDetailErrorTemplate(message) {
  return `
    <div id="stories-detail-error" class="stories-detail__error">
      <h2>Terjadi kesalahan pengambilan detail laporan</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function generateCommentsListEmptyTemplate() {
  return `
    <div id="story-detail-comments-list-empty" class="story-detail__comments-list__empty">
      <h2>Tidak ada komentar yang tersedia</h2>
      <p>Saat ini, tidak ada komentar yang dapat ditampilkan.</p>
    </div>
  `;
}

export function generateCommentsListErrorTemplate(message) {
  return `
    <div id="story-detail-comments-list-error" class="story-detail__comments-list__error">
      <h2>Terjadi kesalahan pengambilan daftar komentar</h2>
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
        </div>
      </div>
    </div>
  `;
}

export function generateStoryDetailImageTemplate(imageUrl = null, alt = '') {
  if (!imageUrl) {
    return `
      <img class="story-detail__image" src="images/placeholder-image.jpg" alt="Placeholder Image">
    `;
  }
  return `
    <img class="story-detail__image" src="${imageUrl}" alt="Detail foto cerita: ${alt}">
  `;
}

export function generateStoryCommentItemTemplate({ photoUrlCommenter, nameCommenter, body }) {
  return `
    <article tabindex="0" class="story-detail__comment-item">      <img
        class="story-detail__comment-item__photo"
        src="${photoUrlCommenter}"
        alt="Foto profil ${nameCommenter} sebagai pemberi komentar"
      >
      <div class="story-detail__comment-item__body">
        <div class="story-detail__comment-item__body__more-info">
          <div class="story-detail__comment-item__body__author">${nameCommenter}</div>
        </div>
        <div class="story-detail__comment-item__body__text">${body}</div>
      </div>
    </article>
  `;
}

export function generateStoryDetailTemplate({
  title,
  description,
  damageLevel,
  evidenceImages,
  latitudeLocation,
  longitudeLocation,
  reporterName,
  createdAt,
}) {
  const createdAtFormatted = showFormattedDate(createdAt, 'id-ID');
  const damageLevelBadge = generateDamageLevelBadge(damageLevel);
  const imagesHtml = evidenceImages.reduce(
    (accumulator, evidenceImage) =>
      accumulator.concat(generateStoryDetailImageTemplate(evidenceImage, title)),
    '',
  );

  return `
    <div class="story-detail__header">
      <h1 id="title" class="story-detail__title">${title}</h1>

      <div class="story-detail__more-info">
        <div class="story-detail__more-info__inline">
          <div id="createdat" class="story-detail__createdat" data-value="${createdAtFormatted}"><i class="fas fa-calendar-alt"></i></div>
        </div>
        <div class="story-detail__more-info__inline">
          <div id="location-latitude" class="story-detail__location__latitude" data-value="${latitudeLocation}">Latitude:</div>
          <div id="location-longitude" class="story-detail__location__longitude" data-value="${longitudeLocation}">Longitude:</div>
        </div>
        <div id="author" class="story-detail__author" data-value="${reporterName}">Dilaporkan oleh:</div>
      </div>

      <div id="damage-level" class="story-detail__damage-level">
        ${damageLevelBadge}
      </div>
    </div>

    <div class="container">
      <div class="story-detail__images__container">
        <div id="images" class="story-detail__images">${imagesHtml}</div>
      </div>
    </div>

    <div class="container">
      <div class="story-detail__body">
        <div class="story-detail__body__description__container">
          <h2 class="story-detail__description__title">Informasi Lengkap</h2>
          <div id="description" class="story-detail__description__body">
            ${description}
          </div>
        </div>
        <div class="story-detail__body__map__container">
          <h2 class="story-detail__map__title">Peta Lokasi</h2>
          <div class="story-detail__map__container">
            <div id="map" class="story-detail__map"></div>
            <div id="map-loading-container"></div>
          </div>
        </div>
  
        <hr>
  
        <div class="story-detail__body__actions__container">
          <h2>Aksi</h2>
          <div class="story-detail__actions__buttons">
            <div id="save-actions-container"></div>
            <div id="notify-me-actions-container">
              <button id="story-detail-notify-me" class="btn btn-transparent">
                Try Notify Me <i class="far fa-bell"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

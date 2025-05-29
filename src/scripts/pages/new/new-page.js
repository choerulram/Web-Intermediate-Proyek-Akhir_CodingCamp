import NewPresenter from './new-presenter';
import { convertBase64ToBlob } from '../../utils';
import * as CityCareAPI from '../../data/api';
import { generateLoaderAbsoluteTemplate } from '../../templates';
import Camera from '../../utils/camera';
import Map from '../../utils/map';

export default class NewPage {
  #presenter;
  #form;
  #camera;
  #isCameraOpen = false;
  #takenDocumentations = [];
  #map = null;

  async render() {
    return `
      <section class="container">
        <div class="new-form__container">
          <form id="new-form" class="new-form">
            <h1 class="new-form__title">Buat Cerita Baru</h1>
            <div class="form-control">
              <label for="description-input" class="new-form__description__title">Deskripsi Cerita</label>

              <div class="new-form__description__container">
                <textarea
                  id="description-input"
                  name="description"
                  placeholder="Bagikan kisah unik dan pengalaman Anda dengan jelas. Ceritakan apa yang membuat cerita Anda berarti bagi Anda dan orang lain."
                ></textarea>
              </div>
            </div>
            <div class="form-control">
              <label for="documentations-input" class="new-form__documentations__title">Dokumentasi</label>
              <div id="documentations-more-info">Anda dapat menyertakan foto sebagai dokumentasi.</div>

              <div class="new-form__documentations__container">
                <div class="new-form__documentations__buttons">
                  <button id="documentations-input-button" class="btn btn-outline" type="button">Ambil Gambar</button>
                  <input
                    id="documentations-input"
                    class="new-form__documentations__input"
                    name="documentations"
                    type="file"
                    accept="image/*"
                    multiple
                    aria-multiline="true"
                    aria-describedby="documentations-more-info"
                  >
                  <button id="open-documentations-camera-button" class="btn btn-outline" type="button">
                    Buka Kamera
                  </button>
                </div>
                <div id="camera-container" class="new-form__camera__container">
                  <video id="camera-video" class="new-form__camera__video">
                    Video stream not available.
                  </video>
                  <canvas id="camera-canvas" class="new-form__camera__canvas"></canvas>                  
                    <div class="new-form__camera__tools">
                      <select id="camera-select"></select>
                      <div class="new-form__camera__tools_buttons">
                        <button id="camera-take-button" class="btn" type="button">
                          Ambil Gambar
                        </button>
                    </div>
                  </div>
                </div>
                <ul id="documentations-taken-list" class="new-form__documentations__outputs"></ul>
              </div>
            </div>
            <div class="form-control">
              <div class="new-form__location__title">Lokasi</div>

              <div class="new-form__location__container">
                <div class="new-form__location__map__container">
                  <div id="map" class="new-form__location__map"></div>
                  <div id="map-loading-container"></div>
                </div>
                <div class="new-form__location__lat-lng">
                  <input type="number" name="lat" value="-6.175389" disabled>
                  <input type="number" name="lon" value="106.827139" disabled>
                </div>
              </div>
            </div>
            <div class="form-buttons">
              <span id="submit-button-container">
                <button class="btn" type="submit">Buat Laporan</button>
              </span>
              <a class="btn btn-outline" href="#/">Batal</a>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new NewPresenter({
      view: this,
      model: CityCareAPI,
    });
    this.#takenDocumentations = [];

    this.#presenter.showNewFormMap();
    this.#setupForm();
  }

  #setupForm() {
    this.#form = document.getElementById('new-form');
    this.#form.addEventListener('submit', async (event) => {
      event.preventDefault();

      // Check if there are any photos
      if (this.#takenDocumentations.length === 0) {
        this.storeFailed('Silakan pilih foto terlebih dahulu');
        return;
      }

      const data = {
        description: this.#form.elements.namedItem('description').value,
        photo: this.#takenDocumentations[0].blob,
        lat: parseFloat(this.#form.elements.namedItem('lat').value),
        lon: parseFloat(this.#form.elements.namedItem('lon').value),
      };

      try {
        await this.#presenter.postNewStory(data);
        // Force redirect immediately after successful submission
        window.location.href = '#/';
      } catch (error) {
        console.error('Failed to submit story:', error);
      }
    });

    // Handle file input
    document.getElementById('documentations-input').addEventListener('change', async (event) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        // Take only the first file
        await this.#addTakenPicture(files[0]);
        await this.#populateTakenPictures();
      }
    });

    document.getElementById('documentations-input-button').addEventListener('click', () => {
      document.getElementById('documentations-input').click();
    });

    const cameraContainer = document.getElementById('camera-container');
    document
      .getElementById('open-documentations-camera-button')
      .addEventListener('click', async (event) => {
        cameraContainer.classList.toggle('open');

        this.#isCameraOpen = cameraContainer.classList.contains('open');
        if (this.#isCameraOpen) {
          event.currentTarget.textContent = 'Tutup Kamera';
          this.#setupCamera();
          this.#camera.launch();
          return;
        }

        event.currentTarget.textContent = 'Buka Kamera';
        this.#camera.stop();
      });
  }

  // TODO: map initialization
  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
      locate: true,
    });

    // Preparing marker for select coordinate
    const centerCoordinate = this.#map.getCenter();

    this.#updateLatLngInput(centerCoordinate.latitude, centerCoordinate.longitude);

    const draggableMarker = this.#map.addMarker(
      [centerCoordinate.latitude, centerCoordinate.longitude],
      { draggable: 'true' },
    );

    draggableMarker.addEventListener('move', (event) => {
      const coordinate = event.target.getLatLng();
      this.#updateLatLngInput(coordinate.lat, coordinate.lng);
    });

    this.#map.addMapEventListener('click', (event) => {
      draggableMarker.setLatLng(event.latlng);

      // Keep center with user view
      event.sourceTarget.flyTo(event.latlng);
    });
  }

  #updateLatLngInput(latitude, longitude) {
    this.#form.elements.namedItem('lat').value = latitude;
    this.#form.elements.namedItem('lon').value = longitude;
  }

  // TODO: camera initialization
  #setupCamera() {
    if (!this.#camera) {
      this.#camera = new Camera({
        video: document.getElementById('camera-video'),
        cameraSelect: document.getElementById('camera-select'),
        canvas: document.getElementById('camera-canvas'),
      });

      // Add camera capture handler
      this.#camera.addCheeseButtonListener('#camera-take-button', async () => {
        try {
          const imageBase64 = await this.#camera.takePicture();
          await this.#addTakenPicture(imageBase64);
          await this.#populateTakenPictures();
        } catch (error) {
          console.error('Failed to capture image:', error);
          this.storeFailed('Gagal mengambil foto dari kamera');
        }
      });
    }
  }

  async #addTakenPicture(image) {
    let file;

    try {
      if (typeof image === 'string') {
        // Handle base64 string from camera
        const blob = await convertBase64ToBlob(image, 'image/jpeg');
        file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
      } else if (image instanceof File) {
        // Handle file from input
        file = image;
      } else if (image instanceof Blob) {
        // Handle blob
        file = new File([image], `photo-${Date.now()}.jpg`, { type: image.type || 'image/jpeg' });
      } else {
        console.error('Unsupported image type:', image);
        throw new Error('Format foto tidak didukung');
      }

      // Store only one image at a time
      this.#takenDocumentations = [
        {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          blob: file,
        },
      ];
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Gagal memproses foto');
    }
  }

  async #populateTakenPictures() {
    const html = this.#takenDocumentations.reduce((accumulator, picture, currentIndex) => {
      const imageUrl = URL.createObjectURL(picture.blob);
      return accumulator.concat(`
        <li class="new-form__documentations__outputs-item">
          <button type="button" data-deletepictureid="${picture.id}" class="new-form__documentations__outputs-item__delete-btn">
            <img src="${imageUrl}" alt="Dokumentasi ke-${currentIndex + 1}">
          </button>
        </li>
      `);
    }, '');

    document.getElementById('documentations-taken-list').innerHTML = html;

    document.querySelectorAll('button[data-deletepictureid]').forEach((button) =>
      button.addEventListener('click', (event) => {
        const pictureId = event.currentTarget.dataset.deletepictureid;

        const deleted = this.#removePicture(pictureId);
        if (!deleted) {
          console.log(`Picture with id ${pictureId} was not found`);
        }

        // Updating taken pictures
        this.#populateTakenPictures();
      }),
    );
  }

  #removePicture(id) {
    const selectedPicture = this.#takenDocumentations.find((picture) => {
      return picture.id == id;
    });

    // Check if founded selectedPicture is available
    if (!selectedPicture) {
      return null;
    }

    // Deleting selected selectedPicture from takenPictures
    this.#takenDocumentations = this.#takenDocumentations.filter((picture) => {
      return picture.id != selectedPicture.id;
    });

    return selectedPicture;
  }
  storeSuccessfully() {
    // Not used anymore since redirect and notifications are handled elsewhere
    this.clearForm();
  }

  storeFailed(message) {
    // Only show alert if there's an actual error message
    if (message) {
      alert(message);
    }
  }

  clearForm() {
    this.#form.reset();
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Buat Laporan
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit">Buat Laporan</button>
    `;
  }
}

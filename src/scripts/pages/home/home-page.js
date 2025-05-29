import Map from '../../utils/map';
import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
  generateStoryDetailModalTemplate,
} from '../../templates';
import HomePresenter from './home-presenter';
import * as CityCareAPI from '../../data/api';

export default class HomePage {
  #presenter = null;
  async render() {
    return `
      <section class="container">
        <div class="stories-list__container">
          <h1 class="section-title">Daftar Cerita</h1>
          <div id="stories-list"></div>
          <div id="stories-list-loading-container"></div>
        </div>
        <div id="modal-container"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: CityCareAPI,
    });

    await this.#presenter.initialGalleryAndMap();
  }

  async #setupStoryDetailModal() {
    document.querySelectorAll('.story-item__read-more').forEach((button) => {
      button.addEventListener('click', async (event) => {
        event.preventDefault();
        const storyId = event.target.closest('.story-item').dataset.storyid;
        await this.showStoryDetailModal(storyId);
      });
    });

    // Close modal when clicking outside or on close button
    document.addEventListener('click', (event) => {
      if (
        event.target.classList.contains('modal') ||
        event.target.classList.contains('modal-close')
      ) {
        this.hideStoryDetailModal();
      }
    });
  }

  async showStoryDetailModal(storyId) {
    this.showLoading();
    try {
      const response = await CityCareAPI.getStoryById(storyId);
      if (!response.ok) {
        throw new Error(response.message || 'Failed to fetch story details');
      }

      const modalContainer = document.getElementById('modal-container');
      modalContainer.innerHTML = generateStoryDetailModalTemplate(response.story);

      const modal = document.getElementById(`modal-${storyId}`);
      modal.classList.add('show');

      // Initialize map in modal
      const mapContainer = document.getElementById(`modal-map-${storyId}`);
      if (mapContainer) {
        const map = await Map.build(`#modal-map-${storyId}`, {
          center: [response.story.lat, response.story.lon],
          zoom: 13,
        });

        map.addMarker(
          [response.story.lat, response.story.lon],
          {},
          {
            content: `
              <div class="story-map-popup">
                <h3>${response.story.name}</h3>
                <p>${response.story.description}</p>
              </div>
            `,
          },
        );
      }
    } catch (error) {
      console.error('Error showing story detail:', error);
      alert('Failed to load story details. Please try again.');
    } finally {
      this.hideLoading();
    }
  }

  hideStoryDetailModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => {
      modal.classList.remove('show');
    });
  }

  populateStoriesList(message, stories) {
    if (stories.length <= 0) {
      this.populateStoriesListEmpty();
      return;
    }

    const html = stories.reduce((accumulator, story) => {
      return accumulator.concat(
        generateStoryItemTemplate({
          ...story,
          name: story.name,
        }),
      );
    }, '');
    document.getElementById('stories-list').innerHTML = `
      <div class="stories-list">${html}</div>
    `;

    // Setup modal event listeners after populating stories
    this.#setupStoryDetailModal();

    // Give the DOM time to update before initializing maps
    setTimeout(() => {
      // Initialize maps for each story
      stories.forEach(async (story) => {
        try {
          const mapContainer = document.getElementById(`map-${story.id}`);
          if (!mapContainer) {
            console.error(`Map container for story ${story.id} not found`);
            return;
          }

          const map = await Map.build(`#map-${story.id}`, {
            center: [story.lat, story.lon],
            zoom: 13,
          });

          // Add marker with popup for each story
          map.addMarker(
            [story.lat, story.lon],
            {},
            {
              content: `
                <div class="story-map-popup">
                  <h3>${story.name}</h3>
                  <p>${story.description}</p>
                </div>
              `,
            },
          );
        } catch (error) {
          console.error(`Error initializing map for story ${story.id}:`, error);
        }
      });
    }, 100); // Small delay to ensure DOM is ready
  }

  populateStoriesListEmpty() {
    document.getElementById('stories-list').innerHTML = generateStoriesListEmptyTemplate();
  }

  populateStoriesListError(message) {
    document.getElementById('stories-list').innerHTML = generateStoriesListErrorTemplate(message);
  }

  async initialMap() {
    // TODO: map initialization
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showLoading() {
    document.getElementById('stories-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = '';
  }
}

import Map from '../../utils/map';
import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
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

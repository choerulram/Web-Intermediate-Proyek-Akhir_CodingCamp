import BookmarkPresenter from './bookmark-presenter';
import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoryDetailModalTemplate,
  generateMainNavigationListTemplate,
} from '../../templates';
import Database from '../../data/database';
import Map from '../../utils/map';
import * as CityCareAPI from '../../data/api';

export default class BookmarkPage {
  #presenter = null;
  async render() {
    return `
      <section class="container">
        <div class="stories-list__container">
          <h1 class="section-title">Daftar Cerita Tersimpan</h1>
          <div id="bookmarked-stories"></div>
          <div id="bookmarked-stories-loading-container"></div>
        </div>
        <div id="modal-container"></div>
      </section>
    `;
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
      // For bookmarked stories, we already have the data in IndexedDB
      const stories = await Database.getAllReports();
      const story = stories.find((s) => s.id === storyId);

      if (!story) {
        throw new Error('Story not found in bookmarks');
      }

      const modalContainer = document.getElementById('modal-container');
      modalContainer.innerHTML = generateStoryDetailModalTemplate(story);

      const modal = document.getElementById(`modal-${storyId}`);
      modal.classList.add('show');

      // Initialize map in modal
      const mapContainer = document.getElementById(`modal-map-${storyId}`);
      if (mapContainer) {
        const map = await Map.build(`#modal-map-${storyId}`, {
          center: [story.lat, story.lon],
          zoom: 13,
        });

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

  async afterRender() {
    this.#presenter = new BookmarkPresenter({
      view: this,
      model: Database,
    });

    await this.#presenter.getBookmarkedStories();
  }

  showLoading() {
    document.getElementById('bookmarked-stories-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('bookmarked-stories-loading-container').innerHTML = '';
  }
  populateBookmarkedStories(stories) {
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

    document.getElementById('bookmarked-stories').innerHTML = `
      <div class="stories-list">${html}</div>
    `;

    // Update all save buttons to show as "Saved"
    document.querySelectorAll('.story-item__save-button').forEach((button) => {
      button.innerHTML = `
        <i class="fas fa-bookmark"></i>
        <span>Saved</span>
      `;
      button.classList.add('saved');

      // Add click handler for removing bookmark
      button.addEventListener('click', async (event) => {
        const storyId = event.currentTarget.dataset.storyid;
        if (confirm('Remove this story from bookmarks?')) {
          await this.#presenter.removeStory(storyId);
        }
      });
    });

    // Setup detail button functionality
    this.#setupStoryDetailModal();

    // Update all save buttons to show as "Saved"
    document.querySelectorAll('.story-item__save-button').forEach((button) => {
      button.innerHTML = `
        <i class="fas fa-bookmark"></i>
        <span>Saved</span>
      `;
      button.classList.add('saved');
    });

    // Setup detail modal functionality
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
    document.getElementById('bookmarked-stories').innerHTML = generateStoriesListEmptyTemplate();
  }
}

export default class HomePresenter {
  #view;
  #model;
  #dbModel;

  constructor({ view, model, dbModel }) {
    this.#view = view;
    this.#model = model;
    this.#dbModel = dbModel;
  }

  async showStoriesListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showStoriesListMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initialGalleryAndMap() {
    this.#view.showLoading();
    try {
      // Hapus pemanggilan showStoriesListMap
      // await this.showStoriesListMap();

      console.log('Fetching stories with params:', { page: 1, size: 10, location: 0 });
      const response = await this.#model.getAllStories({ page: 1, size: 10, location: 0 });

      if (!response.ok) {
        console.error('initialGalleryAndMap: response:', response);
        this.#view.populateStoriesListError(response.message);
        return;
      }

      this.#view.populateStoriesList(response.message, response.listStory);
    } catch (error) {
      console.error('initialGalleryAndMap: error:', error);
      this.#view.populateStoriesListError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
  async saveStory(storyId) {
    try {
      const response = await this.#model.getStoryById(storyId);
      if (!response.ok) {
        throw new Error('Failed to get story details');
      }
      await this.#dbModel.putReport(response.story);
      this.#view.saveToBookmarkSuccessfully(storyId, 'Story saved to bookmarks successfully!');
    } catch (error) {
      console.error('saveStory error:', error);
      this.#view.saveToBookmarkFailed(error.message || 'Failed to save story to bookmarks');
    }
  }
}

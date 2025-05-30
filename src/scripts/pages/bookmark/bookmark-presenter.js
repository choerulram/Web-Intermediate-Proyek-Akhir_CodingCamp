export default class BookmarkPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async getBookmarkedStories() {
    this.#view.showLoading();
    try {
      const stories = await this.#model.getAllReports();
      this.#view.populateBookmarkedStories(stories);
    } catch (error) {
      console.error('getBookmarkedStories error:', error);
      this.#view.populateStoriesListEmpty();
    } finally {
      this.#view.hideLoading();
    }
  }
}

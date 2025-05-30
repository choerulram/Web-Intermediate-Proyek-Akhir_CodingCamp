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

  async removeStory(storyId) {
    try {
      await this.#model.removeReport(storyId);
      // Refresh the stories list after removal
      const stories = await this.#model.getAllReports();
      this.#view.populateBookmarkedStories(stories);
      alert('Story removed from bookmarks successfully!');
    } catch (error) {
      console.error('removeStory error:', error);
      alert('Failed to remove story from bookmarks');
    }
  }
}

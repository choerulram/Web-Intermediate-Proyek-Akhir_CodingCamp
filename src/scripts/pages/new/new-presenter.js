export default class NewPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showNewFormMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showNewFormMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }
  async postNewStory({ description, photo, lat, lon }) {
    this.#view.showSubmitLoadingButton();
    try {
      const response = await this.#model.storeNewStory({
        description,
        photo,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
      });
      if (!response.ok || !response.data) {
        this.#view.storeFailed(response.message || 'Gagal membuat cerita');
        return;
      }

      // Immediately handle the notification
      const notifyResponse = await this.#notifyToAllUser(response.data.id); // No need to call storeSuccessfully since redirect is handled in the form submission
    } catch (error) {
      this.#view.storeFailed('Gagal membuat cerita');
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }

  async #notifyToAllUser(storyId) {
    try {
      const response = await this.#model.sendStoryNotification(storyId);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

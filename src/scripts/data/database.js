import { openDB } from 'idb';
 
const DATABASE_NAME = 'storyapp';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'saved-stories';
 
const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade: (database) => {
    database.createObjectStore(OBJECT_STORE_NAME, {
      keyPath: 'id',
    });
  },
});

const Database = {
  async putReport(report) {
    if (!Object.hasOwn(report, 'id')) {
      throw new Error('`id` is required to save.');
    }

    return (await dbPromise).put(OBJECT_STORE_NAME, report);
  },

  async getAllReports() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  async removeReport(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
};

export default Database;
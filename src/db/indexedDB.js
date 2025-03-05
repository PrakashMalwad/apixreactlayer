import { openDB } from "idb";

const DB_NAME = "ApiTesterDB";
const STORE_COLLECTIONS = "collections";
const STORE_HISTORY = "history";

// Open Database
const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_COLLECTIONS)) {
      db.createObjectStore(STORE_COLLECTIONS, { keyPath: "id", autoIncrement: true });
    }
    if (!db.objectStoreNames.contains(STORE_HISTORY)) {
      db.createObjectStore(STORE_HISTORY, { keyPath: "id", autoIncrement: true });
    }
  },
});

// 💾 CRUD Operations for Collections
export const addCollection = async (name) => {
  const db = await dbPromise;
  const id = await db.add(STORE_COLLECTIONS, { name });
  return { id, name };
};

export const getCollections = async () => {
  const db = await dbPromise;
  return db.getAll(STORE_COLLECTIONS);
};

export const updateCollection = async (id, name) => {
  const db = await dbPromise;
  const existing = await db.get(STORE_COLLECTIONS, id);
  if (existing) {
    await db.put(STORE_COLLECTIONS, { ...existing, name });
  }
};

export const deleteCollection = async (id) => {
  const db = await dbPromise;
  await db.delete(STORE_COLLECTIONS, id);
};

// 🔹 CRUD Operations for History
export const addHistoryItem = async (requestName, requestData) => {
  const db = await dbPromise;
  const id = await db.add(STORE_HISTORY, { requestName, requestData, timestamp: new Date() });
  return { id, requestName, requestData, timestamp: new Date() };
};

export const getHistory = async () => {
  const db = await dbPromise;
  return db.getAll(STORE_HISTORY);
};

export const clearHistory = async () => {
  const db = await dbPromise;
  await db.clear(STORE_HISTORY);
};

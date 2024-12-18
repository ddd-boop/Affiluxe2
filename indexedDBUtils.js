// IndexedDB Utility Functions
const DB_NAME = 'userDB';
const DB_VERSION = 1;
const STORE_NAME = 'users';

// Open IndexedDB database
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'username' });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

// Add user to IndexedDB
function addUserToDB(username, password, userUID) {
  return openDB().then((db) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.add({ username, password, userUID });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  });
}

// Retrieve user from IndexedDB by username
function getUserFromDB(username) {
  return openDB().then((db) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(username);

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  });
}

// Generate a unique user ID (UID)
function generateUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

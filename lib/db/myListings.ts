"use client";

export interface MyListingRecord {
  id: number;
  title: string;
  description?: string;
  category?: string;
  price?: number;
  discountPercentage?: number;
  stock?: number;
  thumbnail?: string;
  images?: string[];
  discountType?: string;
  remoteId?: number;
  createdAt: string;
  source?: "api" | "draft";
  raw?: unknown;
}

const DB_NAME = "buy-com";
const STORE_NAME = "my-listing";
const DB_VERSION = 1;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

function generateLocalId() {
  return Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);
}

export async function addListing(
  record: MyListingRecord,
  options: { allowReplace?: boolean } = {}
) {
  const db = await openDatabase();

  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const preparedRecord: MyListingRecord = {
      ...record,
      remoteId: record.remoteId ?? record.id,
    };

    if (options.allowReplace) {
      store.put(preparedRecord);
    } else {
      const getRequest = store.get(preparedRecord.id);
      getRequest.onsuccess = () => {
        const existing = getRequest.result as MyListingRecord | undefined;
        const entry = existing
          ? { ...preparedRecord, id: generateLocalId() }
          : preparedRecord;
        store.put(entry);
      };
      getRequest.onerror = () => {
        reject(getRequest.error);
      };
    }

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
}

export async function getListings(): Promise<MyListingRecord[]> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result ?? []);
    request.onerror = () => reject(request.error);
  });
}

export async function clearListings() {
  const db = await openDatabase();

  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.clear();

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function getListingById(
  id: number
): Promise<MyListingRecord | undefined> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result as MyListingRecord);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteListing(id: number) {
  const db = await openDatabase();

  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.delete(id);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

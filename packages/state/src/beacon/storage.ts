// extend storage from beacon-types such that we encrypt the data we store and decrypt it when we retrieve it
// we can use the same encryption key for all data

import { Storage, type StorageKey, type StorageKeyReturnType } from "@airgap/beacon-sdk";
import { decrypt, encrypt, type EncryptedData } from "@umami/crypto";

// get a static password from enviornment variables

const local_storage_password: string = "umami-test-password-123";

export class EncryptedBeaconStorage extends Storage {
  static async isSupported(): Promise<boolean> {
    return typeof localStorage !== "undefined";
  }

  async get<K extends StorageKey>(key: K): Promise<StorageKeyReturnType[K]> {
    const decryptData= localStorage.getItem(this.getPrefixedKey(key))?.split(",");
    if (decryptData === undefined || local_storage_password === undefined) {
      return undefined as StorageKeyReturnType[K];
    }
    const encryptedValue :EncryptedData= {
      iv: decryptData[0],
      salt: decryptData[1],
      data: decryptData[2],
    };
      const decryptedValue = decrypt(encryptedValue, local_storage_password);
      let result = JSON.parse(await decryptedValue) as StorageKeyReturnType[K];
      console.log("Beacon encryption get:", key, result);
      return result;

  }

  async set<K extends StorageKey>(key: K, value: StorageKeyReturnType[K]): Promise<void> {
    console.log("Beacon encryption set:", key, value  );
    if (local_storage_password === undefined) {
      return;
    }
    const stringValue = JSON.stringify(value);
    const encryptedValue = await encrypt(stringValue, local_storage_password);
    localStorage.setItem(this.getPrefixedKey(key),[encryptedValue.iv, encryptedValue.salt, encryptedValue.data].join(","));
  }

  async delete<K extends StorageKey>(key: K): Promise<void> {
    localStorage.removeItem(this.getPrefixedKey(key));
  }

  async subscribeToStorageChanged(callback: (arg: {
    eventType: "storageCleared" | "entryModified";
    key: string | null;
    oldValue: string | null;
    newValue: string | null;
  }) => {}): Promise<void> {
    window.addEventListener("storage", (event) => {
      if (event.storageArea === localStorage) {
        callback({
          eventType: event.key ? "entryModified" : "storageCleared",
          key: event.key,
          oldValue: event.oldValue,
          newValue: event.newValue,
        });
      }
    });
  }

  getPrefixedKey<K extends StorageKey>(key: K): string {
    return `beacon:${key}`;
  }
}

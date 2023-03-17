import { buf2hex, hex2Bytes } from "@taquito/utils";
import { UmamiEncrypted } from "../types/UmamiEncrypted";

export function getMessageEncoding(message: string) {
  let enc = new TextEncoder();
  return enc.encode(message);
}

export async function encryptMessage(key: CryptoKey, message: string) {
  let encoded = getMessageEncoding(message);
  // The iv must never be reused with a given key.
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const data = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encoded
  );

  return { iv, data };
}

export async function decryptMessage(
  key: CryptoKey,
  iv: Uint8Array,
  ciphertext: ArrayBuffer
) {
  let decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    ciphertext
  );

  let dec = new TextDecoder();
  return dec.decode(decrypted);
}

export const keyFromPassword = async (password: string) => {
  const buffer = Buffer.alloc(32, password);
  return window.crypto.subtle.importKey("raw", buffer, "AES-GCM", true, [
    "encrypt",
    "decrypt",
  ]);
};

export const derivableKeyFromPassword = async (password: string) => {
  const buffer = Buffer.alloc(32, password);
  return window.crypto.subtle.importKey("raw", buffer, "PBKDF2", false, [
    "deriveBits",
    "deriveKey",
  ]);
};

export const encryptWithPassword = async (
  password: string,
  message: string
) => {
  const key = await keyFromPassword(password);

  const encryptedMessage = await encryptMessage(key, message);
  return encryptedMessage;
};

export const decryptWithPassword = async (
  password: string,
  encryptedMessage: {
    iv: Uint8Array;
    data: ArrayBuffer;
  }
) => {
  const key = await keyFromPassword(password);
  const { iv, data } = encryptedMessage;
  const decryptedMessage = await decryptMessage(key, iv, data);
  return decryptedMessage;
};

export const deriveKeyWithSalt = (salt: any, key: CryptoKey) =>
  crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 10000,
      hash: "SHA-256",
    },
    key,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );

export const makeSalt = () => crypto.getRandomValues(new Uint8Array(32));

export const makeSaltedSecret = async (data: string, password: string) => {
  const key = await derivableKeyFromPassword(password);
  const salt = makeSalt();
  const derivedKey = await deriveKeyWithSalt(salt, key);

  const encrypted = await encryptMessage(derivedKey, data);

  const secret: UmamiEncrypted = {
    iv: buf2hex(encrypted.iv as Buffer),
    data: buf2hex(encrypted.data as Buffer),
    salt: buf2hex(salt as Buffer),
  };
  return secret;
};

export const descryptSaltedSecret = async (
  secret: UmamiEncrypted,
  password: string
) => {
  const { iv, data, salt } = secret;
  const key = await derivableKeyFromPassword(password);
  const derivedKey = await deriveKeyWithSalt(hex2Bytes(salt), key);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: hex2Bytes(iv),
    },
    derivedKey,
    hex2Bytes(data)
  );

  const result = Buffer.from(decrypted).toString("utf8");
  return result;
};

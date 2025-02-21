import Aes from "crypto-js/aes";
import CryptoJsCore from "crypto-js/core";

export const NONCE_NAME = "user_requirements_nonce";

export const getOrCreateUserNonce = (password?: string): string | null => {
  const nonce = getUserNonce();
  if (nonce) {
    return nonce;
  }
  if (password) {
    const decryptedNonce = decryptUserNonce(password);
    if (decryptedNonce) {
      return decryptedNonce;
    }
    return createUserNonce(password);
  }

  return null;
};

export const getUserNonce = (): string | null => sessionStorage.getItem(NONCE_NAME) ?? "";

export const decryptUserNonce = (password: string): string | null => {
  const encryptedNonce = localStorage.getItem(NONCE_NAME);
  if (!encryptedNonce) {
    return null;
  }

  try {
    const bytes = Aes.decrypt(encryptedNonce, password);
    const nonce = bytes.toString(CryptoJsCore.enc.Utf8);
    if (!nonce) {
      throw new Error("Failed to decrypt nonce");
    }

    sessionStorage.setItem(NONCE_NAME, nonce);
    return nonce;
  } catch {
    return null;
  }
};

export const createUserNonce = (password: string): string => {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const nonce = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  const encrypted = Aes.encrypt(nonce, password).toString();
  localStorage.setItem(NONCE_NAME, encrypted);

  sessionStorage.setItem(NONCE_NAME, nonce);

  return nonce;
};

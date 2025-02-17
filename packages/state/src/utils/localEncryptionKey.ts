import Aes from "crypto-js/aes";
import CryptoJsCore from "crypto-js/core";

export const NONCE_NAME = "user_requirements_nonce";

export const getOrCreateUserNonce = (password?: string): string | null => {
  // Try session storage first (unencrypted for current session)
  let nonce = sessionStorage.getItem(NONCE_NAME) ?? "";

  if (nonce === "") {
    const encryptedNonce = localStorage.getItem(NONCE_NAME);

    if (!encryptedNonce) {
      // Create new nonce if none exists
      if (!password) { return null; } // Need password to create new nonce
      
      const randomBytes = crypto.getRandomValues(new Uint8Array(32));
      nonce = Array.from(randomBytes)
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
      
      // Store encrypted in localStorage
      const encrypted = Aes.encrypt(nonce, password).toString();
      localStorage.setItem(NONCE_NAME, encrypted);
    } else {
      // Decrypt existing nonce
      if (!password) {return null;}
      try {
        const bytes = Aes.decrypt(encryptedNonce, password);
        nonce = bytes.toString(CryptoJsCore.enc.Utf8);
        if (!nonce) {throw new Error("Failed to decrypt nonce");}
      } catch {
        return null; // Wrong password
      }
    }
    
    // Store decrypted in sessionStorage for current session
    sessionStorage.setItem(NONCE_NAME, nonce);
  }

  return nonce;
};

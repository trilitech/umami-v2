import { digestStringAsync, getRandomBytes } from "expo-crypto";
import CryptoJS from "crypto-js";

const crypto = {
  getRandomValues: (buffer) => {
    if (!(buffer instanceof Uint8Array)) {
      throw new TypeError("Expected buffer to be an instance of Uint8Array");
    }
    const randomBytes = getRandomBytes(buffer.length);
    buffer.set(randomBytes);
    return buffer;
  },

  createHash: (algorithm) => {
    if (!["SHA256", "SHA512", "MD5"].includes(algorithm.toUpperCase())) {
      throw new Error(`Unsupported algorithm: ${algorithm}`);
    }
    return {
      _data: "",
      update(data) {
        this._data += data;
        return this;
      },
      async digest(encoding = "hex") {
        const hash = await digestStringAsync(algorithm, this._data, {
          encoding: encoding.toUpperCase(),
        });
        return hash;
      },
    };
  },

  createHmac: (algorithm, key) => {
    if (!["SHA256", "SHA512", "MD5"].includes(algorithm.toUpperCase())) {
      throw new Error(`Unsupported algorithm: ${algorithm}`);
    }
    return {
      _data: "",
      update(data) {
        this._data += data;
        return this;
      },
      digest(encoding = "hex") {
        const hmac = CryptoJS.HmacSHA256(this._data, CryptoJS.enc.Hex.parse(key.toString("hex")));
        return encoding === "hex"
          ? hmac.toString(CryptoJS.enc.Hex)
          : Buffer.from(hmac.toString(CryptoJS.enc.Hex), "hex");
      },
    };
  },

  createCipheriv: (algorithm, key, iv) => {
    if (algorithm !== "aes-256-cbc") {
      throw new Error(`Unsupported algorithm: ${algorithm}`);
    }

    // Ensure key is 32 bytes
    if (key.length < 32) {
      console.warn("Key is shorter than 32 bytes. Padding with zeros.");
      key = Buffer.concat([key, Buffer.alloc(32 - key.length, 0)]);
    } else if (key.length > 32) {
      console.warn("Key is longer than 32 bytes. Trimming to 32 bytes.");
      key = key.slice(0, 32);
    }

    // Ensure IV is 16 bytes
    if (iv.length !== 16) {
      throw new Error("IV must be 16 bytes (128 bits) for aes-256-cbc.");
    }

    const keyHex = CryptoJS.enc.Hex.parse(Buffer.from(key).toString("hex"));
    const ivHex = CryptoJS.enc.Hex.parse(Buffer.from(iv).toString("hex"));
    let plaintext = "";

    return {
      update(data) {
        if (!Buffer.isBuffer(data)) {
          throw new Error("Data must be a Buffer.");
        }
        plaintext += data.toString("utf8");
        return Buffer.alloc(0); // Return an empty buffer as per Node.js behavior for `update`.
      },
      final() {
        if (!plaintext) {
          throw new Error("No data to encrypt. Call `update` with some data first.");
        }

        const encrypted = CryptoJS.AES.encrypt(plaintext, keyHex, {
          iv: ivHex,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }).ciphertext;

        return Buffer.from(encrypted.toString(CryptoJS.enc.Hex), "hex");
      },
    };
  }
};

module.exports = crypto;

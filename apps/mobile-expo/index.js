import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import { Buffer } from 'buffer';
import process from 'process';
import { digestStringAsync, getRandomBytes } from "expo-crypto";


global.Buffer = Buffer;
global.process = process;

global.crypto = global.crypto || {};
global.crypto.getRandomValues = (buffer) => {
  if (!(buffer instanceof Uint8Array)) {
    throw new TypeError("Expected buffer to be an instance of Uint8Array");
  }
  const randomBytes = getRandomBytes(buffer.length);
  buffer.set(randomBytes);
  return buffer;
}
global.crypto.createHash = (algorithm) => {
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
};

// global.crypto = {
//   getRandomValues: (buffer) => {
//     if (!(buffer instanceof Uint8Array)) {
//       throw new TypeError("Expected buffer to be an instance of Uint8Array");
//     }
//     const randomBytes = getRandomBytes(buffer.length);
//     buffer.set(randomBytes);
//     return buffer;
//   },
//   createHash: (algorithm) => {
//     if (!["SHA256", "SHA512", "MD5"].includes(algorithm.toUpperCase())) {
//       throw new Error(`Unsupported algorithm: ${algorithm}`);
//     }
//
//     return {
//       _data: "",
//       update(data) {
//         this._data += data;
//         return this;
//       },
//       async digest(encoding = "hex") {
//         const hash = await digestStringAsync(algorithm, this._data, {
//           encoding: encoding.toUpperCase(),
//         });
//         return hash;
//       },
//     };
//   },
// };

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);

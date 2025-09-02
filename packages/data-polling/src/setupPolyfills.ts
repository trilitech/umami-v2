import { webcrypto } from "crypto";
import { TextDecoder, TextEncoder } from "util";

// Set up polyfills before any modules are loaded
Object.defineProperties(global, {
  crypto: { value: webcrypto, writable: true },
  TextDecoder: { value: TextDecoder, writable: true },
  TextEncoder: { value: TextEncoder, writable: true },
});

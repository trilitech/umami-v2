import { webcrypto } from "crypto";
import { TextDecoder, TextEncoder } from "util";

import { mockLocalStorage } from "@umami/test-utils";

// Set up polyfills before any modules are loaded
Object.defineProperties(global, {
  crypto: { value: webcrypto, writable: true },
  TextDecoder: { value: TextDecoder, writable: true },
  TextEncoder: { value: TextEncoder, writable: true },
});

// Set up localStorage mock before any modules are loaded
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage(),
  writable: true,
});

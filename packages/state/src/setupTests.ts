import { webcrypto } from "crypto";
import { TextDecoder, TextEncoder } from "util";

// Global setup that needs to run before any modules are imported
Object.defineProperties(global, {
  crypto: { value: webcrypto, writable: true },
  TextDecoder: { value: TextDecoder, writable: true },
  TextEncoder: { value: TextEncoder, writable: true },
  fetch: { value: jest.fn(), writable: true },
});

// Global setup that runs before any imports
import { webcrypto } from "crypto";
import { TextDecoder, TextEncoder } from "util";

// Set up TextEncoder/TextDecoder globally before any modules are imported
Object.defineProperties(global, {
  crypto: { value: webcrypto, writable: true },
  TextDecoder: { value: TextDecoder, writable: true },
  TextEncoder: { value: TextEncoder, writable: true },
});

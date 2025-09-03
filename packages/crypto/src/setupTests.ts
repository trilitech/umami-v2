import { webcrypto } from "crypto";
import { TextDecoder, TextEncoder } from "util";

import { mockLocalStorage } from "@umami/test-utils";

// Polyfill TextEncoder and TextDecoder for Node.js test environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

Object.defineProperties(global, {
  crypto: { value: webcrypto, writable: true },
});

beforeEach(() => mockLocalStorage());

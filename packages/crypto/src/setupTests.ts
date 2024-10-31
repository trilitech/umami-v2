import { webcrypto } from "crypto";

import { mockLocalStorage } from "@umami/test-utils";

Object.defineProperties(global, {
  crypto: { value: webcrypto, writable: true },
});

beforeEach(() =>
  Object.defineProperty(window, "localStorage", {
    value: mockLocalStorage(),
  })
);
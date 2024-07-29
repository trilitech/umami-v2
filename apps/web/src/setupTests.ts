import "@testing-library/jest-dom";
import { webcrypto } from "crypto";
import { TextDecoder, TextEncoder } from "util";

import { mockToast } from "@umami/state";
import { setupJestCanvasMock } from "jest-canvas-mock";

jest.mock("./env", () => ({ IS_DEV: false }));

jest.doMock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useToast: () => mockToast,
}));

Object.defineProperties(global, {
  crypto: { value: webcrypto, writable: true },
  TextDecoder: { value: TextDecoder, writable: true },
  TextEncoder: { value: TextEncoder, writable: true },
});

jest.mock("./utils/persistor", () => ({
  pause: jest.fn(),
}));

beforeEach(() => setupJestCanvasMock());

// TODO: fix act warnings
const originalError = console.error;
jest.spyOn(console, "error").mockImplementation((...args) => {
  // suppress act warnings temporarily
  if (args[0].includes("Warning: An update to %s inside a test was not wrapped in act")) {
    return;
  }
  originalError(...args);
});

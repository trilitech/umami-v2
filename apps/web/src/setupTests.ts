import "@testing-library/jest-dom";
import { webcrypto } from "crypto";
import { TextDecoder, TextEncoder } from "util";

import { mockToast } from "@umami/state";
import { setupJestCanvasMock } from "jest-canvas-mock";

const intersectionObserverMock = () => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
});

const localStorageMock = () => {
  const store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
  };
};

jest.mock("./env", () => ({ IS_DEV: false }));

jest.doMock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useToast: () => mockToast,
  useColorMode: () => ({ colorMode: "light", toggleColorMode: jest.fn() }),
}));

Object.defineProperties(global, {
  crypto: { value: webcrypto, writable: true },
  TextDecoder: { value: TextDecoder, writable: true },
  TextEncoder: { value: TextEncoder, writable: true },
  IntersectionObserver: { value: intersectionObserverMock, writable: true, configurable: true },
});

jest.mock("./utils/persistor", () => ({
  pause: jest.fn(),
}));

beforeEach(() => {
  setupJestCanvasMock();

  Object.defineProperty(window, "localStorage", {
    value: localStorageMock(),
  });
});

// TODO: fix act warnings
const originalError = console.error;
jest.spyOn(console, "error").mockImplementation((...args) => {
  // suppress act warnings temporarily
  if (args[0].includes("Warning: An update to %s inside a test was not wrapped in act")) {
    return;
  }
  originalError(...args);
});

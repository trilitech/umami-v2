import "@testing-library/jest-dom";
import { webcrypto } from "crypto";
import { TextDecoder, TextEncoder } from "util";

import { mockToast } from "@umami/state";
import { mockLocalStorage } from "@umami/test-utils";
import { setupJestCanvasMock } from "jest-canvas-mock";

const mockIntersectionObserver = class MockIntersectionObserver {
  callback: jest.Mock;
  options: jest.Mock;
  observe: jest.Mock;
  unobserve: jest.Mock;
  disconnect: jest.Mock;

  constructor(callback: jest.Mock, options: jest.Mock) {
    this.callback = callback;
    this.options = options;
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
  }
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
  IntersectionObserver: { value: mockIntersectionObserver, writable: true, configurable: true },
  fetch: { value: jest.fn(), writable: true },
});

jest.mock("./utils/persistor", () => ({
  pause: jest.fn(),
}));

beforeEach(() => {
  setupJestCanvasMock();

  Object.defineProperty(window, "localStorage", {
    value: mockLocalStorage(),
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

jest.mock("@walletconnect/core", () => ({
  Core: jest.fn().mockImplementation(config => ({
    projectId: config.projectId,
  })),
}));
jest.mock("@reown/walletkit", () => ({
  WalletKit: jest.fn(),
}));
jest.mock("@walletconnect/utils", () => ({
  WalletConnect: jest.fn(),
}));

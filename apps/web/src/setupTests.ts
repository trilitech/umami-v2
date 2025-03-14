import "@testing-library/jest-dom";
import { webcrypto } from "crypto";
import { TextDecoder, TextEncoder } from "util";

import { mockToast } from "@umami/state";
import { mockLocalStorage, mockLocation, mockSessionStorage } from "@umami/test-utils";
import { setupJestCanvasMock } from "jest-canvas-mock";

(window as any).gtag = jest.fn();

const writeText = jest.fn();

Object.assign(navigator, {
  clipboard: {
    writeText,
  },
});

const XMLHttpRequestMock = jest.fn(() => ({
  open: jest.fn(),
  send: jest.fn(),
  setRequestHeader: jest.fn(),
  readyState: 4,
  status: 200,
  responseText: "",
  onload: jest.fn(),
  onerror: jest.fn(),
  ontimeout: jest.fn(),
  upload: {
    onprogress: jest.fn(),
  },
}));

Object.defineProperties(XMLHttpRequestMock, {
  UNSENT: { value: 0 },
  OPENED: { value: 1 },
  HEADERS_RECEIVED: { value: 2 },
  LOADING: { value: 3 },
  DONE: { value: 4 },
});

XMLHttpRequestMock.prototype = {
  open: jest.fn(),
  send: jest.fn(),
  setRequestHeader: jest.fn(),
};

global.XMLHttpRequest = XMLHttpRequestMock as unknown as typeof XMLHttpRequest;

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
  useBreakpointValue: jest.fn(),
  useToast: () => mockToast,
  useColorMode: () => ({ colorMode: "light", toggleColorMode: jest.fn() }),
}));

jest.mock("@umami/utils", () => ({
  ...jest.requireActual("@umami/utils"),
  useCustomToast: () => mockToast,
}));

jest.mock("./utils/persistor", () => ({
  pause: jest.fn(),
}));

beforeEach(() => {
  setupJestCanvasMock();

  mockLocalStorage();
  mockSessionStorage();

  mockLocation();


  Object.defineProperties(global, {
    crypto: { value: webcrypto, writable: true },
    TextDecoder: { value: TextDecoder, writable: true },
    TextEncoder: { value: TextEncoder, writable: true },
    IntersectionObserver: { value: mockIntersectionObserver, writable: true, configurable: true },
    fetch: { value: jest.fn(), writable: true },
  });
});

afterEach(() => {
  jest.clearAllMocks();
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

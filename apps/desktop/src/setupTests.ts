// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

import { webcrypto } from "crypto";
import { TextDecoder, TextEncoder } from "util";

import { mockToast } from "@umami/state";
import { setupJestCanvasMock } from "jest-canvas-mock";
import MockDate from "mockdate";

import {
  MockModal,
  MockModalCloseButton,
  MockModalContent,
  MockModalHeader,
  MockModalInnerComponent,
} from "./mocks/modal";

// TODO: enable it back when fixed Warning: The current testing environment is not configured to support act(...)
// failOnConsole();

MockDate.set("2023-03-27T14:15:09.760Z");

jest.mock("./env", () => ({ IS_DEV: false }));

beforeEach(() => {
  // Add missing browser APIs
  Object.defineProperties(global, {
    crypto: { value: webcrypto, writable: true },
    TextDecoder: { value: TextDecoder, writable: true },
    TextEncoder: { value: TextEncoder, writable: true },
    scrollTo: { value: jest.fn(), writable: true },

    // taken from https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
    matchMedia: {
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
      writable: true,
    },
  });

  // Hack for testing HashRouter: clears URL between tests.
  window.location.hash = "";

  setupJestCanvasMock();
});

jest.doMock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useToast: () => mockToast,
  Modal: MockModal,
  ModalContent: MockModalContent,
  ModalBody: MockModalInnerComponent,
  ModalHeader: MockModalHeader,
  ModalFooter: MockModalInnerComponent,
  ModalOverlay: MockModalInnerComponent,
  ModalCloseButton: MockModalCloseButton,
}));

// https://github.com/chakra-ui/chakra-ui/issues/2684
jest.mock("@popperjs/core", () => ({
  createPopper: () => ({
    state: null,
    forceUpdate: () => {},
    destroy: () => {},
    setOptions: () => {},
  }),
}));

jest.mock("redux-persist", () => ({
  ...jest.requireActual("redux-persist"),
  persistReducer: jest.fn().mockImplementation((_config, reducers) => reducers),
}));

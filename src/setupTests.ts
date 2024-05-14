// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

import { webcrypto } from "crypto";
import { TextDecoder, TextEncoder } from "util";

import { setupJestCanvasMock } from "jest-canvas-mock";
import failOnConsole from "jest-fail-on-console";
import MockDate from "mockdate";
import React from "react";

import { mockUseToast } from "./mocks/toast";
import { accountsSlice } from "./utils/redux/slices/accountsSlice/accountsSlice";
import { announcementSlice } from "./utils/redux/slices/announcementSlice";
import { batchesActions } from "./utils/redux/slices/batches";
import { beaconActions } from "./utils/redux/slices/beaconSlice";
import { contactsActions } from "./utils/redux/slices/contactsSlice";
import { errorsSlice } from "./utils/redux/slices/errorsSlice";
import { multisigsSlice } from "./utils/redux/slices/multisigsSlice";
import { networksActions } from "./utils/redux/slices/networks";
import { tokensActions } from "./utils/redux/slices/tokensSlice";
import { store } from "./utils/redux/store";

failOnConsole();

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

  // set clean state before each test
  store.dispatch(accountsSlice.actions.reset());
  store.dispatch(announcementSlice.actions.reset());
  store.dispatch(batchesActions.reset());
  store.dispatch(beaconActions.reset());
  store.dispatch(contactsActions.reset());
  store.dispatch(errorsSlice.actions.reset());
  store.dispatch(multisigsSlice.actions.reset());
  store.dispatch(networksActions.reset());
  store.dispatch(tokensActions.reset());

  setupJestCanvasMock();
});

const MockModal = ({ children, isOpen }: any) =>
  React.createElement("div", { "data-testid": "mock-modal" }, isOpen ? children : null);

const MockModalHeader = ({ children }: any) =>
  React.createElement("header", { id: "modal-header" }, children);

const MockModalContent = ({ children }: any) =>
  React.createElement(
    "section",
    { role: "dialog", "aria-labelledby": "modal-header", "aria-modal": true },
    children
  );

const MockModalInnerComponent = ({ children }: any) => React.createElement("div", {}, children);

const MockModalCloseButton = ({ children }: any) =>
  React.createElement("button", { "aria-label": "Close" }, children);

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  // Mock toast since it has an erratic behavior in RTL
  // https://github.com/chakra-ui/chakra-ui/issues/2969
  useToast: mockUseToast,
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

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { webcrypto } from "crypto";
import { TextDecoder, TextEncoder } from "util";

import { act } from "@testing-library/react";
import failOnConsole from "jest-fail-on-console";
import MockDate from "mockdate";
import React from "react";

import { mockUseToast } from "./mocks/toast";
import { accountsSlice } from "./utils/redux/slices/accountsSlice";
import { batchesActions } from "./utils/redux/slices/batches";
import { contactsActions } from "./utils/redux/slices/contactsSlice";
import { errorsSlice } from "./utils/redux/slices/errorsSlice";
import { multisigsSlice } from "./utils/redux/slices/multisigsSlice";
import { networksActions } from "./utils/redux/slices/networks";
import { tokensActions } from "./utils/redux/slices/tokensSlice";
import { store } from "./utils/redux/store";

failOnConsole();

MockDate.set("2023-03-27T14:15:09.760Z");

jest.mock("./utils/tezos");

jest.mock("./utils/redux/extraArgument");
// https://github.com/chakra-ui/chakra-ui/issues/2684
jest.mock("@popperjs/core", () => {
  return {
    createPopper: () => {
      return {
        state: null,
        forceUpdate: () => {},
        destroy: () => {},
        setOptions: () => {},
      };
    },
  };
});

jest.mock("react-identicons", () => {
  return { default: (props: any) => props.children };
});

// Add missing browser APIs
Object.assign(window, {
  TextDecoder,
  TextEncoder,
  crypto: webcrypto,
  scrollTo: jest.fn(),
});

beforeEach(() => {
  // taken from https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
  Object.defineProperty(window, "matchMedia", {
    writable: true,
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
  });
});

const MockModal = ({ children, isOpen }: any) => {
  return React.createElement("div", { "data-testid": "mock-modal" }, isOpen ? children : null);
};
const MockModalHeader = ({ children }: any) => {
  return React.createElement("header", { id: "modal-header" }, children);
};
const MockModalContent = ({ children }: any) => {
  return React.createElement(
    "section",
    { role: "dialog", "aria-labelledby": "modal-header", "aria-modal": true },
    children
  );
};

const MockModalInnerComponent = ({ children }: any) => React.createElement("div", {}, children);

const MockModalCloseButton = ({ children }: any) =>
  React.createElement("button", { "aria-label": "Close" }, children);

jest.mock("@chakra-ui/react", () => {
  return {
    ...jest.requireActual("@chakra-ui/react"),
    // Mock taost since it has an erratic behavior in RTL
    // https://github.com/chakra-ui/chakra-ui/issues/2969
    useToast: mockUseToast,
    Modal: MockModal,
    ModalContent: MockModalContent,
    ModalBody: MockModalInnerComponent,
    ModalHeader: MockModalHeader,
    ModalFooter: MockModalInnerComponent,
    ModalOverlay: MockModalInnerComponent,
    ModalCloseButton: MockModalCloseButton,
  };
});

afterEach(() => {
  act(() => {
    store.dispatch(accountsSlice.actions.reset());
    store.dispatch(multisigsSlice.actions.reset());
    store.dispatch(contactsActions.reset());
    store.dispatch(tokensActions.reset());
    store.dispatch(errorsSlice.actions.reset());
    store.dispatch(networksActions.reset());
    store.dispatch(batchesActions.reset());
  });
});

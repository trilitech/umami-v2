import { webcrypto } from "crypto";
import { TextDecoder, TextEncoder } from "util";

import { mockLocalStorage } from "@umami/test-utils";

import { mockToast } from "./testUtils";

Object.defineProperties(global, {
  crypto: { value: webcrypto, writable: true },
  TextDecoder: { value: TextDecoder, writable: true },
  TextEncoder: { value: TextEncoder, writable: true },
});

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useToast: () => mockToast,
}));

jest.mock("./beacon/WalletClient", () => ({
  WalletClient: {
    getPeers: jest.fn(),
    removePeer: jest.fn(),
  },
}));

beforeEach(() =>
  Object.defineProperty(window, "localStorage", {
    value: mockLocalStorage(),
  })
);

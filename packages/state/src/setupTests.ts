import { webcrypto } from "crypto";
import { TextDecoder, TextEncoder } from "util";

import { mockLocalStorage } from "@umami/test-utils";

import { mockToast } from "./testUtils";

Object.defineProperties(global, {
  crypto: { value: webcrypto, writable: true },
  TextDecoder: { value: TextDecoder, writable: true },
  TextEncoder: { value: TextEncoder, writable: true },
  fetch: { value: jest.fn(), writable: true },
});

jest.mock("@umami/utils", () => ({
  ...jest.requireActual("@umami/utils"),
  useCustomToast: () => mockToast,
}));

jest.mock("./beacon/WalletClient", () => ({
  WalletClient: {
    getPeers: jest.fn(),
    removePeer: jest.fn(),
  },
}));

jest.mock("@walletconnect/core", () => ({
  Core: jest.fn().mockImplementation(config => ({
    projectId: config.projectId,
  })),
}));
jest.mock("@reown/walletkit", () => {
  const mockOn = jest.fn();
  const mockOff = jest.fn();

  const mockWalletKit = {
    init: jest.fn().mockResolvedValue({
      core: {},
      metadata: {
        name: "Umami Wallet",
        description: "Umami Wallet with WalletConnect",
        url: "https://umamiwallet.com",
        icons: ["https://umamiwallet.com/assets/favicon-32-45gq0g6M.png"],
      },
      on: mockOn,
      off: mockOff,
    }),
  };
  return {
    WalletKit: mockWalletKit,
  };
});

beforeEach(() =>
  Object.defineProperty(window, "localStorage", {
    value: mockLocalStorage(),
  })
);

import "@testing-library/jest-dom";

import { TextDecoder, TextEncoder } from "node:util";

const writeText = jest.fn();

Object.assign(navigator, {
  clipboard: {
    writeText,
  },
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

if (
  typeof globalThis.TextEncoder === "undefined" ||
  typeof globalThis.TextDecoder === "undefined"
) {
  globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
  globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;
}

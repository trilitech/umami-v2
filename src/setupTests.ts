// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import MockDate from "mockdate";
import { webcrypto } from "crypto";

import { TextDecoder, TextEncoder } from "util";

MockDate.set("2023-03-27T14:15:09.760Z");

jest.mock("react-identicons", () => {
  return { default: (props: any) => props.children };
});

// Setup web crypto environment
beforeAll(() => {
  window.TextEncoder = TextEncoder;
  (window as any).TextDecoder = TextDecoder;
  (window as any).crypto = webcrypto;
});

// If you wanted to restore the mutations done above
// Do as follows:

// afterAll(() => {
//   delete (window as any)["crypto"];
//   delete (window as any)["TextEncoder"];
//   delete (window as any)["TextDecoder"];
// });

jest.mock("@airgap/tezos/node_modules/@airgap/sapling-wasm", () => {
  return {};
});

// Fixes: Cannot find module '@tzkt/oazapfts/runtime' from 'node_modules/@tzkt/sdk-api/build/main/index.js'
jest.mock("@tzkt/sdk-api", () => {
  return {};
});

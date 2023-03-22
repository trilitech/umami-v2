// Can't load this in jest
jest.mock("@airgap/sapling-wasm", () => {
  return {};
});

// Fixes: Cannot find module '@tzkt/oazapfts/runtime' from 'node_modules/@tzkt/sdk-api/build/main/index.js'
jest.mock("@tzkt/sdk-api", () => {
  return {};
});

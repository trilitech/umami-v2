// Can't load this in jest
jest.mock("@airgap/sapling-wasm", () => {
  return {};
});

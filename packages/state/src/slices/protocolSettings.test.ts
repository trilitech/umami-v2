import { store } from "../store";

describe("protocolSettingsSlice", () => {
  test("initial state", () => {
    expect(store.getState().protocolSettings).toEqual({
      mainnet: { maxSlashingPeriod: 2, consensusRightsDelay: 2 },
      ghostnet: { maxSlashingPeriod: 2, consensusRightsDelay: 2 },
    });
  });
});

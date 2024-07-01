import { GHOSTNET, MAINNET, isDefault } from "./Network";

describe("Network", () => {
  describe("isDefault", () => {
    it("returns true for MAINNET and GHOSTNET", () => {
      expect(isDefault(MAINNET)).toBe(true);
      expect(isDefault(GHOSTNET)).toBe(true);
    });

    it("returns false for custom networks", () => {
      expect(isDefault({ ...MAINNET, name: "custom" })).toEqual(false);
    });
  });
});

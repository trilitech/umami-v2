import { GHOSTNET, MAINNET, SHADOWNET, isDefault } from "./Network";

describe("Network", () => {
  describe("isDefault", () => {
    it("returns true for MAINNET, GHOSTNET and SHADOWNET", () => {
      expect(isDefault(MAINNET)).toBe(true);
      expect(isDefault(GHOSTNET)).toBe(true);
      expect(isDefault(SHADOWNET)).toBe(true);
    });

    it("returns false for custom networks", () => {
      expect(isDefault({ ...MAINNET, name: "custom" })).toEqual(false);
    });
  });
});

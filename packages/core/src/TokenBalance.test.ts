import { fa1Token } from "@umami/test-utils";

import { fromRawTokenBalance } from "./TokenBalance";

describe("TokenBalance", () => {
  describe("fromRawTokenBalance", () => {
    it("parses token & its balance", () => {
      expect(fromRawTokenBalance(fa1Token)).toEqual({
        type: "fa1.2",
        contract: "KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe",
        tokenId: "0",
        balance: "443870",
        lastLevel: 1365863,
      });
    });

    it("returns null if balance is absent", () => {
      expect(fromRawTokenBalance({ ...fa1Token, balance: null })).toEqual(null);
    });

    it("returns null if token is invalid", () => {
      expect(fromRawTokenBalance({ token: {}, balance: "1" } as any)).toEqual(null);
    });
  });
});

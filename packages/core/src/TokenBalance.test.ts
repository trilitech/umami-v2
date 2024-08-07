import { fa1Token } from "@umami/test-utils";

import { type NFTBalanceWithOwner, fromRawTokenBalance, sortedByLastUpdate } from "./TokenBalance";

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

  describe("sortedByLastUpdate", () => {
    it("sorts by lastLevel desc, id asc, owner asc", () => {
      const nfts = [
        { id: 5, lastLevel: 3, owner: "tz1" },
        { id: 38, lastLevel: 1, owner: "tz3" },
        { id: 22, lastLevel: 2, owner: "tz2" },
        { id: 23, lastLevel: 2, owner: "tz2" },
        { id: 23, lastLevel: 2, owner: "tz1" },
        { id: 14, lastLevel: 4, owner: "tz1" },
      ] as NFTBalanceWithOwner[];

      expect(sortedByLastUpdate(nfts)).toEqual([
        { id: 14, lastLevel: 4, owner: "tz1" },
        { id: 5, lastLevel: 3, owner: "tz1" },
        { id: 22, lastLevel: 2, owner: "tz2" },
        { id: 23, lastLevel: 2, owner: "tz1" },
        { id: 23, lastLevel: 2, owner: "tz2" },
        { id: 38, lastLevel: 1, owner: "tz3" },
      ]);
    });

    it("can sort without an owner", () => {
      const nfts = [
        { id: 5, lastLevel: 3 },
        { id: 38, lastLevel: 1 },
        { id: 22, lastLevel: 2 },
        { id: 23, lastLevel: 2 },
        { id: 14, lastLevel: 4 },
      ] as any;

      expect(sortedByLastUpdate(nfts)).toEqual([
        { id: 14, lastLevel: 4 },
        { id: 5, lastLevel: 3 },
        { id: 22, lastLevel: 2 },
        { id: 23, lastLevel: 2 },
        { id: 38, lastLevel: 1 },
      ]);
    });
  });
});

import { getIPFSurl, sortedByLastUpdate } from "./utils";

describe("utils", () => {
  describe("sortedByLastUpdate", () => {
    it("sorts by lastLevel desc, id asc, owner asc", () => {
      const nfts = [
        { id: 5, lastLevel: 3, owner: "tz1", token: { tokenId: 1 } },
        { id: 38, lastLevel: 1, owner: "tz3", token: { tokenId: 1 } },
        { id: 22, lastLevel: 2, owner: "tz2", token: { tokenId: 1 } },
        { id: 23, lastLevel: 2, owner: "tz2", token: { tokenId: 1 } },
        { id: 23, lastLevel: 2, owner: "tz1", token: { tokenId: 1 } },
        { id: 14, lastLevel: 4, owner: "tz1", token: { tokenId: 1 } },
      ] as any;

      const sorted = sortedByLastUpdate(nfts);
      expect(sorted).toEqual([
        { id: 14, lastLevel: 4, owner: "tz1", token: { tokenId: 1 } },
        { id: 5, lastLevel: 3, owner: "tz1", token: { tokenId: 1 } },
        { id: 22, lastLevel: 2, owner: "tz2", token: { tokenId: 1 } },
        { id: 23, lastLevel: 2, owner: "tz1", token: { tokenId: 1 } },
        { id: 23, lastLevel: 2, owner: "tz2", token: { tokenId: 1 } },
        { id: 38, lastLevel: 1, owner: "tz3", token: { tokenId: 1 } },
      ]);
    });

    it("can sort without an owner", () => {
      const nfts = [
        { id: 5, lastLevel: 3, token: { tokenId: 1 } },
        { id: 38, lastLevel: 1, token: { tokenId: 1 } },
        { id: 22, lastLevel: 2, token: { tokenId: 1 } },
        { id: 23, lastLevel: 2, token: { tokenId: 1 } },
        { id: 14, lastLevel: 4, token: { tokenId: 1 } },
      ] as any;

      const sorted = sortedByLastUpdate(nfts);
      expect(sorted).toEqual([
        { id: 14, lastLevel: 4, token: { tokenId: 1 } },
        { id: 5, lastLevel: 3, token: { tokenId: 1 } },
        { id: 22, lastLevel: 2, token: { tokenId: 1 } },
        { id: 23, lastLevel: 2, token: { tokenId: 1 } },
        { id: 38, lastLevel: 1, token: { tokenId: 1 } },
      ]);
    });
  });

  describe("getIPFSurl", () => {
    it("returns nothing if no URI is provided", () => {
      expect(getIPFSurl(undefined)).toBe(undefined);
    });

    it("converts an IPFS URI to an HTTP one", () => {
      expect(getIPFSurl("ipfs://some/image/uri")).toBe("https://ipfs.io/ipfs/some/image/uri");
    });
  });
});

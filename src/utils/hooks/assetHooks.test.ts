import { ghostTezzard, ghostFA12, ghostFA2 } from "../../mocks/tokens";
import { Asset } from "../../types/Asset";
import { searchAsset } from "./assetsHooks";

describe("searchAsset", () => {
  const mockAssets: Asset[] = [ghostTezzard, ghostFA12, ghostFA2];

  it("should find FA1 assets from the provided asset list", () => {
    expect(searchAsset(ghostTezzard.contract, ghostTezzard.tokenId, mockAssets)).toEqual(
      ghostTezzard
    );
  });

  it("should find FA2 assets from the provided asset list", () => {
    expect(searchAsset(ghostTezzard.contract, ghostTezzard.tokenId, mockAssets)).toEqual(
      ghostTezzard
    );
    expect(searchAsset(ghostFA2.contract, ghostFA2.tokenId, mockAssets)).toEqual(ghostFA2);
  });

  it("should return undefined if no asset is found from the provided asset list", () => {
    expect(searchAsset(ghostFA2.contract, undefined, mockAssets)).toEqual(undefined);
    expect(searchAsset("foo", ghostFA2.tokenId, mockAssets)).toEqual(undefined);
    expect(searchAsset("foo", "bar", mockAssets)).toEqual(undefined);
    expect(searchAsset("foo", undefined, mockAssets)).toEqual(undefined);
  });
});

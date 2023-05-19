import { tzBtsc, hedgeHoge } from "../mocks/fa12Tokens";
import { uUSD } from "../mocks/fa2Tokens";
import { fa1Token, fa2Token, nft } from "../mocks/tzktResponse";
import { Asset, FA12Token, FA2Token, NFT } from "../types/Asset";
import type { TokenMetadata } from "./Token";

describe("Asset.from", () => {
  test("case fa1.2 valid", () => {
    const result = Asset.from(fa1Token);
    const expected = new FA12Token(
      "KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe",
      "443870"
    );
    expect(result).toEqual(expected);
  });

  test("case fa1.2 invalid (missing balance)", () => {
    const result = Asset.from({ ...fa1Token, balance: null });
    expect(result).toEqual(null);
  });

  test("case valid fa2 token", () => {
    const result = Asset.from(fa2Token);
    expect(result).toEqual(
      new FA2Token("KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ", "1", "409412200", {
        decimals: "5",
        name: "Klondike3",
        symbol: "KL3",
      })
    );
  });

  test("case invalid fa2 token (missing tokenId)", () => {
    const result = Asset.from({ ...fa2Token, token: { tokenId: undefined } });

    expect(result).toEqual(null);
  });

  test("case valid nft", () => {
    const result = Asset.from(nft);
    const expected = new NFT(
      "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
      "3",
      "0",
      "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      nft.token?.metadata as TokenMetadata
    );
    expect(result).toEqual(expected);
  });

  test("case invalid nft (missing contract address)", () => {
    const result = Asset.from({
      ...nft,
      token: { contract: { address: null } },
    });

    expect(result).toEqual(null);
  });

  test("case fa1 token with name symbol and decimals (tzBTC)", () => {
    const result = Asset.from(tzBtsc);

    const expected = new FA12Token(
      "KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn",
      "2205",
      {
        decimals: "8",
        name: "tzBTC",
        symbol: "tzBTC",
      }
    );
    expect(result).toEqual(expected);
  });

  test("case fa1 token with name symbol decimals and icon (hedgeHoge)", () => {
    const result = Asset.from(hedgeHoge);

    const expected = new FA12Token(
      "KT1G1cCRNBgQ48mVDjopHjEmTN5Sbtar8nn9",
      "10000000000",
      {
        decimals: "6",
        name: "Hedgehoge",
        symbol: "HEH",
        icon: "ipfs://QmXL3FZ5kcwXC8mdwkS1iCHS2qVoyg69ugBhU2ap8z1zcs",
      }
    );
    expect(result).toEqual(expected);
    expect(result?.iconUri).toEqual(expected.iconUri);
  });

  test("case fa2 token with thumbnailUri (uUSD)", () => {
    const result = Asset.from(uUSD);
    const expected = new FA2Token(
      "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
      "0",
      "19218750000",
      {
        decimals: "12",
        name: "youves uUSD",
        symbol: "uUSD",
        shouldPreferSymbol: true,
        thumbnailUri: "ipfs://QmbvhanNCxydZEbGu1RdqkG3LcpNGv7XYsCHgzWBXnmxRd",
      }
    );

    expect(result).toEqual(expected);
    expect(result?.iconUri()).toEqual(
      "https://ipfs.io/ipfs/QmbvhanNCxydZEbGu1RdqkG3LcpNGv7XYsCHgzWBXnmxRd"
    );
  });
});

describe("FA12Token", () => {
  describe("name", () => {
    test("when metadata.name exists", () => {
      const token = new FA12Token("KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo", "1", {
        name: "some token name",
      });
      expect(token.name()).toEqual("some token name");
    });
    test("when metadata.name is empty we use the default name", () => {
      const token = new FA12Token("KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo", "1");
      expect(token.name()).toEqual("FA1.2 token");
    });
  });

  describe("symbol", () => {
    test("when metadata.symbol exists", () => {
      const token = new FA12Token("KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo", "1", {
        symbol: "some token symbol",
      });
      expect(token.symbol()).toEqual("some token symbol");
    });
    test("when metadata.symbol is empty we use the default symbol", () => {
      const token = new FA12Token("KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo", "1");
      expect(token.symbol()).toEqual("FA1.2");
    });
  });

  describe("iconUri", () => {
    test("when metadata.icon is not set it returns undefined", () => {
      const token = new FA12Token("KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo", "1");
      expect(token.iconUri()).toBeUndefined();
    });

    test("when metadata.icon is set it returns modified ipfs link", () => {
      const token = new FA12Token("KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo", "1", {
        icon: "ipfs://QmbvhanNCxydZEbGu1RdqkG3LcpNGv7XYsCHgzWBXnmxRd",
      });
      expect(token.iconUri()).toEqual(
        "https://ipfs.io/ipfs/QmbvhanNCxydZEbGu1RdqkG3LcpNGv7XYsCHgzWBXnmxRd"
      );
    });
  });
});

describe("FA2Token", () => {
  describe("name", () => {
    test("when metadata.name exists", () => {
      const token = new FA2Token(
        "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
        "1",
        "1",
        {
          name: "some token name",
        }
      );
      expect(token.name()).toEqual("some token name");
    });
    test("when metadata.name is empty we use the default name", () => {
      const token = new FA2Token(
        "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
        "1",
        "1",
        {}
      );
      expect(token.name()).toEqual("FA2 token");
    });
  });

  describe("symbol", () => {
    test("when metadata.symbol exists", () => {
      const token = new FA2Token(
        "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
        "1",
        "1",
        {
          symbol: "some token symbol",
        }
      );
      expect(token.symbol()).toEqual("some token symbol");
    });
    test("when metadata.symbol is empty we use the default symbol", () => {
      const token = new FA2Token(
        "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
        "1",
        "1",
        {}
      );
      expect(token.symbol()).toEqual("FA2");
    });
  });

  describe("iconUri", () => {
    test("when metadata.thumbnailUri is not set it returns undefined", () => {
      const token = new FA2Token(
        "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
        "1",
        "2",
        {}
      );
      expect(token.iconUri()).toBeUndefined();
    });

    test("when metadata.thumbnailUri is set it returns modified ipfs link", () => {
      const token = new FA2Token(
        "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
        "1",
        "2",
        {
          thumbnailUri: "ipfs://QmbvhanNCxydZEbGu1RdqkG3LcpNGv7XYsCHgzWBXnmxRd",
        }
      );
      expect(token.iconUri()).toEqual(
        "https://ipfs.io/ipfs/QmbvhanNCxydZEbGu1RdqkG3LcpNGv7XYsCHgzWBXnmxRd"
      );
    });
  });
});

describe("NFT", () => {
  describe("name", () => {
    test("when metadata.name exists", () => {
      const token = new NFT(
        "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
        "1",
        "1",
        "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        {
          name: "some token name",
        }
      );
      expect(token.name()).toEqual("some token name");
    });
    test("when metadata.name is empty we use the default name", () => {
      const token = new NFT(
        "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
        "1",
        "1",
        "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        {}
      );
      expect(() => token.name()).toThrowError();
    });
  });

  describe("symbol", () => {
    test("when metadata.symbol exists", () => {
      const token = new NFT(
        "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
        "1",
        "1",
        "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        {
          symbol: "some token symbol",
        }
      );
      expect(token.symbol()).toEqual("some token symbol");
    });
    test("when metadata.symbol is empty we use the default symbol", () => {
      const token = new NFT(
        "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
        "1",
        "1",
        "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        {}
      );
      expect(() => token.name()).toThrowError();
    });
  });

  describe("iconUri", () => {
    test("it always returns undefined as it's not used for NFT", () => {
      const token = new NFT(
        "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
        "1",
        "1",
        "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        {}
      );
      expect(token.iconUri()).toBeUndefined();
    });
  });
});

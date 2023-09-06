import { tzBtsc, hedgehoge } from "../mocks/fa12Tokens";
import { uUSD } from "../mocks/fa2Tokens";
import { mockNFT, mockImplicitAddress } from "../mocks/factories";
import { fa1Token, fa2Token, nft } from "../mocks/tzktResponse";
import {
  FA12Token,
  FA2Token,
  artifactUri,
  formatTokenAmount,
  fromRaw,
  httpIconUri,
  metadataUri,
  mimeType,
  royalties,
  thumbnailUri,
  tokenDecimals,
  tokenNameSafe,
  tokenSymbolSafe,
} from "./Token";
import type { Metadata } from "./Token";

beforeEach(() => {
  jest.spyOn(console, "warn").mockImplementation();
});

describe("fromRaw", () => {
  test("fa1.2", () => {
    const result = fromRaw(fa1Token.token);
    const expected = {
      type: "fa1.2",
      contract: "KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe",
      tokenId: "0",
    };
    expect(result).toEqual(expected);
  });

  describe("fa2", () => {
    test("valid fa2 token", () => {
      const result = fromRaw(fa2Token.token);
      expect(result).toEqual({
        type: "fa2",
        contract: "KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ",
        tokenId: "1",
        metadata: {
          decimals: "5",
          name: "Klondike3",
          symbol: "KL3",
        },
      });
    });

    test("invalid fa2 token (missing tokenId)", () => {
      const { token } = fa2Token;
      delete token.tokenId;
      const result = fromRaw(token);
      expect(result).toEqual(null);
    });
  });

  describe("NFT", () => {
    it("returns FA2 token if decimals field is present", () => {
      const result = fromRaw({ ...nft.token, metadata: { decimals: "5" } });
      expect(result).toEqual({
        type: "fa2",
        contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        tokenId: "3",
        metadata: { decimals: "5" },
      });
    });

    it("parses valid NFT", () => {
      const expected = {
        type: "nft",
        contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        tokenId: "3",
        displayUri: "ipfs://zdj7Wk92xWxpzGqT6sE4cx7umUyWaX2Ck8MrSEmPAR31sNWGz",
        id: 10899466223617,
        metadata: nft.token.metadata as Metadata,
        totalSupply: "1",
      };

      const { token } = nft;
      const metadata = token.metadata as Metadata;
      metadata.decimals = "0";
      expect(fromRaw(token)).toEqual(expected);
      metadata.decimals = undefined;
      expect(fromRaw(token)).toEqual(expected);
      delete metadata.decimals;
      expect(fromRaw(token)).toEqual(expected);
    });
  });

  test("fa1 token with name symbol and decimals (tzBTC)", () => {
    const result = fromRaw(tzBtsc(mockImplicitAddress(0)).token);

    const expected = {
      type: "fa1.2",
      contract: "KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn",
      tokenId: "0",
      metadata: {
        decimals: "8",
        name: "tzBTC",
        symbol: "tzBTC",
      },
    };
    expect(result).toEqual(expected);
  });

  test("fa1 token with name symbol decimals and icon (Hedgehoge)", () => {
    const result = fromRaw(hedgehoge(mockImplicitAddress(0)).token);

    const expected = {
      type: "fa1.2",
      contract: "KT1G1cCRNBgQ48mVDjopHjEmTN5Sbtar8nn9",
      tokenId: "0",
      metadata: {
        decimals: "6",
        name: "Hedgehoge",
        symbol: "HEH",
        icon: "ipfs://QmXL3FZ5kcwXC8mdwkS1iCHS2qVoyg69ugBhU2ap8z1zcs",
      },
    };
    expect(result).toEqual(expected);
  });

  test("fa2 token with thumbnailUri (uUSD)", () => {
    const result = fromRaw(uUSD(mockImplicitAddress(0)).token);
    const expected = {
      type: "fa2",
      contract: "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
      tokenId: "0",
      metadata: {
        decimals: "12",
        name: "youves uUSD",
        symbol: "uUSD",
        shouldPreferSymbol: true,
        thumbnailUri: "ipfs://QmbvhanNCxydZEbGu1RdqkG3LcpNGv7XYsCHgzWBXnmxRd",
      },
    };

    expect(result).toEqual(expected);
  });
});

describe("tokenNameSafe", () => {
  test("when metadata.name exists", () => {
    const fa1token: FA12Token = {
      type: "fa1.2",
      contract: "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
      tokenId: "0",
    };
    expect(tokenNameSafe(fa1token)).toEqual("FA1.2 token");
    const fa1tokenWithName = {
      ...fa1token,
      metadata: {
        name: "some token name",
      },
    };
    expect(tokenNameSafe(fa1tokenWithName)).toEqual("some token name");

    const fa2token: FA2Token = {
      type: "fa2",
      contract: "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
      tokenId: "123",
    };
    expect(tokenNameSafe(fa2token)).toEqual("FA2 token");
    const fa2tokenWithName = {
      ...fa2token,
      metadata: {
        name: "some token name",
      },
    };
    expect(tokenNameSafe(fa2tokenWithName)).toEqual("some token name");
  });

  test("get tokenName for NFT", () => {
    const nft = mockNFT(0);

    expect(tokenNameSafe(nft)).toEqual("Tezzardz #0");

    nft.metadata = {};
    expect(tokenNameSafe(nft)).toEqual("NFT");
  });
});

describe("tokenSymbolSafe", () => {
  test("when metadata.symbol exists", () => {
    const fa1token: FA12Token = {
      type: "fa1.2",
      contract: "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
      tokenId: "0",
    };
    expect(tokenSymbolSafe(fa1token)).toEqual("FA1.2");
    const fa1tokenWithSymbol = {
      ...fa1token,
      metadata: {
        symbol: "some token symbol",
      },
    };
    expect(tokenSymbolSafe(fa1tokenWithSymbol)).toEqual("some token symbol");

    const fa2token: FA2Token = {
      type: "fa2",
      contract: "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
      tokenId: "123",
    };
    expect(tokenSymbolSafe(fa2token)).toEqual("FA2");
    const fa2tokenWithSymbol = {
      ...fa2token,
      metadata: {
        symbol: "some token symbol",
      },
    };
    expect(tokenSymbolSafe(fa2tokenWithSymbol)).toEqual("some token symbol");
  });

  test("get token symbol for NFT", () => {
    const nft = mockNFT(0);
    expect(tokenSymbolSafe(nft)).toEqual("FKR0");

    nft.metadata = {};
    expect(tokenSymbolSafe(nft)).toEqual("NFT");
  });
});

describe("httpIconUri", () => {
  test("when metadata.symbol exists", () => {
    const fa1token: FA12Token = {
      type: "fa1.2",
      contract: "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
      tokenId: "0",
    };
    expect(httpIconUri(fa1token)).toEqual(undefined);
    const fa1tokenWithIcon = {
      ...fa1token,
      metadata: {
        icon: "ipfs://QmXL3FZ5kcwXC8mdwkS1iCHS2qVoyg69ugBhU2ap8z1zcs",
      },
    };
    expect(httpIconUri(fa1tokenWithIcon)).toEqual(
      "https://ipfs.io/ipfs/QmXL3FZ5kcwXC8mdwkS1iCHS2qVoyg69ugBhU2ap8z1zcs"
    );

    const fa2token: FA2Token = {
      type: "fa2",
      contract: "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
      tokenId: "123",
    };
    expect(httpIconUri(fa2token)).toEqual(undefined);
    const fa2tokenWithIcon = {
      ...fa2token,
      metadata: {
        thumbnailUri: "ipfs://QmXL3FZ5kcwXC8mdwkS1iCHS2qVoyg69ugBhU2ap8z1zcs",
      },
    };
    expect(httpIconUri(fa2tokenWithIcon)).toEqual(
      "https://ipfs.io/ipfs/QmXL3FZ5kcwXC8mdwkS1iCHS2qVoyg69ugBhU2ap8z1zcs"
    );
  });
});

describe("royalties", () => {
  it("returns an empty array when royalties are absent", () => {
    const nft = mockNFT(0);

    delete nft.metadata.royalties;
    expect(royalties(nft)).toEqual([]);
  });

  it("returns an empty array when shares are absent", () => {
    const nft = mockNFT(0);

    nft.metadata.royalties = {
      decimals: "1",
      shares: {},
    };
    expect(royalties(nft)).toEqual([]);
  });

  it("returns sorted shares as percentages", () => {
    const nft = mockNFT(0);

    nft.metadata.royalties = {
      decimals: "4",
      shares: {
        [mockImplicitAddress(0).pkh]: "5",
        [mockImplicitAddress(2).pkh]: "4000",
        [mockImplicitAddress(1).pkh]: "200",
      },
    };
    expect(royalties(nft)).toEqual([
      { address: mockImplicitAddress(2).pkh, share: 40.0 },
      { address: mockImplicitAddress(1).pkh, share: 2.0 },
      { address: mockImplicitAddress(0).pkh, share: 0.05 },
    ]);
  });
});

describe("mimeType", () => {
  it("returns undefined if formats are absent", () => {
    const nft = mockNFT(0);
    delete nft.metadata.formats;

    expect(mimeType(nft)).toBeUndefined();
  });

  it("returns the mime type of the artifact", () => {
    const nft = mockNFT(0);
    nft.metadata.artifactUri = nft.displayUri + "salt";
    nft.metadata.formats = [
      {
        uri: nft.metadata.artifactUri,
        mimeType: "image/png",
      },
      {
        uri: nft.displayUri,
        mimeType: "image/jpg",
      },
    ];

    expect(mimeType(nft)).toEqual("image/png");

    delete nft.metadata.artifactUri;
    expect(mimeType(nft)).toEqual("image/jpg");
  });
});

describe("artifactUri", () => {
  it("returns artifactUri", () => {
    const nft = mockNFT(0);
    nft.metadata.artifactUri = nft.displayUri + "salt";

    expect(artifactUri(nft)).toEqual(nft.metadata.artifactUri);
  });

  it("returns displayUri when artifactUri is absent", () => {
    const nft = mockNFT(0);
    delete nft.metadata.artifactUri;

    expect(artifactUri(nft)).toEqual(nft.displayUri);
  });
});

describe("thumbnailUri", () => {
  it("returns thumbnailUri", () => {
    const nft = mockNFT(0);
    nft.metadata.thumbnailUri = nft.displayUri + "salt";

    expect(thumbnailUri(nft)).toEqual(nft.metadata.thumbnailUri);
  });

  it("returns displayUri when thumbnailUri is absent", () => {
    const nft = mockNFT(0);
    delete nft.metadata.thumbnailUri;

    expect(thumbnailUri(nft)).toEqual(nft.displayUri);
  });
});

describe("metadataUri", () => {
  it("returns a tzkt link", () => {
    const nft = mockNFT(0);

    expect(metadataUri(nft, "mainnet")).toEqual(
      "https://mainnet.tzkt.io/KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG/tokens/mockId0/metadata"
    );
    expect(metadataUri(nft, "ghostnet")).toEqual(
      "https://ghostnet.tzkt.io/KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG/tokens/mockId0/metadata"
    );
  });
});

describe("tokenDecimal", () => {
  it("returns token decimal if it's present in the metadata", () => {
    const fa2token: FA2Token = {
      type: "fa2",
      contract: "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
      tokenId: "123",
      metadata: {
        decimals: "3",
      },
    };
    expect(tokenDecimals(fa2token)).toEqual("3");
  });

  it("returns 0 if metadata doesn't have the decimal field", () => {
    const fa2token: FA2Token = {
      type: "fa2",
      contract: "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
      tokenId: "123",
      metadata: {},
    };
    expect(tokenDecimals(fa2token)).toEqual("0");
  });
});

describe("formatTokenAmount", () => {
  it("returns raw amount if no decimals are present", () => {
    expect(formatTokenAmount("1000")).toEqual("1,000");
  });

  it("returns raw amount if decimals field is 0", () => {
    expect(formatTokenAmount("1000", "0")).toEqual("1,000");
  });

  it("returns pretty amount if decimals field is present", () => {
    expect(formatTokenAmount("1000", "5")).toEqual("0.01000");
  });

  it("shows all decimals even if amount is integer", () => {
    expect(formatTokenAmount("100000", "3")).toEqual("100.000");
  });
});

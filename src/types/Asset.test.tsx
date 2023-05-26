import { tzBtsc, hedgeHoge } from "../mocks/fa12Tokens";
import { uUSD } from "../mocks/fa2Tokens";
import { fa1Token, fa2Token, nft } from "../mocks/tzktResponse";
import {
  FA12Token,
  FA2Token,
  fromToken,
  httpIconUri,
  tokenName,
  tokenSymbol,
} from "../types/Asset";
import type { TokenMetadata } from "./Token";

describe("fromToken", () => {
  test("case fa1.2 valid", () => {
    const result = fromToken(fa1Token);
    const expected = {
      type: "fa1.2",
      contract: "KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe",
      balance: "443870",
    };
    expect(result).toEqual(expected);
  });

  test("case fa1.2 with no balance", () => {
    const result = fromToken({ ...fa1Token, balance: null });
    expect(result).toEqual(null);
  });

  test("case valid fa2 token", () => {
    const result = fromToken(fa2Token);
    expect(result).toEqual({
      type: "fa2",
      contract: "KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ",
      tokenId: "1",
      balance: "409412200",
      metadata: {
        decimals: "5",
        name: "Klondike3",
        symbol: "KL3",
      },
    });
  });

  test("case invalid fa2 token (missing tokenId)", () => {
    const result = fromToken({ ...fa2Token, token: { tokenId: undefined } });

    expect(result).toEqual(null);
  });

  test("case valid nft", () => {
    const result = fromToken(nft);
    const expected = {
      type: "nft",
      contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
      tokenId: "3",
      balance: "0",
      owner: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      metadata: nft.token?.metadata as TokenMetadata,
    };
    expect(result).toEqual(expected);
  });

  test("case invalid nft (missing contract address)", () => {
    const result = fromToken({
      ...nft,
      token: { contract: { address: null } },
    });

    expect(result).toEqual(null);
  });

  test("case fa1 token with name symbol and decimals (tzBTC)", () => {
    const result = fromToken(tzBtsc);

    const expected = {
      type: "fa1.2",
      contract: "KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn",
      balance: "2205",
      metadata: {
        decimals: "8",
        name: "tzBTC",
        symbol: "tzBTC",
      },
    };
    expect(result).toEqual(expected);
  });

  test("case fa1 token with name symbol decimals and icon (hedgeHoge)", () => {
    const result = fromToken(hedgeHoge);

    const expected = {
      type: "fa1.2",
      contract: "KT1G1cCRNBgQ48mVDjopHjEmTN5Sbtar8nn9",
      balance: "10000000000",
      metadata: {
        decimals: "6",
        name: "Hedgehoge",
        symbol: "HEH",
        icon: "ipfs://QmXL3FZ5kcwXC8mdwkS1iCHS2qVoyg69ugBhU2ap8z1zcs",
      },
    };
    expect(result).toEqual(expected);
  });

  test("case fa2 token with thumbnailUri (uUSD)", () => {
    const result = fromToken(uUSD);
    const expected = {
      type: "fa2",
      contract: "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
      tokenId: "0",
      balance: "19218750000",
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

describe("tokenName", () => {
  test("when metadata.name exists", () => {
    const fa1token: FA12Token = {
      type: "fa1.2",
      contract: "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
      balance: "1",
    };
    expect(tokenName(fa1token)).toEqual("FA1.2 token");
    const fa1tokenWithName = {
      ...fa1token,
      metadata: {
        name: "some token name",
      },
    };
    expect(tokenName(fa1tokenWithName)).toEqual("some token name");

    const fa2token: FA2Token = {
      type: "fa2",
      contract: "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
      balance: "1",
      tokenId: "123",
    };
    expect(tokenName(fa2token)).toEqual("FA2 token");
    const fa2tokenWithName = {
      ...fa2token,
      metadata: {
        name: "some token name",
      },
    };
    expect(tokenName(fa2tokenWithName)).toEqual("some token name");
  });
});

describe("tokenSymbol", () => {
  test("when metadata.symbol exists", () => {
    const fa1token: FA12Token = {
      type: "fa1.2",
      contract: "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
      balance: "1",
    };
    expect(tokenSymbol(fa1token)).toEqual("FA1.2");
    const fa1tokenWithSymbol = {
      ...fa1token,
      metadata: {
        symbol: "some token symbol",
      },
    };
    expect(tokenSymbol(fa1tokenWithSymbol)).toEqual("some token symbol");

    const fa2token: FA2Token = {
      type: "fa2",
      contract: "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
      balance: "1",
      tokenId: "123",
    };
    expect(tokenSymbol(fa2token)).toEqual("FA2");
    const fa2tokenWithSymbol = {
      ...fa2token,
      metadata: {
        symbol: "some token symbol",
      },
    };
    expect(tokenSymbol(fa2tokenWithSymbol)).toEqual("some token symbol");
  });
});

describe("httpIconUri", () => {
  test("when metadata.symbol exists", () => {
    const fa1token: FA12Token = {
      type: "fa1.2",
      contract: "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
      balance: "1",
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
      balance: "1",
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

import { tzBtsc, hedgeHoge } from "../../mocks/fa12Tokens";
import { uUSD } from "../../mocks/fa2Tokens";
import { fa1Token, fa2Token, nft, response } from "../../mocks/tzktResponse";
import { Asset, FA12Token, FA2Token, NFT } from "../../types/Asset";
import { classifyToken } from "./classify/classifyToken";

describe("ClassifyToken", () => {
  test("case fa1.2 valid", () => {
    const result = classifyToken(fa1Token);
    const expected = {
      balance: "443870",
      contract: "KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe",
      type: "fa1.2",
    };
    expect(result).toEqual(expected);
  });

  test("case fa1.2 invalid (missing balance)", () => {
    const result = classifyToken({ ...fa1Token, balance: null });
    expect(result).toEqual(null);
  });

  test("case valid fa2 token", () => {
    const result = classifyToken(fa2Token);
    expect(result).toEqual({
      balance: "409412200",
      contract: "KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ",
      tokenId: "1",
      metadata: { decimals: "5", name: "Klondike3", symbol: "KL3" },
      type: "fa2",
    });
  });

  test("case invalid fa2 token (missing token id)", () => {
    const result = classifyToken({ ...fa2Token, token: { id: undefined } });

    expect(result).toEqual(null);
  });

  test("case valid nft", () => {
    const result = classifyToken(nft);
    const expected: NFT = {
      owner: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      balance: "0",
      contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
      metadata: {
        displayUri:
          "https://ipfs.io/ipfs/zdj7Wk92xWxpzGqT6sE4cx7umUyWaX2Ck8MrSEmPAR31sNWGz",
        name: "Tezzardz #10",
        symbol: "FKR",
      },
      tokenId: "3",
      type: "nft",
    };
    expect(result).toEqual(expected);
  });

  test("case invalid nft (missing contract address)", () => {
    const result = classifyToken({
      ...nft,
      token: { contract: { address: null } },
    });

    expect(result).toEqual(null);
  });

  test("case fa1 token with name symbol and decimals (tzBTC)", () => {
    const result = classifyToken(tzBtsc);

    const expected: FA12Token = {
      balance: "2205",
      contract: "KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn",
      metadata: {
        decimals: "8",
        name: "tzBTC",
        symbol: "tzBTC",
      },
      type: "fa1.2",
    };
    expect(result).toEqual(expected);
  });

  test("case fa1 token with name symbol decimals and icon (hedgeHoge)", () => {
    const result = classifyToken(hedgeHoge);

    const expected: FA12Token = {
      balance: "10000000000",
      contract: "KT1G1cCRNBgQ48mVDjopHjEmTN5Sbtar8nn9",
      metadata: {
        decimals: "6",
        iconUrl:
          "https://ipfs.io/ipfs/QmXL3FZ5kcwXC8mdwkS1iCHS2qVoyg69ugBhU2ap8z1zcs",
        name: "Hedgehoge",
        symbol: "HEH",
      },
      type: "fa1.2",
    };

    expect(result).toEqual(expected);
  });

  test("case fa2 token with thumbnailUri (uUSD)", () => {
    const result = classifyToken(uUSD);
    const expected: FA2Token = {
      balance: "19218750000",
      contract: "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
      metadata: {
        decimals: "12",
        iconUrl:
          "https://ipfs.io/ipfs/QmbvhanNCxydZEbGu1RdqkG3LcpNGv7XYsCHgzWBXnmxRd",
        name: "youves uUSD",
        symbol: "uUSD",
      },
      tokenId: "0",
      type: "fa2",
    };

    expect(result).toEqual(expected);
  });

  test("valid tzkt response is parsed correctly", () => {
    const result = response.map(classifyToken);

    const expected: Asset[] = [
      {
        balance: "443870",
        contract: "KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe",
        type: "fa1.2",
      },
      {
        balance: "409412200",
        contract: "KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ",
        metadata: { decimals: "5", name: "Klondike3", symbol: "KL3" },
        tokenId: "1",
        type: "fa2",
      },
      {
        balance: "409412200",
        contract: "KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ",
        metadata: { decimals: "5", name: "Klondike3", symbol: "KL3" },
        tokenId: "1",
        type: "fa2",
      },
      {
        balance: "0",
        contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        metadata: {
          displayUri:
            "https://ipfs.io/ipfs/zdj7Wk92xWxpzGqT6sE4cx7umUyWaX2Ck8MrSEmPAR31sNWGz",
          name: "Tezzardz #10",
          symbol: "FKR",
        },
        owner: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        tokenId: "3",
        type: "nft",
      },
      {
        balance: "0",
        contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        metadata: {
          displayUri:
            "https://ipfs.io/ipfs/zdj7WaSoswEYY5hcis4i4ZLDXpsusu8FaJNf4LfYXDoviiRem",
          name: "Tezzardz #12",
          symbol: "FKR",
        },
        owner: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        tokenId: "4",
        type: "nft",
      },
      {
        balance: "0",
        contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        metadata: {
          displayUri:
            "https://ipfs.io/ipfs/zdj7WVwx4CX5fK5sHmXhjTm5wG9nCrzSBy83CGNXJ78fAJmba",
          name: "Tezzardz #20",
          symbol: "FKR",
        },
        owner: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        tokenId: "5",
        type: "nft",
      },
      {
        balance: "1",
        contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        metadata: {
          displayUri:
            "https://ipfs.io/ipfs/zdj7WWXMC8RpzC6RkR2DXtD2zcfLc2QWu6tu7f6vnkeeUvSoh",
          name: "Tezzardz #24",
          symbol: "FKR",
        },
        owner: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        tokenId: "6",
        type: "nft",
      },
      {
        balance: "0",
        contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        metadata: {
          displayUri:
            "https://ipfs.io/ipfs/zdj7Wc5siFbHn8EMrfGYiJrfe5fjqGrbJSvgjfr4oR4Rf9juV",
          name: "Tezzardz #28",
          symbol: "FKR",
        },
        owner: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        tokenId: "8",
        type: "nft",
      },

      {
        balance: "1",
        contract: "KT1P16Zn5i578uZhThHpcPtAhVuq7ZVsdnRn",
        metadata: {
          displayUri:
            "https://ipfs.io/ipfs/QmYd7UqZiHtpR3Qc7XnC7NWUt1qxCN9aiwEf9aGF9iybBB/display/5040.png",
          name: "Ronald Reagan (L)",
          symbol: "POTUS40-L",
        },
        owner: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        tokenId: "47",
        type: "nft",
      },
      {
        balance: "1",
        contract: "KT1RifpSrfjPnKJFp89igVUccvpnWtsre2wD",
        metadata: {
          displayUri:
            "https://ipfs.io/ipfs/QmXfLqzV28TfSpps1UFZo94NMsyYdnrxDNffdQsYPMr53t/image.png",
          name: "Tezos Meet & Greet Access Token",
          symbol: undefined,
        },
        owner: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        tokenId: "2",
        type: "nft",
      },
      {
        balance: "1",
        contract: "KT1K1LMeToxBX4tPPAZKMR8hCQgw3hpLaoti",
        metadata: {
          displayUri:
            "https://ipfs.io/ipfs/QmReoHBVcKAaHFi5n2ADiAJfaNiFhqxfJsRWGYe8ocozpT/image.png",
          name: "Tezos Meet & Greet Access Token",
          symbol: undefined,
        },
        owner: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        tokenId: "2",
        type: "nft",
      },
      {
        balance: "1",
        contract: "KT1K1LMeToxBX4tPPAZKMR8hCQgw3hpLaoti",
        metadata: {
          displayUri:
            "https://ipfs.io/ipfs/QmXfLqzV28TfSpps1UFZo94NMsyYdnrxDNffdQsYPMr53t/image.png",
          name: "Tezos Meet & Greet Access Token",
          symbol: undefined,
        },
        owner: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        tokenId: "4",
        type: "nft",
      },
      {
        balance: "1",
        contract: "KT18f225bFCeTt1AHLT5n7gTf3a8wv7iyEYC",
        metadata: {
          displayUri:
            "https://ipfs.io/ipfs/QmXfLqzV28TfSpps1UFZo94NMsyYdnrxDNffdQsYPMr53t/image.png",
          name: "Tezos Meet & Greet Access Token",
          symbol: undefined,
        },
        owner: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        tokenId: "2",
        type: "nft",
      },
      {
        balance: "1",
        contract: "KT1QhxBa4fep4vgyiB4MtjjqMdo21QHj2haG",
        metadata: {
          displayUri:
            "https://ipfs.io/ipfs/bafybeicet3ixylrqrn3mrxlbqiusznrsubr5qxyu7y3d64ewyvwohwa25a/image.png",
          name: "Paris Tezos Meetup Access Token",
          symbol: undefined,
        },
        owner: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        tokenId: "2",
        type: "nft",
      },
    ];
    expect(result.some((el) => el === null)).toEqual(false);
    expect(result).toEqual(expected);
  });
});

import { fa1Token, fa2Token, nft, response } from "../../mocks/tzktResponse";
import { NFT, classifyToken } from "./classify/classifyToken";

describe("ClassifyToken", () => {
  test("case fa1.2 valid", () => {
    const result = classifyToken(fa1Token);
    const expected = {
      balance: "443870",
      contract: "KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe",
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
      id: 10898231001089,
      metadata: { decimals: "5", name: "Klondike3", symbol: "KL3" },
    });
  });

  test("case invalid fa2 token (missing token id)", () => {
    const result = classifyToken({ ...fa2Token, token: { id: undefined } });

    expect(result).toEqual(null);
  });

  test("case valid nft", () => {
    const result = classifyToken(nft);
    const expected: NFT = {
      balance: "0",
      contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
      id: 10899466223617,
      metadata: {
        displayUri: "ipfs://zdj7Wk92xWxpzGqT6sE4cx7umUyWaX2Ck8MrSEmPAR31sNWGz",
        name: "Tezzardz #10",
        symbol: "FKR",
      },
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

  test("valid tzkt response is parsed correctly", () => {
    const result = response.map(classifyToken);

    const expected = [
      { balance: "443870", contract: "KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe" },
      {
        balance: "409412200",
        contract: "KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ",
        id: 10898231001089,
        metadata: { decimals: "5", name: "Klondike3", symbol: "KL3" },
      },
      {
        balance: "409412200",
        contract: "KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ",
        id: 10898231001089,
        metadata: { decimals: "5", name: "Klondike3", symbol: "KL3" },
      },
      {
        balance: "0",
        contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        id: 10899466223617,
        metadata: {
          displayUri:
            "ipfs://zdj7Wk92xWxpzGqT6sE4cx7umUyWaX2Ck8MrSEmPAR31sNWGz",
          name: "Tezzardz #10",
          symbol: "FKR",
        },
      },
      {
        balance: "0",
        contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        id: 10899502923777,
        metadata: {
          displayUri:
            "ipfs://zdj7WaSoswEYY5hcis4i4ZLDXpsusu8FaJNf4LfYXDoviiRem",
          name: "Tezzardz #12",
          symbol: "FKR",
        },
      },
      {
        balance: "0",
        contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        id: 10899539623937,
        metadata: {
          displayUri:
            "ipfs://zdj7WVwx4CX5fK5sHmXhjTm5wG9nCrzSBy83CGNXJ78fAJmba",
          name: "Tezzardz #20",
          symbol: "FKR",
        },
      },
      {
        balance: "1",
        contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        id: 10899580518401,
        metadata: {
          displayUri:
            "ipfs://zdj7WWXMC8RpzC6RkR2DXtD2zcfLc2QWu6tu7f6vnkeeUvSoh",
          name: "Tezzardz #24",
          symbol: "FKR",
        },
      },
      {
        balance: "0",
        contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        id: 10899657064449,
        metadata: {
          displayUri:
            "ipfs://zdj7Wc5siFbHn8EMrfGYiJrfe5fjqGrbJSvgjfr4oR4Rf9juV",
          name: "Tezzardz #28",
          symbol: "FKR",
        },
      },
      {
        balance: "1",
        contract: "KT1P16Zn5i578uZhThHpcPtAhVuq7ZVsdnRn",
        id: 67550012506113,
        metadata: {
          displayUri:
            "ipfs://QmYd7UqZiHtpR3Qc7XnC7NWUt1qxCN9aiwEf9aGF9iybBB/display/5040.png",
          name: "Ronald Reagan (L)",
          symbol: "POTUS40-L",
        },
      },
      {
        balance: "1",
        contract: "KT1RifpSrfjPnKJFp89igVUccvpnWtsre2wD",
        id: 82690241986561,
        metadata: {
          displayUri:
            "ipfs://QmXfLqzV28TfSpps1UFZo94NMsyYdnrxDNffdQsYPMr53t/image.png",
          name: "Tezos Meet & Greet Access Token",
          symbol: undefined,
        },
      },
      {
        balance: "1",
        contract: "KT1K1LMeToxBX4tPPAZKMR8hCQgw3hpLaoti",
        id: 82687681363969,
        metadata: {
          displayUri:
            "ipfs://QmReoHBVcKAaHFi5n2ADiAJfaNiFhqxfJsRWGYe8ocozpT/image.png",
          name: "Tezos Meet & Greet Access Token",
          symbol: undefined,
        },
      },
      {
        balance: "1",
        contract: "KT1K1LMeToxBX4tPPAZKMR8hCQgw3hpLaoti",
        id: 82700684754945,
        metadata: {
          displayUri:
            "ipfs://QmXfLqzV28TfSpps1UFZo94NMsyYdnrxDNffdQsYPMr53t/image.png",
          name: "Tezos Meet & Greet Access Token",
          symbol: undefined,
        },
      },
      {
        balance: "1",
        contract: "KT18f225bFCeTt1AHLT5n7gTf3a8wv7iyEYC",
        id: 82704303390721,
        metadata: {
          displayUri:
            "ipfs://QmXfLqzV28TfSpps1UFZo94NMsyYdnrxDNffdQsYPMr53t/image.png",
          name: "Tezos Meet & Greet Access Token",
          symbol: undefined,
        },
      },
      {
        balance: "1",
        contract: "KT1QhxBa4fep4vgyiB4MtjjqMdo21QHj2haG",
        id: 99966347378689,
        metadata: {
          displayUri:
            "ipfs://bafybeicet3ixylrqrn3mrxlbqiusznrsubr5qxyu7y3d64ewyvwohwa25a/image.png",
          name: "Paris Tezos Meetup Access Token",
          symbol: undefined,
        },
      },
    ];

    expect(result.some((el) => el === null)).toEqual(false);
    expect(result).toEqual(expected);
  });
});

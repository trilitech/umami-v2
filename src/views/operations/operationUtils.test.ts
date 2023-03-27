import { TokenTransfer } from "@tzkt/sdk-api";
import {
  getTokenTransactionsResult,
  getTransacionsResult,
} from "../../mocks/tzktResponse";
import { OperationDisplay, TezTransfer } from "../../types/Operation";
import {
  getOperationDisplays,
  getTezOperationDisplay,
  getTokenOperationDisplay,
} from "./operationsUtils";

const forAddress = "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS";
describe("getTezOperationsDisplay", () => {
  test("case tez incoming", () => {
    const incomingTez: TezTransfer = {
      type: "transaction",
      id: 109783351820288,
      level: 2213611,
      timestamp: "2023-03-27T08:47:30Z",
      block: "BM4xPHaLWYYw2KLwQrpUYjMYf1eN1mqfjtCEYUCgFpuyAd6u5cH",
      hash: "ooZCfnsMgXvxni6umn999MKfpT6zmVJpDzZmmCCh6AZ89gvUHGM",
      counter: 134162,
      sender: { address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3" },
      gasLimit: 1101,
      gasUsed: 1001,
      storageLimit: 0,
      storageUsed: 0,
      bakerFee: 402,
      storageFee: 0,
      allocationFee: 0,
      target: { address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
      amount: 2400000,
      status: "applied",
      hasInternals: false,
    };

    const result = getTezOperationDisplay(incomingTez, forAddress);

    const expected: OperationDisplay = {
      amount: { prettyDisplay: "+2.4 ꜩ" },
      fee: "0.000402 ꜩ",
      prettyTimestamp: "today at 10:47 AM",
      recipient: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
      sender: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      status: "confirmed",
      timestamp: "2023-03-27T08:47:30Z",
      type: "transaction",
      tzktUrl:
        "https://mainnet.tzkt.io/ooZCfnsMgXvxni6umn999MKfpT6zmVJpDzZmmCCh6AZ89gvUHGM",
    };
    expect(result).toEqual(expected);
  });

  test("case tez outgoing", () => {
    const outgoingTez: TezTransfer = {
      type: "transaction",
      id: 109810172297216,
      level: 2214204,
      timestamp: "2023-03-27T10:36:40Z",
      block: "BKyZ7dksWdf6sFcnWnwvS5FgQ8JgEMFxg3SsL1bWR3FBz5mSAX3",
      hash: "oo3Moa2XToLeCjiVhQFHWe3aJkFtqbbW2GKvG9Zvb5aZLs6tHWZ",
      counter: 10304021,
      sender: {
        address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
      },
      gasLimit: 1101,
      gasUsed: 1001,
      storageLimit: 0,
      storageUsed: 0,
      bakerFee: 403,
      storageFee: 0,
      allocationFee: 0,
      target: {
        address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      },
      amount: 6410000,
      status: "applied",
      hasInternals: false,
    };

    const result = getTezOperationDisplay(outgoingTez, forAddress);

    const expected: OperationDisplay = {
      amount: { prettyDisplay: "-6.41 ꜩ" },
      fee: "0.000403 ꜩ",
      prettyTimestamp: "today at 12:36 PM",
      recipient: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      sender: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
      status: "confirmed",
      timestamp: "2023-03-27T10:36:40Z",
      type: "transaction",
      tzktUrl:
        "https://mainnet.tzkt.io/oo3Moa2XToLeCjiVhQFHWe3aJkFtqbbW2GKvG9Zvb5aZLs6tHWZ",
    };

    expect(result).toEqual(expected);
  });

  test("incoming nft", () => {
    const incomingNft: TokenTransfer = {
      id: 109817445220353,
      level: 2214369,
      timestamp: "2023-03-27T11:06:40Z",
      token: {
        id: 10899580518401,
        contract: {
          address: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        },
        tokenId: "6",
        standard: "fa2",
        totalSupply: "1",
        metadata: {
          name: "Tezzardz #24",
          rights: "© 2021 George Goodwin. All rights reserved.",
          symbol: "FKR",
          formats: [
            {
              uri: "ipfs://zdj7Wkn6y1DRrfJ3A1NEyxj1Sw2b39ZjggDPe9FEe7DGtNqoC",
              mimeType: "image/png",
            },
          ],
          creators: ["George Goodwin (@omgidrawedit)"],
          decimals: "0",
          royalties: {
            shares: {
              tz1LLPWMyZ7gKsp3WnLfemyAYW6CoZoozku5: "5",
            },
            decimals: "2",
          },
          attributes: [
            {
              name: "Background",
              value: "Pink",
            },
            {
              name: "Skin",
              value: "White",
            },
            {
              name: "Skin Pattern",
              value: "Bolt",
            },
            {
              name: "Clothing",
              value: "Rainbow Onesie",
            },
            {
              name: "Headwear",
              value: "Backwards Cap",
            },
            {
              name: "Bling Level",
              value: "$$$",
            },
            {
              name: "Face",
              value: "Bent Tongue Feisty",
            },
          ],
          displayUri:
            "ipfs://zdj7WWXMC8RpzC6RkR2DXtD2zcfLc2QWu6tu7f6vnkeeUvSoh",
          artifactUri:
            "ipfs://zdj7Wkn6y1DRrfJ3A1NEyxj1Sw2b39ZjggDPe9FEe7DGtNqoC",
          description:
            "Tezzardz is a collection of 4,200 programmatically, randomly generated, snazzy little fukrs on the Tezos blockchain.",
          thumbnailUri:
            "ipfs://zb2rhfbacgmTnG13DiCvjs6J21hzMeAueYVWg37C5owThnpfQ",
        },
      },
      from: {
        address: "tz1W5iRhKWPoLviqExtDDKJqCcPRLBWMhg6S",
      },
      to: {
        address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
      },
      amount: "1",
      transactionId: 109817445220352,
    };

    const result = getTokenOperationDisplay(incomingNft, forAddress);

    const expected = {
      type: "transaction",
      tzktUrl: "https://mainnet.tzkt.io/2214369/operations",
      amount: {
        prettyDisplay: "+1 FKR",
        url: "https://ipfs.io/ipfs/zdj7WWXMC8RpzC6RkR2DXtD2zcfLc2QWu6tu7f6vnkeeUvSoh",
      },
      prettyTimestamp: "today at 1:06 PM",
      recipient: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
      sender: "tz1W5iRhKWPoLviqExtDDKJqCcPRLBWMhg6S",
      timestamp: "2023-03-27T11:06:40Z",
    };

    expect(result).toEqual(expected);
  });

  test("outgoing Nft", () => {
    const outgoingNft = {
      id: 109854457856001,
      level: 2215172,
      timestamp: "2023-03-27T13:24:48Z",
      token: {
        id: 10899580518401,
        contract: {
          address: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        },
        tokenId: "6",
        standard: "fa2",
        totalSupply: "1",
        metadata: {
          name: "Tezzardz #24",
          rights: "© 2021 George Goodwin. All rights reserved.",
          symbol: "FKR",
          formats: [
            {
              uri: "ipfs://zdj7Wkn6y1DRrfJ3A1NEyxj1Sw2b39ZjggDPe9FEe7DGtNqoC",
              mimeType: "image/png",
            },
          ],
          creators: ["George Goodwin (@omgidrawedit)"],
          decimals: "0",
          royalties: {
            shares: {
              tz1LLPWMyZ7gKsp3WnLfemyAYW6CoZoozku5: "5",
            },
            decimals: "2",
          },
          attributes: [
            {
              name: "Background",
              value: "Pink",
            },
            {
              name: "Skin",
              value: "White",
            },
            {
              name: "Skin Pattern",
              value: "Bolt",
            },
            {
              name: "Clothing",
              value: "Rainbow Onesie",
            },
            {
              name: "Headwear",
              value: "Backwards Cap",
            },
            {
              name: "Bling Level",
              value: "$$$",
            },
            {
              name: "Face",
              value: "Bent Tongue Feisty",
            },
          ],
          displayUri:
            "ipfs://zdj7WWXMC8RpzC6RkR2DXtD2zcfLc2QWu6tu7f6vnkeeUvSoh",
          artifactUri:
            "ipfs://zdj7Wkn6y1DRrfJ3A1NEyxj1Sw2b39ZjggDPe9FEe7DGtNqoC",
          description:
            "Tezzardz is a collection of 4,200 programmatically, randomly generated, snazzy little fukrs on the Tezos blockchain.",
          thumbnailUri:
            "ipfs://zb2rhfbacgmTnG13DiCvjs6J21hzMeAueYVWg37C5owThnpfQ",
        },
      },
      from: {
        address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
      },
      to: {
        address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      },
      amount: "1",
      transactionId: 109854457856000,
    };

    const expected = {
      type: "transaction",
      amount: {
        prettyDisplay: "-1 FKR",
        url: "https://ipfs.io/ipfs/zdj7WWXMC8RpzC6RkR2DXtD2zcfLc2QWu6tu7f6vnkeeUvSoh",
      },
      tzktUrl: "https://mainnet.tzkt.io/2215172/operations",
      prettyTimestamp: "today at 3:24 PM",
      recipient: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      sender: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
      timestamp: "2023-03-27T13:24:48Z",
    };

    const result = getTokenOperationDisplay(outgoingNft, forAddress);
    expect(result).toEqual(expected);
  });

  test("Incoming fa2 token", () => {
    const incomingKL3: TokenTransfer = {
      id: 109855131041793,
      level: 2215185,
      timestamp: "2023-03-27T13:27:13Z",
      token: {
        id: 10898231001089,
        contract: {
          address: "KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ",
        },
        tokenId: "1",
        standard: "fa2",
        totalSupply: "13000000000",
        metadata: {
          name: "Klondike3",
          symbol: "KL3",
          decimals: "5",
        },
      },
      from: {
        address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      },
      to: {
        address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
      },
      amount: "716850",
      transactionId: 109855131041792,
    };

    const result = getTokenOperationDisplay(incomingKL3, forAddress);
    const expected = {
      type: "transaction",
      tzktUrl: "https://mainnet.tzkt.io/2215185/operations",
      amount: { prettyDisplay: "+7.1685 KL3", url: undefined },
      prettyTimestamp: "today at 3:27 PM",
      recipient: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
      sender: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      timestamp: "2023-03-27T13:27:13Z",
    };
    expect(result).toEqual(expected);
  });

  test("Outgoing fa2 token", () => {
    const incomingKL3: TokenTransfer = {
      id: 109855493849090,
      level: 2215193,
      timestamp: "2023-03-27T13:29:22Z",
      token: {
        id: 10898231001089,
        contract: {
          address: "KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ",
        },
        tokenId: "1",
        standard: "fa2",
        totalSupply: "13000000000",
        metadata: {
          name: "Klondike3",
          symbol: "KL3",
          decimals: "5",
        },
      },
      from: {
        address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
      },
      to: {
        address: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
      },
      amount: "451000",
      transactionId: 109855493849088,
    };

    const result = getTokenOperationDisplay(incomingKL3, forAddress);
    const expected = {
      type: "transaction",
      tzktUrl: "https://mainnet.tzkt.io/2215193/operations",
      amount: { prettyDisplay: "-4.51 KL3", url: undefined },
      prettyTimestamp: "today at 3:29 PM",
      recipient: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
      sender: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
      timestamp: "2023-03-27T13:29:22Z",
    };
    expect(result).toEqual(expected);
  });

  test("Incoming fa1.2 token", () => {
    const incomingFa12: TokenTransfer = {
      id: 109855847219201,
      level: 2215201,
      timestamp: "2023-03-27T13:30:37Z",
      token: {
        id: 10897625972737,
        contract: {
          address: "KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe",
        },
        tokenId: "0",
        standard: "fa1.2",
        totalSupply: "13000000",
      },
      from: {
        address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      },
      to: {
        address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
      },
      amount: "27400",
      transactionId: 109855847219200,
    };

    const result = getTokenOperationDisplay(incomingFa12, forAddress);
    const expected = {
      type: "transaction",
      tzktUrl: "https://mainnet.tzkt.io/2215201/operations",
      amount: { prettyDisplay: "+2.74 KLD", url: undefined },
      prettyTimestamp: "today at 3:30 PM",
      recipient: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
      sender: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      timestamp: "2023-03-27T13:30:37Z",
    };
    expect(result).toEqual(expected);
  });
});

describe("getOperationsDisplays", () => {
  it("returns the right value", () => {
    const result = getOperationDisplays(
      getTransacionsResult,
      getTokenTransactionsResult,
      forAddress
    );

    const expected: OperationDisplay[] = [
      {
        amount: { prettyDisplay: "+2.74 KLD", url: undefined },
        prettyTimestamp: "today at 3:30 PM",
        recipient: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        sender: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        timestamp: "2023-03-27T13:30:37Z",
        type: "transaction",
        tzktUrl: "https://mainnet.tzkt.io/2215201/operations",
      },
      {
        amount: { prettyDisplay: "-4.51 KL3", url: undefined },
        prettyTimestamp: "today at 3:29 PM",
        recipient: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
        sender: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        timestamp: "2023-03-27T13:29:22Z",
        type: "transaction",
        tzktUrl: "https://mainnet.tzkt.io/2215193/operations",
      },
      {
        amount: { prettyDisplay: "+7.1685 KL3", url: undefined },
        prettyTimestamp: "today at 3:27 PM",
        recipient: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        sender: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        timestamp: "2023-03-27T13:27:13Z",
        type: "transaction",
        tzktUrl: "https://mainnet.tzkt.io/2215185/operations",
      },
      {
        amount: {
          prettyDisplay: "-1 FKR",
          url: "https://ipfs.io/ipfs/zdj7WWXMC8RpzC6RkR2DXtD2zcfLc2QWu6tu7f6vnkeeUvSoh",
        },
        prettyTimestamp: "today at 3:24 PM",
        recipient: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        sender: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        timestamp: "2023-03-27T13:24:48Z",
        type: "transaction",
        tzktUrl: "https://mainnet.tzkt.io/2215172/operations",
      },
      {
        amount: {
          prettyDisplay: "+1 FKR",
          url: "https://ipfs.io/ipfs/zdj7WWXMC8RpzC6RkR2DXtD2zcfLc2QWu6tu7f6vnkeeUvSoh",
        },
        prettyTimestamp: "today at 1:06 PM",
        recipient: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        sender: "tz1W5iRhKWPoLviqExtDDKJqCcPRLBWMhg6S",
        timestamp: "2023-03-27T11:06:40Z",
        type: "transaction",
        tzktUrl: "https://mainnet.tzkt.io/2214369/operations",
      },
      {
        amount: { prettyDisplay: "-6.41 ꜩ" },
        fee: "0.000403 ꜩ",
        prettyTimestamp: "today at 12:36 PM",
        recipient: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        sender: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        status: "confirmed",
        timestamp: "2023-03-27T10:36:40Z",
        type: "transaction",
        tzktUrl:
          "https://mainnet.tzkt.io/oo3Moa2XToLeCjiVhQFHWe3aJkFtqbbW2GKvG9Zvb5aZLs6tHWZ",
      },
      {
        amount: { prettyDisplay: "+2.4 ꜩ" },
        fee: "0.000402 ꜩ",
        prettyTimestamp: "today at 10:47 AM",
        recipient: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        sender: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        status: "confirmed",
        timestamp: "2023-03-27T08:47:30Z",
        type: "transaction",
        tzktUrl:
          "https://mainnet.tzkt.io/ooZCfnsMgXvxni6umn999MKfpT6zmVJpDzZmmCCh6AZ89gvUHGM",
      },
      {
        amount: { prettyDisplay: "+2.1 KL2", url: undefined },
        prettyTimestamp: "yesterday at 4:38 PM",
        recipient: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        sender: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
        timestamp: "2023-03-26T14:38:48Z",
        type: "transaction",
        tzktUrl: "https://mainnet.tzkt.io/2207656/operations",
      },
      {
        amount: { prettyDisplay: "-0 ꜩ" },
        fee: "0.000771 ꜩ",
        prettyTimestamp: "yesterday at 4:34 PM",
        recipient: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        sender: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        status: "confirmed",
        timestamp: "2023-03-26T14:34:47Z",
        type: "transaction",
        tzktUrl:
          "https://mainnet.tzkt.io/op9pGAxiJtPcv37KRnLWhYBDx2RRhTiBeTZNsKQAQ1Pxn8AsbUC",
      },
      {
        amount: {
          prettyDisplay: "-1 FKR",
          url: "https://ipfs.io/ipfs/zdj7WWXMC8RpzC6RkR2DXtD2zcfLc2QWu6tu7f6vnkeeUvSoh",
        },
        prettyTimestamp: "yesterday at 4:34 PM",
        recipient: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
        sender: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        timestamp: "2023-03-26T14:34:47Z",
        type: "transaction",
        tzktUrl: "https://mainnet.tzkt.io/2207631/operations",
      },
    ];
    expect(result).toEqual(expected);
  });
});

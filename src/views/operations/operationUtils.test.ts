import { DelegationOperation } from "@tzkt/sdk-api";
import { mockImplicitAddress } from "../../mocks/factories";
import {
  getLatestDelegationResult,
  getTokenTransactionsResult,
  getTransactionsResult,
  rawTzktNftTransfer,
} from "../../mocks/tzktResponse";
import { OperationDisplay, TezTransfer, TokenTransfer } from "../../types/Transfer";
import {
  getOperationDisplays,
  getTezOperationDisplay,
  getTokenOperationDisplay,
  getTransactionUrl,
} from "./operationsUtils";
import { DefaultNetworks } from "../../types/Network";

const forAddress = "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS";
describe("getTezOperationDisplay", () => {
  test("it throws for a tez transfer non related to reference address", () => {
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

    expect(() => getTezOperationDisplay(incomingTez, mockImplicitAddress(4).pkh)).toThrowError(
      "Address tz1i9imTXjMAW5HP5g3wq55Pcr43tDz8c3VZ doesn't match sender or recipient"
    );
  });

  test("returns null for a token transfer non related to reference address", () => {
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

    expect(() => getTokenOperationDisplay(incomingKL3, mockImplicitAddress(4).pkh)).toThrowError(
      "Address tz1i9imTXjMAW5HP5g3wq55Pcr43tDz8c3VZ doesn't match sender or recipient"
    );
  });

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
      id: 109783351820288,
      amount: { prettyDisplay: "+2.400000 ꜩ" },
      fee: "0.000402 ꜩ",
      prettyTimestamp: "today at 10:47 AM",
      recipient: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
      sender: { type: "implicit", pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3" },
      status: "confirmed",
      timestamp: "2023-03-27T08:47:30Z",
      type: "transaction",
      tzktUrl: "https://mainnet.tzkt.io/ooZCfnsMgXvxni6umn999MKfpT6zmVJpDzZmmCCh6AZ89gvUHGM",
      level: 2213611,
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
      id: 109810172297216,
      amount: { prettyDisplay: "-6.410000 ꜩ" },
      fee: "0.000403 ꜩ",
      prettyTimestamp: "today at 12:36 PM",
      recipient: { type: "implicit", pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3" },
      sender: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
      status: "confirmed",
      timestamp: "2023-03-27T10:36:40Z",
      type: "transaction",
      tzktUrl: "https://mainnet.tzkt.io/oo3Moa2XToLeCjiVhQFHWe3aJkFtqbbW2GKvG9Zvb5aZLs6tHWZ",
      level: 2214204,
    };

    expect(result).toEqual(expected);
  });

  test("incoming nft", () => {
    const incomingNft: TokenTransfer = rawTzktNftTransfer;

    const result = getTokenOperationDisplay(incomingNft, forAddress);

    const expected = {
      id: 109817445220353,
      type: "transaction",
      tzktUrl: "https://mainnet.tzkt.io/transactions/109817445220352",
      amount: {
        id: 10899580518401,
        prettyDisplay: "+1",
        url: "https://ipfs.io/ipfs/zb2rhfbacgmTnG13DiCvjs6J21hzMeAueYVWg37C5owThnpfQ",
      },
      prettyTimestamp: "today at 1:06 PM",
      recipient: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
      sender: { type: "implicit", pkh: "tz1W5iRhKWPoLviqExtDDKJqCcPRLBWMhg6S" },
      timestamp: "2023-03-27T11:06:40Z",
      level: 2214369,
    };

    expect(result).toEqual(expected);
  });

  test("incoming nft with missing from", () => {
    const incomingNft = { ...rawTzktNftTransfer, from: undefined };

    const result = getTokenOperationDisplay(incomingNft, forAddress);

    const expected = {
      id: 109817445220353,
      type: "transaction",
      tzktUrl: "https://mainnet.tzkt.io/transactions/109817445220352",
      amount: {
        id: 10899580518401,
        prettyDisplay: "+1",
        url: "https://ipfs.io/ipfs/zb2rhfbacgmTnG13DiCvjs6J21hzMeAueYVWg37C5owThnpfQ",
      },
      prettyTimestamp: "today at 1:06 PM",
      recipient: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
      sender: { type: "contract", pkh: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob" },
      timestamp: "2023-03-27T11:06:40Z",
      level: 2214369,
    };

    expect(result).toEqual(expected);
  });

  test("outgoing Nft", () => {
    const outgoingNft = {
      ...rawTzktNftTransfer,
      from: {
        address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
      },
      to: {
        address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      },
    };

    const expected = {
      id: 109817445220353,
      type: "transaction",
      amount: {
        id: 10899580518401,
        prettyDisplay: "-1",
        url: "https://ipfs.io/ipfs/zb2rhfbacgmTnG13DiCvjs6J21hzMeAueYVWg37C5owThnpfQ",
      },
      tzktUrl: "https://mainnet.tzkt.io/transactions/109817445220352",
      prettyTimestamp: "today at 1:06 PM",
      recipient: { type: "implicit", pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3" },
      sender: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
      timestamp: "2023-03-27T11:06:40Z",
      level: 2214369,
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
      id: 109855131041793,
      type: "transaction",
      tzktUrl: "https://mainnet.tzkt.io/transactions/109855131041792",
      amount: {
        id: 10898231001089,
        prettyDisplay: "+7.16850 KL3",
        url: undefined,
      },
      prettyTimestamp: "today at 3:27 PM",
      recipient: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
      sender: { type: "implicit", pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3" },
      timestamp: "2023-03-27T13:27:13Z",
      level: 2215185,
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
      id: 109855493849090,
      type: "transaction",
      tzktUrl: "https://mainnet.tzkt.io/transactions/109855493849088",
      amount: {
        id: 10898231001089,
        prettyDisplay: "-4.51000 KL3",
        url: undefined,
      },
      prettyTimestamp: "today at 3:29 PM",
      recipient: { type: "implicit", pkh: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D" },
      sender: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
      timestamp: "2023-03-27T13:29:22Z",
      level: 2215193,
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
      id: 109855847219201,
      type: "transaction",
      tzktUrl: "https://mainnet.tzkt.io/transactions/109855847219200",
      amount: {
        id: 10897625972737,
        prettyDisplay: "+27,400 FA1.2",
        url: undefined,
      },
      prettyTimestamp: "today at 3:30 PM",
      recipient: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
      sender: { type: "implicit", pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3" },
      timestamp: "2023-03-27T13:30:37Z",
      level: 2215201,
    };
    expect(result).toEqual(expected);
  });
});

describe("getOperationDisplays", () => {
  it("returns the right value", () => {
    const result = getOperationDisplays(
      getTransactionsResult,
      getTokenTransactionsResult,
      getLatestDelegationResult,
      forAddress
    );

    const expected: OperationDisplay[] = [
      {
        id: 537704232124416,
        amount: { prettyDisplay: "0.467532 ꜩ" },
        fee: "0.000396 ꜩ",
        level: 3414723,
        prettyTimestamp: "04/24/2023",
        recipient: { type: "implicit", pkh: "tz1fHn9ZSqMwp1WNwdCLqnh52yPgzQ4QydTm" },
        sender: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
        timestamp: "2023-04-24T09:48:17Z",
        type: "delegation",
        tzktUrl: "https://mainnet.tzkt.io/onxgPmNMo4756y7PhXeYethMVf2e3HUSHoZuia8rY5qFujgbqva",
      },
      {
        id: 109855847219201,
        amount: {
          id: 10897625972737,
          prettyDisplay: "+27,400 FA1.2",
          url: undefined,
        },
        prettyTimestamp: "today at 3:30 PM",
        recipient: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
        sender: { type: "implicit", pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3" },
        timestamp: "2023-03-27T13:30:37Z",
        type: "transaction",
        tzktUrl: "https://mainnet.tzkt.io/transactions/109855847219200",
        level: 2215201,
      },
      {
        id: 109855493849090,
        amount: {
          id: 10898231001089,
          prettyDisplay: "-4.51000 KL3",
          url: undefined,
        },
        prettyTimestamp: "today at 3:29 PM",
        recipient: { type: "implicit", pkh: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D" },
        sender: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
        timestamp: "2023-03-27T13:29:22Z",
        type: "transaction",
        tzktUrl: "https://mainnet.tzkt.io/transactions/109855493849088",
        level: 2215193,
      },
      {
        id: 109855131041793,
        amount: {
          id: 10898231001089,
          prettyDisplay: "+7.16850 KL3",
          url: undefined,
        },
        prettyTimestamp: "today at 3:27 PM",
        recipient: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
        sender: { type: "implicit", pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3" },
        timestamp: "2023-03-27T13:27:13Z",
        type: "transaction",
        tzktUrl: "https://mainnet.tzkt.io/transactions/109855131041792",
        level: 2215185,
      },
      {
        id: 109854457856001,
        amount: {
          id: 10899580518401,
          prettyDisplay: "-1",
          url: "https://ipfs.io/ipfs/zb2rhfbacgmTnG13DiCvjs6J21hzMeAueYVWg37C5owThnpfQ",
        },
        prettyTimestamp: "today at 3:24 PM",
        recipient: { type: "implicit", pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3" },
        sender: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
        timestamp: "2023-03-27T13:24:48Z",
        type: "transaction",
        tzktUrl: "https://mainnet.tzkt.io/transactions/109854457856000",
        level: 2215172,
      },
      {
        id: 109817445220353,
        amount: {
          id: 10899580518401,
          prettyDisplay: "+1",
          url: "https://ipfs.io/ipfs/zb2rhfbacgmTnG13DiCvjs6J21hzMeAueYVWg37C5owThnpfQ",
        },
        prettyTimestamp: "today at 1:06 PM",
        recipient: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
        sender: { type: "implicit", pkh: "tz1W5iRhKWPoLviqExtDDKJqCcPRLBWMhg6S" },
        timestamp: "2023-03-27T11:06:40Z",
        type: "transaction",
        tzktUrl: "https://mainnet.tzkt.io/transactions/109817445220352",
        level: 2214369,
      },
      {
        id: 109810172297216,
        amount: { prettyDisplay: "-6.410000 ꜩ" },
        fee: "0.000403 ꜩ",
        prettyTimestamp: "today at 12:36 PM",
        recipient: { type: "implicit", pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3" },
        sender: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
        status: "confirmed",
        timestamp: "2023-03-27T10:36:40Z",
        type: "transaction",
        tzktUrl: "https://mainnet.tzkt.io/oo3Moa2XToLeCjiVhQFHWe3aJkFtqbbW2GKvG9Zvb5aZLs6tHWZ",
        level: 2214204,
      },
      {
        id: 109783351820288,
        amount: { prettyDisplay: "+2.400000 ꜩ" },
        fee: "0.000402 ꜩ",
        prettyTimestamp: "today at 10:47 AM",
        recipient: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
        sender: { type: "implicit", pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3" },
        status: "confirmed",
        timestamp: "2023-03-27T08:47:30Z",
        type: "transaction",
        tzktUrl: "https://mainnet.tzkt.io/ooZCfnsMgXvxni6umn999MKfpT6zmVJpDzZmmCCh6AZ89gvUHGM",
        level: 2213611,
      },
      {
        id: 109511935262721,
        amount: {
          id: 10898194300929,
          prettyDisplay: "+2.10000 KL2",
          url: undefined,
        },
        prettyTimestamp: "yesterday at 4:38 PM",
        recipient: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
        sender: { type: "implicit", pkh: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D" },
        timestamp: "2023-03-26T14:38:48Z",
        type: "transaction",
        tzktUrl: "https://mainnet.tzkt.io/transactions/109511935262720",
        level: 2207656,
      },
      {
        id: 109510819577856,
        amount: { prettyDisplay: "-0.000000 ꜩ" },
        fee: "0.000771 ꜩ",
        prettyTimestamp: "yesterday at 4:34 PM",
        recipient: { type: "contract", pkh: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob" },
        sender: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
        status: "confirmed",
        timestamp: "2023-03-26T14:34:47Z",
        type: "transaction",
        tzktUrl: "https://mainnet.tzkt.io/op9pGAxiJtPcv37KRnLWhYBDx2RRhTiBeTZNsKQAQ1Pxn8AsbUC",
        level: 2207631,
      },
      {
        id: 109510819577858,
        amount: {
          id: 10899580518401,
          prettyDisplay: "-1",
          url: "https://ipfs.io/ipfs/zb2rhfbacgmTnG13DiCvjs6J21hzMeAueYVWg37C5owThnpfQ",
        },
        prettyTimestamp: "yesterday at 4:34 PM",
        recipient: { type: "implicit", pkh: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D" },
        sender: { type: "implicit", pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
        timestamp: "2023-03-26T14:34:47Z",
        type: "transaction",
        tzktUrl: "https://mainnet.tzkt.io/transactions/109510819577856",
        level: 2207631,
      },
    ];
    expect(result).toEqual(expected);
  });

  it("includes an active delegation", () => {
    const result = getOperationDisplays(
      [],
      [],
      {
        id: 12345,
        sender: { address: mockImplicitAddress(1).pkh },
        newDelegate: { address: mockImplicitAddress(1).pkh },
        timestamp: new Date().toISOString(),
        amount: 100000,
        hash: "mockHash",
        level: 300,
        bakerFee: 400,
      } as DelegationOperation,
      mockImplicitAddress(1).pkh
    );
    expect(result).toEqual([
      {
        id: 12345,
        amount: { prettyDisplay: "0.100000 ꜩ" },
        fee: "0.000400 ꜩ",
        level: 300,
        prettyTimestamp: "today at 4:15 PM",
        recipient: { type: "implicit", pkh: "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf" },
        sender: { type: "implicit", pkh: "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf" },
        timestamp: "2023-03-27T14:15:09.760Z",
        type: "delegation",
        tzktUrl: "https://mainnet.tzkt.io/mockHash",
      },
    ]);
  });

  it("ignores an inactive delegation", () => {
    const result = getOperationDisplays(
      [],
      [],
      {
        id: 12345,
        sender: { address: mockImplicitAddress(1).pkh },
        timestamp: new Date().toISOString(),
        amount: 100000,
        hash: "mockHash",
        level: 300,
        bakerFee: 400,
      } as DelegationOperation,
      mockImplicitAddress(1).pkh
    );
    expect(result).toEqual([]);
  });
});

describe("getTransactionUrl", () => {
  it("should return a proper URL", () => {
    DefaultNetworks.forEach(network => {
      expect(
        getTransactionUrl({
          transactionId: 123,
          originationId: 456,
          migrationId: 789,
          network: network,
        })
      ).toEqual(`https://${network}.tzkt.io/transactions/123`);
      expect(
        getTransactionUrl({
          transactionId: undefined,
          originationId: 456,
          migrationId: 789,
          network: network,
        })
      ).toEqual(`https://${network}.tzkt.io/originations/456`);
      expect(
        getTransactionUrl({
          transactionId: undefined,
          originationId: undefined,
          migrationId: 789,
          network: network,
        })
      ).toEqual(`https://${network}.tzkt.io/migrations/789`);
      expect(() =>
        getTransactionUrl({
          transactionId: undefined,
          originationId: undefined,
          migrationId: undefined,
          network: network,
        })
      ).toThrow();
    });
  });
});

import { DelegationOperation, TokenTransfer } from "@tzkt/sdk-api";
import { TezTransfer } from "../types/Operation";
import { Token } from "../types/Token";
import { TokenBalancePayload } from "../utils/store/assetsSlice";
import { tzktGetSameMultisigsResponseType } from "../utils/tzkt/types";
import { mockContractAddress, mockImplicitAddress } from "./factories";

export const fa1Token: Token = {
  id: 10897662672897,
  account: {
    address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
  },
  token: {
    id: 10897625972737,
    contract: {
      address: "KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe",
    },
    tokenId: "0",
    standard: "fa1.2",
    totalSupply: "13000000",
  },
  balance: "443870",
  transfersCount: 27,
  firstLevel: 288229,
  firstTime: "2022-03-24T15:32:10Z",
  lastLevel: 1365863,
  lastTime: "2022-10-20T13:36:35Z",
};

export const fa2Token = {
  id: 10898310692865,
  account: {
    address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
  },
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
  balance: "409412200",
  transfersCount: 22,
  firstLevel: 288246,
  firstTime: "2022-03-24T15:37:20Z",
  lastLevel: 1365863,
  lastTime: "2022-10-20T13:36:35Z",
};

export const nft: Token = {
  id: 10899466223618,
  account: {
    address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
  },
  token: {
    id: 10899466223617,
    contract: {
      address: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
    },
    tokenId: "3",
    standard: "fa2",
    totalSupply: "1",
    metadata: {
      name: "Tezzardz #10",
      rights: "© 2021 George Goodwin. All rights reserved.",
      symbol: "FKR",
      formats: [
        {
          uri: "ipfs://zdj7WgkxmCSgNVMFg2yR9mKgKjEH2RkzHatgHSCBYW3CQ5EJH",
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
          value: "Purple",
        },
        {
          name: "Skin",
          value: "Orange",
        },
        {
          name: "Skin Pattern",
          value: "Heavy",
        },
        {
          name: "Clothing",
          value: "Shrine Onesie",
        },
        {
          name: "Tail Spikes",
          value: "Rainbow",
        },
        {
          name: "Headwear",
          value: "Limited Spikes",
        },
        {
          name: "Bling Level",
          value: "$",
        },
        {
          name: "Eyewear",
          value: "Gold Leaf Eye Patch",
        },
        {
          name: "Face",
          value: "Straight Tongue Sad",
        },
      ],
      displayUri: "ipfs://zdj7Wk92xWxpzGqT6sE4cx7umUyWaX2Ck8MrSEmPAR31sNWGz",
      artifactUri: "ipfs://zdj7WgkxmCSgNVMFg2yR9mKgKjEH2RkzHatgHSCBYW3CQ5EJH",
      description:
        "Tezzardz is a collection of 4,200 programmatically, randomly generated, snazzy little fukrs on the Tezos blockchain.",
      thumbnailUri: "ipfs://zb2rhXWQ9X95yxQwusNjftDSWVQYbGjFFFFBjJKQZ8uCrNcvV",
    },
  },
  balance: "0",
  transfersCount: 8,
  firstLevel: 288277,
  firstTime: "2022-03-24T15:45:30Z",
  lastLevel: 697800,
  lastTime: "2022-06-15T14:05:25Z",
};

export const getTransactionsResult: TezTransfer[] = [
  {
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
  },
  {
    type: "transaction",
    id: 109783351820288,
    level: 2213611,
    timestamp: "2023-03-27T08:47:30Z",
    block: "BM4xPHaLWYYw2KLwQrpUYjMYf1eN1mqfjtCEYUCgFpuyAd6u5cH",
    hash: "ooZCfnsMgXvxni6umn999MKfpT6zmVJpDzZmmCCh6AZ89gvUHGM",
    counter: 134162,
    sender: {
      address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
    },
    gasLimit: 1101,
    gasUsed: 1001,
    storageLimit: 0,
    storageUsed: 0,
    bakerFee: 402,
    storageFee: 0,
    allocationFee: 0,
    target: {
      address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
    },
    amount: 2400000,
    status: "applied",
    hasInternals: false,
  },
  {
    type: "transaction",
    id: 109510819577856,
    level: 2207631,
    timestamp: "2023-03-26T14:34:47Z",
    block: "BKiv7G5finLJJLkP3T97vPnk95ZVrLLFURVzTeM6RqoSMKFq9N8",
    hash: "op9pGAxiJtPcv37KRnLWhYBDx2RRhTiBeTZNsKQAQ1Pxn8AsbUC",
    counter: 10304020,
    sender: {
      address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
    },
    gasLimit: 3656,
    gasUsed: 3556,
    storageLimit: 67,
    storageUsed: 67,
    bakerFee: 771,
    storageFee: 16750,
    allocationFee: 0,
    target: {
      address: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
    },
    targetCodeHash: 1095391981,
    amount: 0,
    parameter: {
      entrypoint: "transfer",
      value: [
        {
          txs: [
            {
              to_: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
              amount: "1",
              token_id: "6",
            },
          ],
          from_: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        },
      ],
    },
    status: "applied",
    hasInternals: false,
    tokenTransfersCount: 1,
  },
];

export const getTokenTransactionsResult: TokenTransfer[] = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
        displayUri: "ipfs://zdj7WWXMC8RpzC6RkR2DXtD2zcfLc2QWu6tu7f6vnkeeUvSoh",
        artifactUri: "ipfs://zdj7Wkn6y1DRrfJ3A1NEyxj1Sw2b39ZjggDPe9FEe7DGtNqoC",
        description:
          "Tezzardz is a collection of 4,200 programmatically, randomly generated, snazzy little fukrs on the Tezos blockchain.",
        thumbnailUri: "ipfs://zb2rhfbacgmTnG13DiCvjs6J21hzMeAueYVWg37C5owThnpfQ",
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
  },
  {
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
        displayUri: "ipfs://zdj7WWXMC8RpzC6RkR2DXtD2zcfLc2QWu6tu7f6vnkeeUvSoh",
        artifactUri: "ipfs://zdj7Wkn6y1DRrfJ3A1NEyxj1Sw2b39ZjggDPe9FEe7DGtNqoC",
        description:
          "Tezzardz is a collection of 4,200 programmatically, randomly generated, snazzy little fukrs on the Tezos blockchain.",
        thumbnailUri: "ipfs://zb2rhfbacgmTnG13DiCvjs6J21hzMeAueYVWg37C5owThnpfQ",
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
  },
  {
    id: 109511935262721,
    level: 2207656,
    timestamp: "2023-03-26T14:38:48Z",
    token: {
      id: 10898194300929,
      contract: {
        address: "KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ",
      },
      tokenId: "0",
      standard: "fa2",
      totalSupply: "13000000000",
      metadata: {
        name: "Klondike2",
        symbol: "KL2",
        decimals: "5",
      },
    },
    from: {
      address: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
    },
    to: {
      address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
    },
    amount: "210000",
    transactionId: 109511935262720,
  },
  {
    id: 109510819577858,
    level: 2207631,
    timestamp: "2023-03-26T14:34:47Z",
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
        displayUri: "ipfs://zdj7WWXMC8RpzC6RkR2DXtD2zcfLc2QWu6tu7f6vnkeeUvSoh",
        artifactUri: "ipfs://zdj7Wkn6y1DRrfJ3A1NEyxj1Sw2b39ZjggDPe9FEe7DGtNqoC",
        description:
          "Tezzardz is a collection of 4,200 programmatically, randomly generated, snazzy little fukrs on the Tezos blockchain.",
        thumbnailUri: "ipfs://zb2rhfbacgmTnG13DiCvjs6J21hzMeAueYVWg37C5owThnpfQ",
      },
    },
    from: {
      address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
    },
    to: {
      address: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
    },
    amount: "1",
    transactionId: 109510819577856,
  },
];

export const ghostMultisigContracts = [
  {
    id: 533705,
    type: "contract",
    address: "KT1Mqvf7bnYe4Ty2n7ZbGkdbebCd4WoTJUUp",
    kind: "smart_contract",
    balance: 0,
    creator: { address: "tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3" },
    numContracts: 0,
    activeTokensCount: 0,
    tokensCount: 0,
    tokenBalancesCount: 0,
    tokenTransfersCount: 0,
    numDelegations: 0,
    numOriginations: 1,
    numTransactions: 0,
    numReveals: 0,
    numMigrations: 0,
    transferTicketCount: 0,
    increasePaidStorageCount: 0,
    eventsCount: 0,
    firstActivity: 1636117,
    firstActivityTime: "2022-12-09T16:49:25Z",
    lastActivity: 1636117,
    lastActivityTime: "2022-12-09T16:49:25Z",
    storage: {
      owner: "tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3",
      signers: ["tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3", "tz1dyX3B1CFYa2DfdFLyPtiJCfQRUgPVME6E"],
      metadata: 216412,
      threshold: "1",
      last_op_id: "0",
      pending_ops: 216411,
    },
    typeHash: 1963879877,
    codeHash: -1890025422,
  },
  {
    id: 536908,
    type: "contract",
    address: "KT1VwWbTMRN5uX4bfxCcpJnPP6iAhboqhGZr",
    kind: "smart_contract",
    balance: 0,
    creator: { address: "tz1dyX3B1CFYa2DfdFLyPtiJCfQRUgPVME6E" },
    numContracts: 0,
    activeTokensCount: 0,
    tokensCount: 0,
    tokenBalancesCount: 0,
    tokenTransfersCount: 0,
    numDelegations: 0,
    numOriginations: 1,
    numTransactions: 0,
    numReveals: 0,
    numMigrations: 0,
    transferTicketCount: 0,
    increasePaidStorageCount: 0,
    eventsCount: 0,
    firstActivity: 1667087,
    firstActivityTime: "2022-12-15T16:49:45Z",
    lastActivity: 1667087,
    lastActivityTime: "2022-12-15T16:49:45Z",
    storage: {
      owner: "tz1dyX3B1CFYa2DfdFLyPtiJCfQRUgPVME6E",
      signers: [
        "tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3",
        "tz1VTfGqp34NypRQJmjNiPrCTG5TRonevsmf",
        "tz1g2pCYFonfHXqjNCJNnGRy6MamDPdon4oS",
      ],
      metadata: 219459,
      threshold: "2",
      last_op_id: "0",
      pending_ops: 219458,
    },
    typeHash: 1963879877,
    codeHash: -1890025422,
  },
  {
    id: 537023,
    type: "contract",
    address: "KT1Vdhz4izz7LASWU4tTLu3GBsvhJ8ULSi3G",
    kind: "smart_contract",
    balance: 0,
    creator: { address: "tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3" },
    numContracts: 0,
    activeTokensCount: 0,
    tokensCount: 0,
    tokenBalancesCount: 0,
    tokenTransfersCount: 0,
    numDelegations: 0,
    numOriginations: 1,
    numTransactions: 0,
    numReveals: 0,
    numMigrations: 0,
    transferTicketCount: 0,
    increasePaidStorageCount: 0,
    eventsCount: 0,
    firstActivity: 1668011,
    firstActivityTime: "2022-12-15T21:21:20Z",
    lastActivity: 1668011,
    lastActivityTime: "2022-12-15T21:21:20Z",
    storage: {
      owner: "tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3",
      signers: ["tz1RVPjF88wjiZ7JhxvmLPRm6TTR9MHPAFPd", "tz1ajzeMEzKxM9H4keBxoD1JSQy3iGRoHPg5"],
      metadata: 219536,
      threshold: "1",
      last_op_id: "0",
      pending_ops: 219535,
    },
    typeHash: 1963879877,
    codeHash: -1890025422,
  },
];

export const getLatestDelegationResult: DelegationOperation = {
  type: "delegation",
  id: 537704232124416,
  level: 3414723,
  timestamp: "2023-04-24T09:48:17Z",
  block: "BMQqjM67WtpYZEzSUTYgQQfQpM5b7kkX5QF9pDK6HJ9vCSQMY8J",
  hash: "onxgPmNMo4756y7PhXeYethMVf2e3HUSHoZuia8rY5qFujgbqva",
  counter: 85715155,
  sender: {
    address: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
  },
  gasLimit: 1100,
  gasUsed: 1000,
  storageLimit: 0,
  bakerFee: 396,
  amount: 467532,
  newDelegate: {
    alias: "NFTBakery",
    address: "tz1fHn9ZSqMwp1WNwdCLqnh52yPgzQ4QydTm",
  },
  status: "applied",
};

export const tzktGetSameMultisigsResponse: tzktGetSameMultisigsResponseType = [
  {
    balance: 0,
    address: mockContractAddress(0).pkh,
    storage: { threshold: "2", pending_ops: 0, signers: [mockImplicitAddress(0).pkh] },
  },
  {
    balance: 10,
    address: mockContractAddress(10).pkh,
    storage: { threshold: "2", pending_ops: 0, signers: [mockImplicitAddress(10).pkh] },
  },
];

export const mockBalancePlayload: TokenBalancePayload = {
  pkh: "baz",
  tokens: [
    {
      balance: "1",
      token: {
        contract: { address: "mockContract" },
        standard: "fa2",
        tokenId: "0",
        metadata: {
          decimals: "2",
          symbol: "mockSymbol",
        },
      },
    },
  ],
};

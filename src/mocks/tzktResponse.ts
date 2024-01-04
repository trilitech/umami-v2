import { mockContractAddress, mockImplicitAddress } from "./factories";
import { RawTokenBalance } from "../types/TokenBalance";
import { RawTzktGetSameMultisigs } from "../utils/tzkt/types";

export const fa1Token: RawTokenBalance = {
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

export const fa2Token: RawTokenBalance = {
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

export const nft: RawTokenBalance = {
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

export const tzktGetSameMultisigsResponse: RawTzktGetSameMultisigs = [
  {
    address: mockContractAddress(0).pkh,
    storage: { threshold: "2", pending_ops: 0, signers: [mockImplicitAddress(0).pkh] },
  },
  {
    address: mockContractAddress(2).pkh,
    storage: { threshold: "2", pending_ops: 1, signers: [mockImplicitAddress(2).pkh] },
  },
];

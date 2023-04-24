import { DelegationOperation } from "@tzkt/sdk-api";
import { TransactionValues } from "../components/sendForm/types";
import { Account, AccountType } from "../types/Account";
import { NFT } from "../types/Asset";
import { Baker } from "../types/Baker";
import { TezTransfer, TokenTransfer } from "../types/Operation";
import { Token } from "../types/Token";
import { getDerivationPath } from "../utils/restoreAccounts";

export const mockTezTransaction = (id: number) => {
  return {
    sender: { address: `mockSender${id}` },
    target: { address: `mockTarget${id}` },
  } as TezTransfer;
};

export const mockDelegation = (
  id: number,
  initalAmount: number,
  delegateAddress: string,
  delegateAlias: string,
  date = new Date()
) => {
  return {
    type: "delegation",
    id: id,
    level: 3278793,
    timestamp: date.toISOString(),
    block: "BMGrLsKz89GdctsFamoGErgKfBjt2P9aoroCQFmzqbDBbwwfKQZ",
    hash: "oo6eXUdtvpRsFDsNR9YE7zngbeCU89FsZfxQHNzMmiaNJHniF67",
    counter: 13186782,
    sender: { address: mockPkh(id) },
    gasLimit: 1100,
    gasUsed: 1000,
    storageLimit: 0,
    bakerFee: 396,
    amount: initalAmount,
    prevDelegate: {
      alias: "Pool of Stake",
      address: "tz1gjwq9ybKEmqQrTmzCoVB3HESYV1Ekc5up",
    },
    newDelegate: {
      alias: delegateAlias,
      address: delegateAddress,
    },
    status: "applied",
  } as DelegationOperation;
};

export const mockTokenTransaction = (id: number) => {
  return {
    from: { address: `mockSender${id}` },
    to: { address: `mockTarget${id}` },
  } as TokenTransfer;
};

const validMockPkhs = [
  "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h",
  "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf",
  "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
  "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
  "tz1i9imTXjMAW5HP5g3wq55Pcr43tDz8c3VZ",
  "tz1PB7jN9GnNppn8hEbrherUAt4n3bv3wgNn",
  "tz1cuj9Cgi19KMRi83UuypS89kXM435qdhmy",
  "tz1Kt4P8BCaP93AEV4eA7gmpRryWt5hznjCP",
  "tz1cX93Q3KsiTADpCC4f12TBvAmS5tw7CW19",
  "tz1NEKxGEHsFufk87CVZcrqWu8o22qh46GK6",
];

export const mockPkh = (index: number) => {
  if (index >= validMockPkhs.length) {
    throw Error("index out of bound");
  }
  return validMockPkhs[index];
};

export const mockAccountLabel = (index: number) => `Account ${index}`;

export const mockPk = (index: number) =>
  `edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6H${index}`;

export const mockAccount = (
  index: number,
  type = AccountType.MNEMONIC,
  fingerPrint = "mockPrint"
): Account => {
  if (type === AccountType.MNEMONIC) {
    return {
      curve: "ed25519",
      derivationPath: getDerivationPath(0),
      type,
      label: mockAccountLabel(index),
      pkh: mockPkh(index),
      pk: mockPk(index),
      seedFingerPrint: `${fingerPrint}`,
    };
  }

  if (type === AccountType.SOCIAL) {
    return {
      type: AccountType.SOCIAL,
      label: "google " + mockAccountLabel(index),
      pkh: mockPkh(index),
      pk: mockPk(index),
      idp: "google",
    };
  }

  if (type === AccountType.LEDGER) {
    return {
      curve: "ed25519",
      derivationPath: getDerivationPath(0),
      type,
      label: mockAccountLabel(index) + " ledger",
      pkh: mockPkh(index),
      pk: mockPk(index),
    };
  }

  const error: never = type;
  throw new Error(error);
};

const mockContract = (index: number) =>
  `KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob${index}`;

export const mockNFTToken = (
  index: number,
  pkh: string,
  balance = 1
): Token => {
  return {
    id: index,
    account: {
      address: pkh,
    },
    token: {
      id: index,
      contract: {
        address: mockContract(index),
      },
      tokenId: String(index),
      standard: "fa2",
      totalSupply: "1",
      metadata: {
        name: "Tezzardz #10",
        creators: ["George Goodwin (@omgidrawedit)"],
        decimals: "0",
        royalties: {
          shares: {
            tz1LLPWMyZ7gKsp3WnLfemyAYW6CoZoozku5: "5",
          },
          decimals: "2",
        },
        description:
          "Tezzardz is a collection of 4,200 programmatically, randomly generated, snazzy little fukrs on the Tezos blockchain.",
        displayUri: `ipfs://zb2rhXWQ9X95yxQwusNjftDSWVQYbGjFFFFBjJKQZ8uCrNcvV${index}`,
      },
    },
    balance: String(balance),
  };
};

export const mockFA2Token = (
  index: number,
  pkh: string,
  balance = 1,
  decimals = 4,
  symbol = "KL2",
  name = "Klondike2"
): Token => {
  return {
    id: 10898270846977,
    account: {
      address: pkh,
    },
    token: {
      id: 10898194300929,
      contract: {
        address: mockContract(index),
      },
      tokenId: String(index),
      standard: "fa2",
      totalSupply: "13000000000",
      metadata: {
        name,
        symbol,
        decimals: String(decimals),
      },
    },
    balance: String(balance),
    transfersCount: 27,
    firstLevel: 288245,
    firstTime: "2022-03-24T15:36:50Z",
    lastLevel: 2247548,
    lastTime: "2023-03-31T11:19:01Z",
  };
};

export const mockFA1Token = (
  index: number,
  pkh: string,
  balance = 1
): Token => {
  return {
    id: 10897662672897,
    account: {
      address: pkh,
    },
    token: {
      id: 10897625972737,
      contract: {
        address: mockContract(index),
      },
      tokenId: "0",
      standard: "fa1.2",
      totalSupply: "13000000",
    },
    balance: String(balance),
    transfersCount: 28,
    firstLevel: 288229,
    firstTime: "2022-03-24T15:32:10Z",
    lastLevel: 2215201,
    lastTime: "2023-03-27T13:30:37Z",
  };
};

export const mockNFT = (index: number, balance = "1"): NFT => {
  return {
    type: "nft",
    owner: mockPkh(index),
    balance,
    contract: mockContract(index),
    metadata: {
      displayUri:
        "https://ipfs.io/ipfs/zdj7Wk92xWxpzGqT6sE4cx7umUyWaX2Ck8MrSEmPAR31sNWG" +
        index,
      name: "Tezzardz #" + index,
      symbol: "FKR" + index,
    },
    tokenId: "mockId" + index,
  };
};

export const mockBaker = (index: number) =>
  ({
    name: `label${index}`,
    logo: `label${index}`,
    address: mockPkh(index),
  } as Baker);

export const mockTezTransfer = (index: number): TransactionValues => {
  return {
    type: "tez",
    values: {
      amount: index,
      sender: mockPkh(index),
      recipient: mockPkh(index + 1),
    },
  };
};

export const mockNftTransfer = (index: number): TransactionValues => {
  return {
    type: "nft",
    data: {} as NFT,
    values: {
      amount: index,
      sender: mockPkh(index),
      recipient: mockPkh(index + 1),
    },
  };
};

export const mockDelegationTransfer = (index: number): TransactionValues => {
  return {
    type: "delegation",
    values: {
      sender: mockPkh(index),
      recipient: mockPkh(index + 1),
    },
  };
};

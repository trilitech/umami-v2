import { DelegationOperation } from "@tzkt/sdk-api";
import {
  ImplicitAccount,
  AccountType,
  LedgerAccount,
  SocialAccount,
  MultisigAccount,
  Account,
  MnemonicAccount,
} from "../types/Account";
import { ContractAddress, ImplicitAddress } from "../types/Address";
import { FA12TokenBalance, FA2TokenBalance, NFTBalance, fromRaw } from "../types/TokenBalance";
import { Contact } from "../types/Contact";
import { TezTransfer as TzktTezTransfer, TokenTransfer } from "../types/Transfer";
import { RawTokenBalance } from "../types/TokenBalance";
import { MultisigOperation, Multisig } from "../utils/multisig/types";
import {
  Delegation,
  FA12Transfer,
  FA2Transfer,
  TezTransfer,
  Undelegation,
} from "../types/Operation";
import { getDefaultDerivationPath } from "../utils/account/derivationPathUtils";
import { Delegate } from "../types/Delegate";

// TODO: separate TZKT factories from internal ones
export const mockTezTransaction = (id: number) => {
  return {
    sender: { address: `mockSender${id}` },
    target: { address: `mockTarget${id}` },
  } as TzktTezTransfer;
};

export const mockDelegation = (
  id: number,
  initialAmount: number,
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
    sender: { address: mockImplicitAddress(id).pkh },
    gasLimit: 1100,
    gasUsed: 1000,
    storageLimit: 0,
    bakerFee: 396,
    amount: initialAmount,
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
    transactionId: 100 + id,
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
  "tz1W2hEsS1mj7dHPZ6267eeM4HDWJoG3s13n",
];

export const mockImplicitAddress = (index: number): ImplicitAddress => {
  if (index >= validMockPkhs.length) {
    throw Error("index out of bound");
  }
  return { type: "implicit", pkh: validMockPkhs[index] };
};

export const mockAccountLabel = (index: number) => `Account ${index}`;

export const mockPk = (index: number) =>
  `edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6H${index}`;

export const mockImplicitAccount = (
  index: number,
  type = AccountType.MNEMONIC,
  fingerPrint = "mockPrint"
): ImplicitAccount => {
  if (type === AccountType.MNEMONIC) {
    return mockMnemonicAccount(index, fingerPrint) as ImplicitAccount;
  }

  if (type === AccountType.SOCIAL) {
    return mockSocialAccount(index) as ImplicitAccount;
  }

  if (type === AccountType.LEDGER) {
    return mockLedgerAccount(index) as ImplicitAccount;
  }

  throw new Error("Can't mock mulitisig accounts yet!");
};

export const mockMnemonicAccount = (index: number, fingerPrint = "mockPrint"): MnemonicAccount => {
  const account = {
    curve: "ed25519",
    derivationPath: getDefaultDerivationPath(index),
    derivationPathPattern: "44'/1729'/?'/0'",
    type: AccountType.MNEMONIC,
    label: mockAccountLabel(index),
    address: mockImplicitAddress(index),
    pk: mockPk(index),
    seedFingerPrint: `${fingerPrint}`,
  };
  return account as MnemonicAccount;
};

export const mockSocialAccount = (index: number) => {
  const account: SocialAccount = {
    type: AccountType.SOCIAL,
    label: "google " + mockAccountLabel(index),
    address: mockImplicitAddress(index),
    pk: mockPk(index),
    idp: "google",
  };
  return account;
};

export const mockLedgerAccount = (index: number) => {
  const account: LedgerAccount = {
    type: AccountType.LEDGER,
    derivationPath: getDefaultDerivationPath(index),
    curve: "ed25519",
    label: mockAccountLabel(index) + " ledger",
    address: mockImplicitAddress(index),
    pk: mockPk(index),
  };
  return account;
};

export const mockMultisigAccount = (index: number): MultisigAccount => {
  return {
    type: AccountType.MULTISIG,
    address: mockContractAddress(index),
    label: "label",
    threshold: 1,
    signers: [mockImplicitAddress(index)],
    pendingOperationsBigmapId: index,
  };
};

export const mockMultisigWithOperations = (
  index: number,
  operations: MultisigOperation[] = [],
  signers: string[] = [],
  balance = "0",
  threshold = 3
): Multisig => {
  return {
    address: mockContractAddress(index),
    pendingOperationsBigmapId: index,
    signers: signers.map(pkh => ({ type: "implicit", pkh } as const)),
    threshold,
  };
};

const validContractAddresses = [
  "KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG",
  "KT1CSKPf2jeLpMmrgKquN2bCjBTkAcAdRVDy",
  "KT1EctCuorV2NfVb1XTQgvzJ88MQtWP8cMMv",
  "KT1Ex8LrDbCrZuTgmWin8eEo7HFw74jAqTvz",
];

export const mockContractAddress = (index: number): ContractAddress => ({
  type: "contract",
  pkh: validContractAddresses[index],
});

export const mockNFTToken = (index: number, pkh: string, balance = 1): RawTokenBalance => {
  return {
    id: index,
    account: {
      address: pkh,
    },
    token: {
      id: index,
      contract: {
        address: mockContractAddress(index).pkh,
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
  account: Account,
  balance = 1,
  decimals = 4,
  symbol = "KL2",
  name = "Klondike2"
): FA2TokenBalance =>
  fromRaw(
    mockFA2TokenRaw(index, account.address.pkh, balance, decimals, symbol, name)
  ) as FA2TokenBalance;

export const mockFA12Token = (index: number, account: Account, balance = 1): FA12TokenBalance =>
  fromRaw(mockFA1TokenRaw(index, account.address.pkh, balance)) as FA12TokenBalance;

export const mockFA2TokenRaw = (
  index: number,
  pkh: string,
  balance = 1,
  decimals = 4,
  symbol = "KL2",
  name = "Klondike2"
): RawTokenBalance => {
  return {
    id: 10898270846977,
    account: {
      address: pkh,
    },
    token: {
      id: 10898194300929,
      contract: {
        address: mockContractAddress(index).pkh,
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

export const mockFA1TokenRaw = (index: number, pkh: string, balance = 1): RawTokenBalance => {
  return {
    id: 10897662672897,
    account: {
      address: pkh,
    },
    token: {
      id: 10897625972737,
      contract: {
        address: mockContractAddress(index).pkh,
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

export const mockNFT = (index: number, balance = "1"): NFTBalance => {
  const displayUri = "ipfs://zdj7Wk92xWxpzGqT6sE4cx7umUyWaX2Ck8MrSEmPAR31sNWG" + index;
  return {
    id: 1,
    type: "nft",
    balance,
    displayUri,
    contract: mockContractAddress(index).pkh,
    tokenId: "mockId" + index,
    totalSupply: "1",
    metadata: {
      displayUri: displayUri,
      name: "Tezzardz #" + index,
      symbol: "FKR" + index,
    },
  };
};

export const mockBaker = (index: number): Delegate => ({
  name: `label${index}`,
  address: mockImplicitAddress(index).pkh,
  stakingBalance: 100000 + index,
});

export const mockTezOperation = (index: number): TezTransfer => ({
  type: "tez",
  amount: String(index),
  recipient: mockImplicitAddress(index + 1),
});

export const mockFA12Operation = (index: number): FA12Transfer => ({
  type: "fa1.2",
  amount: String(index),
  sender: mockImplicitAddress(index),
  recipient: mockImplicitAddress(index + 1),
  contract: mockContractAddress(index),
  tokenId: "0",
});

export const mockNftOperation = (index: number): FA2Transfer => ({
  type: "fa2",
  amount: String(index),
  sender: mockImplicitAddress(index),
  recipient: mockImplicitAddress(index + 1),
  contract: mockContractAddress(index),
  tokenId: String(index),
});

export const mockFA2Operation = mockNftOperation;

export const mockDelegationOperation = (index: number): Delegation => {
  return {
    type: "delegation",
    sender: mockImplicitAddress(index),
    recipient: mockImplicitAddress(index + 1),
  };
};

export const mockUndelegationOperation = (index: number): Undelegation => {
  return {
    type: "undelegation",
    sender: mockImplicitAddress(index),
  };
};

export const mockContact = (index: number): Contact => {
  return {
    name: `Contact ${index}`,
    pkh: mockImplicitAddress(index).pkh,
  };
};

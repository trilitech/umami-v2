import { type MichelsonV1Expression } from "@taquito/rpc";
import { type DelegationOperation } from "@tzkt/sdk-api";
import { type IDP } from "@umami/social-auth";
import {
  type ImplicitAddress,
  type RawPkh,
  defaultDerivationPathTemplate,
  getDefaultDerivationPath,
  mockContractAddress,
  mockImplicitAddress,
  mockPk,
} from "@umami/tezos";
import {
  type RawTzktAccount,
  type RawTzktTokenBalance,
  type RawTzktTokenTransfer,
} from "@umami/tzkt";

import {
  type Account,
  type ImplicitAccount,
  type LedgerAccount,
  type MnemonicAccount,
  type MultisigAccount,
  type SecretKeyAccount,
  type SocialAccount,
} from "./Account";
import { type StoredContactInfo } from "./Contact";
import { type Delegate } from "./Delegate";
import {
  type ContractOrigination,
  type Delegation,
  type FA12Transfer,
  type FA2Transfer,
  type TezTransfer,
  type Undelegation,
} from "./Operation";
import {
  type FA12TokenBalance,
  type FA2TokenBalance,
  type NFTBalance,
  fromRawTokenBalance,
} from "./TokenBalance";

export const mockDelegation = (
  id: number,
  initialAmount: number,
  delegateAddress: string,
  delegateAlias: string,
  date = new Date()
) =>
  ({
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
  }) as DelegationOperation;

export const mockTokenTransaction = (id: number) =>
  ({
    from: { address: `mockSender${id}` },
    to: { address: `mockTarget${id}` },
    transactionId: 100 + id,
  }) as RawTzktTokenTransfer;

/**
 * Generates default account label for a given account type & index.
 *
 * Generated account name matches the pattern for default account labels.
 * Default account labels are applied when no user label was set.
 *
 * @returns A string with the generated account label.
 */
export const mockAccountLabel = (accountIndex: number): string =>
  accountIndex === 0 ? "Account" : `Account ${accountIndex + 1}`;

export const mockImplicitAccount = (
  index: number,
  type: ImplicitAccount["type"] = "mnemonic",
  fingerPrint = "mockPrint",
  label?: string
): ImplicitAccount => {
  switch (type) {
    case "mnemonic":
      return {
        ...mockMnemonicAccount(index, label),
        seedFingerPrint: fingerPrint,
      };
    case "social":
      return mockSocialAccount(index, label);
    case "ledger":
      return mockLedgerAccount(index, label);
    case "secret_key":
      return mockSecretKeyAccount(index, label);
  }
};

export const mockMnemonicAccount = (index: number, label?: string): MnemonicAccount => ({
  curve: "ed25519",
  derivationPath: getDefaultDerivationPath(index),
  derivationPathTemplate: "44'/1729'/?'/0'",
  type: "mnemonic",
  label: label || mockAccountLabel(index),
  address: mockImplicitAddress(index),
  pk: mockPk(index),
  seedFingerPrint: "mockPrint",
});

export const mockSecretKeyAccount = (index: number, label?: string): SecretKeyAccount => ({
  type: "secret_key",
  curve: "ed25519",
  label: label || mockAccountLabel(index),
  address: mockImplicitAddress(index),
  pk: mockPk(index),
});

export const mockSocialAccount = (index: number, label?: string, idp?: IDP): SocialAccount => ({
  type: "social",
  label: label || mockAccountLabel(index),
  address: mockImplicitAddress(index),
  pk: mockPk(index),
  idp: idp || "google",
});

export const mockLedgerAccount = (index: number, label?: string): LedgerAccount => {
  const account: LedgerAccount = {
    type: "ledger",
    derivationPathTemplate: defaultDerivationPathTemplate,
    derivationPath: getDefaultDerivationPath(index),
    curve: "ed25519",
    label: label || mockAccountLabel(index),
    address: mockImplicitAddress(index),
    pk: mockPk(index),
  };
  return account;
};

/**
 * Use {@link utils/redux/thunks/renameAccount#renameAccount} to set a label for a multisig account.
 */
export const mockMultisigAccount = (
  index: number,
  signers?: ImplicitAddress[]
): MultisigAccount => ({
  type: "multisig" as const,
  address: mockContractAddress(index),
  label: `Multisig Account ${index}`,
  threshold: 1,
  signers: signers || [mockImplicitAddress(index)],
  pendingOperationsBigmapId: index,
});

export const mockNFTToken = (
  index: number,
  ownerPkh: string,
  balance = 1
): RawTzktTokenBalance => ({
  id: index,
  account: {
    address: ownerPkh,
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
});

export const mockFA2Token = (
  index: number,
  account: Account,
  balance = 1,
  decimals = 4,
  symbol = "KL2",
  name = "Klondike2"
): FA2TokenBalance =>
  fromRawTokenBalance(
    mockFA2TokenRaw(index, account.address.pkh, balance, decimals, symbol, name)
  ) as FA2TokenBalance;

export const mockFA12Token = (index: number, account: Account, balance = 1): FA12TokenBalance =>
  fromRawTokenBalance(mockFA1TokenRaw(index, account.address.pkh, balance)) as FA12TokenBalance;

export const mockFA2TokenRaw = (
  index: number,
  owner: RawPkh,
  balance = 1,
  decimals = 4,
  symbol = "KL2",
  name = "Klondike2"
): RawTzktTokenBalance => ({
  id: 10898270846977,
  account: {
    address: owner,
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
});

export const mockFA1TokenRaw = (
  index: number,
  owner: RawPkh,
  balance = 1
): RawTzktTokenBalance => ({
  id: 10897662672897,
  account: {
    address: owner,
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
});

export const mockNFTRaw = (
  index: number,
  owner: RawPkh,
  balance = 1,
  symbol = "KL2",
  name = "Klondike2"
): RawTzktTokenBalance => {
  const tokenBalance = mockFA2TokenRaw(index, owner, balance, 0, symbol, name);
  tokenBalance.token.metadata.displayUri = mockDisplayURI(index);
  return tokenBalance;
};

const mockDisplayURI = (index: number) =>
  `ipfs://zdj7Wk92xWxpzGqT6sE4cx7umUyWaX2Ck8MrSEmPAR31sNWG${index}`;

export const mockNFT = (index: number, balance = "1"): NFTBalance => {
  const displayUri = mockDisplayURI(index);
  return {
    id: 1,
    type: "nft",
    balance,
    displayUri,
    contract: mockContractAddress(index).pkh,
    tokenId: "mockId" + index,
    totalSupply: "1",
    metadata: {
      displayUri,
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

export const mockDelegationOperation = (index: number): Delegation => ({
  type: "delegation",
  sender: mockImplicitAddress(index),
  recipient: mockImplicitAddress(index + 1),
});

export const mockUndelegationOperation = (index: number): Undelegation => ({
  type: "undelegation",
  sender: mockImplicitAddress(index),
});

export const mockContractOrigination = (
  index: number,
  storage = {},
  code: MichelsonV1Expression[] = []
): ContractOrigination => ({
  type: "contract_origination",
  storage: storage,
  code: code,
  sender: mockImplicitAddress(index),
});

export const mockImplicitContact = (index: number, label?: string): StoredContactInfo => ({
  name: label || `Contact ${index}`,
  pkh: mockImplicitAddress(index).pkh,
  network: undefined,
});

export const mockContractContact = (
  index: number,
  network: string,
  label?: string
): StoredContactInfo => ({
  name: label || `Contact ${index}`,
  pkh: mockContractAddress(index).pkh,
  network,
});

export const rawAccountFixture = (props?: Partial<RawTzktAccount>): RawTzktAccount => ({
  address: mockImplicitAddress(0).pkh,
  balance: 1000000,
  delegate: { alias: "mega_baker", address: mockImplicitAddress(1).pkh },
  stakedBalance: 0,
  unstakedBalance: 0,
  rollupBonds: 0,
  smartRollupBonds: 0,
  ...props,
});

import {
  type Alias,
  type TransactionOperation as RawTransactionOperation,
  type TokenBalance,
  type TokenInfo,
} from "@tzkt/sdk-api";
import { type RawPkh } from "@umami/tezos";

export type TzktAlias = Omit<Alias, "address"> & { address: RawPkh };

export type RawTzktAccountType =
  | "user"
  | "delegate"
  | "contract"
  | "ghost"
  | "rollup"
  | "smart_rollup"
  | "empty";

export type RawTzktBlock = {
  level: number;
  cycle: number;
};

export type RawTzktUnstakeRequest = {
  cycle: number;
  amount: number;
  status: "pending" | "finalizable" | "finalized";
  staker: TzktAlias;
};

export type RawTzktTokenInfo = TokenInfo & {
  contract: TzktAlias;
  metadata?: RawTzktTokenMetadata;
  tokenId: string;
};

export type RawTzktTokenBalance = Omit<TokenBalance, "account" | "token"> & {
  account: TzktAlias;
  token: RawTzktTokenInfo;
};

export type RawTzktTokenTransfer = {
  id: number;
  amount: string;
  token: RawTzktTokenInfo;
  to?: TzktAlias | null;
  from?: TzktAlias | null;
  level: number;
  migrationId?: number;
  originationId?: number;
  transactionId?: number;
  initiator?: undefined;
  timestamp: string;
};

export type RawTzktTezTransfer = RawTransactionOperation;

// TzKT defines metadata as any, but we need to have at least some clarity of what can be inside
export type RawTzktTokenMetadata = {
  name?: string;
  symbol?: string;
  decimals?: string;
  description?: string;
  artifactUri?: string;
  displayUri?: string;
  thumbnailUri?: string;
  icon?: string;
  externalUri?: string;
  isBooleanAmount?: boolean;
  shouldPreferSymbol?: boolean;
  isTransferable?: boolean;
  creators?: string[];
  tags?: string[];
  rights?: string;
  royalties?: {
    shares: {
      [prop: string]: string;
    };
    decimals: string;
  };
  attributes?: Array<{
    name: string;
    value: string;
  }>;
  date?: string;
  type?: string;
  rarity?: string;
  language?: string;
  formats?: Array<{
    uri?: string;
    fileName?: string;
    fileSize?: string;
    mimeType?: string;
  }>;
};

// TzKT defines type Account = {type: string};
// whilst accountsGet returns all the info about accounts
export type TzktAccount = {
  address: RawPkh;
  balance: number; // this is an actual spendable balance
  stakedBalance: number;
  delegate: TzktAlias | null;
};

export type RawTzktAccount = {
  address: RawPkh;
  balance: number;
  stakedBalance: number;
  unstakedBalance: number;
  rollupBonds: number;
  smartRollupBonds: number;
  delegate: TzktAlias | null;
};

export type TzktUnstakeRequest = {
  cycle: number;
  actualAmount: number;
  status: "pending" | "finalizable";
  staker: TzktAlias;
};

type CommonOperationFields = {
  id: number;
  level: number;
  hash: string;
  counter: number;
  status: "applied" | "failed" | "backtracked" | "skipped";
  sender: TzktAlias;
  timestamp: string;
  bakerFee?: number;
  storageFee?: number;
  allocationFee?: number;
};

export type DelegationOperation = CommonOperationFields & {
  type: "delegation";
  newDelegate?: TzktAlias | null;
  initiator?: TzktAlias | null;
  timestamp: string;
  amount: number;
};

export type TransactionOperation = CommonOperationFields & {
  type: "transaction";
  target?: TzktAlias | null;
  amount: number;
  parameter?: { entrypoint: string; value?: any };
};

export type OriginationOperation = CommonOperationFields & {
  type: "origination";
  originatedContract?: {
    address: RawPkh;
    codeHash: number;
    typeHash: number;
  };
};

export type TokenTransferOperation = RawTzktTokenTransfer & {
  type: "token_transfer";
};

export type StakeOperation = CommonOperationFields & {
  type: "stake";
  amount: number;
  baker: TzktAlias;
};

export type UnstakeOperation = CommonOperationFields & {
  type: "unstake";
  amount: number;
  baker: TzktAlias;
};

export type FinalizeUnstakeOperation = CommonOperationFields & {
  type: "finalize";
  amount: number;
};

export type StakingOperation = StakeOperation | UnstakeOperation | FinalizeUnstakeOperation;

export type RawTzktStakingOperation = Omit<StakingOperation, "type"> & {
  type: "staking";
  action: "stake" | "unstake" | "finalize";
};

export type TzktCombinedOperation =
  | DelegationOperation
  | TransactionOperation
  | OriginationOperation
  | TokenTransferOperation
  | StakeOperation
  | UnstakeOperation
  | FinalizeUnstakeOperation;

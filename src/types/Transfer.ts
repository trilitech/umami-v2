import * as tzktApi from "@tzkt/sdk-api";
import { Address, TzktAlias } from "./Address";
import { RawTokenInfo } from "./Token";

export type TokenTransfer = tzktApi.TokenTransfer & {
  id: number;
  level: number;
  amount: string;
  token: RawTokenInfo;
  to: TzktAlias;
  from?: TzktAlias;
  transactionId: number;
};

// TODO: remove!
export type TezTransfer = tzktApi.TransactionOperation;

// OperationDisplay is nicely formated for display in tables
export type OperationDisplay = {
  id: number;
  type: "transaction" | "delegation";
  amount: {
    prettyDisplay: string;
    url?: string;
    id?: number;
  };
  fee?: string;
  sender: Address;
  recipient: Address;
  status?: string;
  prettyTimestamp: string;
  timestamp: string;
  tzktUrl?: string;
  level: number;
};

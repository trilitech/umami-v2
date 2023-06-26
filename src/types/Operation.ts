import * as tzktApi from "@tzkt/sdk-api";
import { Address } from "./Address";
import { tokenInfo } from "./Token";

export type TokenTransfer = Omit<tzktApi.TokenTransfer, "token"> & {
  token?: null | tokenInfo;
};

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

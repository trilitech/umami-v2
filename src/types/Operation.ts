import * as tzktApi from "@tzkt/sdk-api";
import { tokenInfo } from "./Token";

import { IAirGapTransaction } from "@airgap/coinlib-core/interfaces/IAirGapTransaction";

export type Operation = Omit<IAirGapTransaction, "protocolIdentifier" | "network">[];

export type TokenTransfer = Omit<tzktApi.TokenTransfer, "token"> & {
  token?: null | tokenInfo;
};

export type TezTransfer = tzktApi.TransactionOperation;

// OperationDisplay is nicely formated for display in tables
export type OperationDisplay = {
  type?: string;
  amount: {
    prettyDisplay: string;
    url?: string;
    id?: number;
  };
  fee?: string;
  sender: string;
  recipient: string;
  status?: string;
  prettyTimestamp: string;
  timestamp: string;
  tzktUrl?: string;
  level: number;
};

import * as tzktApi from "@tzkt/sdk-api";

import { TzktAlias } from "./Address";
import { RawTokenInfo } from "./Token";

export type TokenTransfer = tzktApi.TokenTransfer & {
  id: number;
  amount: string;
  token: RawTokenInfo;
  to?: TzktAlias;
  level: number;
  migrationId?: number;
  originationId?: number;
  transactionId?: number;
};

export type TezTransfer = tzktApi.TransactionOperation;

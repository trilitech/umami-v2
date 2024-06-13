import * as tzktApi from "@tzkt/sdk-api";

import { TzktAlias } from "./Address";
import { RawTokenInfo } from "./Token";

export type TokenTransfer = {
  id: number;
  amount: string;
  token: RawTokenInfo;
  to?: TzktAlias | null;
  from?: TzktAlias | null;
  level: number;
  migrationId?: number;
  originationId?: number;
  transactionId?: number;
  initiator?: undefined;
  timestamp: string;
};

export type TezTransfer = tzktApi.TransactionOperation;

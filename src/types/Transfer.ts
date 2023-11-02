import * as tzktApi from "@tzkt/sdk-api";
import { TzktAlias } from "./Address";
import { RawTokenInfo } from "./Token";

export type TokenTransfer = tzktApi.TokenTransfer & {
  amount: string;
  token: RawTokenInfo;
  to: TzktAlias;
  transactionId: number;
};

export type TezTransfer = tzktApi.TransactionOperation;

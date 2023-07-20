import { Curves } from "@taquito/signer";
import { TezosNetwork } from "./TezosNetwork";

export enum SignerType {
  SK = "sk",
  LEDGER = "ledger",
}

type BaseSignerConfig = {
  type: SignerType;
  network: TezosNetwork;
};

export type SkSignerConfig = BaseSignerConfig & {
  type: SignerType.SK;
  sk: string;
};

export type LedgerSignerConfig = BaseSignerConfig & {
  type: SignerType.LEDGER;
  derivationPath: string;
  derivationType: Curves;
};

export type SignerConfig = SkSignerConfig | LedgerSignerConfig;

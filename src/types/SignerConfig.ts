import { ImplicitAccount, LedgerAccount } from "./Account";
import { TezosNetwork } from "./Network";

export type SignerConfig = { network: TezosNetwork } & (
  | { type: "ledger"; account: LedgerAccount }
  | { type: "mnemonic"; secretKey: string }
  | { type: "social"; secretKey: string }
  | { type: "fake"; signer: ImplicitAccount }
);

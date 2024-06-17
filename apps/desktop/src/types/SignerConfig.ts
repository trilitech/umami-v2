import { type ImplicitAccount, type LedgerAccount } from "./Account";
import { type Network } from "./Network";

export type SignerConfig = { network: Network } & (
  | { type: "ledger"; account: LedgerAccount }
  | { type: "mnemonic"; secretKey: string }
  | { type: "secret_key"; secretKey: string }
  | { type: "social"; secretKey: string }
  | { type: "fake"; signer: ImplicitAccount }
);

import { ImplicitAccount, LedgerAccount } from "./Account";
import { Network } from "./Network";

export type SignerConfig = { network: Network } & (
  | { type: "ledger"; account: LedgerAccount }
  | { type: "mnemonic"; secretKey: string }
  | { type: "secret_key"; secretKey: string }
  | { type: "social"; secretKey: string }
  | { type: "fake"; signer: ImplicitAccount }
);

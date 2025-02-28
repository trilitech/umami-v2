import { type Curves } from "@taquito/signer";

export type FormFields = {
  password: string;
  passwordConfirmation: string;
  derivationPath: string;
  curve: Exclude<Curves, "bip25519">;
};

export type Mode = "mnemonic" | "secret_key" | "new_mnemonic" | "verification" | "add_account";

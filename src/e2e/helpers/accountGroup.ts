import { InMemorySigner } from "@taquito/signer";

import { RawPkh } from "../../types/Address";
import { makeDerivationPath } from "../../utils/account/derivationPathUtils";
import { derivePublicKeyPair } from "../../utils/mnemonic";
import { getFingerPrint } from "../../utils/tezos";

type AccountGroup = {
  type: "mnemonic" | "secret_key";
  groupTitle: string;
  accounts: Account[];
};

type Account = {
  name: string;
  pkh: RawPkh;
};

/**
 * Helper class for building account groups. It contains data displayed on accounts page.
 *
 * The builder uniforms the process of creating account groups among different types.
 * Using a method unsuitable for chosen account group type will cause an exception to be thrown.
 *
 * Builder is not intended to be reused for building multiple groups.
 */
export class AccountGroupBuilder {
  private accountGroup: AccountGroup;

  private derivationPathPattern = "";
  private seedPhrase: string[] = [];

  constructor(groupType: "mnemonic" | "secret_key", accountsAmount: number) {
    this.accountGroup = {
      type: groupType,
      groupTitle: "",
      accounts: [],
    };
    switch (this.accountGroup.type) {
      case "secret_key":
        this.accountGroup.groupTitle = "Secret Key Accounts";
        break;
      case "mnemonic":
        this.accountGroup.groupTitle = "";
        break;
    }
    for (let i = 0; i < accountsAmount; i++) {
      this.accountGroup.accounts.push({ name: "", pkh: "" });
    }
  }

  setDerivationPathPattern(derivationPathPattern: string): void {
    switch (this.accountGroup.type) {
      case "secret_key":
        throw new Error("Derivation path is not used for secret key accounts");
      case "mnemonic":
        this.derivationPathPattern = derivationPathPattern;
        break;
    }
  }

  getSeedPhrase = () => this.seedPhrase;

  /**
   * TODO: REFACTOR
   *
   * Updates the group title and saves the seedphrase for creating group accounts.
   *
   * Mnemonic accounts are grouped by seed phrases.
   *
   * @param seedPhrase - Space separated words making a BIP39 seed phrase.
   */
  async setSeedPhrase(seedPhrase: string[]): Promise<void> {
    switch (this.accountGroup.type) {
      case "secret_key":
        throw new Error("Seed phrase is not used for secret key accounts");
      case "mnemonic":
        this.seedPhrase = seedPhrase;
        this.accountGroup.groupTitle = `Seedphrase ${await getFingerPrint(seedPhrase.join(" "))}`;
        break;
    }
  }

  async setSecretKey(secretKey: string, accountIndex = 0): Promise<void> {
    switch (this.accountGroup.type) {
      case "mnemonic":
        throw new Error("Secret key is not used for mnemonic accounts");
      case "secret_key":
        this.accountGroup.accounts[accountIndex].pkh = await (
          await InMemorySigner.fromSecretKey(secretKey)
        ).publicKeyHash();
        break;
    }
  }

  setAllAccountNames(accountPrefix?: string): void {
    const prefix = accountPrefix || "Account";
    for (let i = 0; i < this.accountGroup.accounts.length; i++) {
      this.accountGroup.accounts[i].name = i === 0 ? prefix : `${prefix} ${i + 1}`;
    }
  }

  async build(): Promise<AccountGroup> {
    if (this.accountGroup.type === "mnemonic") {
      if (this.seedPhrase.length === 0) {
        throw new Error("Seedphrase is not set");
      }
      if (this.derivationPathPattern === "") {
        throw new Error("Derivation path is not set");
      }
      for (let i = 0; i < this.accountGroup.accounts.length; i++) {
        const keyPair = await derivePublicKeyPair(
          this.seedPhrase.join(" "),
          makeDerivationPath(this.derivationPathPattern, i)
        );
        this.accountGroup.accounts[i].pkh = keyPair.pkh;
      }
    }

    // TODO: add checks for empty fields and throw if something is not set.

    return this.accountGroup;
  }
}

import { InMemorySigner } from "@taquito/signer";

import { RawPkh } from "../../types/Address";
import { makeDerivationPath } from "../../utils/account/derivationPathUtils";
import { derivePublicKeyPair } from "../../utils/mnemonic";
import { getFingerPrint } from "../../utils/tezos";

export type AccountGroup = {
  type: "mnemonic" | "secret_key";
  groupTitle: string;
  accounts: Account[];
};

type Account = {
  name: string;
  pkh: RawPkh;
};

/**
 * Helper class for building account groups. It contains data expected to be displayed on accounts page.
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
    if (this.accountGroup.type !== "mnemonic") {
      throw new Error(`Derivation path is not used for ${this.accountGroup.type} accounts}`);
    }
    this.derivationPathPattern = derivationPathPattern;
  }

  async setSeedPhrase(seedPhrase: string[]): Promise<void> {
    if (this.accountGroup.type !== "mnemonic") {
      throw new Error(`Seed phrase is not used for ${this.accountGroup.type} accounts}`);
    }
    this.seedPhrase = seedPhrase;
    this.accountGroup.groupTitle = `Seedphrase ${await getFingerPrint(seedPhrase.join(" "))}`;
  }

  getSeedPhrase = () => this.seedPhrase;

  async setSecretKey(secretKey: string, accountIndex = 0): Promise<void> {
    if (this.accountGroup.type !== "secret_key") {
      throw new Error(`Secret key is not used for ${this.accountGroup.type} accounts}`);
    }
    this.accountGroup.accounts[accountIndex].pkh = await (
      await InMemorySigner.fromSecretKey(secretKey)
    ).publicKeyHash();
  }

  setAllAccountNames(accountPrefix?: string): void {
    const prefix = accountPrefix || "Account";
    for (let i = 0; i < this.accountGroup.accounts.length; i++) {
      this.accountGroup.accounts[i].name = i === 0 ? prefix : `${prefix} ${i + 1}`;
    }
  }

  setAccountName(accountName: string, accountIndex = 0): void {
    this.accountGroup.accounts[accountIndex].name = accountName;
  }

  async build(): Promise<AccountGroup> {
    if (this.accountGroup.type === "mnemonic") {
      await this.setMnemonicPkhs();
    }
    return this.accountGroup;
  }

  private async setMnemonicPkhs() {
    if (this.seedPhrase.length === 0) {
      throw new Error("Seed phrase is not set");
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
}

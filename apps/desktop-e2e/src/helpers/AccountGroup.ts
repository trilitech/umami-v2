import { InMemorySigner } from "@taquito/signer";
import { type RawPkh, derivePublicKeyPair, makeDerivationPath } from "@umami/tezos";
import { CustomError } from "@umami/utils";
import lodash from "lodash";

export type AccountGroup = {
  type: "mnemonic" | "secret_key";
  label: string;
  accounts: Account[];
};

export type Account = {
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

  private derivationPathTemplate = "";
  private seedPhrase: string[] = [];

  constructor(groupType: "mnemonic" | "secret_key", accountsAmount: number) {
    this.accountGroup = {
      type: groupType,
      label: "",
      accounts: [],
    };
    if (this.accountGroup.type === "secret_key") {
      this.accountGroup.label = "Secret Key Accounts";
    }
    this.accountGroup.accounts = lodash.times(accountsAmount, () => ({ name: "", pkh: "" }));
  }

  setDerivationPathTemplate(derivationPathTemplate: string): void {
    if (this.accountGroup.type !== "mnemonic") {
      throw new CustomError(`Derivation path is not used for ${this.accountGroup.type} accounts`);
    }
    this.derivationPathTemplate = derivationPathTemplate;
  }

  setSeedPhrase(seedPhrase: string[]): void {
    if (this.accountGroup.type !== "mnemonic") {
      throw new CustomError(`Seed phrase is not used for ${this.accountGroup.type} accounts`);
    }
    this.seedPhrase = seedPhrase;
  }

  getSeedPhrase = () => this.seedPhrase;

  async setSecretKey(secretKey: string, accountIndex = 0): Promise<void> {
    if (this.accountGroup.type !== "secret_key") {
      throw new CustomError(`Secret key is not used for ${this.accountGroup.type} accounts`);
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
      throw new CustomError("Seed phrase is not set");
    }
    if (this.derivationPathTemplate === "") {
      throw new CustomError("Derivation path is not set");
    }
    for (let i = 0; i < this.accountGroup.accounts.length; i++) {
      const keyPair = await derivePublicKeyPair(
        this.seedPhrase.join(" "),
        makeDerivationPath(this.derivationPathTemplate, i),
        "ed25519"
      );
      this.accountGroup.accounts[i].pkh = keyPair.pkh;
    }
  }
}

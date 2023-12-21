import { Page } from "@playwright/test";
import { InMemorySigner } from "@taquito/signer";

import { RawPkh } from "../../types/Address";
import { derivePublicKeyPair } from "../../utils/mnemonic";
import { getFingerPrint } from "../../utils/tezos";

export abstract class AddAccountPage {
  // to be set on the account name page
  namePrefix: string = "";

  // used for ledger & mnemonic accounts only
  derivationPath: string = "";

  // used for mnemonic accounts only
  seedPhrase: string[] = [];

  // used for secret key accounts only
  secretKey: string = "";

  constructor(readonly page: Page) {}

  abstract groupTitle(): Promise<string>;
  abstract pkh(): Promise<RawPkh>;
}

export class AddMnemonicAccountPage extends AddAccountPage {
  override async pkh(): Promise<RawPkh> {
    const keyPair = await derivePublicKeyPair(
      this.seedPhrase.join(" "),
      `m/${this.derivationPath}`
    );
    return keyPair.pkh;
  }

  override async groupTitle(): Promise<string> {
    const fingerPrint = await getFingerPrint(this.seedPhrase.join(" "));
    return `Seedphrase ${fingerPrint}`;
  }
}

export class AddSecretKeyAccountPage extends AddAccountPage {
  override async pkh(): Promise<RawPkh> {
    return (await InMemorySigner.fromSecretKey(this.secretKey)).publicKeyHash();
  }

  override async groupTitle(): Promise<string> {
    return "Secret Key Accounts";
  }
}

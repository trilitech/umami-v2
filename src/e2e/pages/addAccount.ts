import { Page } from "@playwright/test";

import { RawPkh } from "../../types/Address";
import { DEFAULT_DERIVATION_PATH } from "../../utils/account/derivationPathUtils";
import { derivePublicKeyPair } from "../../utils/mnemonic";
import { getFingerPrint } from "../../utils/tezos";

export abstract class AddAccountPage {
  // to be set on the account name page
  namePrefix: string = "";

  constructor(readonly page: Page) {}

  abstract groupTitle(): Promise<string>;
  abstract pkh(): Promise<RawPkh>;
}

export class AddMnemonicAccountPage extends AddAccountPage {
  derivationPath: string = DEFAULT_DERIVATION_PATH.value;
  seedPhrase: string[] = [];

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
  secretKey: string = "";

  override async pkh(): Promise<RawPkh> {
    return "TODO" as any;
  }

  override async groupTitle(): Promise<string> {
    return "Continuous title";
  }
}

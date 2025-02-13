import { type MnemonicAccount, mockImplicitAccount } from "@umami/core";
import { type EncryptedData, decrypt, encrypt } from "@umami/crypto";
import { mnemonic1, mnemonic2 } from "@umami/test-utils";
import { generateHash } from "@umami/tezos";

import { changeMnemonicPassword } from "./changeMnemonicPassword";
import { accountsActions } from "../slices/accounts/accounts";
import { type UmamiStore, makeStore } from "../store";

const currentPassword = "currentPassword";
const newPassword = "newPassword";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

let fingerPrint1: string;
let fingerPrint2: string;

beforeAll(async () => {
  fingerPrint1 = generateHash();
  await new Promise(resolve => setTimeout(resolve, 1000)); // make sure the fingerprints are different
  fingerPrint2 = generateHash();
});

beforeEach(async () => {
  store.dispatch(
    accountsActions.addMnemonicAccounts({
      seedFingerprint: fingerPrint1,
      accounts: [
        mockImplicitAccount(0, undefined, fingerPrint1, "Mnemonic 1.1"),
        mockImplicitAccount(1, undefined, fingerPrint1, "Mnemonic 1.2"),
      ] as MnemonicAccount[],
      encryptedMnemonic: await encrypt(mnemonic1, currentPassword),
    })
  );

  store.dispatch(
    accountsActions.addMnemonicAccounts({
      seedFingerprint: fingerPrint2,
      accounts: [
        mockImplicitAccount(4, undefined, fingerPrint2, "Mnemonic 2"),
      ] as MnemonicAccount[],
      encryptedMnemonic: await encrypt(mnemonic2, currentPassword),
    })
  );
});

describe("changeMnemonicPassword", () => {
  it("should update password", async () => {
    const action = await store.dispatch<any>(
      changeMnemonicPassword({ currentPassword, newPassword })
    );
    expect(action.type).toEqual("accounts/changeMnemonicPassword/fulfilled");

    const { newEncryptedMnemonics } = action.payload;

    // For mnemonic1
    const encryptedMnemonic1 = newEncryptedMnemonics[fingerPrint1] as EncryptedData;
    const decryptedMnemonic1 = await decrypt(encryptedMnemonic1, newPassword);
    expect(decryptedMnemonic1).toEqual(mnemonic1);
    // For mnemonic2
    const encryptedMnemonic2 = newEncryptedMnemonics[fingerPrint2] as EncryptedData;
    const decryptedMnemonic2 = await decrypt(encryptedMnemonic2, newPassword);
    expect(decryptedMnemonic2).toEqual(mnemonic2);
  });

  it("should throw with old password", async () => {
    const action: {
      type: string;
      payload: { newEncryptedMnemonics: Record<string, EncryptedData | undefined> };
    } = await store.dispatch<any>(changeMnemonicPassword({ currentPassword, newPassword }));

    expect(action.type).toEqual("accounts/changeMnemonicPassword/fulfilled");
    const { newEncryptedMnemonics } = action.payload;

    // For mnemonic1
    const encryptedMnemonic1 = newEncryptedMnemonics[fingerPrint1] as EncryptedData;
    await expect(decrypt(encryptedMnemonic1, currentPassword)).rejects.toThrow(
      "Error decrypting data"
    );
    // For mnemonic2
    const encryptedMnemonic2 = newEncryptedMnemonics[fingerPrint2] as EncryptedData;
    await expect(decrypt(encryptedMnemonic2, currentPassword)).rejects.toThrow(
      "Error decrypting data"
    );
  });
});

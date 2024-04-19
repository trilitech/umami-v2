import { changeMnemonicPassword } from "./changeMnemonicPassword";
import { mockImplicitAccount } from "../../../mocks/factories";
import { mnemonic1, mnemonic2 } from "../../../mocks/mockMnemonic";
import { MnemonicAccount } from "../../../types/Account";
import { decrypt, encrypt } from "../../crypto/AES";
import { EncryptedData } from "../../crypto/types";
import { getFingerPrint } from "../../tezos";
import { accountsSlice } from "../slices/accountsSlice";
import { store } from "../store";

const currentPassword = "currentPassword";
const newPassword = "newPassword";

beforeEach(async () => {
  const fingerPrint1 = await getFingerPrint(mnemonic1);
  store.dispatch(
    accountsSlice.actions.addMnemonicAccounts({
      seedFingerprint: fingerPrint1,
      accounts: [
        mockImplicitAccount(0, undefined, fingerPrint1, "Mnemonic 1.1"),
        mockImplicitAccount(1, undefined, fingerPrint1, "Mnemonic 1.2"),
      ] as MnemonicAccount[],
      encryptedMnemonic: await encrypt(mnemonic1, currentPassword),
    })
  );

  const fingerPrint2 = await getFingerPrint(mnemonic2);
  store.dispatch(
    accountsSlice.actions.addMnemonicAccounts({
      seedFingerprint: fingerPrint2,
      accounts: [
        mockImplicitAccount(4, undefined, fingerPrint2, "Mnemonic 2"),
      ] as MnemonicAccount[],
      encryptedMnemonic: await encrypt(mnemonic2, currentPassword),
    })
  );
});

describe("changeMnemonicPassword thunk", () => {
  it("should update password", async () => {
    const fingerPrint1 = await getFingerPrint(mnemonic1);
    const fingerPrint2 = await getFingerPrint(mnemonic2);

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
    const fingerPrint1 = await getFingerPrint(mnemonic1);
    const fingerPrint2 = await getFingerPrint(mnemonic2);

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

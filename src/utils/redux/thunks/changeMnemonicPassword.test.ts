import createMockStore from "redux-mock-store";
import { makeDefaultDevSigner } from "../../../mocks/devSignerKeys";
import { mnemonic1, mnemonic2 } from "../../../mocks/mockMnemonic";
import {
  defaultDerivationPathPattern,
  makeDerivationPath,
} from "../../account/derivationPathUtils";
import { makeMnemonicAccount } from "../../account/makeMnemonicAccount";
import { getFingerPrint } from "../../tezos";
import thunk from "redux-thunk";
import { extraArgument } from "../extraArgument";
import { decrypt, encrypt } from "../../crypto/AES";
import { EncryptedData } from "../../crypto/types";
import { State } from "../slices/accountsSlice";
import { changeMnemonicPassword } from "./changeMnemonicPassword";
import { MnemonicAccount } from "../../../types/Account";

jest.unmock("../../../utils/tezos");
jest.unmock("../../../utils/redux/extraArgument");

const currentPassword = "currentPassword";
const newPassword = "newPassword";

const setupStore = async () => {
  const mockStore = createMockStore<
    { accounts: State },
    { changeMnemonicPassword: ReturnType<typeof changeMnemonicPassword> }
  >([thunk.withExtraArgument(extraArgument)]);

  const mockAccounts = await Promise.all(
    [makeDefaultDevSigner(0), makeDefaultDevSigner(1), makeDefaultDevSigner(2)].map(
      async (signer, i) => {
        const pk = await signer.publicKey();
        const pkh = await signer.publicKeyHash();
        const fingerPrint = await getFingerPrint(i % 2 === 0 ? mnemonic1 : mnemonic2);
        return makeMnemonicAccount(
          pk,
          pkh,
          makeDerivationPath(defaultDerivationPathPattern, i),
          defaultDerivationPathPattern,
          fingerPrint,
          `Account ${i}`
        );
      }
    )
  );

  return mockStore({
    accounts: {
      items: mockAccounts,
      seedPhrases: {
        [mockAccounts[0].seedFingerPrint]: await encrypt(mnemonic1, currentPassword),
        [mockAccounts[1].seedFingerPrint]: await encrypt(mnemonic2, currentPassword),
      },
      secretKeys: {},
    },
  });
};

describe("changeMnemonicPassword thunk", () => {
  it("should update password", async () => {
    const store = await setupStore();

    const { items } = store.getState().accounts;

    const action: {
      type: string;
      payload: { newEncryptedMnemonics: Record<string, EncryptedData | undefined> };
    } = await store.dispatch(changeMnemonicPassword({ currentPassword, newPassword }) as any);
    expect(action.type).toEqual("accounts/changeMnemonicPassword/fulfilled");

    const { newEncryptedMnemonics } = action.payload;
    for (let i = 0; i < items.length; i++) {
      const account = items[i] as MnemonicAccount;
      const encryptedMnemonic = newEncryptedMnemonics[account.seedFingerPrint] as EncryptedData;
      const decrypted = await decrypt(encryptedMnemonic, newPassword);
      expect(decrypted).toEqual(i % 2 === 0 ? mnemonic1 : mnemonic2);
    }
  });

  it("should throw with old password", async () => {
    const store = await setupStore();

    const { items } = store.getState().accounts;

    const action: {
      type: string;
      payload: { newEncryptedMnemonics: Record<string, EncryptedData | undefined> };
    } = await store.dispatch(changeMnemonicPassword({ currentPassword, newPassword }) as any);

    expect(action.type).toEqual("accounts/changeMnemonicPassword/fulfilled");
    const { newEncryptedMnemonics } = action.payload;

    for (let i = 0; i < items.length; i++) {
      const account = items[i] as MnemonicAccount;
      const encryptedMnemonic = newEncryptedMnemonics[account.seedFingerPrint] as EncryptedData;
      await expect(decrypt(encryptedMnemonic, currentPassword)).rejects.toThrowError(
        "Error decrypting data"
      );
    }
  });
});

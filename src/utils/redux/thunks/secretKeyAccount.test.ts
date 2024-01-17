import { remove, restore } from "./secretKeyAccount";
import { mockSecretKeyAccount } from "../../../mocks/factories";
import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { ImplicitAccount } from "../../../types/Account";
import { AVAILABLE_DERIVATION_PATHS, makeDerivationPath } from "../../account/derivationPathUtils";
import { decrypt } from "../../crypto/AES";
import { EncryptedData } from "../../crypto/types";
import { derivePublicKeyPair, deriveSecretKey } from "../../mnemonic";
import { accountsSlice } from "../slices/accountsSlice";
import { store } from "../store";

jest.unmock("../../tezos");

describe("secretKeyAccount", () => {
  describe("restore", () => {
    it("adds account and secret key to accounts slice", async () => {
      const secretKey = "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq";
      const label = "Test Account";
      const password = "12345678";

      await store.dispatch(
        restore({
          secretKey,
          label,
          password,
        })
      );

      const pkh = "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb";

      expect(store.getState().accounts.items).toEqual([
        {
          type: "secret_key",
          address: { pkh, type: "implicit" },
          label: "Test Account",
          pk: "edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn",
        },
      ]);

      const encrypted = store.getState().accounts.secretKeys[pkh] as EncryptedData;
      const decrypted = await decrypt(encrypted, password);
      expect(decrypted).toEqual(secretKey);
    });

    it("doesn't update accounts slice on adding account with existing pkh", async () => {
      const derivationPath = makeDerivationPath(AVAILABLE_DERIVATION_PATHS[2].value, 0);
      const pubKeyPair = await derivePublicKeyPair(mnemonic1, derivationPath);
      const existingMnemonic = {
        curve: "ed25519",
        derivationPath: derivationPath,
        type: "mnemonic",
        pk: pubKeyPair.pk,
        address: { type: "implicit", pkh: pubKeyPair.pkh },
        seedFingerPrint: "mockFingerPrint",
        label: "Mnemonic Acc",
        derivationPathPattern: AVAILABLE_DERIVATION_PATHS[2].value,
      } as ImplicitAccount;
      store.dispatch(accountsSlice.actions.addAccount(existingMnemonic));

      const secretKey = await deriveSecretKey(mnemonic1, derivationPath, "ed25519");
      const label = "Secret Key Acc";
      const password = "12345678";

      await expect(() =>
        store.dispatch(
          restore({
            secretKey,
            label,
            password,
          })
        )
      ).rejects.toThrow(`Can't add account ${pubKeyPair.pkh} in store since it already exists.`);

      expect(store.getState().accounts.items).toEqual([existingMnemonic]);
      expect(store.getState().accounts.secretKeys).toEqual({});
    });
  });

  describe("remove", () => {
    test("deletes relevant data from accounts slice", async () => {
      const account = mockSecretKeyAccount(0);
      store.dispatch(accountsSlice.actions.addAccount(account));
      store.dispatch(
        accountsSlice.actions.addSecretKey({
          pkh: account.address.pkh,
          encryptedSecretKey: "encryptedSecretKey" as any,
        })
      );

      await store.dispatch(remove(account));

      expect(store.getState().accounts.items).toEqual([]);
      expect(store.getState().accounts.secretKeys).toEqual({});
    });
  });
});

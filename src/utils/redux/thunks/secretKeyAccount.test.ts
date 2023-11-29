import { remove, restore } from "./secretKeyAccount";
import { mockSecretKeyAccount } from "../../../mocks/factories";
import { decrypt } from "../../crypto/AES";
import { EncryptedData } from "../../crypto/types";
import { accountsSlice } from "../slices/accountsSlice";
import { store } from "../store";

describe("secretKeyAccount", () => {
  test("restore", async () => {
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

  test("remove", async () => {
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

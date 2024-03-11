import { getCurve, restore } from "./secretKeyAccount";
import { mockMnemonicAccount } from "../../../mocks/factories";
import { decrypt } from "../../crypto/AES";
import { EncryptedData } from "../../crypto/types";
import { accountsSlice } from "../slices/accountsSlice";
import { store } from "../store";

jest.unmock("../../tezos");

describe("secretKeyAccount", () => {
  describe.each([
    {
      curve: "ed25519" as const,
      secretKey: "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq",
      publicKey: "edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn",
      pkh: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
    },
    {
      curve: "secp256k1" as const,
      secretKey: "spsk2jm29sHC99HDi64VBpSwEMZRQ7WfHdvQPVMZCkyWyR4spBrtRW",
      publicKey: "sppk7cFUHS8Awn5EMtC2ymhbuAXfY26397kErEmnjGcbD7mZZm1Cae7",
      pkh: "tz2XP1sHKe9YjpfQTt7oWcMgyxN8RkMURnHE",
    },
    {
      curve: "p256" as const,
      secretKey: "p2sk475pFLkLHURkbxYJN8tmJ52XDd27Cc5Rhj5Ujy9sEnLVEYH3zZ",
      publicKey: "p2pk66yNek9wyZaZeVZGcJsW3USvBj5c8n3exxD4kFPLV3PbCBEB29a",
      pkh: "tz3VqWhp2bQczQEYyfYnzj4XBRPqbreuqb3W",
    },
  ])("restore $curve key", ({ secretKey, curve, publicKey, pkh }) => {
    it("adds account and secret key to accounts slice", async () => {
      const label = "Test Account";
      const password = "12345678";

      await store.dispatch(
        restore({
          secretKey,
          label,
          password,
        })
      );

      expect(store.getState().accounts.items).toEqual([
        {
          type: "secret_key",
          address: { pkh, type: "implicit" },
          label: "Test Account",
          curve,
          pk: publicKey,
        },
      ]);

      const encrypted = store.getState().accounts.secretKeys[pkh] as EncryptedData;
      const decrypted = await decrypt(encrypted, password);
      expect(decrypted).toEqual(secretKey);
    });

    it("doesn't update accounts slice on adding account with existing pkh", async () => {
      const existingMnemonic = {
        ...mockMnemonicAccount(0),
        curve,
        pk: publicKey,
        address: { type: "implicit" as const, pkh },
      };
      store.dispatch(accountsSlice.actions.addAccount(existingMnemonic));

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
      ).rejects.toThrow(`Can't add account ${pkh} in store since it already exists.`);

      expect(store.getState().accounts.items).toEqual([existingMnemonic]);
      expect(store.getState().accounts.secretKeys).toEqual({});
    });
  });

  describe("getCurve", () => {
    it("returns ed25519 for edsk", () => {
      expect(
        getCurve(
          "edskRk1hRPhBCsGRDfqRBKDY5ecPKLfBhQDC4MvmWwa8i8dXUiGEyWJ7vUDjFo1k59PHfRrQKSEM9ieJNH3FbqrrDFg18ZZorh"
        )
      ).toEqual("ed25519");
      expect(
        getCurve(
          "edesk1GXwWmGjXiLHBKxGBxwmNvG21vKBh6FBxc4CyJ8adQQE2avP5vBB57ZUZ93Anm7i4k8RmsHaPzVAvpnHkFF"
        )
      ).toEqual("ed25519");
    });

    it("returns secp256k1 for spsk", () => {
      expect(getCurve("spsk24EJohZHJkZnWEzj3w9wE7BFARpFmq5WAo9oTtqjdJ2t4pyoB3")).toEqual(
        "secp256k1"
      );
      expect(
        getCurve(
          "spesk1ZJjoYUkfR2HDYgFEDRyhSkCCdPjv5P33sV1mxmPCqXZ7kTCsSuUPkgEGBBLuMGP4YoLHqBqnLj775vREpi"
        )
      ).toEqual("secp256k1");
    });

    it("returns p256 for p2sk", () => {
      expect(getCurve("p2sk2QJEAksohs8eCZJNGiptfSDuSC9LofkLPfABLfJFJyNTLDWXfs")).toEqual("p256");
      expect(
        getCurve(
          "p2esk2TFqgNcoT4u99ut5doGTUFNwo9x4nNvkpM6YMLqXrt4SbFdQnqLM3hoAXLMB2uZYazj6LZGvcoYzk16H6Et"
        )
      ).toEqual("p256");
    });

    it("throws if secret key is invalid", () => {
      expect(() => getCurve("invalid")).toThrow("Invalid secret key");
    });
  });
});

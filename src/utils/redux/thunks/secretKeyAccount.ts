import { InMemorySigner } from "@taquito/signer";

import { SecretKeyAccount } from "../../../types/Account";
import { parseImplicitPkh } from "../../../types/Address";
import { encrypt } from "../../crypto/AES";
import { accountsSlice } from "../slices/accountsSlice";
import { AppDispatch } from "../store";

export const restore =
  ({ secretKey, label, password }: { secretKey: string; label: string; password: string }) =>
  async (dispatch: AppDispatch) => {
    const signer = new InMemorySigner(secretKey);
    const publicKey = await signer.publicKey();
    const pkh = await signer.publicKeyHash();
    const encryptedSecretKey = await encrypt(secretKey, password);

    dispatch(accountsSlice.actions.addSecretKey({ pkh, encryptedSecretKey }));
    dispatch(
      accountsSlice.actions.addAccount({
        type: "secret_key",
        pk: publicKey,
        label,
        address: parseImplicitPkh(pkh),
      })
    );
  };

export const remove = (account: SecretKeyAccount) => async (dispatch: AppDispatch) => {
  dispatch(accountsSlice.actions.removeSecretKey(account));
  dispatch(accountsSlice.actions.removeAccount(account));
};

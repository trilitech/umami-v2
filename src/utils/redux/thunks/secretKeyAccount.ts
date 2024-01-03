import { SecretKeyAccount } from "../../../types/Account";
import { parseImplicitPkh } from "../../../types/Address";
import { encrypt } from "../../crypto/AES";
import { getPkAndPkhFromSk } from "../../tezos";
import { accountsSlice } from "../slices/accountsSlice";
import { AppDispatch } from "../store";

export const restore =
  ({ secretKey, label, password }: { secretKey: string; label: string; password: string }) =>
  async (dispatch: AppDispatch) => {
    const { pk, pkh } = await getPkAndPkhFromSk(secretKey);
    const encryptedSecretKey = await encrypt(secretKey, password);

    dispatch(accountsSlice.actions.addSecretKey({ pkh, encryptedSecretKey }));
    dispatch(
      accountsSlice.actions.addAccount({
        type: "secret_key",
        pk,
        label,
        address: parseImplicitPkh(pkh),
      })
    );
  };

export const remove = (account: SecretKeyAccount) => async (dispatch: AppDispatch) => {
  dispatch(accountsSlice.actions.removeSecretKey(account));
  dispatch(accountsSlice.actions.removeAccount(account));
};

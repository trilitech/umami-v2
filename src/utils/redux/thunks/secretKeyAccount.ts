import { SecretKeyAccount } from "../../../types/Account";
import { parseImplicitPkh } from "../../../types/Address";
import { encrypt } from "../../crypto/AES";
import { getPkAndPkhFromSk } from "../../tezos";
import { accountsSlice } from "../slices/accountsSlice";
import { AppDispatch } from "../store";

export const makeSecretKeyAccount = async ({
  secretKey,
  label,
  password,
}: {
  secretKey: string;
  label: string;
  password: string;
}) => {
  const { pk, pkh } = await getPkAndPkhFromSk(secretKey);
  const encryptedSecretKey = await encrypt(secretKey, password);
  const account = {
    type: "secret_key" as const,
    pk,
    label,
    address: parseImplicitPkh(pkh),
  };

  return {
    account,
    encryptedSecretKey,
  };
};

export const restore =
  ({ secretKey, label, password }: { secretKey: string; label: string; password: string }) =>
  async (dispatch: AppDispatch) => {
    const { account, encryptedSecretKey } = await makeSecretKeyAccount({
      secretKey,
      label,
      password,
    });
    dispatch(accountsSlice.actions.addAccount(account));
    dispatch(accountsSlice.actions.addSecretKey({ pkh: account.address.pkh, encryptedSecretKey }));
  };

export const remove = (account: SecretKeyAccount) => async (dispatch: AppDispatch) => {
  dispatch(accountsSlice.actions.removeSecretKey(account));
  dispatch(accountsSlice.actions.removeAccount(account));
};

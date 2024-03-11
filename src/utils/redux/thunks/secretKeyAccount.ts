import { Curves } from "@taquito/signer";
import { Prefix } from "@taquito/utils";

import { parseImplicitPkh } from "../../../types/Address";
import { encrypt } from "../../crypto/AES";
import { getPublicKeyPairFromSk } from "../../tezos";
import { accountsSlice } from "../slices/accountsSlice";
import { AppDispatch } from "../store";

export const getCurve = (secretKey: string): Curves => {
  if (secretKey.startsWith(Prefix.EDESK) || secretKey.startsWith(Prefix.EDSK)) {
    return "ed25519";
  }
  if (secretKey.startsWith(Prefix.SPESK) || secretKey.startsWith(Prefix.SPSK)) {
    return "secp256k1";
  }
  if (secretKey.startsWith(Prefix.P2ESK) || secretKey.startsWith(Prefix.P2SK)) {
    return "p256";
  }
  throw new Error("Invalid secret key");
};

export const isEncryptedSecretKeyPrefix = (secretKeyPrefix: string) =>
  secretKeyPrefix.substring(2, 3) === "e";

export const makeSecretKeyAccount = async ({
  secretKey,
  label,
  password,
}: {
  secretKey: string;
  label: string;
  password: string;
}) => {
  const { pk, pkh } = await getPublicKeyPairFromSk(secretKey);
  const encryptedSecretKey = await encrypt(secretKey, password);
  const account = {
    type: "secret_key" as const,
    pk,
    label,
    curve: getCurve(secretKey),
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

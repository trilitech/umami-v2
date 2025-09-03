import { type Curves } from "@taquito/signer";
import { PrefixV2 } from "@taquito/utils";
import { encrypt } from "@umami/crypto";
import { getPublicKeyPairFromSk, parseImplicitPkh } from "@umami/tezos";
import { CustomError } from "@umami/utils";

import { accountsActions } from "../slices/accounts";
import { type AppDispatch } from "../store";

export const getCurve = (secretKey: string): Curves => {
  // Support both old and new prefix formats for backward compatibility
  if (
    secretKey.startsWith(PrefixV2.Ed25519EncryptedSeed) ||
    secretKey.startsWith(PrefixV2.Ed25519Seed)
  ) {
    return "ed25519";
  }
  if (
    secretKey.startsWith(PrefixV2.Secp256k1EncryptedSecretKey) ||
    secretKey.startsWith(PrefixV2.Secp256k1SecretKey)
  ) {
    return "secp256k1";
  }
  if (
    secretKey.startsWith(PrefixV2.P256EncryptedSecretKey) ||
    secretKey.startsWith(PrefixV2.P256SecretKey)
  ) {
    return "p256";
  }
  throw new CustomError("Invalid secret key");
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

export const restoreFromSecretKey =
  ({ secretKey, label, password }: { secretKey: string; label: string; password: string }) =>
  async (dispatch: AppDispatch) => {
    const { account, encryptedSecretKey } = await makeSecretKeyAccount({
      secretKey,
      label,
      password,
    });
    dispatch(accountsActions.addAccount(account));
    dispatch(accountsActions.setDefaultAccount());
    dispatch(accountsActions.addSecretKey({ pkh: account.address.pkh, encryptedSecretKey }));
  };

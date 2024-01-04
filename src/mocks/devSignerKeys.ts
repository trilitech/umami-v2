import { InMemorySigner } from "@taquito/signer";

import { mnemonic1 } from "./mockMnemonic";
import { getDefaultDerivationPath } from "../utils/account/derivationPathUtils";

// make the default signer used in the dev mode.
// e.g. makeDefaultDevSigner(0) is equivalent to the "restored account 0".
export const makeDefaultDevSigner = (index: number): InMemorySigner => {
  return InMemorySigner.fromMnemonic({
    mnemonic: mnemonic1,
    derivationPath: getDefaultDerivationPath(index),
    curve: "ed25519",
  });
};

export const makeDefaultDevSignerKeys = async (index: number) => {
  const signer = makeDefaultDevSigner(index);
  return {
    secretKey: await signer.secretKey(),
    pk: await signer.publicKey(),
    pkh: await signer.publicKeyHash(),
  };
};

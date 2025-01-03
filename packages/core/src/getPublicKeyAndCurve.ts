import { type ManagerKeyResponse } from "@taquito/rpc";
import { type ImplicitAccount } from "@umami/core";
import { type Network, type RawPkh, makeToolkit } from "@umami/tezos";
import { WalletConnectError } from "@umami/utils";
import { type SessionTypes } from "@walletconnect/types";

/**
 * Fetches the public key and curve of a given tz1 address.
 *
 * @param address - tz1 address of the account
 * @param signer - Implicit account
 * @param network - network
 * @param session - WalletConnect session
 * @returns the public key if revelead
 * Throws an error if the account is not revealed
 */
export const getPublicKeyAndCurve = async (
  address: RawPkh,
  signer: ImplicitAccount,
  network: Network,
  session?: SessionTypes.Struct | null
): Promise<{ publicKey: string; curve: string }> => {
  const tezosToolkit = await makeToolkit({
    type: "fake",
    signer: signer,
    network,
  });
  const keyResponse: ManagerKeyResponse | null = await tezosToolkit.rpc.getManagerKey(address);
  if (!keyResponse) {
    throw new WalletConnectError(
      `Signer address is not revealed on the ${network.name}. To reveal it, send any amount, e.g. 0.000001ꜩ, from that address to yourself. Wait several minutes and try again.`,
      "UNSUPPORTED_ACCOUNTS",
      session || null
    );
  }
  const publicKey = typeof keyResponse === "string" ? keyResponse : keyResponse.key;
  const curve = publicKey.startsWith("edpk")
    ? "ed25519"
    : publicKey.startsWith("sppk")
      ? "secp256k1"
      : publicKey.startsWith("p2pk")
        ? "p-256"
        : null;
  if (!curve) {
    throw new WalletConnectError(
      `Unknown curve for the public key: ${publicKey}`,
      "UNSUPPORTED_ACCOUNTS",
      session || null
    );
  }
  return { publicKey, curve };
};

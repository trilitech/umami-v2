/* istanbul ignore file */
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { LedgerSigner } from "@taquito/ledger-signer";
import { PublicKeyPair } from "../mnemonic";

export const getPk = async (derivationPath?: string): Promise<PublicKeyPair> => {
  const transport = await TransportWebUSB.create();
  const ledgerSigner = new LedgerSigner(transport, derivationPath, true);
  const pk = await ledgerSigner.publicKey();
  const pkh = await ledgerSigner.publicKeyHash();
  await transport.close();
  return { pk, pkh };
};

import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import { LedgerSigner } from "@taquito/ledger-signer";
import { PublicKeyPair } from "../mnemonic";

export const getPk = async (derivationPath?: string): Promise<PublicKeyPair> => {
  const transport = await TransportWebHID.create();
  const ledgerSigner = new LedgerSigner(transport, derivationPath, true);
  const pk = await ledgerSigner.publicKey();
  const pkh = await ledgerSigner.publicKeyHash();
  await transport.close();
  return { pk, pkh };
};

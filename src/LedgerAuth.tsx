import { Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import { LedgerSigner, DerivationType, HDPathTemplate } from '@taquito/ledger-signer';

export type LedgerAuthProps = {
  buttonText?: string;
  onReceivePk: (pk: string, pkh: string) => void;
  width?: string;
  bg?: string;
  isLoading?: boolean;
};

export const DEFAULT_BTN_TEXT = "Restore Ledger";

export const LedgerAuth: React.FC<LedgerAuthProps> = ({
  buttonText = DEFAULT_BTN_TEXT,
  onReceivePk,
  width,
  bg,
  isLoading = false,
}) => {
  const [isConnecting, SetIsConnecting] = useState(false);
  const toast = useToast();

  const getPubicKeyHash = async () => {
    SetIsConnecting(true)
    TransportWebHID.create().then(async (transport) => {
      const ledgerSigner = new LedgerSigner(
        transport,
        HDPathTemplate(1), // TODO pull correct derivation path (equivalent to "44'/1729'/1'/0'")
        true, // PK Verification needed
        DerivationType.ED25519 // TODO pull correct type
      );
      try {
        const pk = await ledgerSigner.publicKey()
        const pkh = await ledgerSigner.publicKeyHash()
        toast({ title: "Request sent to Ledger", description: "Open the Tezos app on your Ledger and accept the request" });
        onReceivePk(pk, pkh)
      } catch (e) {
        toast({ title: "Request sent to Ledger", description: "Open the Tezos app on your Ledger and accept the request" });

      } finally {
        await transport.close()
      }
    }).catch(reason => {
      if (reason.name === 'PublicKeyRetrievalError') {
        toast({ title: "Request cancelled", description: "Please unlock your Ledger and open the Tezos app" });
      } else {
        toast({ title: "Request cancelled", description: reason.name });
      }
    })
      .finally(() => SetIsConnecting(false))
  }

  return (
    <Button
      isLoading={isLoading || isConnecting}
      onClick={getPubicKeyHash}
      width={width}
      bg={bg}
    >
      {buttonText}
    </Button>
  );
};

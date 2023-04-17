import { Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import BluetoothTransport from "@ledgerhq/hw-transport-web-ble";
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
    // const internalWindows = window as any;
    // console.log('getPubicKeyHash', internalWindows, internalWindows.electronAPI, internalWindows.electronAPI.signLedger)
    // internalWindows.electronAPI.signLedger()

    // alert(`Is supported ${await TransportWebHID.isSupported()}`)

    // Close existing connections to be able to reinitiate
    const devices = await TransportWebHID.list()
    for (let i = 0; i < devices.length; i++) {
      devices[i].close()
    }

    SetIsConnecting(true)
    TransportWebHID.create()
      .then(async (transport) => {
        const ledgerSigner = new LedgerSigner(
          transport,
          HDPathTemplate(1), // TODO pull correct derivation path (equivalent to "44'/1729'/1'/0'")
          true,
          DerivationType.SECP256K1 // TODO pull correct type
        );
        toast({ title: "Request sent to Ledger", description: "Open the Tezos app on your Ledger and accept the request" });
        const pk = await ledgerSigner.publicKey()
        const pkh = await ledgerSigner.publicKeyHash()

        onReceivePk(pk, pkh)
        await transport.close()
      })
      // TODO in case of cancle, the transport can't currently be closed
      .catch(reason => {
        toast({ title: "Request cancelled", description: reason.name });
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

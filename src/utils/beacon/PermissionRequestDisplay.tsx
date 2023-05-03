import {
  BeaconMessageType,
  BeaconResponseInputMessage,
  Network,
  NetworkType,
  PermissionRequestOutput,
} from "@airgap/beacon-wallet";
import { TezosNetwork } from "@airgap/tezos";
import {
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
  AspectRatio,
  Image,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ConnectedAccountSelector } from "../../components/AccountSelector/AccountSelector";
import { Account } from "../../types/Account";
import { useSelectedNetwork } from "../hooks/assetsHooks";
import { walletClient } from "./Beacon";

const tezosNetworkToBeaconNetwork = (n: TezosNetwork) => {
  if (n === TezosNetwork.MAINNET) {
    return NetworkType.MAINNET;
  } else if (n === TezosNetwork.GHOSTNET) {
    return NetworkType.GHOSTNET;
  }

  const foo: never = n;
  throw new Error(foo);
};

const PermissionRequest: React.FC<{
  request: PermissionRequestOutput;
}> = ({ request }) => {
  const [account, setAccount] = useState<Account>();
  const network = useSelectedNetwork();
  // const response: BeaconResponseInputMessage = {
  //   type: BeaconMessageType.PermissionResponse,
  //   network: message.network, // Use the same network that the user requested
  //   scopes: message.scopes,
  //   id: message.id,
  //   publicKey: publicKey,
  // };

  // // Send response back to DApp
  // walletClient.respond(response);

  const grant = () => {
    if (!account) {
      throw new Error("foo");
    }

    const response: BeaconResponseInputMessage = {
      type: BeaconMessageType.PermissionResponse,
      network: { type: tezosNetworkToBeaconNetwork(network) }, // Use the same network that the user requested
      scopes: request.scopes,
      id: request.id,
      publicKey: account.pk,
    };

    walletClient.respond(response);
  };

  return (
    <ModalContent>
      <ModalHeader>
        Permission Request from {request.appMetadata.name}
      </ModalHeader>

      <ModalCloseButton />
      <ModalBody>
        <ConnectedAccountSelector
          selected={account && account.pkh}
          onSelect={(a) => {
            setAccount(a);
          }}
        />
        <AspectRatio width={"100%"} ratio={1}>
          <Image width="100%" height={40} src={request.appMetadata.icon} />
        </AspectRatio>
      </ModalBody>

      <ModalFooter>
        <Button isDisabled={!account} onClick={(_) => grant()}>
          Grant
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default PermissionRequest;

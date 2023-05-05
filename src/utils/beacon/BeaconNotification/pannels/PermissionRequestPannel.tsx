import {
  BeaconMessageType,
  BeaconResponseInputMessage,
  PermissionRequestOutput,
} from "@airgap/beacon-wallet";
import {
  AspectRatio,
  Button,
  Image,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ConnectedAccountSelector } from "../../../../components/AccountSelector/AccountSelector";
import { Account } from "../../../../types/Account";
import { walletClient } from "../../beacon";

const PermissionRequestPannel: React.FC<{
  request: PermissionRequestOutput;
  onSuccess: () => void;
}> = ({ request, onSuccess: onSubmit }) => {
  const [account, setAccount] = useState<Account>();

  const grant = async () => {
    if (!account) {
      throw new Error("No account selected");
    }

    const response: BeaconResponseInputMessage = {
      type: BeaconMessageType.PermissionResponse,
      network: { type: request.network.type }, // Use the same network that the user requested
      scopes: request.scopes,
      id: request.id,
      publicKey: account.pk,
    };

    await walletClient.respond(response);
    onSubmit();
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
        <AspectRatio mt={2} mb={2} width={"100%"} ratio={1}>
          <Image width="100%" height={40} src={request.appMetadata.icon} />
        </AspectRatio>
        <Text>{request.network.type}</Text>
        <Text>{request.senderId}</Text>
        <Text>{JSON.stringify(request.scopes)}</Text>
      </ModalBody>

      <ModalFooter>
        <Button isDisabled={!account} onClick={(_) => grant()}>
          Grant
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default PermissionRequestPannel;

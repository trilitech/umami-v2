import { SignPayloadRequestOutput } from "@airgap/beacon-wallet";
import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react";
import React from "react";
import { useGetAccount } from "../hooks/accountHooks";

const SignPayloadRequestPannel: React.FC<{
  request: SignPayloadRequestOutput;
  onSubmit: () => void;
}> = ({ request }) => {
  console.log(request);

  const getAccount = useGetAccount();
  const signerAccount = getAccount(request.sourceAddress);

  if (!signerAccount) {
    return <div>"unknown account"</div>;
  }

  return (
    <ModalContent>
      <ModalHeader>
        Sign payload Request from {request.appMetadata.name}
      </ModalHeader>

      <ModalCloseButton />
      <ModalBody>{request.payload}</ModalBody>

      <ModalFooter>
        <Button>Sign</Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default SignPayloadRequestPannel;

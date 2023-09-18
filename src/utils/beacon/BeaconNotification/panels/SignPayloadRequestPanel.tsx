import {
  BeaconMessageType,
  SignPayloadRequestOutput,
  SignPayloadResponseInput,
} from "@airgap/beacon-wallet";
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useToast,
} from "@chakra-ui/react";
import { TezosToolkit } from "@taquito/taquito";
import React from "react";
import { useGetImplicitAccountSafe } from "../../../hooks/accountHooks";
import { walletClient } from "../../beacon";
import SignButton from "../../../../components/SendFlow/SignButton";

const SignPayloadRequestPanel: React.FC<{
  request: SignPayloadRequestOutput;
  onSuccess: () => void;
}> = ({ request, onSuccess: onSubmit }) => {
  const getAccount = useGetImplicitAccountSafe();
  const signerAccount = getAccount(request.sourceAddress);
  const toast = useToast();

  if (!signerAccount) {
    return <div>"unknown account"</div>;
  }
  const sign = async (tezosToolkit: TezosToolkit) => {
    const result = await tezosToolkit.signer.sign(request.payload);

    const response: SignPayloadResponseInput = {
      type: BeaconMessageType.SignPayloadResponse,
      id: request.id,
      signingType: request.signingType,
      signature: result.prefixSig, // TODO: Check if it works
    };

    await walletClient.respond(response);

    toast({ title: "Successfully submitted Beacon operation", status: "success" });
    onSubmit();
  };

  return (
    <ModalContent>
      <ModalHeader>Sign payload Request from {request.appMetadata.name}</ModalHeader>

      <ModalCloseButton />
      <ModalBody>{request.payload}</ModalBody>

      <ModalFooter justifyContent="center" display="flex">
        <SignButton signer={signerAccount} onSubmit={sign} />
      </ModalFooter>
    </ModalContent>
  );
};

export default SignPayloadRequestPanel;

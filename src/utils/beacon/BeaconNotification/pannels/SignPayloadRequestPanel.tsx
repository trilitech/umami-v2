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
import React, { useState } from "react";
import SignButton from "../../../../components/sendForm/components/SignButton";
import { AccountType } from "../../../../types/Account";
import { makeToolkit } from "../../../../types/ToolkitConfig";
import { LedgerToolkitConfig, SecretkeyToolkitConfig } from "../../../../types/ToolkitConfig";
import { useGetImplicitAccount } from "../../../hooks/accountHooks";
import { useSelectedNetwork } from "../../../hooks/assetsHooks";
import { walletClient } from "../../beacon";

const SignPayloadRequestPanel: React.FC<{
  request: SignPayloadRequestOutput;
  onSuccess: () => void;
}> = ({ request, onSuccess: onSubmit }) => {
  const getAccount = useGetImplicitAccount();
  const network = useSelectedNetwork();
  const [isLoading, setIsLoading] = useState(false);
  const signerAccount = getAccount(request.sourceAddress);
  const toast = useToast();

  if (!signerAccount) {
    return <div>"unknown account"</div>;
  }
  const sign = async (config: LedgerToolkitConfig | SecretkeyToolkitConfig) => {
    setIsLoading(true);
    if (signerAccount.type === AccountType.LEDGER) {
      toast({ title: "connect ledger" });
    }

    try {
      const { signer } = await makeToolkit(config);
      const result = await signer.sign(request.payload);

      const response: SignPayloadResponseInput = {
        type: BeaconMessageType.SignPayloadResponse,
        id: request.id,
        signingType: request.signingType,
        signature: result.prefixSig, // TODO: Signature
      };

      await walletClient.respond(response);

      toast({ title: "Success" });
      onSubmit();
    } catch (error) {
      toast({ title: "Error" });
    }

    setIsLoading(false);
  };

  return (
    <ModalContent>
      <ModalHeader>Sign payload Request from {request.appMetadata.name}</ModalHeader>

      <ModalCloseButton />
      <ModalBody>{request.payload}</ModalBody>

      <ModalFooter justifyContent="center" display="flex">
        <SignButton
          signerAccount={signerAccount}
          onSubmit={sign}
          isLoading={isLoading}
          network={network}
        />
      </ModalFooter>
    </ModalContent>
  );
};

export default SignPayloadRequestPanel;

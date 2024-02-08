import {
  BeaconMessageType,
  SignPayloadRequestOutput,
  SignPayloadResponseInput,
} from "@airgap/beacon-wallet";
import {
  Box,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useToast,
} from "@chakra-ui/react";
import { TezosToolkit } from "@taquito/taquito";
import React from "react";

import { SignButton } from "../../../../components/SendFlow/SignButton";
import colors from "../../../../style/colors";
import { useGetImplicitAccountSafe } from "../../../hooks/getAccountDataHooks";
import { walletClient } from "../../beacon";

export const SignPayloadRequestPanel: React.FC<{
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

    toast({ description: "Successfully submitted Beacon operation", status: "success" });
    onSubmit();
  };

  return (
    <ModalContent>
      <ModalHeader marginBottom="32px" textAlign="center">
        Connect with pairing request
      </ModalHeader>
      <ModalCloseButton />

      <ModalBody>
        <Heading marginBottom="12px" size="l">
          {`${request.appMetadata.name}/dApp Pairing Request`}
        </Heading>
        <Box
          padding="15px"
          border="1px solid"
          borderColor={colors.gray[500]}
          borderRadius="4px"
          backgroundColor={colors.gray[800]}
        >
          <Text color={colors.gray[450]} size="md">
            {request.payload}
          </Text>
        </Box>
      </ModalBody>

      <ModalFooter justifyContent="center" display="flex" padding="16px 0 0 0">
        <SignButton onSubmit={sign} signer={signerAccount} text="Connect" />
      </ModalFooter>
    </ModalContent>
  );
};

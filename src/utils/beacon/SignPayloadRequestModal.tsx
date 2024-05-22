import {
  BeaconErrorType,
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
import React, { useContext } from "react";

import { useRemovePeerBySenderId } from "./beacon";
import { decodePayload } from "./decodePayload";
import { WalletClient } from "./WalletClient";
import { DynamicModalContext } from "../../components/DynamicModal";
import { SignButton } from "../../components/SendFlow/SignButton";
import colors from "../../style/colors";
import { useGetImplicitAccount } from "../hooks/getAccountDataHooks";

export const SignPayloadRequestModal: React.FC<{
  request: SignPayloadRequestOutput;
}> = ({ request }) => {
  const { onClose } = useContext(DynamicModalContext);
  const getAccount = useGetImplicitAccount();
  const signerAccount = getAccount(request.sourceAddress);
  const toast = useToast();
  const removePeer = useRemovePeerBySenderId();

  const onModalClose = () => {
    void removePeer(request.senderId);
    void WalletClient.respond({
      id: request.id,
      type: BeaconMessageType.Error,
      errorType: BeaconErrorType.ABORTED_ERROR,
    });
  };

  const sign = async (tezosToolkit: TezosToolkit) => {
    const result = await tezosToolkit.signer.sign(request.payload);

    const response: SignPayloadResponseInput = {
      type: BeaconMessageType.SignPayloadResponse,
      id: request.id,
      signingType: request.signingType,
      signature: result.prefixSig,
    };

    await WalletClient.respond(response);

    toast({
      description: "Successfully submitted Beacon operation",
      status: "success",
    });
    onClose();
  };

  return (
    <ModalContent>
      <ModalHeader marginBottom="32px" textAlign="center">
        Connect with pairing request
      </ModalHeader>
      <ModalCloseButton onClick={onModalClose} />

      <ModalBody>
        <Heading marginBottom="12px" size="l">
          {`${request.appMetadata.name}/dApp Pairing Request`}
        </Heading>
        <Box
          overflowY="auto"
          maxHeight="300px"
          padding="15px"
          border="1px solid"
          borderColor={colors.gray[500]}
          borderRadius="4px"
          backgroundColor={colors.gray[800]}
        >
          <Text color={colors.gray[450]} size="md">
            {decodePayload(request.payload)}
          </Text>
        </Box>
      </ModalBody>

      <ModalFooter justifyContent="center" display="flex" padding="16px 0 0 0">
        <SignButton onSubmit={sign} signer={signerAccount} text="Sign" />
      </ModalFooter>
    </ModalContent>
  );
};

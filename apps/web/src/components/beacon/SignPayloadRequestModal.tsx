import {
  BeaconMessageType,
  type SignPayloadRequestOutput,
  type SignPayloadResponseInput,
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
import { type TezosToolkit } from "@taquito/taquito";
import { useDynamicModalContext } from "@umami/components";
import { WalletClient, useGetImplicitAccount } from "@umami/state";
import { FormProvider, useForm } from "react-hook-form";

import { decodePayload } from "./decodePayload";
import { SignButton } from "../../components/SendFlow/SignButton";
import { useColor } from "../../styles/useColor";

export const SignPayloadRequestModal = ({ request }: { request: SignPayloadRequestOutput }) => {
  const { onClose } = useDynamicModalContext();
  const getAccount = useGetImplicitAccount();
  const signerAccount = getAccount(request.sourceAddress);
  const toast = useToast();
  const form = useForm();
  const color = useColor();

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
    <FormProvider {...form}>
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
            overflowY="auto"
            maxHeight="300px"
            padding="15px"
            border="1px solid"
            borderColor={color("300")}
            borderRadius="4px"
            backgroundColor={color("100")}
          >
            <Text color={color("600")} size="md">
              {decodePayload(request.payload)}
            </Text>
          </Box>
        </ModalBody>

        <ModalFooter justifyContent="center" display="flex" padding="16px 0 0 0">
          <SignButton onSubmit={sign} signer={signerAccount} text="Sign" />
        </ModalFooter>
      </ModalContent>
    </FormProvider>
  );
};

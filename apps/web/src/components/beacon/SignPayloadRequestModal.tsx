import {
  BeaconMessageType,
  type SignPayloadRequestOutput,
  type SignPayloadResponseInput,
} from "@airgap/beacon-wallet";
import { WarningIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { type TezosToolkit } from "@taquito/taquito";
import { useDynamicModalContext } from "@umami/components";
import { decodeBeaconPayload } from "@umami/core";
import { WalletClient, useGetImplicitAccount } from "@umami/state";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { SignButton } from "../../components/SendFlow/SignButton";
import { useColor } from "../../styles/useColor";

export const SignPayloadRequestModal = ({ request }: { request: SignPayloadRequestOutput }) => {
  const { onClose } = useDynamicModalContext();
  const getAccount = useGetImplicitAccount();
  const signerAccount = getAccount(request.sourceAddress);
  const toast = useToast();
  const form = useForm();
  const color = useColor();
  const [showRaw, setShowRaw] = useState(false);

  const { result: parsedPayload, error: parsingError } = decodeBeaconPayload(
    request.payload,
    request.signingType
  );

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
          {`${request.appMetadata.name}/dApp Pairing Request`}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Flex justifyContent="space-between" marginBottom="12px">
            <Heading size="l">Payload</Heading>

            {!parsingError && (
              <Flex alignItems="center" gap="4px">
                <Text>Raw</Text>
                <Switch onChange={() => setShowRaw(val => !val)} />
              </Flex>
            )}
          </Flex>

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
              {showRaw ? request.payload : parsedPayload.trim()}
            </Text>
          </Box>

          {parsingError && (
            <Flex alignItems="center" gap="4px" marginTop="4px">
              <WarningIcon width="15px" height="15px" />
              <Text color="red" size="xs">
                Raw Payload. Parsing failed
              </Text>
            </Flex>
          )}
        </ModalBody>

        <ModalFooter justifyContent="center" display="flex" padding="16px 0 0 0">
          <SignButton onSubmit={sign} signer={signerAccount} text="Sign" />
        </ModalFooter>
      </ModalContent>
    </FormProvider>
  );
};

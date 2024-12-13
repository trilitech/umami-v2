import { BeaconMessageType, type SignPayloadResponseInput } from "@airgap/beacon-wallet";
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
import { WalletClient, walletKit } from "@umami/state";
import { formatJsonRpcResult } from "@walletconnect/jsonrpc-utils";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useColor } from "../../styles/useColor";
import { SignButton } from "../SendFlow/SignButton";
import { type SignPayloadProps } from "../SendFlow/utils";

export const SignPayloadRequestModal = ({ opts }: { opts: SignPayloadProps }) => {
  const { goBack } = useDynamicModalContext();
  const toast = useToast();
  const form = useForm();
  const color = useColor();
  const [showRaw, setShowRaw] = useState(false);

  const { result: parsedPayload, error: parsingError } = decodeBeaconPayload(
    opts.payload,
    opts.signingType
  );

  const sign = async (tezosToolkit: TezosToolkit) => {
    const result = await tezosToolkit.signer.sign(opts.payload);

    if (opts.requestId.sdkType === "beacon") {
      const response: SignPayloadResponseInput = {
        type: BeaconMessageType.SignPayloadResponse,
        id: opts.requestId.id.toString(),
        signingType: opts.signingType,
        signature: result.prefixSig,
      };
      await WalletClient.respond(response);
    } else {
      const response = formatJsonRpcResult(opts.requestId.id, { signature: result.prefixSig });
      await walletKit.respondSessionRequest({ topic: opts.requestId.topic, response });
    }

    toast({
      description: "Successfully signed the payload",
      status: "success",
    });
    goBack();
  };

  return (
    <FormProvider {...form}>
      <ModalContent>
        <ModalHeader marginBottom="32px" textAlign="center">
          {`Sign Payload Request from ${opts.appName}`}
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
              {showRaw ? opts.payload : parsedPayload.trim()}
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
          <SignButton onSubmit={sign} signer={opts.signer} text="Sign" />
        </ModalFooter>
      </ModalContent>
    </FormProvider>
  );
};

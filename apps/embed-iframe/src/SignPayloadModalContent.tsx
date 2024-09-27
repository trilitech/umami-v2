import { Box, Flex, Heading, Switch, Text, VStack } from "@chakra-ui/react";
import * as Auth from "@umami/social-auth";

import { UmamiLogoIcon } from "./assets/icons/UmamiLogo";

import { getErrorContext } from "./imported/utils/getErrorContext";
import { withTimeout } from "./imported/utils/withTimeout";
import { sendOperationErrorResponse, sendResponse, toTezosNetwork } from "./utils";
import { makeToolkit } from "@umami/tezos";
import { useEmbedApp } from "./EmbedAppContext";
import { useColor } from "./imported/style/useColor";
import { LoginButtonComponent } from "./LoginButtonComponent";
import { getDAppByOrigin } from "./ClientsPermissions";
import { useSignPayloadModalContext } from "./SignPayloadModalContext";
import { decodeBeaconPayload } from "@umami/core";
import { useState } from "react";

import { WarningIcon } from "@chakra-ui/icons";

const SIGN_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export const SignPayloadModalContent = () => {
  const [showRaw, setShowRaw] = useState(false);

  const { onClose, setIsLoading, signingType, payload } = useSignPayloadModalContext();
  const { getNetwork, getUserData, getDAppOrigin } = useEmbedApp();

  const { result: parsedPayload, error: parsingError } = decodeBeaconPayload(
    payload!,
    signingType!
  );

  const color = useColor();
  const dAppName = getDAppByOrigin(getDAppOrigin());

  const onClick = async () => {
    setIsLoading(true);
    try {
      const { secretKey } = await withTimeout(
        async () => Auth.forIDP(getUserData()!.typeOfLogin).getCredentials(),
        SIGN_TIMEOUT
      );
      const toolkit = await makeToolkit({
        type: "social",
        secretKey,
        network: toTezosNetwork(getNetwork()!),
      });

      const result = await toolkit.signer.sign(payload!);

      sendResponse({
        type: "sign_response",
        signingType: signingType!,
        signature: result.prefixSig,
      });
    } catch (error) {
      sendOperationErrorResponse(getErrorContext(error).description);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <VStack spacing="0">
      <Box marginBottom="10px">
        <UmamiLogoIcon />
      </Box>

      <Heading marginBottom="10px" fontSize="16px" lineHeight="22px">
        Sign Payload
      </Heading>

      <Flex justifyContent="center" marginBottom="16px">
        <Text color={color("900")} size="sm" lineHeight="14px" textAlign="center">
          <Text as="span">{dAppName ? dAppName : getDAppOrigin()}</Text>
          <Text as="span" color={color("500")} marginLeft="5px">
            is requesting permission to sign this payload
          </Text>
        </Text>
      </Flex>

      <Box
        width="100%"
        marginBottom="20px"
        overflowY="auto"
        maxHeight="200px"
        padding="16px"
        borderRadius="5px"
        backgroundColor={color("100")}
      >
        <Text size="sm">{showRaw ? payload! : parsedPayload.trim()}</Text>
        {parsingError && (
          <Flex alignItems="center" gap="4px" marginTop="4px">
            <WarningIcon width="15px" height="15px" />
            <Text color="red" size="xs">
              Raw Payload. Parsing failed
            </Text>
          </Flex>
        )}
      </Box>

      {!parsingError && (
        <Flex alignItems="center" justifyContent="flex-end" gap="4px" marginBottom="20px" ml="auto">
          <Text>Raw</Text>
          <Switch onChange={() => setShowRaw(val => !val)} />
        </Flex>
      )}

      <LoginButtonComponent
        loginType={getUserData()!.typeOfLogin}
        prefix="Sign with"
        onClick={onClick}
      />
    </VStack>
  );
};

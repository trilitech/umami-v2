import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import * as Auth from "@umami/social-auth";

import { UmamiLogoIcon } from "./assets/icons/UmamiLogo";
import { JsValueWrap } from "./imported/JsValueWrap";

import { getErrorContext } from "./imported/utils/getErrorContext";
import { withTimeout } from "./imported/utils/withTimeout";
import { sendOperationErrorResponse, sendResponse, toTezosNetwork } from "./utils";
import { makeToolkit, prettyTezAmount } from "@umami/tezos";
import { useEmbedApp } from "./EmbedAppContext";
import { useColor } from "./imported/style/useColor";
import { executeOperations, totalFee } from "@umami/core";
import { LoginButtonComponent } from "./LoginButtonComponent";
import { useOperationModalContext } from "./OperationModalContext";
import { getDAppByOrigin } from "./ClientsPermissions";

const SIGN_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export const OperationModalContent = () => {
  const { onClose, isLoading, setIsLoading, estimatedOperations } = useOperationModalContext();
  const { getNetwork, getUserData, getDAppOrigin } = useEmbedApp();

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

      const { opHash } = await executeOperations(estimatedOperations!, toolkit);

      console.log("request sent", opHash);

      sendResponse({ type: "operation_response", opHash });
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
        Confirm Operation
      </Heading>

      <Flex justifyContent="center" marginBottom="16px">
        <Text color={color("900")} size="sm" lineHeight="14px" textAlign="center">
          <Text as="span">{dAppName ? dAppName : getDAppOrigin()}</Text>
          <Text as="span" color={color("500")} marginLeft="5px">
            is requesting permission to sign this operation
          </Text>
        </Text>
      </Flex>

      <Accordion allowToggle width="100%" marginBottom="10px">
        <AccordionItem border="none">
          <AccordionButton>
            <Heading flex="1" textAlign="left" paddingY="6px" size="sm">
              Show Details
            </Heading>
            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel width="100%">
            <JsValueWrap
              background={color("100")}
              overflowY="auto"
              maxHeight="200px"
              value={estimatedOperations!.operations}
              marginBottom="16px"
            />

            <Flex alignItems="center" justifyContent="space-between">
              <Flex marginRight="110px">
                <Text marginRight="4px" color={color("500")} size="xs">
                  Count:
                </Text>
                <Text color={color("900")} data-testid="transaction-length" size="xs">
                  {estimatedOperations!.operations.length}
                </Text>
              </Flex>

              <Flex alignItems="center" marginBottom="5px">
                <Text marginRight="4px" color={color("500")} size="xs">
                  Fee:
                </Text>
                <Text color={color("900")} data-testid="fee" size="xs">
                  {isLoading ? "..." : prettyTezAmount(totalFee(estimatedOperations!.estimates))}
                </Text>
              </Flex>
            </Flex>

            <Flex justifyContent="space-between">
              <Text color={color("500")} size="xs" lineHeight="14px" marginRight="5px">
                Network:
              </Text>
              <Text color={color("900")} size="xs" lineHeight="14px">
                {getNetwork()}
              </Text>
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <LoginButtonComponent
        loginType={getUserData()!.typeOfLogin}
        prefix="Confirm with"
        onClick={onClick}
      />
    </VStack>
  );
};

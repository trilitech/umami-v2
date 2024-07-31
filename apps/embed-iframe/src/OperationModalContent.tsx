import { type PartialTezosOperation, TezosOperationType } from "@airgap/beacon-types";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import * as Auth from "@umami/social-auth";
import { useEffect, useState } from "react";

import { TezosLogoIcon } from "./assets/icons/TezosLogo";
import { UmamiLogoIcon } from "./assets/icons/UmamiLogo";
import { JsValueWrap } from "./imported/JsValueWrap";

import { getErrorContext } from "./imported/utils/getErrorContext";
import { withTimeout } from "./imported/utils/withTimeout";
import { sendOperationErrorResponse, sendResponse, toSocialAccount, toTezosNetwork } from "./utils";
import { makeToolkit, prettyTezAmount } from "@umami/tezos";
import { useEmbedApp } from "./EmbedAppContext";
import { useColor } from "./imported/style/useColor";
import {
  estimate,
  EstimatedAccountOperations,
  executeOperations,
  toAccountOperations,
  totalFee,
} from "@umami/core";
import { LoginButtonComponent } from "./LoginButtonComponent";

const SIGN_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export const OperationModalContent = ({
  operations,
  closeModal,
}: {
  operations: PartialTezosOperation[];
  closeModal: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { getNetwork, getUserData } = useEmbedApp();
  const [estimatedOperations, setEstimatedOperations] = useState<EstimatedAccountOperations | null>(
    null
  );

  const color = useColor();

  useEffect(() => {
    const fetchEstimatedOperations = async () => {
      try {
        const accountOperations = toAccountOperations(operations, toSocialAccount(getUserData()!));
        const estimatedOperations = await estimate(
          accountOperations,
          toTezosNetwork(getNetwork()!)
        );
        setEstimatedOperations(estimatedOperations);
      } catch (error) {
        // TODO: display error to the user instead?
        sendOperationErrorResponse(getErrorContext(error).description);
        closeModal();
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstimatedOperations();
  }, [operations, getUserData, getNetwork, closeModal]);

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
      closeModal();
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

      <Flex justifyContent="space-between" marginBottom="20px">
        <Text color={color("500")} size="xs" lineHeight="14px" marginRight="5px">
          Network:
        </Text>
        <Text color={color("900")} size="xs" lineHeight="14px">
          {getNetwork()}
        </Text>
      </Flex>

      <Accordion allowToggle defaultIndex={[0]} width="100%" marginBottom="10px">
        <AccordionItem background={color("100")} border="none" borderRadius="8px">
          <AccordionButton>
            <Heading flex="1" textAlign="left" paddingY="6px" size="sm">
              Operations
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <JsValueWrap overflowY="auto" maxHeight="200px" value={operations} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Flex alignItems="center" justifyContent="space-between" marginBottom="20px">
        <Flex marginRight="110px">
          <Text marginRight="4px" color={color("500")} size="sm">
            Count:
          </Text>
          <Text color={color("900")} data-testid="transaction-length" size="sm">
            {operations.length}
          </Text>
        </Flex>

        <Flex alignItems="center">
          <Text marginRight="4px" color={color("500")} size="sm">
            Fee:
          </Text>
          <Text color={color("900")} data-testid="fee" size="sm">
            {isLoading ? "..." : prettyTezAmount(totalFee(estimatedOperations!.estimates))}
          </Text>
        </Flex>
      </Flex>

      <LoginButtonComponent loginType={getUserData()!.typeOfLogin} onClick={onClick} />

      <Center marginTop="30px">
        <Text marginRight="10px" color={color("500")} fontSize="xs" lineHeight="14px">
          Powered by
        </Text>
        <TezosLogoIcon />
      </Center>
    </VStack>
  );
};

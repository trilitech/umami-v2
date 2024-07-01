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
import { OpKind, type WalletParamsWithKind } from "@taquito/taquito";
import { type Network, type UserData } from "@trilitech-umami/umami-embed/types";
import * as Auth from "@umami/social-auth";
import { useState } from "react";
import { makeToolkit } from "@umami/tezos";

import { TezosLogoIcon } from "./assets/icons/TezosLogo";
import { UmamiLogoIcon } from "./assets/icons/UmamiLogo";
import { JsValueWrap } from "./imported/JsValueWrap";
import colors from "./imported/style/colors";
import { getErrorContext } from "./imported/utils/getErrorContext";
import { withTimeout } from "./imported/utils/withTimeout";
import { sendOperationErrorResponse, sendResponse, toTezosNetwork } from "./utils";
import { totalFee, type EstimatedAccountOperations } from "@umami/core";
import { LoginButtonComponent } from "./LoginButtonComponent";
import { SignPageFee } from "./imported/SignPageFee";

const SIGN_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export const OperationModalContent: React.FC<{
  userData: UserData;
  network: Network;
  operations: PartialTezosOperation[];
  estimatedOperations: EstimatedAccountOperations;
  closeModal: () => void;
}> = ({ userData, network, operations, estimatedOperations, closeModal }) => {
  const [isLoading, setIsLoading] = useState(false);


  const onClick = async () => {
    setIsLoading(true);
    try {
      const { secretKey } = await withTimeout(
        async () => Auth.forIDP(userData.typeOfLogin, "embed").getCredentials(),
        SIGN_TIMEOUT
      );
      const toolkit = await makeToolkit({
        type: "social",
        secretKey,
        network: toTezosNetwork(network),
      });
      const { opHash } = await toolkit.wallet.batch(operations.map(toTaquitoOperation)).send();
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
            <Text color={colors.grey[500]} fontSize="xs" lineHeight="14px" marginRight="10px">
              Network:
            </Text>
            <Text color={colors.grey[900]} fontSize="xs" lineHeight="14px">
              {network}
            </Text>
          </Flex>


              <Accordion allowToggle defaultIndex={[0]} width="100%" marginBottom="10px">
              <AccordionItem background={colors.grey[100]} border="none" borderRadius="8px">
                <AccordionButton>
                  <Heading flex="1" textAlign="left" paddingY="6px" size="sm">
                    Operations
                  </Heading>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <JsValueWrap
                    overflowY="auto"
                    maxHeight="200px"
                    value={operations}
                  />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

          <Flex alignItems="center" justifyContent="space-between" marginBottom="20px">
            <Flex marginRight="110px">
              <Text marginRight="4px" color={colors.grey[450]} size="sm">
                Count:
              </Text>
              <Text color={colors.grey[400]} data-testid="transaction-length" size="sm">
                {operations.length}
              </Text>
            </Flex>

            <SignPageFee fee={totalFee(estimatedOperations.estimates)} />
          </Flex>

          <LoginButtonComponent loginType={userData.typeOfLogin} labelPrefix="Sign with" onClick={onClick} />

          <Center marginTop="30px">
            <Text marginRight="10px" color={colors.grey[500]} fontSize="xs" lineHeight="14px">
              Powered by
            </Text>
            <TezosLogoIcon />
          </Center>
        </VStack>
  );
};

const toTaquitoOperation = (operation: PartialTezosOperation): WalletParamsWithKind => {
  switch (operation.kind) {
    case TezosOperationType.TRANSACTION:
      return {
        kind: OpKind.TRANSACTION,
        to: operation.destination,
        amount: parseInt(operation.amount),
        mutez: true,
      };
    case TezosOperationType.DELEGATION:
      return {
        kind: OpKind.DELEGATION,
        delegate: operation.delegate,
      };
    default:
      throw new Error("Unsupported operation kind");
  }
};

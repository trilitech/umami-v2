import { type PartialTezosOperation, TezosOperationType } from "@airgap/beacon-types";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { OpKind, type WalletParamsWithKind } from "@taquito/taquito";
import * as Auth from "@umami/social-auth";
import { useState } from "react";

import { GoogleLogoIcon } from "./assets/icons/GoogleLogo";
import { TezosLogoIcon } from "./assets/icons/TezosLogo";
import { UmamiLogoIcon } from "./assets/icons/UmamiLogo";
import { JsValueWrap } from "./imported/JsValueWrap";

import { getErrorContext } from "./imported/utils/getErrorContext";
import { withTimeout } from "./imported/utils/withTimeout";
import { sendOperationErrorResponse, sendResponse, toTezosNetwork } from "./utils";
import { makeToolkit } from "@umami/tezos";
import { useEmbedApp } from "./EmbedAppContext";
import { useColor } from "./imported/style/useColor";

const SIGN_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export const OperationModalContent = ({
  operations,
  closeModal,
}: {
  operations: PartialTezosOperation[];
  closeModal: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { getNetwork, getUserData } = useEmbedApp();

  const color = useColor();

  const onClick = async () => {
    setIsLoading(true);
    try {
      const { secretKey } = await withTimeout(
        async () => Auth.forIDP(getUserData()!.typeOfLogin, "embed").getCredentials(),
        SIGN_TIMEOUT
      );
      const toolkit = await makeToolkit({
        type: "social",
        secretKey,
        network: toTezosNetwork(getNetwork()!),
      });

      const { opHash } = await toolkit.wallet.batch(operations.map(toTaquitoOperation)).send();

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

      <Accordion allowToggle={true}>
        <AccordionItem background={color("100")} border="none" borderRadius="8px">
          <AccordionButton>
            <Box flex="1" textAlign="left">
              JSON
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <JsValueWrap value={operations} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Button width="100%" isLoading={isLoading} onClick={onClick} size="lg">
        <Flex alignItems="center" justifyContent="flex-start" flex={1}>
          <GoogleLogoIcon position="absolute" />
          <Heading margin="auto" textColor={color("900")} fontSize="14px" lineHeight="18px">
            Sign with Google
          </Heading>
        </Flex>
      </Button>

      <Center marginTop="30px">
        <Text marginRight="10px" color={color("500")} fontSize="xs" lineHeight="14px">
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

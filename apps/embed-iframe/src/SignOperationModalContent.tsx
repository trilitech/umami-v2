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
import { InMemorySigner } from "@taquito/signer";
import { OpKind, TezosToolkit, type WalletParamsWithKind } from "@taquito/taquito";
import { useState } from "react";

import { GoogleLogoIcon } from "./assets/icons/GoogleLogo";
import { TezosLogoIcon } from "./assets/icons/TezosLogo";
import { UmamiLogoIcon } from "./assets/icons/UmamiLogo";
import { getGoogleCredentials } from "./imported/getGoogleCredentials";
import { JsValueWrap } from "./imported/JsValueWrap";
import colors from "./imported/style/colors";
import { getErrorContext } from "./imported/utils/getErrorContext";
import { sendOperationErrorResponse, sendResponse } from "./utils";

export const OperationModalContent: React.FC<{
  operations: PartialTezosOperation[];
  closeModal: () => void;
}> = ({ operations, closeModal }) => {
  const [isLoading, setIsLoading] = useState(false);

  console.log(operations);

  const onClick = async () => {
    setIsLoading(true);
    try {
      const { secretKey } = await getGoogleCredentials();
      const toolkit = new TezosToolkit("https://ghostnet.ecadinfra.com");
      const signer = new InMemorySigner(secretKey);
      toolkit.setSignerProvider(signer);

      console.log("sending request");

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
        <AccordionItem background={colors.gray[800]} border="none" borderRadius="8px">
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
          <Heading margin="auto" textColor={colors.white} fontSize="14px" lineHeight="18px">
            Sign with Google
          </Heading>
        </Flex>
      </Button>

      <Center marginTop="30px">
        <Text marginRight="10px" color={colors.gray[450]} fontSize="xs" lineHeight="14px">
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

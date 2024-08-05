import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  FormLabel,
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";

import { type BeaconSignPageProps } from "./BeaconSignPageProps";
import { Header } from "./Header";
import { useSignWithBeacon } from "./useSignWithBeacon";
import { useColor } from "../../../styles/useColor";
import { AddressTile } from "../../AddressTile/AddressTile";
import { JsValueWrap } from "../../JsValueWrap";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";

export const BatchSignPage = ({ operation, message }: BeaconSignPageProps) => {
  const { isSigning, onSign, network, fee, form } = useSignWithBeacon(operation, message);
  const color = useColor();
  const { signer } = operation;
  const transactionCount = operation.operations.length;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <Header message={message} />

          <ModalBody>
            <Accordion allowToggle>
              <AccordionItem background={color("100")} border="none" borderRadius="8px">
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
                    value={message.operationDetails}
                  />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            <FormLabel marginTop="16px">From</FormLabel>
            <AddressTile address={signer.address} />
            <Flex alignItems="center" justifyContent="space-between" marginY="12px" paddingX="4px">
              <Flex>
                <Text marginRight="4px" color={color("450")} size="sm">
                  Transactions:
                </Text>
                <Text color={color("400")} data-testid="transaction-length" size="sm">
                  {transactionCount}
                </Text>
              </Flex>
              <SignPageFee fee={fee} />
            </Flex>
          </ModalBody>

          <ModalFooter>
            <SignButton isLoading={isSigning} network={network} onSubmit={onSign} signer={signer} />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};

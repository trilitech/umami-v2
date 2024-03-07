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

import { BeaconSignPageProps } from "./BeaconSignPage";
import { Header } from "./Header";
import { useSignWithBeacon } from "./useSignWithBeacon";
import colors from "../../../style/colors";
import { JsValueWrap } from "../../AccountDrawer/JsValueWrap";
import { AddressTile } from "../../AddressTile/AddressTile";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { headerText } from "../SignPageHeader";

export const BatchSignPage: React.FC<BeaconSignPageProps> = ({ operation, fee, message }) => {
  const { isSigning, onSign } = useSignWithBeacon(operation, message);
  const { signer } = operation;
  const transactionCount = operation.operations.length;

  return (
    <ModalContent>
      <form>
        <Header message={message} mode="batch" operation={operation} />

        <ModalBody>
          <Accordion allowToggle={true}>
            <AccordionItem background={colors.gray[800]} border="none" borderRadius="8px">
              <AccordionButton>
                <Heading flex="1" textAlign="left" paddingY="6px" size="sm">
                  Operations
                </Heading>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <JsValueWrap overflowY="auto" maxHeight="200px" value={message.operationDetails} />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          <FormLabel marginTop="16px">From</FormLabel>
          <AddressTile address={signer.address} />
          <Flex alignItems="center" justifyContent="space-between" marginY="12px" paddingX="4px">
            <Flex>
              <Text marginRight="4px" color={colors.gray[450]} size="sm">
                Transactions:
              </Text>
              <Text color={colors.gray[400]} data-testid="transaction-length" size="sm">
                {transactionCount}
              </Text>
            </Flex>
            <SignPageFee fee={fee} />
          </Flex>
        </ModalBody>

        <ModalFooter>
          <SignButton
            isLoading={isSigning}
            onSubmit={onSign}
            signer={signer}
            text={headerText(operation.type, "batch")}
          />
        </ModalFooter>
      </form>
    </ModalContent>
  );
};

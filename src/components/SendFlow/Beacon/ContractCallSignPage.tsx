import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  FormLabel,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@chakra-ui/react";

import { BeaconSignPageProps } from "./BeaconSignPageProps";
import { Header } from "./Header";
import { useSignWithBeacon } from "./useSignWithBeacon";
import colors from "../../../style/colors";
import { ContractCall } from "../../../types/Operation";
import { useExecuteParams } from "../../../utils/beacon/useExecuteParams";
import { JsValueWrap } from "../../AccountDrawer/JsValueWrap";
import { AddressTile } from "../../AddressTile/AddressTile";
import AdvancedSettingsAccordion from "../../AdvancedSettingsAccordion";
import { TezTile } from "../../AssetTiles/TezTile";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { headerText } from "../SignPageHeader";

export const ContractCallSignPage: React.FC<BeaconSignPageProps> = ({
  operation,
  estimation,
  message,
}) => {
  const {
    amount: mutezAmount,
    contract,
    entrypoint,
    args,
  } = operation.operations[0] as ContractCall;
  const [executeParams, updateExecuteParams] = useExecuteParams(estimation);
  const { isSigning, onSign, network } = useSignWithBeacon(operation, message, estimation);

  return (
    <ModalContent>
      <form>
        <Header message={message} mode="single" operation={operation} />
        <ModalBody>
          <TezTile mutezAmount={mutezAmount} />

          <Flex alignItems="center" justifyContent="end" marginTop="12px">
            <SignPageFee fee={estimation.fee} />
          </Flex>

          <FormLabel marginTop="24px">From </FormLabel>
          <AddressTile address={operation.sender.address} />

          <FormLabel marginTop="24px">To </FormLabel>
          <AddressTile address={contract} />

          <FormLabel marginTop="24px">Contract Call Parameter</FormLabel>
          <Accordion allowToggle={true}>
            <AccordionItem background={colors.gray[800]} border="none" borderRadius="8px">
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  JSON
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <JsValueWrap value={{ entrypoint, values: args }} />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          <AdvancedSettingsAccordion estimation={executeParams} onChange={updateExecuteParams} />
        </ModalBody>
        <ModalFooter padding="16px 0 0 0">
          <SignButton
            isLoading={isSigning}
            network={network}
            onSubmit={onSign}
            signer={operation.signer}
            text={headerText(operation.type, "single")}
          />
        </ModalFooter>
      </form>
    </ModalContent>
  );
};

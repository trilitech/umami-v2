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
import { type ContractCall } from "@umami/core";
import { FormProvider } from "react-hook-form";

import { type BeaconSignPageProps } from "./BeaconSignPageProps";
import { Header } from "./Header";
import { useSignWithBeacon } from "./useSignWithBeacon";
import { useColor } from "../../../styles/useColor";
import { AddressTile } from "../../AddressTile/AddressTile";
import { AdvancedSettingsAccordion } from "../../AdvancedSettingsAccordion";
import { TezTile } from "../../AssetTiles/TezTile";
import { JsValueWrap } from "../../JsValueWrap";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";

export const ContractCallSignPage = ({ operation, message }: BeaconSignPageProps) => {
  const {
    amount: mutezAmount,
    contract,
    entrypoint,
    args,
  } = operation.operations[0] as ContractCall;
  const { isSigning, onSign, network, fee, form } = useSignWithBeacon(operation, message);
  const color = useColor();

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <Header message={message} />
          <ModalBody>
            <TezTile mutezAmount={mutezAmount} />

            <Flex alignItems="center" justifyContent="end" marginTop="12px">
              <SignPageFee fee={fee} />
            </Flex>

            <FormLabel marginTop="24px">From </FormLabel>
            <AddressTile address={operation.sender.address} />

            <FormLabel marginTop="24px">To </FormLabel>
            <AddressTile address={contract} />

            <FormLabel marginTop="24px">Contract Call Parameter</FormLabel>
            <Accordion allowToggle={true}>
              <AccordionItem background={color("100")} border="none" borderRadius="8px">
                <AccordionButton borderRadius="full">
                  <Box flex="1" textAlign="left">
                    JSON
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel padding="10px 0 0">
                  <JsValueWrap value={{ entrypoint, values: args }} />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <AdvancedSettingsAccordion />
          </ModalBody>
          <ModalFooter padding="16px 0 0 0">
            <SignButton
              isLoading={isSigning}
              network={network}
              onSubmit={onSign}
              signer={operation.signer}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};

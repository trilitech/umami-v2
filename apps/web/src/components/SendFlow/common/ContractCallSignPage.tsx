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
import { FormProvider, useForm } from "react-hook-form";

import { Header } from "./Header";
import { useColor } from "../../../styles/useColor";
import { AddressTile } from "../../AddressTile/AddressTile";
import { AdvancedSettingsAccordion } from "../../AdvancedSettingsAccordion";
import { TezTile } from "../../AssetTiles/TezTile";
import { JsValueWrap } from "../../JsValueWrap";
import { Titles } from "../../Titles";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { type CalculatedSignProps, type SdkSignPageProps } from "../utils";

export const ContractCallSignPage = ({
  operation,
  headerProps,
  isSigning,
  onSign,
  network,
  fee,
}: SdkSignPageProps & CalculatedSignProps) => {
  const {
    amount: mutezAmount,
    contract,
    entrypoint,
    args,
  } = operation.operations[0] as ContractCall;
  const color = useColor();
  const form = useForm({ defaultValues: { executeParams: operation.estimates } });

  return (
    <FormProvider {...form}>
      <ModalContent data-testid="ContractCallSignPage">
        <form>
          <Header headerProps={headerProps} title={Titles.ContractCallSignPage} />
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

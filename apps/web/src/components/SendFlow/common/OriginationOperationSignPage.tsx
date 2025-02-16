import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@chakra-ui/react";
import { type ContractOrigination } from "@umami/core";
import { FormProvider, useForm } from "react-hook-form";

import { useColor } from "../../../styles/useColor";
import { AdvancedSettingsAccordion } from "../../AdvancedSettingsAccordion";
import { JsValueWrap } from "../../JsValueWrap";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { type CalculatedSignProps, type SdkSignPageProps } from "../utils";
import { Header } from "./Header";
import { Titles } from "../../Titles";

export const OriginationOperationSignPage = ({
  operation,
  headerProps,
  isSigning,
  onSign,
  network,
  fee,
}: SdkSignPageProps & CalculatedSignProps) => {
  const color = useColor();
  const { code, storage } = operation.operations[0] as ContractOrigination;
  const form = useForm({ defaultValues: { executeParams: operation.estimates } });

  return (
    <FormProvider {...form}>
      <ModalContent data-testid="OriginationOperationSignPage">
        <form>
          <Header headerProps={headerProps} title={Titles.OriginationOperationSignPage} />

          <ModalBody data-testid="beacon-request-body">
            <Flex alignItems="center" justifyContent="end" marginTop="12px">
              <SignPageFee fee={fee} />
            </Flex>

            <Accordion marginTop="16px" allowToggle={true}>
              <AccordionItem background={color("100")} border="none" borderRadius="8px">
                <AccordionButton>
                  <Heading flex="1" textAlign="left" marginY="10px" size="md">
                    Code
                  </Heading>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel overflowY="auto" maxHeight="300px" padding="10px 0 0">
                  <JsValueWrap value={code} />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Accordion marginTop="16px" allowToggle={true}>
              <AccordionItem background={color("100")} border="none" borderRadius="8px">
                <AccordionButton>
                  <Heading flex="1" textAlign="left" marginY="10px" size="md">
                    Storage
                  </Heading>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel overflowY="auto" maxHeight="300px" padding="10px 0 0">
                  <JsValueWrap value={storage} />
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

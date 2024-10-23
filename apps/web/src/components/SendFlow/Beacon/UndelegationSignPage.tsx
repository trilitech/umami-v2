import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";

import { Header } from "./Header";
import { AddressTile } from "../../AddressTile/AddressTile";
import { AdvancedSettingsAccordion } from "../../AdvancedSettingsAccordion";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { type CalculatedSignProps, type SdkSignPageProps } from "../utils";

export const UndelegationSignPage = (
  { operation, headerProps }: SdkSignPageProps,
  calculatedSignProps: CalculatedSignProps
) => {
  const { isSigning, onSign, network, form, fee } = calculatedSignProps;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <Header headerProps={headerProps} />
          <ModalBody>
            <FormLabel>From</FormLabel>
            <AddressTile address={operation.signer.address} />

            <Flex alignItems="center" justifyContent="end" marginTop="12px" paddingX="4px">
              <SignPageFee fee={fee} />
            </Flex>

            <AdvancedSettingsAccordion />
          </ModalBody>
          <ModalFooter>
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

import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { type Delegation } from "@umami/core";
import { FormProvider } from "react-hook-form";

import { AddressTile } from "../../AddressTile/AddressTile";
import { AdvancedSettingsAccordion } from "../../AdvancedSettingsAccordion";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { SignPageHeader } from "../SignPageHeader";
import { type SignPageProps, useSignPageHelpers } from "../utils";

export const SignPage = (props: SignPageProps) => {
  const { operations: initialOperations } = props;
  const { fee, operations, estimationFailed, isLoading, form, signer, onSign } =
    useSignPageHelpers(initialOperations);
  const baker = (operations.operations[0] as Delegation).recipient;
  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader />
          <ModalBody>
            <FormLabel>From</FormLabel>
            <AddressTile address={signer.address} />

            <Flex
              alignItems="center"
              justifyContent="end"
              marginTop="12px"
              marginBottom="24px"
              paddingX="4px"
            >
              <Flex alignItems="center">
                <SignPageFee fee={fee} />
              </Flex>
            </Flex>

            <FormLabel>To</FormLabel>
            <AddressTile address={baker} />

            <AdvancedSettingsAccordion />
          </ModalBody>
          <ModalFooter>
            <SignButton
              isDisabled={estimationFailed}
              isLoading={isLoading}
              onSubmit={onSign}
              signer={signer}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};

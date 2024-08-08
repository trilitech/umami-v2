import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { type TezTransfer } from "@umami/core";
import { FormProvider } from "react-hook-form";

import { AddressTile } from "../../AddressTile/AddressTile";
import { AdvancedSettingsAccordion } from "../../AdvancedSettingsAccordion";
import { TezTile } from "../../AssetTiles/TezTile";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { SignPageHeader } from "../SignPageHeader";
import { type SignPageProps, useSignPageHelpers } from "../utils";

export const SignPage = (props: SignPageProps) => {
  const { mode, operations: initialOperations } = props;
  const { fee, operations, estimationFailed, isLoading, form, signer, onSign } = useSignPageHelpers(
    initialOperations,
    mode
  );

  const { amount: mutezAmount, recipient } = operations.operations[0] as TezTransfer;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader {...props} />
          <ModalBody>
            <TezTile mutezAmount={mutezAmount} />

            <Flex justifyContent="end" width="full" marginTop="12px">
              <SignPageFee fee={fee} />
            </Flex>

            <FormLabel width="full" marginTop="24px">
              From
            </FormLabel>
            <AddressTile address={operations.sender.address} />

            <FormLabel width="full" marginTop="24px">
              To
            </FormLabel>
            <AddressTile address={recipient} />

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

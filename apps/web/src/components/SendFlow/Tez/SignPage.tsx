import {
  Flex,
  FormControl,
  FormLabel,
  ModalBody,
  ModalContent,
  ModalFooter,
  useBreakpointValue,
} from "@chakra-ui/react";
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
  const { operations: initialOperations } = props;
  const { fee, operations, estimationFailed, isLoading, form, signer, onSign } =
    useSignPageHelpers(initialOperations);
  const hideBalance = useBreakpointValue({ base: true, md: false });

  const { amount: mutezAmount, recipient } = operations.operations[0] as TezTransfer;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader />
          <ModalBody gap="24px">
            <FormControl>
              <FormLabel width="full">Amount</FormLabel>
              <TezTile mutezAmount={mutezAmount} />
              <Flex justifyContent="end" width="full" marginTop="12px">
                <SignPageFee fee={fee} />
              </Flex>
            </FormControl>
            <FormControl>
              <FormLabel width="full">From</FormLabel>
              <AddressTile address={operations.sender.address} hideBalance={hideBalance} />
            </FormControl>
            <FormControl>
              <FormLabel width="full">To</FormLabel>
              <AddressTile address={recipient} hideBalance={hideBalance} />
            </FormControl>
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

import {
  Flex,
  FormControl,
  FormLabel,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@chakra-ui/react";
import { type FA12TokenBalance, type FA2TokenBalance, type TokenTransfer } from "@umami/core";
import { FormProvider } from "react-hook-form";

import { AddressTile } from "../../AddressTile/AddressTile";
import { AdvancedSettingsAccordion } from "../../AdvancedSettingsAccordion";
import { TokenTile } from "../../AssetTiles";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { SignPageHeader } from "../SignPageHeader";
import { type SignPageProps, useSignPageHelpers } from "../utils";

export const SignPage = (props: SignPageProps<{ token: FA12TokenBalance | FA2TokenBalance }>) => {
  const {
    operations: initialOperations,
    data: { token },
  } = props;
  const { fee, operations, estimationFailed, isLoading, form, signer, onSign } =
    useSignPageHelpers(initialOperations);

  const { amount, recipient } = operations.operations[0] as TokenTransfer;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader />
          <ModalBody gap="24px">
            <FormControl>
              <FormLabel width="full">Amount</FormLabel>
              <TokenTile amount={amount} token={token} />
              <Flex justifyContent="end" marginTop="12px" paddingX="4px">
                <SignPageFee fee={fee} />
              </Flex>
            </FormControl>
            <FormControl>
              <FormLabel width="full">From</FormLabel>
              <AddressTile address={operations.sender.address} />
            </FormControl>
            <FormControl>
              <FormLabel width="full">To</FormLabel>
              <AddressTile address={recipient} />
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

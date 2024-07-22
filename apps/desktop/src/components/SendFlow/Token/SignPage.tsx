import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { type FA12TokenBalance, type FA2TokenBalance, type TokenTransfer } from "@umami/core";
import { FormProvider } from "react-hook-form";

import { AddressTile } from "../../AddressTile/AddressTile";
import { AdvancedSettingsAccordion } from "../../AdvancedSettingsAccordion";
import { TokenTile } from "../../AssetTiles/TokenTile";
import { OperationSignerSelector } from "../OperationSignerSelector";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { type SignPageProps, useSignPageHelpers } from "../utils";

export const SignPage = (props: SignPageProps<{ token: FA12TokenBalance | FA2TokenBalance }>) => {
  const {
    mode,
    operations: initialOperations,
    data: { token },
  } = props;
  const { fee, operations, estimationFailed, isLoading, form, signer, reEstimate, onSign } =
    useSignPageHelpers(initialOperations, mode);

  const { amount, recipient } = operations.operations[0] as TokenTransfer;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader {...props} operationsType={operations.type} signer={operations.signer} />
          <ModalBody>
            <TokenTile amount={amount} token={token} />

            <Flex
              alignItems="center"
              justifyContent="end"
              marginTop="12px"
              marginBottom="24px"
              paddingX="4px"
            >
              <Flex>
                <SignPageFee fee={fee} />
              </Flex>
            </Flex>

            <FormLabel>From</FormLabel>
            <AddressTile marginBottom="24px" address={operations.sender.address} />
            <FormLabel>To</FormLabel>
            <AddressTile address={recipient} />

            <OperationSignerSelector
              isLoading={isLoading}
              operationType={operations.type}
              reEstimate={reEstimate}
              sender={operations.sender}
            />

            <AdvancedSettingsAccordion />
          </ModalBody>
          <ModalFooter>
            <SignButton
              isDisabled={estimationFailed}
              isLoading={isLoading}
              onSubmit={onSign}
              signer={signer}
              text={headerText(operations.type, mode)}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};

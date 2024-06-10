import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";

import { TokenTransfer } from "../../../types/Operation";
import { FA12TokenBalance, FA2TokenBalance } from "../../../types/TokenBalance";
import { useExecuteParams } from "../../../utils/beacon/useExecuteParams";
import { AddressTile } from "../../AddressTile/AddressTile";
import AdvancedSettingsAccordion from "../../AdvancedSettingsAccordion";
import { TokenTile } from "../../TokenTile";
import { OperationSignerSelector } from "../OperationSignerSelector";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { SignPageProps, useSignPageHelpers } from "../utils";

export const SignPage: React.FC<
  SignPageProps<{ token: FA12TokenBalance | FA2TokenBalance }>
> = props => {
  const {
    mode,
    operations: initialOperations,
    estimation,
    data: { token },
  } = props;
  const [executeParams, updateExecuteParams] = useExecuteParams(estimation);
  const {
    fee,
    operations,
    estimationFailed,
    isLoading,
    form,
    signer,
    reEstimate,
    onSign,
  } = useSignPageHelpers(executeParams, initialOperations, mode);

  const { amount, recipient } = operations.operations[0] as TokenTransfer;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader
            {...props}
            operationsType={operations.type}
            signer={operations.signer}
          />
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
            <AddressTile
              marginBottom="24px"
              address={operations.sender.address}
            />
            <FormLabel>To</FormLabel>
            <AddressTile address={recipient} />

            <OperationSignerSelector
              isLoading={isLoading}
              operationType={operations.type}
              reEstimate={reEstimate}
              sender={operations.sender}
            />

            <AdvancedSettingsAccordion
              {...executeParams}
              fee={fee}
              onChange={updateExecuteParams}
            />
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

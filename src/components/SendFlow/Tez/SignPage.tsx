import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";

import { TezTransfer } from "../../../types/Operation";
import { useExecuteParams } from "../../../utils/beacon/useExecuteParams";
import { AddressTile } from "../../AddressTile/AddressTile";
import AdvancedSettingsAccordion from "../../AdvancedSettingsAccordion";
import { TezTile } from "../../AssetTiles/TezTile";
import { OperationSignerSelector } from "../OperationSignerSelector";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { SignPageProps, useSignPageHelpers } from "../utils";

export const SignPage: React.FC<SignPageProps> = props => {
  const { mode, operations: initialOperations, estimation } = props;
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

  const { amount: mutezAmount, recipient } = operations
    .operations[0] as TezTransfer;

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
            <TezTile mutezAmount={mutezAmount} />

            <Flex alignItems="center" justifyContent="end" marginTop="12px">
              <SignPageFee fee={fee} />
            </Flex>

            <FormLabel marginTop="24px">From </FormLabel>
            <AddressTile address={operations.sender.address} />

            <FormLabel marginTop="24px">To </FormLabel>
            <AddressTile address={recipient} />

            <OperationSignerSelector
              isLoading={isLoading}
              operationType={operations.type}
              reEstimate={reEstimate}
              sender={operations.sender}
            />

            <AdvancedSettingsAccordion
              onChange={updateExecuteParams}
              {...executeParams}
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

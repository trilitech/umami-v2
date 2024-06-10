import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";

import { Delegation } from "../../../types/Operation";
import { useExecuteParams } from "../../../utils/beacon/useExecuteParams";
import { AddressTile } from "../../AddressTile/AddressTile";
import AdvancedSettingsAccordion from "../../AdvancedSettingsAccordion";
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
  const baker = (operations.operations[0] as Delegation).recipient;
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

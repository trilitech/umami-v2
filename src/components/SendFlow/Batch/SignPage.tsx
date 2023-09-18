import React from "react";
import { ModalContent, ModalFooter } from "@chakra-ui/react";
import { AccountOperations } from "../../../types/AccountOperations";
import { BigNumber } from "bignumber.js";
import { useSignPageHelpers } from "../utils";
import { OperationSignerSelector } from "../OperationSignerSelector";
import { headerText } from "../SignPageHeader";
import { FormProvider } from "react-hook-form";
import BatchModalBody from "../BatchModalBody";
import SignButton from "../SignButton";

export const SignPage: React.FC<{
  initialOperations: AccountOperations;
  initialFee: BigNumber;
}> = ({ initialOperations, initialFee }) => {
  const { fee, operations, estimationFailed, isLoading, signer, form, reEstimate, onSign } =
    useSignPageHelpers(initialFee, initialOperations, "batch");
  const title = headerText(operations.type, "batch");
  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <BatchModalBody
            fee={fee}
            title={title}
            signerAddress={signer.address}
            transactionCount={operations.operations.length}
          />

          <OperationSignerSelector
            sender={operations.sender}
            isDisabled={isLoading}
            operationType={operations.type}
            reEstimate={reEstimate}
          />

          <ModalFooter>
            <SignButton
              onSubmit={onSign}
              isLoading={isLoading}
              isDisabled={estimationFailed}
              signer={signer}
              text={title}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};

export default SignPage;

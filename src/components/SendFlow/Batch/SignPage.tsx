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
            signerAddress={signer.address}
            title={title}
            transactionCount={operations.operations.length}
          />

          <OperationSignerSelector
            isLoading={isLoading}
            operationType={operations.type}
            reEstimate={reEstimate}
            sender={operations.sender}
          />

          <ModalFooter>
            <SignButton
              isDisabled={estimationFailed}
              isLoading={isLoading}
              onSubmit={onSign}
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

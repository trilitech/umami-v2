import { ModalContent, ModalFooter } from "@chakra-ui/react";
import { BigNumber } from "bignumber.js";
import React from "react";
import { FormProvider } from "react-hook-form";

import { AccountOperations } from "../../../types/AccountOperations";
import { BatchModalBody } from "../BatchModalBody";
import { OperationSignerSelector } from "../OperationSignerSelector";
import { SignButton } from "../SignButton";
import { headerText } from "../SignPageHeader";
import { useSignPageHelpers } from "../utils";

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

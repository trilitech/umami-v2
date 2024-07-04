import { ModalContent, ModalFooter } from "@chakra-ui/react";
import { type EstimatedAccountOperations } from "@umami/core";
import { FormProvider } from "react-hook-form";

import { BatchModalBody } from "../BatchModalBody";
import { OperationSignerSelector } from "../OperationSignerSelector";
import { SignButton } from "../SignButton";
import { headerText } from "../SignPageHeader";
import { useSignPageHelpers } from "../utils";

export const SignPage = ({
  initialOperations,
}: {
  initialOperations: EstimatedAccountOperations;
}) => {
  const { operations, estimationFailed, isLoading, signer, form, reEstimate, onSign } =
    useSignPageHelpers(initialOperations, "batch");
  const title = headerText(operations.type, "batch");
  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <BatchModalBody
            operation={operations}
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

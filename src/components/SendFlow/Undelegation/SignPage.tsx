import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";
import { SignPageProps, useSignPageHelpers } from "../utils";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { OperationSignerSelector } from "../OperationSignerSelector";
import SignPageFee from "../SignPageFee";
import AddressTile from "../../AddressTile/AddressTile";
import SignButton from "../SignButton";

const SignPage: React.FC<SignPageProps> = props => {
  const { mode, operations: initialOperations, fee: initialFee } = props;
  const { fee, operations, estimationFailed, isLoading, form, signer, reEstimate, onSign } =
    useSignPageHelpers(initialFee, initialOperations, mode);
  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader {...props} operationsType={operations.type} />
          <ModalBody>
            <FormLabel>From</FormLabel>
            <AddressTile address={signer.address} />

            <Flex mt="12px" alignItems="center" justifyContent="end" px="4px">
              <SignPageFee fee={fee} />
            </Flex>

            <OperationSignerSelector
              sender={operations.sender}
              isLoading={isLoading}
              operationType={operations.type}
              reEstimate={reEstimate}
            />
          </ModalBody>
          <ModalFooter>
            <SignButton
              isLoading={isLoading}
              isDisabled={estimationFailed}
              signer={signer}
              onSubmit={onSign}
              text={headerText(operations.type, mode)}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
export default SignPage;

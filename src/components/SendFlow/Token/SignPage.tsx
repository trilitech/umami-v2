import { Flex, FormLabel, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";
import { SignPageProps, useSignPageHelpers } from "../utils";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { FATokenBalance, FATransfer } from "./FormPage";
import { OperationSignerSelector } from "../OperationSignerSelector";
import SignPageFee from "../SignPageFee";
import AddressTile from "../../AddressTile/AddressTile";
import SignButton from "../SignButton";
import TokenTile from "../../TokenTile";

const SignPage: React.FC<SignPageProps<{ token: FATokenBalance }>> = props => {
  const {
    mode,
    operations: initialOperations,
    fee: initialFee,
    data: { token },
  } = props;
  const { fee, operations, estimationFailed, isLoading, form, signer, reEstimate, onSign } =
    useSignPageHelpers(initialFee, initialOperations, mode);

  const { amount, recipient } = operations.operations[0] as FATransfer;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader {...props} operationsType={operations.type} />
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
export default SignPage;

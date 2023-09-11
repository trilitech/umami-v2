import {
  Flex,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";
import colors from "../../../style/colors";
import SignButton from "../../sendForm/components/SignButton";
import { SignPageProps, useSignPageHelpers } from "../utils";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { FATokenBalance, FATransfer } from "./FormPage";
import { formatTokenAmount, tokenSymbolSafe } from "../../../types/Token";
import { OperationSignerSelector } from "../OperationSignerSelector";
import SignPageFee from "../SignPageFee";
import AddressTile from "../../AddressTile/AddressTile";

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
      <ModalContent bg={colors.gray[900]} borderColor={colors.gray[700]} borderRadius="8px">
        <form>
          <SignPageHeader {...props} operationsType={operations.type} />
          <ModalBody>
            {/* TODO: Until we create a token tile we use a disabled input */}
            <FormLabel>Amount</FormLabel>
            <InputGroup>
              <Input
                data-testid="token-amount"
                isDisabled={true}
                type="number"
                variant="filled"
                disabled={true}
                value={formatTokenAmount(amount, token.metadata?.decimals)}
              />
              <InputRightElement pr="12px" data-testid="token-symbol">
                {tokenSymbolSafe(token)}
              </InputRightElement>
            </InputGroup>

            <Flex mt="12px" mb="24px" alignItems="center" justifyContent="end" px="4px">
              <Flex>
                <SignPageFee fee={fee} />
              </Flex>
            </Flex>

            <FormLabel>From</FormLabel>
            <AddressTile mb="24px" address={operations.sender.address} />
            <FormLabel>To</FormLabel>
            <AddressTile address={recipient} />

            <OperationSignerSelector
              sender={operations.sender}
              isDisabled={isLoading}
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

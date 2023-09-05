import {
  Flex,
  FormControl,
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
import { OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import SignButton from "../../sendForm/components/SignButton";
import { SignPageProps, useSignPageHelpers } from "../utils";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { FATokenBalance } from "./FormPage";
import { formatTokenAmount, tokenSymbol } from "../../../types/Token";
import { FA12Transfer } from "../../../types/Operation";
import { OperationSignerSelector } from "../OperationSignerSelector";
import SignPageFee from "../SignPageFee";

const SignPage: React.FC<SignPageProps<{ token: FATokenBalance }>> = props => {
  const {
    mode,
    operations: initialOperations,
    fee: initialFee,
    data: { token },
  } = props;
  const { fee, operations, estimationFailed, isLoading, form, signer, reEstimate, onSign } =
    useSignPageHelpers(initialFee, initialOperations, mode);

  const amount = (operations.operations[0] as FA12Transfer).amount;

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
              <InputRightElement pr={3} data-testid="token-symbol">
                {tokenSymbol(token)}
              </InputRightElement>
            </InputGroup>

            <Flex my={3} alignItems="center" justifyContent="end" px={1}>
              <Flex>
                <SignPageFee fee={fee} />
              </Flex>
            </Flex>

            {/* TODO: Add sender address tile */}
            <FormControl my={3}>
              <OwnedAccountsAutocomplete
                inputName="sender"
                label="From"
                allowUnknown={false}
                isDisabled
              />
            </FormControl>

            {/* TODO: Add recipient address tile */}

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

import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";
import { OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import SignButton from "../../sendForm/components/SignButton";
import { SignPageProps, useSignPageHelpers } from "../utils";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { OperationSignerSelector } from "../OperationSignerSelector";
import { BakerSmallTile } from "../../../views/delegations/BakerSmallTile";
import { Delegation } from "../../../types/Operation";
import SignPageFee from "../SignPageFee";

const SignPage: React.FC<SignPageProps> = props => {
  const { mode, operations: initialOperations, fee: initialFee } = props;
  const { fee, operations, estimationFailed, isLoading, form, signer, reEstimate, onSign } =
    useSignPageHelpers(initialFee, initialOperations, mode);
  const bakerPkh = (operations.operations[0] as Delegation).recipient.pkh;
  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader {...props} operationsType={operations.type} />
          <ModalBody>
            {/* TODO: Make AccountAutoComplete display the address and balance*/}
            <FormControl my={3}>
              <OwnedAccountsAutocomplete
                inputName="sender"
                label="From"
                allowUnknown={false}
                isDisabled
              />
            </FormControl>

            <Flex my={2} alignItems="center" justifyContent="end" px={1}>
              <Flex alignItems="center">
                <SignPageFee fee={fee} />
              </Flex>
            </Flex>

            <Box mb="42px">
              <FormLabel>To</FormLabel>
              <BakerSmallTile pkh={bakerPkh} />
            </Box>

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

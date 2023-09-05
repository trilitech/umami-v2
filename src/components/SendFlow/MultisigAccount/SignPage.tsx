import {
  Flex,
  FormControl,
  FormLabel,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";
import colors from "../../../style/colors";
import { OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import SignButton from "../../sendForm/components/SignButton";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { useSignPageHelpers, SignPageProps } from "../utils";
import { FormValues } from "./FormPage";
import SignPageFee from "../SignPageFee";

const SignPage: React.FC<SignPageProps<FormValues>> = props => {
  const {
    mode,
    operations: initialOperations,
    fee: initialFee,
    data: { threshold, signers, name },
  } = props;

  const { fee, operations, estimationFailed, isLoading, form, signer, onSign } = useSignPageHelpers(
    initialFee,
    initialOperations,
    mode
  );

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader {...props} operationsType={operations.type} />
          <ModalBody>
            <FormLabel>Contract Name</FormLabel>
            <Text
              bg={colors.gray[800]}
              p="14px"
              color={colors.gray[50]}
              borderRadius="6px"
              mb="24px"
              data-testid="contract-name"
            >
              {name}
            </Text>
            <FormControl mb="6px">
              {/* TODO: Until we separate the AccountTile from the AddressAutocomplete we use a disabled input */}
              <OwnedAccountsAutocomplete
                inputName="sender"
                label="Owner"
                allowUnknown={false}
                isDisabled
              />
            </FormControl>

            <Flex justifyContent="flex-end" mb="24px">
              <SignPageFee fee={fee} />
            </Flex>
            {/* TODO: add the Approvers list here when account tiles are ready */}
            <FormLabel>
              Min No. of approvals:
              <Text
                bg={colors.gray[800]}
                display="inline"
                p="15px"
                ml="16px"
                borderRadius="6px"
                color={colors.gray[300]}
                data-testid="threshold"
              >
                {threshold} out of {signers.length}
              </Text>
            </FormLabel>
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

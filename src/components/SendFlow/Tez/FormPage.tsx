import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import colors from "../../../style/colors";
import { parsePkh, RawPkh } from "../../../types/Address";
import { TezOperation } from "../../../types/Operation";
import { tezToMutez } from "../../../utils/format";
import { TEZ } from "../../../utils/tezos";
import { KnownAccountsAutocomplete, OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import { formDefaultValues, FormProps, FormSubmitButtons, useFormHelpers } from "../utils";
import SignPage from "./SignPage";

export type FormValues = {
  sender: RawPkh;
  recipient: RawPkh;
  prettyAmount: string;
};

const formValuesToOperation = (formValues: FormValues): TezOperation => ({
  type: "tez",
  amount: tezToMutez(formValues.prettyAmount).toString(),
  recipient: parsePkh(formValues.recipient),
});

const FormPage: React.FC<FormProps<FormValues>> = props => {
  const senderSelectorDisabled = !!props.sender;

  const { isLoading, onSingleSubmit, onAddToBatch } = useFormHelpers(
    props,
    FormPage,
    SignPage,
    formValuesToOperation
  );

  const form = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: formDefaultValues(props),
  });
  const {
    formState: { isValid, errors },
    register,
    handleSubmit,
  } = form;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <ModalHeader textAlign="center" p="40px 0 32px 0">
            <Text size="2xl" fontWeight="600">
              Send
            </Text>
            <Text textAlign="center" size="sm" color={colors.gray[400]}>
              Send one or insert into batch.
            </Text>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <FormControl mb={2} isInvalid={!!errors.sender}>
              <OwnedAccountsAutocomplete
                label="From"
                isDisabled={!!senderSelectorDisabled}
                inputName="sender"
                allowUnknown={false}
              />
              {errors.sender && (
                <FormErrorMessage data-testid="from-error">
                  {errors.sender.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl mb={2} isInvalid={!!errors.recipient}>
              <KnownAccountsAutocomplete label="To" inputName="recipient" allowUnknown />
              {errors.recipient && (
                <FormErrorMessage data-testid="recipient-error">
                  {errors.recipient.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl mb={2} mt={2} isInvalid={!!errors.prettyAmount}>
              <FormLabel>Amount</FormLabel>

              <InputGroup>
                <Input
                  isDisabled={isLoading}
                  type="number"
                  step="any"
                  variant="filled"
                  {...register("prettyAmount", {
                    // TODO: add validation on format (no more than 6 decimals after dot)
                    required: "Amount is required",
                  })}
                  placeholder="0.000000"
                />
                <InputRightElement>{TEZ}</InputRightElement>
              </InputGroup>
              {/* TODO: make a custom FormErrorMessage because its styling cannot be applied through theme.ts */}
              {errors.prettyAmount && (
                <FormErrorMessage data-testid="amount-error">
                  {errors.prettyAmount.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <FormSubmitButtons
              isLoading={isLoading}
              isValid={isValid}
              onSingleSubmit={handleSubmit(onSingleSubmit)}
              onAddToBatch={handleSubmit(onAddToBatch)}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
export default FormPage;

import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@chakra-ui/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { parsePkh, RawPkh } from "../../../types/Address";
import { TezTransfer } from "../../../types/Operation";
import { tezToMutez } from "../../../utils/format";
import { TEZ, TEZ_DECIMALS } from "../../../utils/tezos";
import { KnownAccountsAutocomplete, OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import {
  formDefaultValues,
  FormPageProps,
  FormSubmitButtons,
  getSmallestUnit,
  makeValidateDecimals,
} from "../utils";
import { SignPage } from "./SignPage";
import {
  useAddToBatchFormAction,
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "../onSubmitFormActionHooks";
import { FormErrorMessage } from "../../FormErrorMessage";
import { FormPageHeader } from "../FormPageHeader";

export type FormValues = {
  sender: RawPkh;
  recipient: RawPkh;
  prettyAmount: string;
};

export const FormPage: React.FC<FormPageProps<FormValues> & { showPreview?: boolean }> = ({
  showPreview = true,
  ...props
}) => {
  const openSignPage = useOpenSignPageFormAction({
    SignPage,
    signPageExtraData: undefined,
    FormPage,
    defaultFormPageProps: props,
    toOperation,
  });

  const addToBatch = useAddToBatchFormAction(toOperation);

  const {
    onFormSubmitActionHandlers: [onSingleSubmit, onBatchSubmit],
    isLoading,
  } = useHandleOnSubmitFormActions([openSignPage, addToBatch]);

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
          <FormPageHeader />
          <ModalBody>
            <FormControl isInvalid={!!errors.prettyAmount}>
              <FormLabel>Amount</FormLabel>

              <InputGroup>
                <Input
                  isDisabled={isLoading}
                  step={getSmallestUnit(TEZ_DECIMALS)}
                  type="number"
                  {...register("prettyAmount", {
                    required: "Amount is required",
                    validate: makeValidateDecimals(TEZ_DECIMALS),
                  })}
                  placeholder="0.000000"
                />
                <InputRightElement>{TEZ}</InputRightElement>
              </InputGroup>
              {errors.prettyAmount && (
                <FormErrorMessage data-testid="amount-error">
                  {errors.prettyAmount.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl marginTop="24px" isInvalid={!!errors.sender}>
              <OwnedAccountsAutocomplete
                allowUnknown={false}
                inputName="sender"
                isDisabled={!!props.sender}
                label="From"
              />
              {errors.sender && (
                <FormErrorMessage data-testid="from-error">
                  {errors.sender.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl marginTop="24px" isInvalid={!!errors.recipient}>
              <KnownAccountsAutocomplete allowUnknown inputName="recipient" label="To" />
              {errors.recipient && (
                <FormErrorMessage data-testid="recipient-error">
                  {errors.recipient.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <FormSubmitButtons
              isLoading={isLoading}
              isValid={isValid}
              onAddToBatch={handleSubmit(onBatchSubmit)}
              onSingleSubmit={handleSubmit(onSingleSubmit)}
              showPreview={showPreview}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};

const toOperation = (formValues: FormValues): TezTransfer => ({
  type: "tez",
  amount: tezToMutez(formValues.prettyAmount).toFixed(),
  recipient: parsePkh(formValues.recipient),
});

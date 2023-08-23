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
import { TezOperation } from "../../../types/Operation";
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
import SignPage from "./SignPage";
import {
  useAddToBatchFormAction,
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "../onSubmitFormActionHooks";
import { FormErrorMessage } from "../../FormErrorMessage";
import FormPageHeader from "../FormPageHeader";

export type FormValues = {
  sender: RawPkh;
  recipient: RawPkh;
  prettyAmount: string;
};

const toOperation = (formValues: FormValues): TezOperation => ({
  type: "tez",
  amount: tezToMutez(formValues.prettyAmount).toString(),
  recipient: parsePkh(formValues.recipient),
});

type TezFormPageProps = FormPageProps<FormValues> & { recipient?: RawPkh };

const tezFormDefaultValues = (props: TezFormPageProps) => ({
  ...formDefaultValues(props),
  // use the recipient from the form as fallback in case the recipient is not known
  // (e.g. when going back from the sign page)
  recipient: props.recipient || props.form?.recipient,
});

const FormPage: React.FC<TezFormPageProps> = props => {
  const { sender, recipient } = props;

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
    defaultValues: tezFormDefaultValues(props),
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
            <FormControl mb={2} isInvalid={!!errors.sender}>
              <OwnedAccountsAutocomplete
                label="From"
                isDisabled={!!sender}
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
              <KnownAccountsAutocomplete
                label="To"
                inputName="recipient"
                allowUnknown
                isDisabled={!!recipient}
              />
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
                  step={getSmallestUnit(TEZ_DECIMALS)}
                  variant="filled"
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
          </ModalBody>
          <ModalFooter>
            <FormSubmitButtons
              isLoading={isLoading}
              isValid={isValid}
              onSingleSubmit={handleSubmit(onSingleSubmit)}
              onAddToBatch={handleSubmit(onBatchSubmit)}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
export default FormPage;

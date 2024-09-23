import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@chakra-ui/react";
import { type TezTransfer } from "@umami/core";
import { type RawPkh, TEZ, TEZ_DECIMALS, parsePkh, tezToMutez } from "@umami/tezos";
import { FormProvider, useForm } from "react-hook-form";

import { SignPage } from "./SignPage";
import { useColor } from "../../../styles/useColor";
import { KnownAccountsAutocomplete } from "../../AddressAutocomplete";
import { TezTile } from "../../AssetTiles";
import { FormPageHeader } from "../FormPageHeader";
import {
  useAddToBatchFormAction,
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "../onSubmitFormActionHooks";
import {
  type FormPageProps,
  FormSubmitButton,
  formDefaultValues,
  getSmallestUnit,
  makeValidateDecimals,
} from "../utils";

export type FormValues = {
  sender: RawPkh;

  recipient: RawPkh;
  prettyAmount: string;
};

export const FormPage = ({ ...props }: FormPageProps<FormValues>) => {
  const color = useColor();
  const openSignPage = useOpenSignPageFormAction({
    SignPage,
    signPageExtraData: undefined,
    FormPage,
    defaultFormPageProps: props,
    toOperation,
  });

  const addToBatch = useAddToBatchFormAction(toOperation);

  const {
    onFormSubmitActionHandlers: [onSingleSubmit],
    isLoading,
  } = useHandleOnSubmitFormActions([openSignPage, addToBatch]);

  const form = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: formDefaultValues(props),
  });

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = form;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSingleSubmit)}>
          <FormPageHeader />
          <ModalBody gap="24px">
            <FormControl data-testid="available-balance" isInvalid={!!errors.sender}>
              <FormLabel>Available Balance</FormLabel>
              <TezTile address={props.sender?.address.pkh} />
            </FormControl>
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
                <InputRightElement marginRight="16px" color={color("400")} fontSize="16px">
                  {TEZ}
                </InputRightElement>
              </InputGroup>
              {errors.prettyAmount && (
                <FormErrorMessage data-testid="amount-error">
                  {errors.prettyAmount.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.recipient}>
              <KnownAccountsAutocomplete allowUnknown inputName="recipient" label="To" />
              {errors.recipient && (
                <FormErrorMessage data-testid="recipient-error">
                  {errors.recipient.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <FormSubmitButton isLoading={isLoading} />
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

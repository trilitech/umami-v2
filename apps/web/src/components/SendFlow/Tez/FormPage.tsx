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
import hj from "@hotjar/browser";
import { type TezTransfer } from "@umami/core";
import { useGetAccountBalanceDetails } from "@umami/state";
import { type RawPkh, TEZ, TEZ_DECIMALS, parsePkh, tezToMutez } from "@umami/tezos";
import { FormProvider, useForm } from "react-hook-form";

import { SignPage } from "./SignPage";
import { useColor } from "../../../styles/useColor";
import { KnownAccountsAutocomplete } from "../../AddressAutocomplete";
import { AddressTile } from "../../AddressTile";
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

  hj.stateChange("send_flow/tez_form_page");

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

  const { spendableBalance } = useGetAccountBalanceDetails(props.sender?.address.pkh ?? "");

  const handleValidateAmount = (value: string) => {
    const validationMessage = makeValidateDecimals(TEZ_DECIMALS)(value);

    if (typeof validationMessage === "string") {
      return validationMessage;
    }

    const amountToSend = tezToMutez(value);

    if (amountToSend.gt(spendableBalance)) {
      return "Insufficient funds";
    }

    return true;
  };
  return (
    <FormProvider {...form}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSingleSubmit)}>
          <FormPageHeader />
          <ModalBody gap="24px">
            {props.sender && (
              <FormControl data-testid="available-balance" isInvalid={!!errors.sender}>
                <FormLabel>From</FormLabel>
                <AddressTile address={props.sender.address} hideBalance={false} />
              </FormControl>
            )}
            <FormControl isInvalid={!!errors.prettyAmount}>
              <FormLabel>Amount</FormLabel>
              <InputGroup>
                <Input
                  isDisabled={isLoading}
                  step={getSmallestUnit(TEZ_DECIMALS)}
                  type="number"
                  {...register("prettyAmount", {
                    required: "Amount is required",
                    validate: handleValidateAmount,
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

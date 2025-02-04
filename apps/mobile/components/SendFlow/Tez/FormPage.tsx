import { type TezTransfer, getSmallestUnit } from "@umami/core";
import { type RawPkh, TEZ_DECIMALS, parsePkh, tezToMutez } from "@umami/tezos";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Form, Input, Label, Text, XStack, YStack } from "tamagui";

import { SignPage } from "./SignPage";
import { ModalCloseButton } from "../../ModalCloseButton";
import {
  useAddToBatchFormAction,
  useHandleOnSubmitFormActions,
  useOpenSignPageFormAction,
} from "../onSubmitFormActionHooks";
import {
  type FormPageProps,
  FormSubmitButton,
  formDefaultValues,
  makeValidateDecimals,
} from "../utils";

type FormValues = {
  sender: RawPkh;
  recipient: RawPkh;
  prettyAmount: string;
};

export const FormPage = ({ ...props }: FormPageProps<FormValues>) => {
  const openSignPage = useOpenSignPageFormAction({
    SignPage,
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
    defaultValues: formDefaultValues(props),
    mode: "onBlur",
  });

  const {
    formState: { errors },
    handleSubmit,
  } = form;

  return (
    <FormProvider {...form}>
      <Form>
        <ModalCloseButton />
        <YStack data-testid="available-balance" isInvalid={!!errors.sender}>
          <Label>Available Balance</Label>
          <Text>{props.sender?.address.pkh}</Text>
        </YStack>
        <YStack isInvalid={!!errors.prettyAmount}>
          <Label>Amount</Label>
          <Controller
            control={form.control}
            name="prettyAmount"
            render={({ field }) => (
              <Input
                {...field}
                isDisabled={isLoading}
                onChangeText={field.onChange}
                placeholder="0.000000"
                step={getSmallestUnit(TEZ_DECIMALS)}
                type="number"
              />
            )}
            rules={{
              required: "Amount is required",
              validate: makeValidateDecimals(TEZ_DECIMALS),
            }}
          />
          {errors.prettyAmount && (
            <Text data-testid="amount-error">{errors.prettyAmount.message}</Text>
          )}
        </YStack>
        <YStack isInvalid={!!errors.recipient}>
          <Label>To</Label>
          <Controller
            control={form.control}
            name="recipient"
            render={({ field }) => (
              <Input {...field} onChangeText={field.onChange} placeholder="tz1..." />
            )}
            rules={{
              required: "Recipient is required",
            }}
          />
          {errors.recipient && (
            <Text data-testid="recipient-error">{errors.recipient.message}</Text>
          )}
        </YStack>
        <XStack justifyContent="flex-end">
          <FormSubmitButton isLoading={isLoading} onPress={handleSubmit(onSingleSubmit)} />
        </XStack>
      </Form>
    </FormProvider>
  );
};

const toOperation = (formValues: FormValues): TezTransfer => ({
  type: "tez",
  amount: tezToMutez(formValues.prettyAmount).toFixed(),
  recipient: parsePkh(formValues.recipient),
});

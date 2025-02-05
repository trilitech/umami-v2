import { type TezTransfer, getSmallestUnit } from "@umami/core";
import { useGetAccountBalance, useTezToDollar } from "@umami/state";
import {
  type RawPkh,
  TEZ_DECIMALS,
  mutezToTez,
  parsePkh,
  prettyTezAmount,
  tezToMutez,
} from "@umami/tezos";
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
  const getBalance = useGetAccountBalance();
  const tezToDollar = useTezToDollar();

  const getCurrentBalance = () => {
    if (props.sender?.address.pkh) {
      return getBalance(props.sender.address.pkh);
    }
  };

  const getDollarBalance = () => {
    if (getCurrentBalance() === undefined) {
      return undefined;
    }

    const usdBalance = tezToDollar(mutezToTez(getCurrentBalance()!).toFixed());
    return usdBalance !== undefined && `$${usdBalance}`;
  };

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
        <YStack padding="$4" paddingTop="$10">
          <YStack data-testid="available-balance" isInvalid={!!errors.sender}>
            <Label fontSize="$6" fontWeight="bold">
              Available Balance
            </Label>
            <Text>
              {getCurrentBalance() !== undefined ? prettyTezAmount(getCurrentBalance()!) : "0.00 ꜩ"}
            </Text>
            {getDollarBalance() && <Text>{getDollarBalance()}</Text>}
          </YStack>
          <YStack isInvalid={!!errors.prettyAmount}>
            <Label fontSize="$5" fontWeight="bold">
              Amount
            </Label>
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
            <Label fontSize="$5" fontWeight="bold">
              To
            </Label>
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
          <XStack justifyContent="flex-end" marginTop="$4">
            <FormSubmitButton isLoading={isLoading} onPress={handleSubmit(onSingleSubmit)} />
          </XStack>
        </YStack>
      </Form>
    </FormProvider>
  );
};

const toOperation = (formValues: FormValues): TezTransfer => ({
  type: "tez",
  amount: tezToMutez(formValues.prettyAmount).toFixed(),
  recipient: parsePkh(formValues.recipient),
});

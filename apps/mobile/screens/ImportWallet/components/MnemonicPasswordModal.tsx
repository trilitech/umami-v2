import { defaultDerivationPathTemplate } from "@umami/tezos";
import { Controller, type FieldValues, useForm } from "react-hook-form";
import { Input, Spinner, Text, XStack, YStack } from "tamagui";

import { ModalCloseButton } from "../../../components/ModalCloseButton";
import { PrimaryButton, PrimaryButtonLabel } from "../../Onboarding/onboardingStyles";
import { useGetSetupPasswordSubmitHandler } from "../useGetSetupPasswordSubmitHandler";

type MnemonicPasswordModalProps<T extends FieldValues> = {
  mnemonic: T;
};

const ONBOARDING_MODE = "mnemonic";

export const MnemonicPasswordModal = <T extends FieldValues>({
  mnemonic,
}: MnemonicPasswordModalProps<T>) => {
  const form = useForm({
    mode: "onBlur",
    defaultValues: {
      password: "",
      derivationPath: defaultDerivationPathTemplate,
      curve: "ed25519",
    },
  });

  const { onSubmit, isLoading } = useGetSetupPasswordSubmitHandler(ONBOARDING_MODE);

  console.log("isLoading", isLoading);

  return (
    <YStack padding="$4" space="$4">
      <ModalCloseButton />
      <Text fontSize="$8" fontWeight="bold">
        Enter Password
      </Text>
      <Text color="$gray11" fontSize="$4">
        Enter the password you used to backup your recovery phrase to the cloud.
      </Text>
      <YStack space="$2">
        <Text fontSize="$4" fontWeight="bold">
          Password
        </Text>
        <Controller
          control={form.control}
          name="password"
          render={({ field }) => (
            <Input
              {...field}
              autoCapitalize="none"
              onChangeText={field.onChange}
              placeholder="Your password"
              secureTextEntry
              size="$4"
            />
          )}
          rules={{
            required: "Password is required",
          }}
        />
        {form.formState.errors.password && (
          <Text data-testid="amount-error">{form.formState.errors.password.message}</Text>
        )}
      </YStack>
      <PrimaryButton onPress={form.handleSubmit(formValues => onSubmit(formValues, { mnemonic }))}>
        <XStack alignItems="center" gap="$2">
          {isLoading && <Spinner color="white" size="small" />}
          <PrimaryButtonLabel>Import</PrimaryButtonLabel>
        </XStack>
      </PrimaryButton>
    </YStack>
  );
};

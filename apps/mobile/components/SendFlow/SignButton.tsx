import { type TezosToolkit } from "@taquito/taquito";
import type { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import {
  type ImplicitAccount,
  type LedgerAccount,
  type MnemonicAccount,
  type SecretKeyAccount,
  type SocialAccount,
} from "@umami/core";
import { useAsyncActionHandler, useGetSecretKey, useSelectedNetwork } from "@umami/state";
import { type Network, makeToolkit } from "@umami/tezos";
import { useCustomToast } from "@umami/utils";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { Button, Input, Label, Spinner, Text, View, YStack } from "tamagui";

import { forIDP } from "../../services/auth";

export const SignButton = ({
  signer,
  onSubmit,
  isLoading: externalIsLoading,
  isDisabled,
  text = "Confirm Transaction",
  network: preferredNetwork,
}: {
  onSubmit: (tezosToolkit: TezosToolkit) => Promise<BatchWalletOperation | void>;
  signer: ImplicitAccount;
  isLoading?: boolean;
  isDisabled?: boolean;
  text?: string; // TODO: after FillStep migration change to the header value from SignPage
  network?: Network;
}) => {
  const form = useForm<{ password: string }>({ mode: "onBlur", defaultValues: { password: "" } });
  const {
    handleSubmit,
    formState: { errors, isValid: isPasswordValid },
  } = form;
  let network = useSelectedNetwork();
  if (preferredNetwork) {
    network = preferredNetwork;
  }

  const {
    formState: { isValid: isOuterFormValid },
  } = useFormContext();

  const isButtonDisabled = isDisabled || !isPasswordValid || !isOuterFormValid;

  const getSecretKey = useGetSecretKey();
  const toast = useCustomToast();
  const { isLoading: internalIsLoading, handleAsyncAction } = useAsyncActionHandler();
  const isLoading = internalIsLoading || externalIsLoading;

  const onMnemonicSign = async ({ password }: { password: string }) =>
    handleAsyncAction(async () => {
      const secretKey = await getSecretKey(signer as MnemonicAccount, password);
      return onSubmit(await makeToolkit({ type: "mnemonic", secretKey, network }));
    });

  const onSecretKeySign = async ({ password }: { password: string }) =>
    handleAsyncAction(async () => {
      const secretKey = await getSecretKey(signer as SecretKeyAccount, password);
      return onSubmit(await makeToolkit({ type: "secret_key", secretKey, network }));
    });

  const onSocialSign = async () =>
    handleAsyncAction(async () => {
      const { secretKey } = await forIDP((signer as SocialAccount).idp).getCredentials();
      return onSubmit(await makeToolkit({ type: "social", secretKey, network }));
    });

  const onLedgerSign = async () =>
    handleAsyncAction(
      async () => {
        toast({
          id: "ledger-sign-toast",
          description: "Please approve the operation on your Ledger",
          status: "info",
          duration: 60000,
          isClosable: true,
        });
        return onSubmit(
          await makeToolkit({
            type: "ledger",
            account: signer as LedgerAccount,
            network,
          })
        );
      },
      (error: any) => ({
        description: `${error.message} Please connect your ledger, open Tezos app and try submitting transaction again`,
        status: "error",
      })
    ).finally(() => toast.close("ledger-sign-toast"));

  switch (signer.type) {
    case "secret_key":
    case "mnemonic":
      return (
        <View width="100%">
          <FormProvider {...form}>
            <YStack alignItems="start" space="$4" spacing="30px">
              <YStack isInvalid={!!errors.password}>
                <Label>Password</Label>
                <Controller
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <Input
                      {...field}
                      data-testid="password"
                      onChangeText={field.onChange}
                      secureTextEntry
                    />
                  )}
                  rules={{ required: "Password is required" }}
                />
                {errors.password && <Text>{errors.password.message}</Text>}
              </YStack>
              <Button
                width="100%"
                disabled={isButtonDisabled || isLoading}
                icon={isLoading ? <Spinner color="white" size="small" /> : null}
                onPress={handleSubmit(
                  signer.type === "mnemonic" ? onMnemonicSign : onSecretKeySign
                )}
                type="submit"
                variant="primary"
              >
                {text}
              </Button>
            </YStack>
          </FormProvider>
        </View>
      );
    case "social":
      return (
        <Button
          width="100%"
          disabled={isDisabled || isLoading}
          icon={isLoading ? <Spinner color="white" size="small" /> : null}
          onPress={onSocialSign}
          variant="primary"
        >
          {text}
        </Button>
      );
    case "ledger":
      return (
        <Button
          width="100%"
          disabled={isDisabled || isLoading}
          icon={isLoading ? <Spinner color="white" size="small" /> : null}
          onPress={onLedgerSign}
          variant="primary"
        >
          {text}
        </Button>
      );
  }
};

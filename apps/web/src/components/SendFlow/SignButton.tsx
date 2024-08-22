import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { type TezosToolkit } from "@taquito/taquito";
import type { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import {
  type ImplicitAccount,
  type LedgerAccount,
  type MnemonicAccount,
  type SecretKeyAccount,
  type SocialAccount,
} from "@umami/core";
import * as Auth from "@umami/social-auth";
import { useAsyncActionHandler, useGetSecretKey, useSelectedNetwork } from "@umami/state";
import { type Network, makeToolkit } from "@umami/tezos";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

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
  const toast = useToast();
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
      const { secretKey } = await Auth.forIDP((signer as SocialAccount).idp).getCredentials();
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
        <Box width="full">
          <FormProvider {...form}>
            <VStack alignItems="start" spacing="30px">
              <Divider />
              <FormControl isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <Input
                  data-testid="password"
                  type="password"
                  {...form.register("password", { minLength: 8, required: "Password is required" })}
                />
                {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
              </FormControl>
              <Button
                width="full"
                isDisabled={isButtonDisabled}
                isLoading={isLoading}
                onClick={handleSubmit(
                  signer.type === "mnemonic" ? onMnemonicSign : onSecretKeySign
                )}
                size="lg"
                type="submit"
                variant="primary"
              >
                {text}
              </Button>
            </VStack>
          </FormProvider>
        </Box>
      );
    case "social":
      return (
        <Button
          width="full"
          isDisabled={isDisabled}
          isLoading={isLoading}
          onClick={onSocialSign}
          size="lg"
          variant="primary"
        >
          {text}
        </Button>
      );
    case "ledger":
      return (
        <Button
          width="full"
          isDisabled={isDisabled}
          isLoading={isLoading}
          onClick={onLedgerSign}
          size="lg"
          variant="primary"
        >
          {text}
        </Button>
      );
  }
};

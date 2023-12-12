import { Box, Button, FormControl, useToast } from "@chakra-ui/react";
import { TezosToolkit } from "@taquito/taquito";
import React, { PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { GoogleAuthProps, useGetGoogleCredentials } from "../../GoogleAuth";
import {
  ImplicitAccount,
  LedgerAccount,
  MnemonicAccount,
  SecretKeyAccount,
} from "../../types/Account";
import { useGetSecretKey } from "../../utils/hooks/accountUtils";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { makeToolkit } from "../../utils/tezos";
import { FormErrorMessage } from "../FormErrorMessage";
import { PasswordInput } from "../PasswordInput";

export const SignWithGoogleButton: React.FC<
  PropsWithChildren<{
    isDisabled?: boolean;
    onSuccessfulAuth: GoogleAuthProps["onSuccessfulAuth"];
  }>
> = ({ isDisabled, onSuccessfulAuth, children }) => {
  const { isLoading, getCredentials } = useGetGoogleCredentials();

  return (
    <Button
      width="100%"
      isDisabled={isDisabled}
      isLoading={isLoading}
      onClick={() => getCredentials(onSuccessfulAuth)}
      size="lg"
    >
      {children}
    </Button>
  );
};

export const SignButton: React.FC<{
  onSubmit: (tezosToolkit: TezosToolkit) => Promise<void>;
  signer: ImplicitAccount;
  isLoading?: boolean;
  isDisabled?: boolean;
  text?: string; // TODO: after FillStep migration change to the header value from SignPage
}> = ({ signer, onSubmit, isLoading: externalIsLoading, isDisabled, text }) => {
  const form = useForm<{ password: string }>({ mode: "onBlur", defaultValues: { password: "" } });
  const {
    handleSubmit,
    formState: { errors, isValid },
  } = form;
  const network = useSelectedNetwork();
  const getSecretKey = useGetSecretKey();
  const toast = useToast();
  const { isLoading: internalIsLoading, handleAsyncAction } = useAsyncActionHandler();
  const isLoading = internalIsLoading || externalIsLoading;
  const buttonIsDisabled = isDisabled || !isValid;

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

  const onSocialSign = async (secretKey: string) =>
    handleAsyncAction(async () =>
      onSubmit(await makeToolkit({ type: "social", secretKey, network }))
    );

  const onLedgerSign = async () =>
    handleAsyncAction(async () => {
      toast({
        description: "Please open the Tezos app on your Ledger and approve the operation",
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
    });

  switch (signer.type) {
    case "secret_key":
    case "mnemonic":
      return (
        <Box width="100%">
          <FormProvider {...form}>
            <FormControl isInvalid={!!errors.password} marginY="16px">
              <PasswordInput data-testid="password" inputName="password" />
              {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
            </FormControl>
            <Button
              width="100%"
              marginTop="8px"
              isDisabled={buttonIsDisabled}
              isLoading={isLoading}
              onClick={handleSubmit(signer.type === "mnemonic" ? onMnemonicSign : onSecretKeySign)}
              size="lg"
              type="submit"
            >
              {text || "Submit Transaction"}
            </Button>
          </FormProvider>
        </Box>
      );
    case "social":
      return (
        <SignWithGoogleButton isDisabled={buttonIsDisabled} onSuccessfulAuth={onSocialSign}>
          {text || "Sign with Google"}
        </SignWithGoogleButton>
      );
    case "ledger":
      return (
        <Button
          width="100%"
          isDisabled={buttonIsDisabled}
          isLoading={isLoading}
          onClick={onLedgerSign}
          size="lg"
        >
          {text || "Sign with Ledger"}
        </Button>
      );
  }
};

import { Box, Button, FormControl, useToast } from "@chakra-ui/react";
import { TezosToolkit } from "@taquito/taquito";
import type { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";

import * as Auth from "../../auth";
import {
  ImplicitAccount,
  LedgerAccount,
  MnemonicAccount,
  SecretKeyAccount,
  SocialAccount,
} from "../../types/Account";
import { Network } from "../../types/Network";
import { useGetSecretKey } from "../../utils/hooks/getAccountDataHooks";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { makeToolkit } from "../../utils/tezos";
import { FormErrorMessage } from "../FormErrorMessage";
import { PasswordInput } from "../PasswordInput";

export const SignButton: React.FC<{
  onSubmit: (tezosToolkit: TezosToolkit) => Promise<BatchWalletOperation | void>;
  signer: ImplicitAccount;
  isLoading?: boolean;
  isDisabled?: boolean;
  text?: string; // TODO: after FillStep migration change to the header value from SignPage
  network?: Network;
}> = ({
  signer,
  onSubmit,
  isLoading: externalIsLoading,
  isDisabled,
  text,
  network: preferredNetwork,
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
        <Box width="100%">
          <FormProvider {...form}>
            <FormControl isInvalid={!!errors.password} marginY="16px">
              <PasswordInput data-testid="password" inputName="password" />
              {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
            </FormControl>
            <Button
              width="100%"
              marginTop="8px"
              isDisabled={isDisabled || !isPasswordValid}
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
        <Button
          width="100%"
          isDisabled={isDisabled}
          isLoading={isLoading}
          onClick={onSocialSign}
          size="lg"
        >
          {text || "Sign with Google"}
        </Button>
      );
    case "ledger":
      return (
        <Button
          width="100%"
          isDisabled={isDisabled}
          isLoading={isLoading}
          onClick={onLedgerSign}
          size="lg"
        >
          {text || "Sign with Ledger"}
        </Button>
      );
  }
};

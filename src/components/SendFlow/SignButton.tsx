import { Box, Button, FormControl, useToast } from "@chakra-ui/react";
import { TezosToolkit } from "@taquito/taquito";
import React, { PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { GoogleAuthProps, useGetGoogleCredentials } from "../../GoogleAuth";
import { ImplicitAccount, MnemonicAccount, LedgerAccount } from "../../types/Account";
import { useGetSecretKey } from "../../utils/hooks/accountUtils";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { makeToolkit } from "../../utils/tezos";
import { FormErrorMessage } from "../FormErrorMessage";
import PasswordInput from "../PasswordInput";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";

export const SignWithGoogleButton: React.FC<
  PropsWithChildren<{
    isDisabled?: boolean;
    onSuccessfulAuth: GoogleAuthProps["onSuccessfulAuth"];
  }>
> = ({ isDisabled, onSuccessfulAuth, children }) => {
  const { isLoading, getCredentials } = useGetGoogleCredentials();

  return (
    <Button
      onClick={() => getCredentials(onSuccessfulAuth)}
      width="100%"
      size="lg"
      isDisabled={isDisabled}
      isLoading={isLoading}
    >
      {children}
    </Button>
  );
};

const SignButton: React.FC<{
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

  const onSocialSign = async (secretKey: string) =>
    handleAsyncAction(async () =>
      onSubmit(await makeToolkit({ type: "social", secretKey, network }))
    );

  const onLedgerSign = async () =>
    handleAsyncAction(async () => {
      toast({
        title: "Request sent to Ledger",
        description: "Open the Tezos app on your Ledger and approve the operation",
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

  return (
    <Box width="100%">
      {signer.type === "mnemonic" && (
        <FormProvider {...form}>
          <FormControl isInvalid={!!errors.password} my={4}>
            <PasswordInput inputName="password" data-testid="password" />
            {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
          </FormControl>
          <Button
            onClick={handleSubmit(onMnemonicSign)}
            width="100%"
            size="lg"
            mt={2}
            isLoading={isLoading}
            isDisabled={buttonIsDisabled}
            type="submit"
          >
            {text || "Submit Transaction"}
          </Button>
        </FormProvider>
      )}
      {signer.type === "social" && (
        <SignWithGoogleButton onSuccessfulAuth={onSocialSign} isDisabled={buttonIsDisabled}>
          {text || "Sign with Google"}
        </SignWithGoogleButton>
      )}
      {signer.type === "ledger" && (
        <Button
          onClick={onLedgerSign}
          width="100%"
          size="lg"
          isLoading={isLoading}
          isDisabled={buttonIsDisabled}
        >
          {text || "Sign with Ledger"}
        </Button>
      )}
    </Box>
  );
};

export default SignButton;

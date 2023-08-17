import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { TezosToolkit } from "@taquito/taquito";
import React, { PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { GoogleAuthProps, useGetGoogleCredentials } from "../../../GoogleAuth";
import {
  ImplicitAccount,
  AccountType,
  MnemonicAccount,
  LedgerAccount,
} from "../../../types/Account";
import { useGetSecretKey } from "../../../utils/hooks/accountUtils";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { useSelectedNetwork } from "../../../utils/hooks/assetsHooks";
import { makeToolkit } from "../../../utils/tezos";
import { MIN_LENGTH } from "../../Onboarding/masterPassword/password/EnterAndConfirmPassword";

export const SignWithGoogleButton: React.FC<
  PropsWithChildren<{
    isDisabled?: boolean;
    onSuccessfulAuth: GoogleAuthProps["onSuccessfulAuth"];
  }>
> = ({ isDisabled, onSuccessfulAuth, children }) => {
  const { isLoading, getCredentials } = useGetGoogleCredentials();

  return (
    <Button
      variant="primary"
      onClick={() => getCredentials(onSuccessfulAuth)}
      width="100%"
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string }>({ mode: "onBlur", defaultValues: { password: "" } });
  const network = useSelectedNetwork();
  const getSecretKey = useGetSecretKey();
  const toast = useToast();
  const { isLoading: internalIsLoading, handleAsyncAction } = useAsyncActionHandler();
  const isLoading = internalIsLoading || externalIsLoading;
  const disableButton = isDisabled || !!errors.password;

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
      {signer.type === AccountType.MNEMONIC && (
        <>
          <FormControl isInvalid={!!errors.password} mt={4}>
            <FormLabel>Password:</FormLabel>
            <Input
              mb={2}
              type="password"
              autoComplete="off"
              {...register("password", {
                required: "Password is required",
                minLength: MIN_LENGTH,
              })}
              placeholder="Enter password..."
            />
            {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
          </FormControl>
          <Button
            onClick={handleSubmit(onMnemonicSign)}
            variant="primary"
            width="100%"
            mt={2}
            isLoading={isLoading}
            isDisabled={disableButton}
            type="submit"
          >
            {text || "Submit Transaction"}
          </Button>
        </>
      )}
      {signer.type === AccountType.SOCIAL && (
        <SignWithGoogleButton onSuccessfulAuth={onSocialSign} isDisabled={disableButton}>
          {text || "Sign with Google"}
        </SignWithGoogleButton>
      )}
      {signer.type === AccountType.LEDGER && (
        <Button
          onClick={onLedgerSign}
          variant="primary"
          width="100%"
          isLoading={isLoading}
          isDisabled={disableButton}
        >
          {text || "Sign with Ledger"}
        </Button>
      )}
    </Box>
  );
};

export default SignButton;

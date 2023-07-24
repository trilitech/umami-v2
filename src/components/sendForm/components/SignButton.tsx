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
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { GoogleAuth } from "../../../GoogleAuth";
import {
  ImplicitAccount,
  AccountType,
  MnemonicAccount,
  LedgerAccount,
} from "../../../types/Account";
import { TezosNetwork } from "../../../types/TezosNetwork";
import { useGetSecretKey } from "../../../utils/hooks/accountUtils";
import { makeToolkit } from "../../../utils/tezos";

const SignButton: React.FC<{
  onSubmit: (tezosToolkit: TezosToolkit) => Promise<void>;
  signerAccount: ImplicitAccount;
  network: TezosNetwork;
}> = ({ signerAccount, network, onSubmit }) => {
  const { register, handleSubmit, formState } = useForm<{ password: string }>({ mode: "onBlur" });
  const { errors } = formState;

  const getSecretKey = useGetSecretKey();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSign = async (getToolkit: () => Promise<TezosToolkit>) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    getToolkit()
      .then(onSubmit)
      .catch((error: any) => toast({ title: "Error", description: error.message, status: "error" }))
      .finally(() => setIsLoading(false));
  };

  const onMnemonicSign = async ({ password }: { password: string }) => {
    return handleSign(async () => {
      const secretKey = await getSecretKey(signerAccount as MnemonicAccount, password);
      return makeToolkit({ type: "mnemonic", secretKey, network });
    });
  };

  const onSocialSign = async (secretKey: string) => {
    return handleSign(() => makeToolkit({ type: "social", secretKey, network }));
  };

  const onLedgerSign = () =>
    handleSign(() =>
      makeToolkit({
        type: "ledger",
        account: signerAccount as LedgerAccount,
        network,
      })
    );

  return (
    <Box width="100%">
      {signerAccount.type === AccountType.MNEMONIC && (
        <>
          <FormControl isInvalid={!!errors.password} mt={4}>
            <FormLabel>Password:</FormLabel>
            <Input
              mb={2}
              type="password"
              autoComplete="off"
              {...register("password", {
                required: "Password is required",
                minLength: 4,
              })}
              placeholder="Enter password..."
            />
            {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
          </FormControl>
          <Button
            onClick={handleSubmit(onMnemonicSign)}
            bg="umami.blue"
            width="100%"
            mt={2}
            isLoading={isLoading}
            type="submit"
          >
            Submit Transaction
          </Button>
        </>
      )}
      {signerAccount.type === AccountType.SOCIAL && <GoogleAuth onSuccessfulAuth={onSocialSign} />}
      {signerAccount.type === AccountType.LEDGER && (
        <Button onClick={() => onLedgerSign()} bg="umami.blue" width="100%" isLoading={isLoading}>
          Sign with Ledger
        </Button>
      )}
    </Box>
  );
};

export default SignButton;

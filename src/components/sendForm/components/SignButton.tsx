import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { TezosToolkit } from "@taquito/taquito";
import React from "react";
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
import { useSafeLoading } from "../../../utils/hooks/useSafeLoading";
import { makeToolkit } from "../../../utils/tezos";

const SignButton: React.FC<{
  onSubmit: (tezosToolkit: TezosToolkit) => Promise<void>;
  signer: ImplicitAccount;
  network: TezosNetwork;
}> = ({ signer, network, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string }>({ mode: "onBlur" });

  const getSecretKey = useGetSecretKey();
  const { isLoading, withLoading } = useSafeLoading();

  const onMnemonicSign = async ({ password }: { password: string }) =>
    withLoading(async () => {
      const secretKey = await getSecretKey(signer as MnemonicAccount, password);
      onSubmit(await makeToolkit({ type: "mnemonic", secretKey, network }));
    });

  const onSocialSign = async (secretKey: string) =>
    withLoading(async () => onSubmit(await makeToolkit({ type: "social", secretKey, network })));

  const onLedgerSign = async () =>
    withLoading(async () =>
      onSubmit(
        await makeToolkit({
          type: "ledger",
          account: signer as LedgerAccount,
          network,
        })
      )
    );

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
      {signer.type === AccountType.SOCIAL && <GoogleAuth onSuccessfulAuth={onSocialSign} />}
      {signer.type === AccountType.LEDGER && (
        <Button onClick={onLedgerSign} bg="umami.blue" width="100%" isLoading={isLoading}>
          Sign with Ledger
        </Button>
      )}
    </Box>
  );
};

export default SignButton;

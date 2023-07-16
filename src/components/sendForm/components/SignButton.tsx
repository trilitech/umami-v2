import { TezosNetwork } from "@airgap/tezos";
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { GoogleAuth } from "../../../GoogleAuth";
import { ImplicitAccount, AccountType } from "../../../types/Account";
import { LedgerToolkitConfig, SecretkeyToolkitConfig } from "../../../types/ToolkitConfig";
import { useGetSk } from "../../../utils/hooks/accountUtils";

const SignButton: React.FC<{
  onSubmit: (config: LedgerToolkitConfig | SecretkeyToolkitConfig) => void;
  signerAccount: ImplicitAccount;
  isLoading: boolean;
  network: TezosNetwork;
}> = ({ signerAccount, isLoading, network, onSubmit }) => {
  const { register, handleSubmit, formState } = useForm<{ password: string }>();

  const getSk = useGetSk();
  const { isValid, isDirty } = formState;

  const type = signerAccount.type;
  const isGoogleSSO = type === AccountType.SOCIAL;
  const isLedger = type === AccountType.LEDGER;
  const isMnemonic = type === AccountType.MNEMONIC;

  const onSubmitGoogleSSO = (sk: string) => {
    if (signerAccount.type !== AccountType.SOCIAL) {
      throw new Error(`Wrong signing method called`);
    }

    const config: SecretkeyToolkitConfig = {
      type: "secretKey",
      sk,
      network,
    };

    onSubmit(config);
  };

  const onSubmitLedger = () => {
    if (signerAccount.type !== AccountType.LEDGER) {
      throw new Error(`Wrong signing method called`);
    }

    const config: LedgerToolkitConfig = {
      type: "ledger",
      network,
      derivationPath: signerAccount.derivationPath,
      derivationType: signerAccount.curve,
    };

    onSubmit(config);
  };

  const onSubmitNominal = async ({ password }: { password: string }) => {
    if (signerAccount.type !== AccountType.MNEMONIC) {
      throw new Error(`Wrong signing method called`);
    }

    // TODO disabled submit button since it"s loading
    const sk = await getSk(signerAccount, password);
    const config: SecretkeyToolkitConfig = {
      type: "secretKey",
      sk,
      network,
    };

    onSubmit(config);
  };
  return (
    <Box>
      {isMnemonic ? (
        <FormControl isInvalid={isDirty && !isValid} mt={4}>
          <FormLabel>Password:</FormLabel>
          <Input
            mb={2}
            type="password"
            {...register("password", {
              required: true,
              minLength: 4,
            })}
            placeholder="Enter password..."
          />
        </FormControl>
      ) : null}
      {isGoogleSSO ? (
        <GoogleAuth
          isLoading={isLoading}
          bg="umami.blue"
          width="100%"
          buttonText="Sign with Google"
          onReceiveSk={onSubmitGoogleSSO}
        />
      ) : (
        <Button
          onClick={handleSubmit(isLedger ? onSubmitLedger : onSubmitNominal)}
          bg="umami.blue"
          width="100%"
          isLoading={isLoading}
          type="submit"
          isDisabled={(!isLedger && !isValid) || isLoading}
        >
          {isLedger ? <>Sign with Ledger</> : <>Submit Transaction</>}
        </Button>
      )}
    </Box>
  );
};

export default SignButton;

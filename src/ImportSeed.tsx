import { useForm } from "react-hook-form";

import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { InMemorySigner } from "@taquito/signer";
import { useState } from "react";
import { MakiLogo } from "./components/MakiLogo";
import { seedPhrase } from "./mocks/seedPhrase";
import { AccountType, LedgerAccount, SocialAccount } from "./types/Account";
import { encrypt } from "./utils/aes";
import { restoreEncryptedAccounts } from "./utils/restoreAccounts";
import accountsSlice from "./utils/store/accountsSlice";
import { useAppDispatch } from "./utils/store/hooks";
import { getFingerPrint } from "./utils/tezos";
import { GoogleAuth } from "./GoogleAuth";
import { LedgerAuth } from "./LedgerAuth";

type FormValues = {
  seedPhrase: string;
};

const accountsActions = accountsSlice.actions;

export const EnterSeed: React.FC<{ onSubmit: (s: string) => void }> = ({
  onSubmit: onSeedSubmit,
}) => {
  const { register, handleSubmit, formState, setValue, trigger } =
    useForm<FormValues>({
      mode: "onBlur",
    });

  const { errors, isValid } = formState;

  const onSubmit = async (data: FormValues) => {
    onSeedSubmit(data.seedPhrase);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Center>
        <VStack width={300}>
          <MakiLogo />
          <Heading>Restore Accounts</Heading>
          <FormControl isInvalid={!!errors.seedPhrase}>
            <FormLabel>Seed phrase</FormLabel>
            <Textarea
              {...register("seedPhrase", {
                required: true,
                pattern: {
                  value: /^(((\w+ ){23}|(\w+ ){11})(\w+)| )$/, // 12 or 24 words. No trailing space.
                  message: "Must be a 24 or 12 word seed phrase",
                },
              })}
              placeholder="Enter your seed phrase..."
            />
            {errors.seedPhrase ? (
              <FormErrorMessage>
                {errors.seedPhrase?.message as string}
              </FormErrorMessage>
            ) : (
              <FormHelperText>
                Enter your seed phrase to restore accounts
              </FormHelperText>
            )}
          </FormControl>
          <Button
            type="submit"
            colorScheme="gray"
            isDisabled={!isValid}
            title="Restore accounts"
          >
            Restore accounts
          </Button>

          <Button
            onClick={(_) => {
              setValue("seedPhrase", seedPhrase);
              trigger();
            }}
            colorScheme="gray"
            title="Restore accounts"
          >
            Enter test seed phrase
          </Button>
        </VStack>
      </Center>
    </form>
  );
};

const MIN_LENGTH = 4;

const useRestore = () => {
  const dispatch = useAppDispatch();
  return async (seedPhrase: string, password: string) => {
    const seedFingerPrint = await getFingerPrint(seedPhrase);
    const accounts = await restoreEncryptedAccounts(seedPhrase, password);
    dispatch(
      accountsActions.addSecret({
        hash: seedFingerPrint,
        secret: await encrypt(seedPhrase, password),
      })
    );
    dispatch(accountsActions.add(accounts));
  };
};

export const ConfirmPassword: React.FC<{
  seedPhrase: string;
  onCancel: (a: void) => void;
}> = (props) => {
  type ConfirmPasswordFormValues = {
    password: string;
    confirm: string;
  };

  const toast = useToast();
  const restore = useRestore();
  const { register, handleSubmit, formState, watch } =
    useForm<ConfirmPasswordFormValues>({
      mode: "onBlur",
    });

  const { errors, isValid } = formState;

  const [isLoading, setIsloading] = useState(false);

  const onSubmit = async (data: ConfirmPasswordFormValues) => {
    setIsloading(true);
    try {
      await restore(props.seedPhrase, data.password);
      toast({
        title: "Successfully restored accounts!",
      });
    } catch (error) {
      toast({
        title: "Failed to restore accounts!",
        description: (error as Error).message, // !!
      });
    }

    setIsloading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Center>
        <VStack width={300}>
          <MakiLogo />
          <Heading>Enter and confirm Password</Heading>
          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              isDisabled={isLoading}
              type="password"
              {...register("password", {
                required: true,
                minLength: MIN_LENGTH,
              })}
              placeholder="Enter your new password..."
            />
          </FormControl>

          <FormControl isInvalid={!!errors.confirm}>
            <FormLabel>Confirm password</FormLabel>
            <Input
              isDisabled={isLoading}
              type="password"
              {...register("confirm", {
                required: true,
                minLength: MIN_LENGTH,
                validate: (val: string) => {
                  if (watch("password") !== val) {
                    return "Your passwords do no match";
                  }
                },
              })}
              placeholder="Confirm your new password..."
            />
            {errors.confirm ? (
              <FormErrorMessage>
                {errors.confirm?.message as string}
              </FormErrorMessage>
            ) : (
              <FormHelperText>Enter and confirm new password</FormHelperText>
            )}
          </FormControl>
          <Button
            isDisabled={!isValid || isLoading}
            isLoading={isLoading}
            type="submit"
            colorScheme="gray"
            title="Submit"
          >
            Submit
          </Button>
          <Button
            isDisabled={isLoading}
            onClick={(_) => props.onCancel()}
            colorScheme="gray"
            title="Submit"
          >
            Cancel
          </Button>
        </VStack>
      </Center>
    </form>
  );
};

const AddLedgerAccount = () => {
  const dispatch = useAppDispatch();
  const handlePk = async (pk: string, pkh: string) => {
    const account: LedgerAccount = {
      type: AccountType.LEDGER,
      pk: pk,
      pkh: pkh,
      label: "Ledger"
    };

    dispatch(accountsActions.add([account]));
  };

  return <LedgerAuth onReceivePk={handlePk} />;
};


const AddGoogleAccount = () => {
  const dispatch = useAppDispatch();
  const handleSk = async (sk: string) => {
    const signer = new InMemorySigner(sk);
    const account: SocialAccount = {
      type: AccountType.SOCIAL,
      pk: await signer.publicKey(),
      pkh: await signer.publicKeyHash(),
      idp: "google",
      label: "Google Account",
    };

    dispatch(accountsActions.add([account]));
  };

  return <GoogleAuth onReceiveSk={handleSk} />;
};

function ImportSeed() {
  const [seed, setSeed] = useState<string>();

  return seed ? (
    <ConfirmPassword seedPhrase={seed} onCancel={(_) => setSeed(undefined)} />
  ) : (
    <VStack>
      <EnterSeed onSubmit={(s) => setSeed(s)} />
      <AddGoogleAccount />
      <AddLedgerAccount />
    </VStack>
  );
}

export default ImportSeed;

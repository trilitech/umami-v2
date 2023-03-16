import { restoreAccounts } from "./utils/restoreAccounts";

import { useForm } from "react-hook-form";

import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { MakiLogo } from "./components/MakiLogo";
import { seedPhrase } from "./mocks/seedPhrase";
import accountsSlice from "./utils/store/accountsSlice";
import { useAppDispatch } from "./utils/store/hooks";

type FormValues = {
  seedPhrase: string;
};

const accountsActions = accountsSlice.actions;

function ImportSeed() {
  const toast = useToast();
  const [isLoading, setIsloading] = useState(false); // TODO replace this with react query
  const dispatch = useAppDispatch();

  const { register, handleSubmit, formState, setValue, trigger } =
    useForm<FormValues>({
      mode: "onBlur",
    });

  const { errors, isValid } = formState;
  // Would have called this handleSubmit but its already taken
  const onSubmit = async (data: FormValues) => {
    setIsloading(true);
    try {
      const accounts = await restoreAccounts(data.seedPhrase);
      dispatch(accountsActions.add(accounts));
      toast({ title: "Accounts restored!" });
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
          <Heading>Restore Accounts</Heading>
          <FormControl isInvalid={!!errors.seedPhrase}>
            <FormLabel>Seed phrase</FormLabel>
            <Textarea
              disabled={isLoading}
              {...register("seedPhrase", {
                required: true,
                pattern: {
                  value: /^(((\w+ ){23}|(\w+ ){11})(\w+)| )$/, // 12 or 24 words. No trailing space.
                  message: "Must be a 24 or 12 word seed phrase",
                },
              })}
              placeholder="Enter your seed phrase..."
            />
            {!!errors.seedPhrase ? (
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
            isLoading={isLoading}
            type="submit"
            colorScheme="gray"
            isDisabled={!isValid || isLoading}
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
            isDisabled={isLoading}
            title="Restore accounts"
          >
            Enter test seed phrase
          </Button>
        </VStack>
      </Center>
    </form>
  );
}

export default ImportSeed;

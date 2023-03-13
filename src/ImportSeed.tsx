import { restoreAccount } from "./utils/restoreAccounts";

import { useForm } from "react-hook-form";
import makiLogo from "./assets/maki-default.png";

import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

type FormValues = {
  seedPhrase: string;
};
function ImportSeed() {
  const toast = useToast();
  const [isLoading, setIsloading] = useState(false); // TODO replace this with react query

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: "onBlur" });

  // Would have called this handleSubmit but its already taken
  const onSubmit = async (data: FormValues) => {
    setIsloading(true);
    try {
      const account = await restoreAccount(data.seedPhrase);
      toast({ title: "Accounts restored!", description: account.pkh });
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
          <Image
            boxSize="100px"
            objectFit="cover"
            src={makiLogo}
            alt="Maki logo"
          />

          <Heading>Restore Accounts</Heading>
          <FormControl isInvalid={!!errors.seedPhrase}>
            <FormLabel>Seed phrase</FormLabel>
            <Textarea
              {...register("seedPhrase", {
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
            colorScheme="orange"
            isDisabled={!isValid || isLoading}
            title="Restore accounts"
          >
            Restore accounts
          </Button>
        </VStack>
      </Center>
    </form>
  );
}

export default ImportSeed;

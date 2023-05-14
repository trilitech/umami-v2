import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { seedPhrase } from "../../../mocks/seedPhrase";

type FormValues = {
  seedPhrase: string;
};

// TODO style this accoding to Figma
// Enforce sanity check on seedphrase
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
              <FormErrorMessage>{errors.seedPhrase.message}</FormErrorMessage>
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

import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

const MIN_LENGTH = 4;

export const EnterAndComfirmPassword: React.FC<{
  onSubmit: (password: string) => void;
  isLoading: boolean;
}> = ({ onSubmit: onSubmitPassword, isLoading }) => {
  type ConfirmPasswordFormValues = {
    password: string;
    confirm: string;
  };

  const { register, handleSubmit, formState, watch } =
    useForm<ConfirmPasswordFormValues>();

  const { errors, isValid } = formState;

  const onSubmit = async (data: ConfirmPasswordFormValues) => {
    onSubmitPassword(data.confirm);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Center>
        <VStack width={300}>
          <Heading>Enter and confirm Password</Heading>
          <FormControl isInvalid={!isValid}>
            <FormLabel>Password</FormLabel>
            <Input
              isDisabled={isLoading}
              type="text"
              {...register("password", {
                required: true,
              })}
              placeholder="Enter account name..."
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
              <FormHelperText>
                Enter and confirm your new master password
              </FormHelperText>
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
        </VStack>
      </Center>
    </form>
  );
};

import { Button, Center, FormControl, FormLabel, Heading, Input, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { SupportedIcons } from "../../../CircleIcon";
import ModalContentWrapper from "../../ModalContentWrapper";
import { MIN_LENGTH } from "./EnterAndConfirmPassword";
import { FormErrorMessage } from "../../../FormErrorMessage";

const EnterPassword = ({
  onSubmit: onSubmitPassword,
  isLoading,
}: {
  onSubmit: (s: string) => void;
  isLoading: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<{
    password: string;
  }>({
    mode: "onBlur",
  });

  const onSubmit = (p: { password: string }) => {
    onSubmitPassword(p.password);
  };

  return (
    <ModalContentWrapper
      icon={SupportedIcons.diamont}
      title="Umami Master Password"
      subtitle="Enter your master password for Umami."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Center>
          <VStack width={300}>
            <Heading>Enter Password to continue</Heading>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                data-testid="password"
                autoComplete="off"
                type="password"
                {...register("password", {
                  required: true,
                  minLength: {
                    value: MIN_LENGTH,
                    message: `Password must be at least ${MIN_LENGTH} characters long`,
                  },
                })}
                placeholder="Enter your password..."
              />
              {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
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
    </ModalContentWrapper>
  );
};

export default EnterPassword;

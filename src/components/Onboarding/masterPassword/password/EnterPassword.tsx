import { Button, Center, FormControl, Heading, VStack } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { SupportedIcons } from "../../../CircleIcon";
import ModalContentWrapper from "../../ModalContentWrapper";
import { FormErrorMessage } from "../../../FormErrorMessage";
import PasswordInput from "../../../PasswordInput";

const EnterPassword = ({
  onSubmit: onSubmitPassword,
  isLoading,
}: {
  onSubmit: (s: string) => void;
  isLoading: boolean;
}) => {
  const form = useForm<{
    password: string;
  }>({
    mode: "onBlur",
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  const onSubmit = (p: { password: string }) => {
    onSubmitPassword(p.password);
  };

  return (
    <ModalContentWrapper
      icon={SupportedIcons.diamont}
      title="Umami Master Password"
      subtitle="Enter your master password for Umami."
    >
      <FormProvider {...form}>
        <Center>
          <VStack width={300}>
            <Heading>Enter Password to continue</Heading>
            <FormControl isInvalid={!!errors.password}>
              <PasswordInput
                inputName="password"
                label="Password"
                required="Password is required"
                data-testid="password"
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
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </VStack>
        </Center>
      </FormProvider>
    </ModalContentWrapper>
  );
};

export default EnterPassword;

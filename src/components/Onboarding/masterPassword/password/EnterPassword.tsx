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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Center>
            <VStack width={300}>
              <Heading>Enter Password to continue</Heading>
              <FormControl isInvalid={!!errors.password}>
                <PasswordInput inputName="password" data-testid="password" />
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
      </FormProvider>
    </ModalContentWrapper>
  );
};

export default EnterPassword;

import { Button, Center, FormControl, VStack } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { SupportedIcons } from "../../../CircleIcon";
import ModalContentWrapper from "../../ModalContentWrapper";
import { FormErrorMessage } from "../../../FormErrorMessage";
import PasswordInput from "../../../PasswordInput";

export const MIN_LENGTH = 8;

export const EnterAndConfirmPassword: React.FC<{
  onSubmit: (password: string) => void;
  isLoading: boolean;
}> = ({ onSubmit: onSubmitPassword, isLoading }) => {
  type ConfirmPasswordFormValues = {
    password: string;
    confirm: string;
  };

  const form = useForm<ConfirmPasswordFormValues>({
    mode: "onBlur",
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = form;

  const onSubmit = async (data: ConfirmPasswordFormValues) => {
    onSubmitPassword(data.confirm);
  };

  return (
    <ModalContentWrapper
      icon={SupportedIcons.diamont}
      title="Umami Master Password"
      subtitle="Please choose a master password for Umami. You will need to use this password in order to perform any operations within Umami."
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Center>
            <VStack width={300}>
              <FormControl isInvalid={!!errors.password}>
                <PasswordInput
                  inputName="password"
                  data-testid="password"
                  placeholder="Enter master password"
                />
                {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
              </FormControl>

              <FormControl isInvalid={!!errors.confirm}>
                <PasswordInput
                  inputName="confirm"
                  label="Confirm Password"
                  data-testid="confirmation"
                  placeholder="Confirm your password"
                  required="Confirmation is required"
                  validate={(val: string) =>
                    getValues("password") === val || "Your passwords do no match"
                  }
                />
                {errors.confirm && <FormErrorMessage>{errors.confirm.message}</FormErrorMessage>}
              </FormControl>
              <Button
                mt={5}
                isDisabled={!isValid || isLoading}
                isLoading={isLoading}
                type="submit"
                w="100%"
                size="lg"
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

export default EnterAndConfirmPassword;

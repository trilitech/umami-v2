import { Button, FormControl } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import ModalContentWrapper from "../../ModalContentWrapper";
import { FormErrorMessage } from "../../../FormErrorMessage";
import PasswordInput from "../../../PasswordInput";
import LockIcon from "../../../../assets/icons/Lock";

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
      icon={<LockIcon />}
      title="Umami Master Password"
      subtitle="Enter your master password for Umami."
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <FormControl isInvalid={!!errors.password}>
            <PasswordInput inputName="password" data-testid="password" />
            {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
          </FormControl>

          <Button
            mt="32px"
            width="100%"
            isDisabled={!isValid}
            isLoading={isLoading}
            size="lg"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </FormProvider>
    </ModalContentWrapper>
  );
};

export default EnterPassword;

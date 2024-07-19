import { Button, FormControl, FormErrorMessage, Input } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";

import { StubIcon as LockIcon } from "../../../../assets/icons";
import { ModalContentWrapper } from "../../ModalContentWrapper";

export const EnterPassword = ({
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
      subtitle="Enter your master password for Umami."
      title="Umami Master Password"
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <FormControl isInvalid={!!errors.password}>
            <Input data-testid="password" type="password" {...form.register("password")} />
            {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
          </FormControl>

          <Button
            width="100%"
            marginTop="32px"
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

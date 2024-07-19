import { Button, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";

import { StubIcon as LockIcon } from "../../../../assets/icons";
import { ModalContentWrapper } from "../../ModalContentWrapper";

export const EnterAndConfirmPassword = ({
  onSubmit: onSubmitPassword,
  isLoading,
}: {
  onSubmit: (password: string) => void;
  isLoading: boolean;
}) => {
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

  const onSubmit = ({ confirm }: ConfirmPasswordFormValues) => onSubmitPassword(confirm);

  return (
    <ModalContentWrapper
      icon={<LockIcon />}
      subtitle="Please choose a master password for Umami. You will need to use this password in order to perform any operations within Umami."
      title="Umami Master Password"
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              data-testid="password"
              placeholder="Enter master password"
              type="password"
              {...form.register("password", { required: "Password is required" })}
            />
            {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
          </FormControl>

          <FormControl marginTop="24px" isInvalid={!!errors.confirm}>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              data-testid="confirmation"
              placeholder="Confirm your password"
              type="password"
              {...form.register("confirm", {
                required: "Confirmation is required",
                validate: (val: string) =>
                  getValues("password") === val || "Your passwords do no match",
              })}
            />
            {errors.confirm && <FormErrorMessage>{errors.confirm.message}</FormErrorMessage>}
          </FormControl>
          <Button
            width="100%"
            marginTop="32px"
            isDisabled={!isValid || isLoading}
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

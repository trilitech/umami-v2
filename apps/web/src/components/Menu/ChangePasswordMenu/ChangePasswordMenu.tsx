import { Button, Divider, VStack, useToast } from "@chakra-ui/react";
import { changeMnemonicPassword, useAppDispatch, useAsyncActionHandler } from "@umami/state";
import { FormProvider, useForm } from "react-hook-form";

import { DrawerContentWrapper } from "../DrawerContentWrapper";
import { PasswordInput } from "../../PasswordInput";

type ChangePasswordMenuValues = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

export const ChangePasswordMenu = () => {
  const form = useForm<ChangePasswordMenuValues>({ mode: "onBlur" });
  const toast = useToast();
  const dispatch = useAppDispatch();
  const { handleAsyncAction, isLoading } = useAsyncActionHandler();
  const {
    handleSubmit,
    formState: { isValid },
    getValues,
  } = form;

  const onSubmit = ({ currentPassword, newPassword }: ChangePasswordMenuValues) =>
    handleAsyncAction(async () => {
      await dispatch(changeMnemonicPassword({ currentPassword, newPassword })).unwrap();
      toast({ description: "Password updated", status: "success" });
    });

  return (
    <FormProvider {...form}>
      <DrawerContentWrapper title="Change Password">
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap="30px" marginTop="40px" spacing="0">
            <PasswordInput
              data-testid="current-password"
              inputName="currentPassword"
              label="Current Password"
              placeholder="Your password"
              required="Current password is required"
            />
            <Divider />
            <PasswordInput
              data-testid="new-password"
              inputName="newPassword"
              label="New Password"
              placeholder="New password"
              required="New password is required"
              validate={(val: string) =>
                getValues("currentPassword") !== val || "Cannot be the same as old password"
              }
            />
            <PasswordInput
              data-testid="new-password-confirmation"
              inputName="newPasswordConfirmation"
              label="Confirm password"
              placeholder="Confirm password"
              required="Confirmation is required"
              validate={(val: string) =>
                getValues("newPassword") === val || "Your new passwords do not match"
              }
            />
          </VStack>
          <Button
            width="full"
            marginTop="30px"
            isDisabled={!isValid}
            isLoading={isLoading}
            size="lg"
            type="submit"
            variant="primary"
          >
            Update Password
          </Button>
        </form>
      </DrawerContentWrapper>
    </FormProvider>
  );
};

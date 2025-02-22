import { Button, Divider, VStack, useToast } from "@chakra-ui/react";
import {
  accountsActions,
  changeMnemonicPassword,
  useAppDispatch,
  useAppSelector,
  useAsyncActionHandler,
} from "@umami/state";
import { FormProvider, useForm } from "react-hook-form";

import { PasswordInput } from "../../PasswordInput";
import { DrawerContentWrapper } from "../DrawerContentWrapper";

type ChangePasswordMenuValues = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

export const ChangePasswordMenu = () => {
  const form = useForm<ChangePasswordMenuValues>({ mode: "all" });
  const toast = useToast();
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(state => state.accounts);
  const { handleAsyncAction, isLoading } = useAsyncActionHandler();
  const {
    handleSubmit,
    formState: { isValid },
    getValues,
    reset,
  } = form;

  const onSubmit = ({ currentPassword, newPassword }: ChangePasswordMenuValues) =>
    handleAsyncAction(async () => {
      await dispatch(changeMnemonicPassword({ currentPassword, newPassword })).unwrap();

      if (accounts.password) {
        dispatch(accountsActions.setPassword(newPassword));
      }

      toast({ description: "Password updated", status: "success" });
      reset();
    });

  return (
    <FormProvider {...form}>
      <DrawerContentWrapper title="Change password">
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap="30px" marginTop="40px" spacing="0">
            <PasswordInput
              data-testid="current-password"
              inputName="currentPassword"
              label="Current password"
              placeholder="Your password"
              required="Current password is required"
            />
            <Divider />
            <PasswordInput
              data-testid="new-password"
              inputName="newPassword"
              isStrengthCheckEnabled
              label="New password"
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
              placeholder="Confirm new password"
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
            Update password
          </Button>
        </form>
      </DrawerContentWrapper>
    </FormProvider>
  );
};

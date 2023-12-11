import {
  Button,
  FormControl,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useToast,
} from "@chakra-ui/react";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";

import colors from "../../style/colors";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { useAppDispatch } from "../../utils/redux/hooks";
import { changeMnemonicPassword } from "../../utils/redux/thunks/changeMnemonicPassword";
import { DynamicModalContext } from "../DynamicModal";
import { FormErrorMessage } from "../FormErrorMessage";
import { PasswordInput } from "../PasswordInput";

type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

export const ChangePasswordForm: React.FC = () => {
  const { onClose } = useContext(DynamicModalContext);
  const form = useForm<ChangePasswordFormValues>({ mode: "onBlur" });
  const toast = useToast();
  const dispatch = useAppDispatch();
  const { handleAsyncAction, isLoading } = useAsyncActionHandler();
  const {
    handleSubmit,
    formState: { isValid, errors },
    getValues,
  } = form;

  const onSubmit = async ({
    currentPassword,
    newPassword,
    newPasswordConfirmation,
  }: ChangePasswordFormValues) => {
    if (currentPassword === newPassword || newPassword !== newPasswordConfirmation) {
      return;
    }

    handleAsyncAction(async () => {
      await dispatch(changeMnemonicPassword({ currentPassword, newPassword })).unwrap();
      toast({ description: "Password updated", status: "success" });
      onClose();
    });
  };

  return (
    <FormProvider {...form}>
      <ModalContent background={colors.gray[700]} data-testid="change-password-modal">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalCloseButton />

          <ModalHeader textAlign="center">
            <Heading>Change Password</Heading>
          </ModalHeader>
          <ModalBody>
            <FormControl marginTop="32px" isInvalid={!!errors.currentPassword}>
              <PasswordInput
                data-testid="current-password"
                inputName="currentPassword"
                label="Current Password"
                placeholder="Enter your current password"
                required="Current password is required"
              />
              {errors.currentPassword && (
                <FormErrorMessage data-testid="current-password-error">
                  {errors.currentPassword.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.newPassword} marginY={6}>
              <PasswordInput
                data-testid="new-password"
                inputName="newPassword"
                label="New Password"
                placeholder="Enter new password"
                required="New password is required"
                validate={(val: string) =>
                  getValues("currentPassword") !== val || "Cannot be the same as old password"
                }
              />
              {errors.newPassword && (
                <FormErrorMessage data-testid="new-password-error">
                  {errors.newPassword.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl marginTop={3} isInvalid={!!errors.newPasswordConfirmation}>
              <PasswordInput
                data-testid="new-password-confirmation"
                inputName="newPasswordConfirmation"
                label="Confirm New Password"
                placeholder="Confirm new password"
                required="Confirmation is required"
                validate={(val: string) =>
                  getValues("newPassword") === val || "Your new passwords do no match"
                }
              />

              {errors.newPasswordConfirmation && (
                <FormErrorMessage data-testid="new-password-confirmation-error">
                  {errors.newPasswordConfirmation.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              width="100%"
              isDisabled={!isValid}
              isLoading={isLoading}
              size="lg"
              type="submit"
            >
              Update Password
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};

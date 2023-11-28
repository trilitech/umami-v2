import {
  Box,
  Button,
  FormControl,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { useAppDispatch } from "../../utils/redux/hooks";
import changeMnemonicPassword from "../../utils/redux/thunks/changeMnemonicPassword";
import { DynamicModalContext } from "../DynamicModal";
import { useContext } from "react";
import { FormErrorMessage } from "../FormErrorMessage";
import PasswordInput from "../PasswordInput";
import colors from "../../style/colors";

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
      toast({ title: "Password updated", status: "success" });
      onClose();
    });
  };

  return (
    <FormProvider {...form}>
      <ModalContent background={colors.gray[700]} data-testid="change-password-modal">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalCloseButton />

          <ModalHeader marginTop={5} textAlign="center">
            <Box>
              <Heading>Change Password</Heading>
            </Box>
          </ModalHeader>
          <ModalBody>
            <FormControl marginTop={3} isInvalid={!!errors.currentPassword}>
              <PasswordInput
                inputName="currentPassword"
                label="Current Password"
                required="Current password is required"
                data-testid="current-password"
                placeholder="Enter your current password"
              />
              {errors.currentPassword && (
                <FormErrorMessage data-testid="current-password-error">
                  {errors.currentPassword.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.newPassword} marginY={6}>
              <PasswordInput
                inputName="newPassword"
                label="New Password"
                required="New password is required"
                data-testid="new-password"
                placeholder="Enter new password"
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
                inputName="newPasswordConfirmation"
                label="Confirm New Password"
                required="Confirmation is required"
                data-testid="new-password-confirmation"
                placeholder="Confirm new password"
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
              marginY={3}
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

export default ChangePasswordForm;

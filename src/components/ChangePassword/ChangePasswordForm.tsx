import {
  Box,
  Button,
  Text,
  FormControl,
  FormLabel,
  Input,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  useToast,
} from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { useAppDispatch } from "../../utils/redux/hooks";
import changeMnemonicPassword from "../../utils/redux/thunks/changeMnemonicPassword";
import { MIN_LENGTH } from "../Onboarding/masterPassword/password/EnterAndConfirmPassword";
import { DynamicModalContext } from "../DynamicModal";
import { useContext } from "react";
import { FormErrorMessage } from "../FormErrorMessage";

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
    register,
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
      <ModalContent data-testid="change-password-modal">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalCloseButton />

          <ModalHeader mt={5} textAlign="center">
            <Box>
              <Text>Change Password</Text>
            </Box>
          </ModalHeader>
          <ModalBody>
            <FormControl isInvalid={!!errors.currentPassword} mt={3}>
              <FormLabel>Current Password</FormLabel>
              <Input
                type="password"
                autoComplete="off"
                data-testid="current-password"
                {...register("currentPassword", {
                  required: "Current password is required",
                  minLength: {
                    value: MIN_LENGTH,
                    message: `Your password must be at least ${MIN_LENGTH} characters long`,
                  },
                })}
                placeholder="Enter current password..."
              />
              {errors.currentPassword && (
                <FormErrorMessage data-testid="current-password-error">
                  {errors.currentPassword.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.newPassword} mt={3}>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                autoComplete="off"
                data-testid="new-password"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: MIN_LENGTH,
                    message: `Your password must be at least ${MIN_LENGTH} characters long`,
                  },
                  validate: (val: string) =>
                    getValues("currentPassword") !== val || "Cannot be the same as old password",
                })}
                placeholder="Enter your new password..."
              />
              {errors.newPassword && (
                <FormErrorMessage data-testid="new-password-error">
                  {errors.newPassword.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.newPasswordConfirmation} mt={3}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                autoComplete="off"
                data-testid="new-password-confirmation"
                {...register("newPasswordConfirmation", {
                  required: "Confirmation is required",
                  validate: (val: string) =>
                    getValues("newPassword") === val || "Your new passwords do no match",
                })}
                placeholder="Confirm your new password..."
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
              marginY={3}
              isDisabled={!isValid}
              isLoading={isLoading}
              w="100%"
              variant="primary"
              type="submit"
            >
              Submit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};

export default ChangePasswordForm;

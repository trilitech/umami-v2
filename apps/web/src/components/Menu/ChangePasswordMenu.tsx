import {
  Button,
  Divider,
  DrawerBody,
  DrawerContent,
  Heading,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { changeMnemonicPassword, useAppDispatch, useAsyncActionHandler } from "@umami/state";
import { FormProvider, useForm } from "react-hook-form";

import { useColor } from "../../styles/useColor";
import { DrawerBackButton } from "../BackButton";
import { DrawerCloseButton } from "../CloseButton";
import { PasswordInput } from "../PasswordInput";

type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

export const ChangePasswordMenu = () => {
  const color = useColor();
  const form = useForm<ChangePasswordFormValues>({ mode: "onBlur" });
  const toast = useToast();
  const dispatch = useAppDispatch();
  const { handleAsyncAction, isLoading } = useAsyncActionHandler();
  const {
    handleSubmit,
    formState: { isValid },
    getValues,
  } = form;

  const onSubmit = ({ currentPassword, newPassword }: ChangePasswordFormValues) =>
    handleAsyncAction(async () => {
      await dispatch(changeMnemonicPassword({ currentPassword, newPassword })).unwrap();
      toast({ description: "Password updated", status: "success" });
    });

  return (
    <FormProvider {...form}>
      <DrawerContent>
        <DrawerBackButton />
        <DrawerCloseButton />
        <DrawerBody paddingTop="90px">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Heading color={color("900")} size="2xl">
              Change Password
            </Heading>
            <VStack
              alignItems="flex-start"
              gap="30px"
              marginTop="40px"
              divider={<Divider color={color("100")} />}
            >
              <PasswordInput
                data-testid="current-password"
                inputName="currentPassword"
                label="Current Password"
                placeholder="Your password"
                required="Current password is required"
              />

              <VStack gap="24px" width="full">
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
              </VStack>
            </VStack>
          </form>
        </DrawerBody>
      </DrawerContent>
    </FormProvider>
  );
};

import {
  Button,
  Center,
  Heading,
  Icon,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { useMultiForm } from "@umami/components";
import { type ImplicitAccount, type SocialAccount } from "@umami/core";
import { FormProvider } from "react-hook-form";

import { LockIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { LoginButton } from "../../views/SessionLogin/LoginButton";
import { ModalBackButton } from "../BackButton";
import { ModalCloseButton } from "../CloseButton";
import { PasswordInput } from "../PasswordInput";

type MasterPasswordModalProps = {
  onSubmit: (password?: string) => Promise<void> | void;
  isLoading?: boolean;
  defaultAccount?: ImplicitAccount | null;
};

export const MasterPasswordModal = ({
  onSubmit,
  isLoading,
  defaultAccount,
}: MasterPasswordModalProps) => {
  const color = useColor();

  const form = useMultiForm<{
    password: string;
  }>({
    defaultValues: {
      password: "",
    },
  });

  const handleSubmit = async () => {
    await onSubmit();
  };

  const getPasswordField = () => {
    if (defaultAccount?.type === "social") {
      return (
        <LoginButton
          idp={(defaultAccount as SocialAccount).idp}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          prefix="Confirm with"
        />
      );
    }

    return (
      <PasswordInput
        data-testid="master-password"
        inputName="password"
        label="Password"
        placeholder="Enter your password"
      />
    );
  };

  return (
    <ModalContent data-testid="master-password-modal">
      <ModalHeader>
        <ModalBackButton />
        <ModalCloseButton />
        <Center flexDirection="column" gap="12px">
          <Icon as={LockIcon} boxSize="24px" marginBottom="4px" color={color("400")} />
          <Heading size="xl">Confirm password</Heading>
          <Text width="full" color={color("700")} fontWeight="400" textAlign="center" size="md">
            Enter your master password
          </Text>
        </Center>
      </ModalHeader>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(({ password }) => onSubmit(password))}>
          <ModalBody>{getPasswordField()}</ModalBody>
          {defaultAccount?.type !== "social" ? (
            <ModalFooter>
              <Button width="full" isLoading={isLoading} type="submit" variant="primary">
                Submit
              </Button>
            </ModalFooter>
          ) : null}
        </form>
      </FormProvider>
    </ModalContent>
  );
};

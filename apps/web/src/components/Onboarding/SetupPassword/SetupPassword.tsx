import {
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { useMultiForm } from "@umami/components";
import { useHandleSession, useIsPasswordSet } from "@umami/state";
import { defaultDerivationPathTemplate } from "@umami/tezos";
import { FormProvider } from "react-hook-form";

import { type FormFields, type Mode } from "./types";
import { LockIcon, UserIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { ModalBackButton } from "../../BackButton";
import { ModalCloseButton } from "../../CloseButton";
import { PasswordInput } from "../../PasswordInput";
import { AdvancedAccountSettings } from "../AdvancedAccountSettings";
import { useGetSetupPasswordSubmitHandler } from "./useGetSetupPasswordSubmitHandler";

type SetupPasswordProps = {
  mode: Mode;
};

const getModeConfig = (mode: Mode) => {
  switch (mode) {
    case "verification":
      return {
        icon: LockIcon,
        title: "Confirm password",
        buttonLabel: "Confirm",
        subtitle: "Confirm the password to secure your wallet and verification process.",
      };
    case "new_mnemonic":
      return {
        icon: UserIcon,
        title: "Create password",
        buttonLabel: "Create account",
        subtitle:
          "Set a password to unlock your wallet.\n Make sure to store your password safely.",
      };
    case "save_backup":
      return {
        icon: LockIcon,
        title: "Create password",
        buttonLabel: "Save backup",
      };
    case "mnemonic":
    case "secret_key":
      return {
        icon: LockIcon,
        title: "Almost there",
        buttonLabel: "Import wallet",
      };
    case "add_account":
      return {
        icon: LockIcon,
        title: "Confirm password",
        buttonLabel: "Add account",
        subtitle: "Confirm the password to add your account.",
      };
  }
};

export const SetupPassword = ({ mode }: SetupPasswordProps) => {
  const color = useColor();
  const { onSubmit, isLoading } = useGetSetupPasswordSubmitHandler(mode);
  const isPasswordSet = useIsPasswordSet();
  const { setupSessionTimeout } = useHandleSession();

  const form = useMultiForm<FormFields>({
    mode: "all",
    defaultValues: {
      derivationPath: defaultDerivationPathTemplate,
      curve: "ed25519",
    },
  });

  const {
    formState: { isValid },
    getValues,
  } = form;

  const { title, subtitle, buttonLabel, icon } = getModeConfig(mode);

  const handleSubmit = async (values: FormFields) => {
    await onSubmit(values);
    if (mode === "new_mnemonic") {
      setupSessionTimeout();
    }
  };

  return (
    <ModalContent>
      <ModalHeader>
        <ModalBackButton />
        <ModalCloseButton />
        <Center flexDirection="column" gap="12px" whiteSpace="break-spaces">
          <Icon as={icon} width="24px" height="24px" color={color("400")} />
          <Heading marginTop="4px" size="xl">
            {title}
          </Heading>
          {subtitle && (
            <Text width="full" color={color("700")} fontWeight="400" textAlign="center" size="md">
              {subtitle}
            </Text>
          )}
        </Center>
      </ModalHeader>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <ModalBody>
            <Flex flexDirection="column" gap="24px">
              <PasswordInput
                inputName="password"
                isStrengthCheckEnabled={!isPasswordSet}
                label={isPasswordSet ? "Password" : "Set password"}
                required="Password is required"
              />
              {!isPasswordSet && (
                <PasswordInput
                  inputName="passwordConfirmation"
                  label="Confirm password"
                  required="Password confirmation is required"
                  validate={value => value === getValues("password") || "Passwords do not match"}
                />
              )}

              {mode === "mnemonic" && <AdvancedAccountSettings />}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              width="full"
              isDisabled={!isValid}
              isLoading={isLoading}
              type="submit"
              variant="primary"
            >
              {buttonLabel}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </ModalContent>
  );
};

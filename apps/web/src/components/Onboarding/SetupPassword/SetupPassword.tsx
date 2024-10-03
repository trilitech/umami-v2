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
import { useIsPasswordSet } from "@umami/state";
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
        title: "Create Password",
        buttonLabel: "Create Account",
        subtitle: "Set a password to unlock your wallet. Make sure to store your password safely.",
      };
    case "save_backup":
      return {
        icon: LockIcon,
        title: "Encrypt Backup",
        buttonLabel: "Save Backup",
      };
    case "mnemonic":
    case "secret_key":
      return {
        icon: LockIcon,
        title: "Almost there",
        buttonLabel: "Import Wallet",
      };
    case "add_account":
      return {
        icon: LockIcon,
        title: "Confirm password",
        buttonLabel: "Add Account",
        subtitle: "Confirm the password to add your account.",
      };
  }
};

export const SetupPassword = ({ mode }: SetupPasswordProps) => {
  const color = useColor();
  const { onSubmit, isLoading } = useGetSetupPasswordSubmitHandler(mode);
  const isPasswordSet = useIsPasswordSet();

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

  return (
    <ModalContent>
      <ModalHeader>
        <ModalBackButton />
        <ModalCloseButton />
        <Center flexDirection="column" gap="16px">
          <Icon as={icon} width="24px" height="24px" color={color("blue")} />
          <Heading size="xl">{title}</Heading>
          {subtitle && (
            <Text width="full" color={color("700")} fontWeight="400" textAlign="center" size="md">
              {subtitle}
            </Text>
          )}
        </Center>
      </ModalHeader>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <ModalBody>
            <Flex flexDirection="column" gap="24px">
              <PasswordInput
                inputName="password"
                isStrengthCheckEnabled={!isPasswordSet}
                label={isPasswordSet ? "Password" : "Set Password"}
                required="Password is required"
              />
              {!isPasswordSet && (
                <PasswordInput
                  inputName="passwordConfirmation"
                  label="Confirm Password"
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

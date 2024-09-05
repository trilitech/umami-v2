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
import { type Curves } from "@taquito/signer";
import { useDynamicModalContext, useMultiForm } from "@umami/components";
import { DEFAULT_ACCOUNT_LABEL, type MnemonicAccount } from "@umami/core";
import {
  accountsActions,
  generate24WordMnemonic,
  useAppDispatch,
  useAsyncActionHandler,
  useCurrentAccount,
  useGetDecryptedMnemonic,
  useGetNextAvailableAccountLabels,
  useIsPasswordSet,
  useRestoreFromMnemonic,
  useRestoreFromSecretKey,
  useValidateMasterPassword,
} from "@umami/state";
import { decryptSecretKey, defaultDerivationPathTemplate } from "@umami/tezos";
import { FormProvider } from "react-hook-form";

import { LockIcon, UserIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { ModalBackButton } from "../../BackButton";
import { ModalCloseButton } from "../../CloseButton";
import { PasswordInput } from "../../PasswordInput";
import { AdvancedAccountSettings } from "../AdvancedAccountSettings";
import { ImportantNoticeModal } from "../VerificationFlow/ImportantNoticeModal";

type FormFields = {
  password: string;
  passwordConfirmation: string;
  derivationPath: string;
  curve: Exclude<Curves, "bip25519">;
};

type Mode = "mnemonic" | "secret_key" | "new_mnemonic" | "verification";

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
    case "mnemonic":
    case "secret_key":
      return {
        icon: LockIcon,
        title: "Almost there",
        buttonLabel: "Import Wallet",
      };
  }
};

export const SetupPassword = ({ mode }: SetupPasswordProps) => {
  const color = useColor();
  const { handleAsyncAction, isLoading } = useAsyncActionHandler();
  const dispatch = useAppDispatch();

  const { allFormValues, onClose, openWith } = useDynamicModalContext();
  const restoreFromMnemonic = useRestoreFromMnemonic();
  const restoreFromSecretKey = useRestoreFromSecretKey();
  const checkPassword = useValidateMasterPassword();
  const getNextAvailableAccountLabels = useGetNextAvailableAccountLabels();
  const isPasswordSet = useIsPasswordSet();
  const getDecryptedMnemonic = useGetDecryptedMnemonic();
  const currentAccount = useCurrentAccount();

  const form = useMultiForm<FormFields>({
    mode: "onBlur",
    defaultValues: {
      derivationPath: defaultDerivationPathTemplate,
      curve: "ed25519",
    },
  });

  const {
    formState: { isValid },
    getValues,
  } = form;

  const isNewMnemonic = mode === "new_mnemonic";

  const onSubmit = ({ password, curve, derivationPath }: FormFields) =>
    handleAsyncAction(async () => {
      const label = getNextAvailableAccountLabels(DEFAULT_ACCOUNT_LABEL)[0];

      await checkPassword?.(password);

      switch (mode) {
        case "secret_key": {
          const secretKey = await decryptSecretKey(
            allFormValues.secretKey,
            allFormValues.secretKeyPassword
          );
          await restoreFromSecretKey(secretKey, password, DEFAULT_ACCOUNT_LABEL);
          break;
        }
        case "mnemonic":
        case "new_mnemonic": {
          const mnemonic = isNewMnemonic
            ? generate24WordMnemonic()
            : allFormValues.mnemonic.map(({ val }: { val: string }) => val).join(" ");

          await restoreFromMnemonic({
            mnemonic,
            password,
            derivationPathTemplate: derivationPath,
            label,
            curve,
            isVerified: !isNewMnemonic,
          });

          if (isNewMnemonic) {
            dispatch(accountsActions.setPassword(password));
          }

          break;
        }
        case "verification": {
          const mnemonic = await getDecryptedMnemonic(currentAccount as MnemonicAccount, password);

          return openWith(<ImportantNoticeModal mnemonic={mnemonic} />, { size: "xl" });
        }
      }

      return onClose();
    });

  const { icon, title, buttonLabel, subtitle } = getModeConfig(mode);

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
                label={isPasswordSet ? "Password" : "Set Password"}
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

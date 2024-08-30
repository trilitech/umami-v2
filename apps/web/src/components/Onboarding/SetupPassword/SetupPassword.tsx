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
import { DEFAULT_ACCOUNT_LABEL } from "@umami/core";
import {
  accountsActions,
  generate24WordMnemonic,
  useAppDispatch,
  useAsyncActionHandler,
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

type FormFields = {
  password: string;
  passwordConfirmation: string;
  derivationPath: string;
  curve: Exclude<Curves, "bip25519">;
};

type Mode = "mnemonic" | "secret_key" | "new-mnemonic";

type SetupPasswordProps = {
  mode: Mode;
};

export const SetupPassword = ({ mode }: SetupPasswordProps) => {
  const color = useColor();
  const { handleAsyncAction, isLoading } = useAsyncActionHandler();
  const { allFormValues, onClose } = useDynamicModalContext();
  const restoreFromMnemonic = useRestoreFromMnemonic();
  const restoreFromSecretKey = useRestoreFromSecretKey();
  const checkPassword = useValidateMasterPassword();
  const getNextAvailableAccountLabels = useGetNextAvailableAccountLabels();
  const isPasswordSet = useIsPasswordSet();

  const dispatch = useAppDispatch();
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
        case "new-mnemonic": {
          const mnemonic =
            mode === "new-mnemonic"
              ? generate24WordMnemonic()
              : allFormValues.mnemonic.map(({ val }: { val: string }) => val).join(" ");

          await restoreFromMnemonic({
            mnemonic,
            password,
            derivationPathTemplate: derivationPath,
            label,
            curve,
          });

          if (mode === "new-mnemonic") {
            dispatch(accountsActions.setIsVerified(false));
          }
          break;
        }
      }

      return onClose();
    });

  const isNewMnemonic = mode === "new-mnemonic";

  const icon = isNewMnemonic ? UserIcon : LockIcon;
  const title = isNewMnemonic ? "Create Password" : "Almost there";
  const buttonLabel = isNewMnemonic ? "Create Account" : "Import Wallet";

  return (
    <ModalContent>
      <ModalHeader>
        <ModalBackButton />
        <ModalCloseButton />
        <Center flexDirection="column" gap="16px">
          <Icon as={icon} width="24px" height="24px" color={color("blue")} />
          <Heading size="xl">{title}</Heading>
          {isNewMnemonic && (
            <Text
              width="full"
              maxWidth="340px"
              color={color("700")}
              fontWeight="400"
              textAlign="center"
              size="md"
            >
              Set a password to unlock your wallet. Make sure to store your password safely.
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

import {
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from "@chakra-ui/react";
import { type Curves } from "@taquito/signer";
import { useDynamicModalContext, useMultiForm } from "@umami/components";
import { DEFAULT_ACCOUNT_LABEL } from "@umami/core";
import {
  useAsyncActionHandler,
  useGetNextAvailableAccountLabels,
  useIsPasswordSet,
  useRestoreFromMnemonic,
  useRestoreFromSecretKey,
  useValidateMasterPassword,
} from "@umami/state";
import { decryptSecretKey, defaultDerivationPathTemplate } from "@umami/tezos";
import { FormProvider } from "react-hook-form";

import { LockIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { ModalBackButton } from "../../BackButton";
import { PasswordInput } from "../../PasswordInput";
import { AdvancedAccountSettings } from "../AdvancedAccountSettings";

type FormFields = {
  password: string;
  passwordConfirmation: string;
  derivationPath: string;
  curve: Exclude<Curves, "bip25519">;
};

export const SetupPassword = ({ mode }: { mode: "mnemonic" | "secret_key" }) => {
  const color = useColor();
  const { handleAsyncAction, isLoading } = useAsyncActionHandler();
  const { allFormValues, onClose } = useDynamicModalContext();
  const restoreFromMnemonic = useRestoreFromMnemonic();
  const restoreFromSecretKey = useRestoreFromSecretKey();
  const checkPassword = useValidateMasterPassword();
  const getNextAvailableAccountLabels = useGetNextAvailableAccountLabels();
  const isPasswordSet = useIsPasswordSet();

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
        case "mnemonic": {
          const mnemonic = allFormValues.mnemonic.map(({ val }: { val: string }) => val).join(" ");

          await restoreFromMnemonic({
            mnemonic,
            password,
            derivationPathTemplate: derivationPath,
            label,
            curve,
          });
          break;
        }
        case "secret_key": {
          const secretKey = await decryptSecretKey(
            allFormValues.secretKey,
            allFormValues.secretKeyPassword
          );
          await restoreFromSecretKey(secretKey, password, label);
        }
      }

      return onClose();
    });

  return (
    <ModalContent>
      <ModalHeader>
        <ModalBackButton />
        <ModalCloseButton />
        <Center flexDirection="column" gap="16px">
          <Icon as={LockIcon} width="24px" height="24px" color={color("blue")} />
          <Heading size="xl">Almost there</Heading>
        </Center>
      </ModalHeader>
      <ModalBody>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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

              <Button
                width="full"
                isDisabled={!isValid}
                isLoading={isLoading}
                type="submit"
                variant="primary"
              >
                Import Wallet
              </Button>
            </Flex>
          </form>
        </FormProvider>
      </ModalBody>
    </ModalContent>
  );
};

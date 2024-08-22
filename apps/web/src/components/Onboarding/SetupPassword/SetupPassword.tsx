import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@chakra-ui/react";
import { type Curves } from "@taquito/signer";
import { useDynamicModalContext, useMultiForm } from "@umami/components";
import { DEFAULT_ACCOUNT_LABEL } from "@umami/core";
import {
  useAsyncActionHandler,
  useRestoreFromMnemonic,
  useRestoreFromSecretKey,
} from "@umami/state";
import { defaultDerivationPathTemplate } from "@umami/tezos";
import { FormProvider } from "react-hook-form";

import { LockIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { ModalBackButton } from "../../BackButton";
import { ModalCloseButton } from "../../CloseButton";
import { PasswordInput } from "../../PasswordInput";
import { RadioButtons } from "../../RadioButtons";

type FormFields = {
  password: string;
  passwordConfirmation: string;
  derivationPath: string;
  curve: Exclude<Curves, "bip25519">;
};

export const CURVES = ["ed25519", "secp256k1", "p256"];

export const SetupPassword = ({ mode }: { mode: "mnemonic" | "secret_key" }) => {
  const color = useColor();
  const { handleAsyncAction, isLoading } = useAsyncActionHandler();
  const { allFormValues, onClose } = useDynamicModalContext();
  const restoreFromMnemonic = useRestoreFromMnemonic();
  const restoreFromSecretKey = useRestoreFromSecretKey();
  const form = useMultiForm<FormFields>({
    mode: "onBlur",
    defaultValues: {
      derivationPath: defaultDerivationPathTemplate,
      curve: "ed25519",
    },
  });

  const {
    formState: { errors, isValid },
    register,
    resetField,
    getValues,
  } = form;

  const onSubmit = ({ password, curve, derivationPath }: FormFields) =>
    handleAsyncAction(async () => {
      switch (mode) {
        case "mnemonic": {
          const mnemonic = allFormValues.mnemonic.map(({ val }: { val: string }) => val).join(" ");

          await restoreFromMnemonic({
            mnemonic,
            password,
            derivationPathTemplate: derivationPath,
            label: DEFAULT_ACCOUNT_LABEL,
            curve,
          });
          break;
        }
        case "secret_key": {
          await restoreFromSecretKey(allFormValues.secretKey, password, DEFAULT_ACCOUNT_LABEL);
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
              <PasswordInput inputName="password" label="Set Password" />

              <PasswordInput
                inputName="passwordConfirmation"
                label="Confirm Password"
                required="Password confirmation is required"
                validate={value => value === getValues("password") || "Passwords do not match"}
              />

              {mode === "mnemonic" && (
                <Accordion marginTop="6px" allowToggle data-testid="advanced-section">
                  <AccordionItem>
                    <AccordionButton justifyContent="center" color={color("900")}>
                      <Heading size="md">Advanced</Heading>
                      <AccordionIcon />
                    </AccordionButton>

                    <AccordionPanel>
                      <Flex flexDirection="column" gap="24px">
                        <FormControl isInvalid={!!errors.curve}>
                          <FormLabel>Elliptic Curve</FormLabel>
                          <Flex gap="8px">
                            <RadioButtons
                              fontSize="sm"
                              fontWeight="400"
                              inputName="curve"
                              options={CURVES}
                            />
                          </Flex>
                        </FormControl>

                        <FormControl isInvalid={!!errors.derivationPath}>
                          <FormLabel>Derivation Path</FormLabel>

                          <InputGroup>
                            <Input
                              {...register("derivationPath", {
                                required: "Derivation path is required",
                              })}
                              placeholder="m/44'/1729'/?'/0' (default)"
                            />
                            <InputRightElement>
                              <Button
                                marginRight="10px"
                                color={color("200")}
                                fontWeight="600"
                                background={color("black")}
                                borderRadius="4px"
                                _hover={{ background: color("400") }}
                                onClick={() => resetField("derivationPath")}
                                size="sm"
                              >
                                Reset
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                          {errors.derivationPath && (
                            <FormErrorMessage>{errors.derivationPath.message}</FormErrorMessage>
                          )}
                        </FormControl>
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              )}

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
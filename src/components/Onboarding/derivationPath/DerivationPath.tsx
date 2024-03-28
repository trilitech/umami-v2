import { Button, Center, FormControl, Input, Switch, Text, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { SlashIcon } from "../../../assets/icons";
import colors from "../../../style/colors";
import {
  AVAILABLE_DERIVATION_PATH_PATTERNS,
  DEFAULT_DERIVATION_PATH_PATTERN,
  defaultDerivationPathPattern,
  getDefaultDerivationPath,
} from "../../../utils/account/derivationPathUtils";
import { deriveSecretKey } from "../../../utils/tezos";
import { ExternalLink } from "../../ExternalLink";
import { FormErrorMessage } from "../../FormErrorMessage";
import { Select } from "../../Select";
import { ModalContentWrapper } from "../ModalContentWrapper";
import { DerivationPathStep, OnboardingStep } from "../OnboardingStep";

/**
 * Component represents the derivation path step in the onboarding flow
 * It's used for ledger & mnemonic accounts
 *
 * @param goToStep - function to go to the next step.
 * @param account - ledger/mnemonic account data collected in previous steps.
 */
export const DerivationPath = ({
  goToStep,
  account,
}: {
  goToStep: (step: OnboardingStep) => void;
  account: DerivationPathStep["account"];
}) => {
  const [isCustomPath, setIsCustomPath] = useState(false);
  const {
    handleSubmit,
    register,
    setValue,
    formState: { isValid, errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      derivationPathPattern: defaultDerivationPathPattern,
      derivationPath: getDefaultDerivationPath(0),
    },
  });

  const onSubmit = async ({
    derivationPathPattern,
    derivationPath,
  }: {
    derivationPathPattern: string;
    derivationPath: string;
  }) => {
    switch (account.type) {
      case "ledger": {
        if (isCustomPath) {
          return goToStep({
            type: "restoreLedger",
            account: {
              ...account,
              derivationPath: normalizeDerivationPath(derivationPath),
            },
          });
        }

        return goToStep({
          type: "restoreLedger",
          account: {
            ...account,
            derivationPathPattern: normalizeDerivationPath(derivationPathPattern),
          },
        });
      }
      case "mnemonic": {
        if (isCustomPath) {
          /**
           * we cannot guess the derivation path pattern from a custom path
           * so we simply convert a mnemonic account to a secret key one
           * when a custom path is used
           */
          const secretKey = await deriveSecretKey(account.mnemonic, derivationPath, "ed25519");
          return goToStep({
            type: "masterPassword",
            account: { type: "secret_key", secretKey, label: account.label },
          });
        }
        return goToStep({
          type: "masterPassword",
          account: { ...account, derivationPathPattern },
        });
      }
    }
  };

  return (
    <ModalContentWrapper
      icon={<SlashIcon />}
      subtitle="Choose a custom derivation path or select the default derivation path and use the default key."
      title="Derivation Path"
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <Center width="100%" marginBottom="12px">
          <Text fontWeight={isCustomPath ? 400 : 600} size="sm">
            Default Path
          </Text>
          <Switch
            data-testid="custom-path-switch"
            marginX="10px"
            onChange={() => setIsCustomPath(v => !v)}
            variant="danger"
          />
          <Text fontWeight={isCustomPath ? 600 : 400} size="sm">
            Custom Path
          </Text>
        </Center>
        {isCustomPath && (
          <>
            <Center marginTop="16px" marginBottom="32px">
              <Text width="340px" color={colors.orange} textAlign="center" size="xs">
                Please write down to your derivation path. You may not be able to restore your data
                if you lose it.
              </Text>
            </Center>
            <FormControl marginBottom="20px" isInvalid={!!errors.derivationPath}>
              <Input
                fontSize="sm"
                textAlign="center"
                data-testid="custom-path-input"
                {...register("derivationPath", {
                  validate: validateDerivationPath,
                })}
              />
              {errors.derivationPath && (
                <FormErrorMessage data-testid="error-message">
                  {errors.derivationPath.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </>
        )}
        {!isCustomPath && (
          <FormControl marginTop="32px" marginBottom="20px">
            <Select
              onChange={newVal => setValue("derivationPathPattern", newVal)}
              options={AVAILABLE_DERIVATION_PATH_PATTERNS}
              selected={DEFAULT_DERIVATION_PATH_PATTERN}
            />
          </FormControl>
        )}
        <Button width="100%" marginTop="12px" isDisabled={!isValid} size="lg" type="submit">
          Continue
        </Button>

        <ExternalLink
          display="block"
          width="100%"
          marginTop="32px"
          textAlign="center"
          href="https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki"
        >
          <Tooltip
            backgroundColor="white"
            defaultIsOpen={false}
            hasArrow
            label="Derivation path is a set of directions that helps create different secret keys; it starts from a master key or seed."
          >
            <Text
              color={colors.blue}
              fontWeight={600}
              textDecoration="underline"
              _hover={{ textDecoration: "underline" }}
              size="sm"
            >
              What's a Derivation Path?
            </Text>
          </Tooltip>
        </ExternalLink>
      </form>
    </ModalContentWrapper>
  );
};

export const normalizeDerivationPath = (path: string) =>
  path.trim().toLowerCase().replace("m/", "");

/**
 * A valid derivation path should:
 *  - start with 44'/1729'/
 *  - contain only numbers, single quotes and slashes
 *  - end with a number followed by a single quote
 * Examples:
 *  44'/1729'/0'/0'
 *  44'/1729'/0'/0'/0'
 *  44'/1729'/0'/123'
 *  44'/1729'/0'
 *
 * Note: it doesn't take the `m/` prefix into account
 *
 * @param path - derivation path (not pattern)
 * @returns error message or true if the path is valid
 */
export const validateDerivationPath = (path: string): string | true => {
  const normalized = normalizeDerivationPath(path);
  if (normalized.length === 0) {
    return "Derivation path is required";
  }
  if (!normalized.startsWith("44'/1729'/")) {
    return "Derivation path must start with `44'/1729'/`";
  }
  if (!normalized.match(new RegExp("^44'/1729'/([0-9]+'/)*([0-9]+')$"))) {
    return "Invalid derivation path";
  }
  return true;
};

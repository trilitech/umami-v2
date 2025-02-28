import { Button, Center, Flex, type FlexProps, Heading, Icon, Text } from "@chakra-ui/react";
import { type ImplicitAccount } from "@umami/core";
import { type EncryptedData, decrypt } from "@umami/crypto";
import { type AccountsState, useAsyncActionHandler } from "@umami/state";
import { type RawPkh } from "@umami/tezos";
import { useCallback, useState } from "react";
import { type FieldValues, FormProvider, useForm } from "react-hook-form";

import { LoginButton } from "./LoginButton";
import { LogoLightIcon, TezosLogoIcon } from "../../assets/icons";
import { PasswordInput } from "../../components/PasswordInput";
import { useColor } from "../../styles/useColor";
import { setupPersistence } from "../../utils/store";

const clearSessionKey = () => {
  localStorage.removeItem("user_requirements_nonce");
  window.location.reload();
};

const getInitialAccounts = (): AccountsState | null => {
  const accounts = localStorage.getItem("persist:accounts");
  if (!accounts) {
    clearSessionKey();
    return null;
  }
  return JSON.parse(accounts) as AccountsState;
};

const useLoginWithMnemonic = (
  defaultAccount: ImplicitAccount | undefined,
  accounts: AccountsState | null
) => {
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();
  const login = useCallback(
    (data: FieldValues) =>
      handleAsyncAction(
        async () => {
          if (!defaultAccount || !accounts) {
            clearSessionKey();
            return;
          }
          if (defaultAccount.type === "mnemonic") {
            const mnemonic = (
              JSON.parse(accounts.seedPhrases as unknown as string) as Record<string, EncryptedData>
            )[defaultAccount.seedFingerPrint];
            const result = await decrypt(mnemonic, data.password);
            setupPersistence(result);
          } else if (defaultAccount.type === "secret_key") {
            const secretKey = (
              JSON.parse(accounts.secretKeys as unknown as string) as Record<RawPkh, EncryptedData>
            )[defaultAccount.address.pkh];
            const result = await decrypt(secretKey, data.password);
            setupPersistence(result);
          }
        },
        { title: "Mnemonic or secret key not found" }
      ),
    [handleAsyncAction, defaultAccount, accounts]
  );

  return { isLoading, login };
};

export const SessionLogin = () => {
  const color = useColor();

  const [accounts] = useState(getInitialAccounts);
  const defaultAccount =
    accounts?.defaultAccount &&
    (JSON.parse(accounts.defaultAccount as unknown as string) as ImplicitAccount);
  const { isLoading, login } = useLoginWithMnemonic(defaultAccount, accounts);
  const form = useForm({
    defaultValues: {
      password: "",
    },
    mode: "onBlur",
  });

  return (
    <FormProvider {...form}>
      <Flex alignItems={{ base: "end", md: "center" }} justifyContent="center" height="100vh">
        <Flex
          alignItems="center"
          alignContent="start"
          flexDirection="column"
          gap="36px"
          width={{ base: "full", md: "510px" }}
          padding={{ base: "36px", md: "36px 42px" }}
          color={color("700")}
          fontSize="14px"
          border="1px solid"
          borderColor={color("100")}
          borderTopRadius="30px"
          borderBottomRadius={{ base: 0, md: "30px" }}
          backgroundColor={color("white")}
        >
          <Flex alignItems="center" justifyContent="end" flexDirection="column" gridArea="header">
            <Icon as={LogoLightIcon} width="42px" height="42px" />
            <Heading marginTop="18px" color={color("900")} size={{ base: "2xl", md: "3xl" }}>
              Welcome back!
            </Heading>
            <Text marginTop="6px" color={color("600")} size={{ base: "md", md: "lg" }}>
              You need to sign back in to use your wallet.
            </Text>
          </Flex>
          {defaultAccount?.type === "social" ? (
            <LoginButton idp={defaultAccount.idp} prefix="Sign in with" />
          ) : (
            <>
              <PasswordInput inputName="password" />
              <Button
                width="full"
                isLoading={isLoading}
                onClick={form.handleSubmit(login)}
                size="lg"
                variant="primary"
              >
                Unlock
              </Button>
            </>
          )}

          <Logo alignSelf="end" gridArea="tezos-logo" />
        </Flex>
      </Flex>
    </FormProvider>
  );
};

const Logo = (props: FlexProps) => (
  <Center gap="10px" width="full" {...props}>
    <Text color="gray.400" size="sm">
      Powered by
    </Text>
    <Icon as={TezosLogoIcon} width="auto" height={{ base: "24px", md: "36px" }} color="gray.400" />
  </Center>
);

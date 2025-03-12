import { Button, Center, Flex, type FlexProps, Heading, Icon, Text } from "@chakra-ui/react";
import { type ImplicitAccount, type SocialAccount } from "@umami/core";
import {
  type AccountsBackup,
  clearStorageWithReload,
  useAsyncActionHandler,
  useLoginToWallet,
} from "@umami/state";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { LoginButton } from "./LoginButton";
import { LogoLightIcon, TezosLogoIcon } from "../../assets/icons";
import { PasswordInput } from "../../components/PasswordInput";
import { useColor } from "../../styles/useColor";
import { setupPersistence } from "../../utils/store";

const getInitialAccounts = (): AccountsBackup | null => {
  const accounts = localStorage.getItem("persist:accounts");

  return accounts ? JSON.parse(accounts) : null;
};

export const SessionLogin = () => {
  const color = useColor();

  const [defaultAccount] = useState(() => {
    const accounts = getInitialAccounts();

    return accounts?.defaultAccount
      ? (JSON.parse(accounts.defaultAccount) as ImplicitAccount)
      : null;
  });

  const { isLoading, handleLogin } = useLoginToWallet(defaultAccount, setupPersistence);
  const { handleAsyncAction } = useAsyncActionHandler();

  const form = useForm({
    defaultValues: {
      password: "",
    },
    mode: "onBlur",
  });

  const handleSubmit = () =>
    handleAsyncAction(async () => {
      if (!defaultAccount) {
        return clearStorageWithReload();
      }

      if (defaultAccount.type === "social") {
        await handleLogin<SocialAccount>()();
      } else {
        await handleLogin()(getInitialAccounts()!, { password: form.getValues().password });
      }
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
            <LoginButton
              idp={defaultAccount.idp}
              isLoading={isLoading}
              onSubmit={handleSubmit}
              prefix="Sign in with"
            />
          ) : (
            <>
              <PasswordInput inputName="password" />
              <Button
                width="full"
                isDisabled={!form.formState.isValid}
                isLoading={isLoading}
                onClick={handleSubmit}
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

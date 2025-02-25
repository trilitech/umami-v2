import { Button, Center, Flex, type FlexProps, Heading, Icon, Text } from "@chakra-ui/react";
import { type ImplicitAccount } from "@umami/core";
import { useState } from "react";
import { type FieldValues, FormProvider, useForm } from "react-hook-form";

import { LoginButtonComponent } from "./SignInWithButton";
import { LogoLightIcon, TezosLogoIcon } from "../../assets/icons";
import { useGetSetupPasswordSubmitHandler } from "../../components/Onboarding/SetupPassword/useGetSetupPasswordSubmitHandler";
import { PasswordInput } from "../../components/PasswordInput";
import { useColor } from "../../styles/useColor";

export const SessionLogin = () => {
  const color = useColor();

  const [defaultAccount] = useState(() => {
    const accounts = localStorage.getItem("persist:accounts");

    if (!accounts) {
      return null;
    }

    const parsedAccounts = JSON.parse(accounts);

    return JSON.parse(parsedAccounts.defaultAccount) as ImplicitAccount;
  });

  const { onSubmit: onSubmit } = useGetSetupPasswordSubmitHandler(
    defaultAccount?.type === "mnemonic" ? "mnemonic" : "secret_key"
  );

  const form = useForm({
    defaultValues: {
      password: "",
    },
    mode: "onBlur",
  });

  const handleSubmit = async (data: FieldValues) => {
    if (defaultAccount?.type === "mnemonic") {
      // do mnemonic logic
    } else if (defaultAccount?.type === "secret_key") {
      // do secret key logic
    }
  };

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
            <LoginButtonComponent idp={defaultAccount.idp} prefix="Sign in with" />
          ) : (
            <>
              <PasswordInput inputName="password" />
              <Button
                width="full"
                onClick={form.handleSubmit(handleSubmit)}
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

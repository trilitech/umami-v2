import { Box, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { InMemorySigner } from "@taquito/signer";
import { type TypeOfLogin } from "@trilitech-umami/umami-embed";
import * as Auth from "@umami/social-auth";

import { useEffect } from "react";

import { track } from "@vercel/analytics";

import { TezosLogoIcon, UmamiLogoIcon } from "./assets/icons";

import { getErrorContext } from "./imported/utils/getErrorContext";
import { withTimeout } from "./imported/utils/withTimeout";
import { LoginButtonComponent } from "./LoginButtonComponent";
import { sendLoginErrorResponse, sendResponse } from "./utils";
import { useEmbedApp } from "./EmbedAppContext";
import { useColor } from "./imported/style/useColor";

import { useLoginModalContext } from "./LoginModalContext";

const LOGIN_TIMEOUT = 3 * 60 * 1000; // 3 minutes

export const LoginModalContent = () => {
  const { isOpen, onClose, isLoading, setIsLoading } = useLoginModalContext();
  const { setUserData, getNetwork, getLoginOptions, getDAppOrigin } = useEmbedApp();

  const color = useColor();

  useEffect(() => {
    if (isOpen && !isLoading && getLoginOptions().length === 1) {
      onLoginClick(getLoginOptions()[0]);
    }
  }, [isOpen]);

  const onLoginClick = async (loginType: TypeOfLogin) => {
    const eventDetails = `${getNetwork()}_${loginType}`;
    setIsLoading(true);
    track("login_button_click", { details: eventDetails, dAppOrigin: getDAppOrigin() });
    try {
      const { secretKey, id, name, email, imageUrl } = await withTimeout(
        async () => Auth.forIDP(loginType).getCredentials(),
        LOGIN_TIMEOUT
      );
      const signer = new InMemorySigner(secretKey);
      const { pk, pkh } = { pk: await signer.publicKey(), pkh: await signer.publicKeyHash() };

      const userData = { pk, pkh, typeOfLogin: loginType, id, name, emailAddress: email, imageUrl };
      setUserData(userData);
      track("successful_login", { details: eventDetails, dAppOrigin: getDAppOrigin() });
      sendResponse({
        ...userData,
        type: "login_response",
      });
    } catch (error) {
      sendLoginErrorResponse(getErrorContext(error).description);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <VStack spacing="0">
      <Box marginBottom="10px">
        <UmamiLogoIcon />
      </Box>
      <Heading marginBottom="30px" fontSize="16px" lineHeight="22px">
        Continue With
      </Heading>
      <Box position="relative" width="100%">
        <VStack width="100%" spacing="10px">
          {getLoginOptions().map(loginType => (
            <LoginButtonComponent
              key={loginType}
              loginType={loginType}
              onClick={() => onLoginClick(loginType)}
            />
          ))}
        </VStack>
      </Box>

      <Center marginTop="30px">
        <Text marginRight="10px" color={color("500")} fontSize="xs" lineHeight="14px">
          Powered by
        </Text>
        <TezosLogoIcon />
      </Center>
    </VStack>
  );
};

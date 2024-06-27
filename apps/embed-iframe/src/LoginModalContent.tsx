import { Box, Center, Flex, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import { InMemorySigner } from "@taquito/signer";
import { type TypeOfLogin } from "@trilitech-umami/umami-embed/types";
import * as Auth from "@umami/social-auth";
import { useState } from "react";

import { TezosLogoIcon, UmamiLogoIcon } from "./assets/icons";
import colors from "./imported/style/colors";
import { getErrorContext } from "./imported/utils/getErrorContext";
import { withTimeout } from "./imported/utils/withTimeout";
import { LoginButtonComponent } from "./LoginButtonComponent";
import { sendLoginErrorResponse, sendResponse } from "./utils";

const LOGIN_TIMEOUT = 3 * 60 * 1000; // 3 minutes

export const LoginModalContent: React.FC<{
  closeModal: () => void;
  onLoginCallback: (loginType: TypeOfLogin) => void;
}> = ({ closeModal, onLoginCallback }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onLoginClick = async (loginType: TypeOfLogin) => {
    setIsLoading(true);
    try {
      const { secretKey, name } = await withTimeout(
        async () => Auth.forIDP(loginType, "embed").getCredentials(),
        LOGIN_TIMEOUT
      );

      const signer = new InMemorySigner(secretKey);
      const { pk, pkh } = { pk: await signer.publicKey(), pkh: await signer.publicKeyHash() };

      onLoginCallback(loginType);
      sendResponse({
        type: "login_response",
        pk,
        pkh,
        userData: { typeOfLogin: "google", id: name },
      });
    } catch (error) {
      sendLoginErrorResponse(getErrorContext(error).description);
    } finally {
      setIsLoading(false);
      closeModal();
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
          <LoginButtonComponent loginType="google" onClick={() => onLoginClick("google")} />
          <LoginButtonComponent loginType="facebook" onClick={() => onLoginClick("facebook")} />
          <LoginButtonComponent loginType="twitter" onClick={() => onLoginClick("twitter")} />
          <LoginButtonComponent loginType="reddit" onClick={() => onLoginClick("reddit")} />
        </VStack>
        {isLoading && (
          <Flex
            position="absolute"
            top="0"
            right="0"
            bottom="0"
            left="0"
            alignItems="center"
            justifyContent="center"
            backgroundColor="rgba(255, 255, 255, 0.8)" // Semi-transparent background
          >
            <Spinner size="xl" />
          </Flex>
        )}
      </Box>

      <Center marginTop="30px">
        <Text marginRight="10px" color={colors.grey[500]} fontSize="xs" lineHeight="14px">
          Powered by
        </Text>
        <TezosLogoIcon />
      </Center>
    </VStack>
  );
};

import { Box, Button, Center, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { InMemorySigner } from "@taquito/signer";
import * as Auth from "@umami/social-auth";
import { useState } from "react";

import { FacebookLogoIcon } from "./assets/icons/FacebookLogo";
import { GoogleLogoIcon } from "./assets/icons/GoogleLogo";
import { TezosLogoIcon } from "./assets/icons/TezosLogo";
import { TwitterLogoIcon } from "./assets/icons/TwitterLogo";
import { UmamiLogoIcon } from "./assets/icons/UmamiLogo";
import colors from "./imported/style/colors";
import { getErrorContext } from "./imported/utils/getErrorContext";
import { sendLoginErrorResponse, sendResponse } from "./utils";

export const LoginModalContent: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onLoginClick = async (idp: Auth.IDP) => {
    setIsLoading(true);
    try {
      const { secretKey, name } = await Auth.forIDP(idp, "embed").getCredentials();

      const signer = new InMemorySigner(secretKey);
      const { pk, pkh } = { pk: await signer.publicKey(), pkh: await signer.publicKeyHash() };

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
      <Heading marginBottom="30px" textColor={colors.white} fontSize="16px" lineHeight="22px">
        Choose Provider
      </Heading>
      <VStack width="100%" spacing="10px">
        <Button width="100%" isLoading={isLoading} onClick={() => onLoginClick("google")} size="lg">
          <Flex alignItems="center" justifyContent="flex-start" flex={1}>
            <GoogleLogoIcon position="absolute" />
            <Heading margin="auto" textColor={colors.white} fontSize="14px" lineHeight="18px">
              Continue with Google
            </Heading>
          </Flex>
        </Button>

        <Button
          width="100%"
          isLoading={isLoading}
          onClick={() => onLoginClick("facebook")}
          size="lg"
        >
          <Flex alignItems="center" justifyContent="flex-start" flex={1}>
            <FacebookLogoIcon position="absolute" />
            <Heading margin="auto" textColor={colors.white} fontSize="14px" lineHeight="18px">
              Continue with Facebook
            </Heading>
          </Flex>
        </Button>

        <Button
          width="100%"
          isLoading={isLoading}
          onClick={() => onLoginClick("twitter")}
          size="lg"
        >
          <Flex alignItems="center" justifyContent="flex-start" flex={1}>
            <TwitterLogoIcon position="absolute" />
            <Heading margin="auto" textColor={colors.white} fontSize="14px" lineHeight="18px">
              Continue with X
            </Heading>
          </Flex>
        </Button>

        <Button width="100%" isLoading={isLoading} onClick={() => onLoginClick("reddit")} size="lg">
          <Flex alignItems="center" justifyContent="flex-start" flex={1}>
            <GoogleLogoIcon position="absolute" />
            <Heading margin="auto" textColor={colors.white} fontSize="14px" lineHeight="18px">
              Continue with Reddit
            </Heading>
          </Flex>
        </Button>
      </VStack>

      <Center marginTop="30px">
        <Text marginRight="10px" color={colors.gray[450]} fontSize="xs" lineHeight="14px">
          Powered by
        </Text>
        <TezosLogoIcon />
      </Center>
    </VStack>
  );
};

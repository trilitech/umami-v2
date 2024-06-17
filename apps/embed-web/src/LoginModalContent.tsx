import { Box, Button, Center, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { InMemorySigner } from "@taquito/signer";
import { useState } from "react";

import { GoogleLogoIcon } from "./assets/icons/GoogleLogo";
import { TezosLogoIcon } from "./assets/icons/TezosLogo";
import { UmamiLogoIcon } from "./assets/icons/UmamiLogo";
import { getGoogleCredentials } from "./imported/getGoogleCredentials";
import colors from "./imported/style/colors";
import { getErrorContext } from "./imported/utils/getErrorContext";
import { sendLoginErrorResponse, sendResponse } from "./utils";

export const LoginModalContent: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onGoogleLoginClick = async () => {
    setIsLoading(true);
    try {
      const { secretKey, email } = await getGoogleCredentials();

      const signer = new InMemorySigner(secretKey);
      const { pk, pkh } = { pk: await signer.publicKey(), pkh: await signer.publicKeyHash() };

      sendResponse({
        type: "login_response",
        pk,
        pkh,
        userData: { typeOfLogin: "google", id: email },
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

      <Button width="100%" isLoading={isLoading} onClick={onGoogleLoginClick} size="lg">
        <Flex alignItems="center" justifyContent="flex-start" flex={1}>
          <GoogleLogoIcon position="absolute" />
          <Heading margin="auto" textColor={colors.white} fontSize="14px" lineHeight="18px">
            Continue with Google
          </Heading>
        </Flex>
      </Button>

      <Center marginTop="30px">
        <Text marginRight="10px" color={colors.gray[450]} fontSize="xs" lineHeight="14px">
          Powered by
        </Text>
        <TezosLogoIcon />
      </Center>
    </VStack>
  );
};

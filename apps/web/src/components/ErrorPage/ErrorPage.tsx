import { Box, Button, Center, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { useImplicitAccounts } from "@umami/state";

import { AlertCircleIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { LogoutModal } from "../Menu/LogoutModal";
import { useSaveBackup } from "../Menu/useSaveBackup";
import { useHasVerifiedAccounts } from "../Onboarding/VerificationFlow";

const feedbackEmailBodyTemplate =
  "What is it about? (if a bug report please consider including your account address) %0A PLEASE FILL %0A%0A What is the feedback? %0A PLEASE FILL";

export const ErrorPage = () => {
  const { openWith: openModal } = useDynamicModalContext();
  const color = useColor();
  const saveBackup = useSaveBackup();

  const isLoggedIn = useImplicitAccounts().length > 0;
  const isVerified = useHasVerifiedAccounts();

  return (
    <Center height="100vh" padding="60px" backgroundSize="cover">
      <Box
        width="480px"
        padding="40px"
        border="1px"
        borderColor={color("100")}
        borderTopRadius="30px"
        borderBottomRadius="30px"
        backgroundColor={color("white")}
      >
        <VStack maxHeight="83vh" spacing={0}>
          <Box marginBottom="16px" color={color("700")}>
            <AlertCircleIcon />
          </Box>
          <Center flexDirection="column" width="340px" marginBottom="32px">
            <Heading color={color("700")} lineHeight="26px" size="xl">
              Oops! Something went wrong!
            </Heading>
            <Text
              marginTop="10px"
              color={color("600")}
              lineHeight="18px"
              textAlign="center"
              size="sm"
            >
              Please refresh the page or use one of the following options:
            </Text>
          </Center>

          <VStack width="100%" spacing="16px">
            {isVerified && (
              <Button width="100%" onClick={saveBackup} size="lg" variant="primary">
                Save backup
              </Button>
            )}

            <Button width="full" size="lg" variant="secondary">
              <Link
                width="full"
                _hover={{ textDecoration: "none" }}
                href={`mailto:umami-support@trili.tech?subject=Umami V2 feedback&body=${feedbackEmailBodyTemplate}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Report error
              </Link>
            </Button>

            {isLoggedIn && (
              <Button
                width="full"
                onClick={() => openModal(<LogoutModal />)}
                size="lg"
                variant="alert"
              >
                Log out
              </Button>
            )}
          </VStack>
        </VStack>
      </Box>
    </Center>
  );
};

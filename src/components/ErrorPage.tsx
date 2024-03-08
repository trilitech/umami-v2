import { Box, Button, Center, Heading, Link, VStack } from "@chakra-ui/react";

import { useOffboardingModal } from "./Offboarding/useOffboardingModal";
import { ModalContentWrapper } from "./Onboarding/ModalContentWrapper";
import { downloadBackupFile } from "./Onboarding/restoreBackupFile/utils";
import { NoticeIcon, ReloadIcon } from "../assets/icons";
import BackgroundImage from "../assets/onboarding/background_image.png";
import colors from "../style/colors";

const feedbackEmailBodyTemplate =
  "What is it about? (if a bug report please consider including your account address) %0A PLEASE FILL %0A%0A What is the feedback? %0A PLEASE FILL";

export const ErrorPage: React.FC = () => {
  const { modalElement: OffboardingModal, onOpen: onOpenOffboardingModal } = useOffboardingModal();

  const onRefresh = () => {
    window.location.reload();
  };

  return (
    <Center height="100vh" padding="60px" backgroundImage={BackgroundImage} backgroundSize="cover">
      <Box
        width="100%"
        maxWidth="460px"
        height="100%"
        maxHeight="480px"
        padding="40px"
        background={colors.gray[900]}
        border="1px"
        borderColor={colors.gray[700]}
        borderRadius="8px"
        boxShadow="0px 0px 30px rgba(0, 0, 0, 0.30)"
      >
        <ModalContentWrapper
          icon={<NoticeIcon />}
          subtitle="Please refresh the app or use one of the following options:"
          title="Oops! Something went wrong!"
        >
          <VStack width="100%" spacing="16px">
            <Button width="100%" onClick={downloadBackupFile} size="lg">
              Save Backup
            </Button>

            <Button width="100%" onClick={onOpenOffboardingModal} size="lg" variant="warning">
              Off-board Wallet
            </Button>

            <Button width="100%" size="lg" variant="tertiary">
              <Link
                href={`mailto:umami-support@trili.tech?subject=Umami V2 feedback&body=${feedbackEmailBodyTemplate}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Report Error
              </Link>
            </Button>

            <Link
              display="block"
              marginTop="14px"
              color={colors.blue}
              fill={colors.blue}
              _hover={{ color: colors.blueL, fill: colors.blueL }}
              onClick={onRefresh}
            >
              <Center>
                <ReloadIcon marginRight="7px" />
                <Heading display="inline" lineHeight="22px" size="md">
                  Refresh
                </Heading>
              </Center>
            </Link>
          </VStack>
        </ModalContentWrapper>
      </Box>
      {OffboardingModal}
    </Center>
  );
};

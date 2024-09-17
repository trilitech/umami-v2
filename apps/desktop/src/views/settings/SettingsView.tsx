import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { type PropsWithChildren } from "react";

import { DAppsDrawerCard } from "./DAppsDrawerCard";
import { ErrorLogsDrawerCard } from "./ErrorLogsDrawerCard";
import { NetworkSettingsDrawerCard } from "./network/NetworkSettingsDrawerCard";
import { DownloadIcon } from "../../assets/icons";
import { ChangePasswordForm } from "../../components/ChangePassword/ChangePasswordForm";
import { ClickableCard, SettingsCardWithDrawerIcon } from "../../components/ClickableCard";
import { useOffboardingModal } from "../../components/Offboarding/useOffboardingModal";
import { TopBar } from "../../components/TopBar";
import { useSaveBackup } from "../../utils/useSaveBackup";

export const SettingsView = () => (
  <Flex flexDirection="column" height="100%">
    <TopBar title="Settings" />
    <Box overflowY="scroll">
      <Box marginTop="16px">
        <GeneralSection />
      </Box>
      <BackupSection />
      <AdvancedSection />
    </Box>
  </Flex>
);

const GeneralSection = () => (
  <SectionContainer title="General">
    <NetworkSettingsDrawerCard />
    <ErrorLogsDrawerCard />
  </SectionContainer>
);

const BackupSection = () => {
  const { onOpen, content } = useSaveBackup();

  return (
    <SectionContainer title="Backup">
      {content}
      <ClickableCard isSelected={false} onClick={onOpen}>
        <Flex alignItems="center" justifyContent="space-between">
          <Heading size="sm">Download backup file</Heading>
          <Button onClick={onOpen} variant="unstyled">
            <DownloadIcon cursor="pointer" />
          </Button>
        </Flex>
      </ClickableCard>
    </SectionContainer>
  );
};

const AdvancedSection = () => {
  const { modalElement: OffboardingModal, onOpen: onOpenOffboardingModal } = useOffboardingModal();
  const { openWith } = useDynamicModalContext();

  return (
    <SectionContainer title="Advanced Settings">
      <DAppsDrawerCard />
      <SettingsCardWithDrawerIcon
        left="Off-board Wallet"
        isSelected={false}
        onClick={onOpenOffboardingModal}
      />
      <SettingsCardWithDrawerIcon
        left="Change Password"
        isSelected={false}
        onClick={() => openWith(<ChangePasswordForm />)}
      />
      {OffboardingModal}
    </SectionContainer>
  );
};

const SectionContainer = ({
  title,
  children,
}: PropsWithChildren<{
  title: string;
}>) => (
  <Box marginTop="8px">
    <Flex>
      <Box width="550px">
        <Heading marginBottom="16px" size="lg">
          {title}
        </Heading>
        {children}
      </Box>
    </Flex>
  </Box>
);

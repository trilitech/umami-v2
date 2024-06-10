import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useContext } from "react";

import { DAppsDrawerCard } from "./DAppsDrawerCard";
import { ErrorLogsDrawerCard } from "./ErrorLogsDrawerCard";
import { NetworkSettingsDrawerCard } from "./network/NetworkSettingsDrawerCard";
import { DownloadIcon } from "../../assets/icons";
import { ChangePasswordForm } from "../../components/ChangePassword/ChangePasswordForm";
import { ClickableCard, SettingsCardWithDrawerIcon } from "../../components/ClickableCard";
import { DynamicModalContext } from "../../components/DynamicModal";
import { useOffboardingModal } from "../../components/Offboarding/useOffboardingModal";
import { downloadBackupFile } from "../../components/Onboarding/restoreBackupFile/utils";
import { TopBar } from "../../components/TopBar";

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
    {/*
        TODO: implement this
        <SettingsCard left="Theme">
          <Flex alignItems="center" justifyContent="space-between">
            <Text size="sm">Light</Text>
            <Switch marginX={3} isChecked isDisabled />
            <Heading size="sm">Dark</Heading>
          </Flex>
        </SettingsCard>
      */}
    <NetworkSettingsDrawerCard />
    <ErrorLogsDrawerCard />
  </SectionContainer>
);

const BackupSection = () => (
  <SectionContainer title="Backup">
    <ClickableCard isSelected={false} onClick={downloadBackupFile}>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading size="sm">Download backup file</Heading>
        <Button onClick={downloadBackupFile} variant="unstyled">
          <DownloadIcon cursor="pointer" />
        </Button>
      </Flex>
    </ClickableCard>
  </SectionContainer>
);

const AdvancedSection = () => {
  const { modalElement: OffboardingModal, onOpen: onOpenOffboardingModal } = useOffboardingModal();
  const { openWith } = useContext(DynamicModalContext);

  return (
    <SectionContainer title="Advanced Settings">
      <DAppsDrawerCard />
      {/*
        TODO: implement this
        <SettingsCardWithDrawerIcon left="Reset Settings" onClick={() => {}} />
      */}
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

const SectionContainer: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
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

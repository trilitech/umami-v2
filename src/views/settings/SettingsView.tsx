import { Box, Divider, Flex, Heading, Input, Switch, Text } from "@chakra-ui/react";
import { BsFolder2Open } from "react-icons/bs";
import { TfiReload } from "react-icons/tfi";
import useChangePasswordModal from "../../components/ChangePassword/useChangePasswordModal";
import ClickableCard, {
  SettingsCard,
  SettingsCardWithDrawerIcon,
} from "../../components/ClickableCard";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import NetworkSelector from "../../components/NetworkSelector";
import useOffboardingModal from "../../components/Offboarding/useOffboardingModal";
import { TopBar } from "../../components/TopBar";
import { BeaconDrawerCard } from "./BeaconDrawerCard";
import ErrorLogsDrawerCard from "./ErrorLogsDrawerCard";

export default function SettingsView() {
  return (
    <Flex direction="column" height="100%">
      <TopBar title="Settings" />
      <Box overflow="scroll">
        <GeneralSection />
        <AppUpdatesSection />
        <BackupSection />
        <AdvancedSection />
      </Box>
    </Flex>
  );
}

const GeneralSection = () => {
  return (
    <SectionContainer title="General">
      <SettingsCard left="Theme">
        <Flex alignItems="center" justifyContent="space-between">
          <Text size="sm">Light</Text>
          <Switch marginX={3} isChecked isDisabled />
          <Heading size="sm">Dark</Heading>
        </Flex>
      </SettingsCard>
      <SettingsCard left="Network">
        <Box>
          <NetworkSelector />
        </Box>
      </SettingsCard>
      <ErrorLogsDrawerCard />
    </SectionContainer>
  );
};

const AppUpdatesSection = () => {
  return (
    <SectionContainer title="App Updates">
      <CardWithDivier
        upperChild={
          <Flex alignItems="center" h="100%">
            <Flex justifyContent="space-between" alignItems="center" w="100%">
              <Heading size="sm">Auto Update</Heading>
              <Switch marginX={3} />
            </Flex>
          </Flex>
        }
        lowerChild={
          <Flex alignItems="center" h="100%">
            <Flex justifyContent="space-between" alignItems="center" w="100%">
              <Flex alignItems="center">
                <Heading size="sm">Version:</Heading>
                <Text>&nbsp;2.0.0-alpha</Text>
              </Flex>
              <IconAndTextBtn
                label="Check for updates"
                icon={TfiReload}
                iconHeight={4}
                iconWidth={4}
              />
            </Flex>
          </Flex>
        }
      />
    </SectionContainer>
  );
};

const BackupSection = () => {
  return (
    <SectionContainer title="Backup">
      <CardWithDivier
        upperChild={
          <Flex alignItems="center">
            <Flex justifyContent="space-between" alignItems="center" w="100%">
              <Heading size="sm">Auto Backup</Heading>
              <Switch marginX={3} />
            </Flex>
          </Flex>
        }
        lowerChild={
          <>
            <Flex justifyContent="space-between" alignItems="center">
              <Flex alignItems="center" p={1}>
                <Heading size="sm">Backup Location</Heading>
              </Flex>
              <IconAndTextBtn
                label="Browse Folder"
                icon={BsFolder2Open}
                iconHeight={4}
                iconWidth={4}
              />
            </Flex>
            <Box mt={3}>
              <Input placeholder="Select the location or enter path" />
            </Box>
          </>
        }
      />
    </SectionContainer>
  );
};

const AdvancedSection = () => {
  const { modalElement: OffboardingModal, onOpen: onOpenOffboardingModal } = useOffboardingModal();
  const { modalElement: ChangePasswordModal, onOpen: onOpenChangePasswordModal } =
    useChangePasswordModal();
  return (
    <SectionContainer title="Advanced Settings">
      <BeaconDrawerCard />
      <SettingsCardWithDrawerIcon left="Reset Settings" onClick={() => {}} />
      <SettingsCardWithDrawerIcon left="Off-board Wallet" onClick={onOpenOffboardingModal} />
      <SettingsCardWithDrawerIcon left="Change Password" onClick={onOpenChangePasswordModal} />
      {OffboardingModal}
      {ChangePasswordModal}
    </SectionContainer>
  );
};

const CardWithDivier: React.FC<{
  upperChild: React.ReactNode;
  lowerChild: React.ReactNode;
}> = ({ upperChild, lowerChild }) => {
  return (
    <ClickableCard>
      {upperChild}

      <Box marginY={4}>
        <Divider orientation="horizontal" size="lg" />
      </Box>

      {lowerChild}
    </ClickableCard>
  );
};

const SectionContainer: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <Box marginY={2}>
      <Flex>
        <Box w="550px">
          <Heading size="lg" marginY={3}>
            {title}
          </Heading>
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

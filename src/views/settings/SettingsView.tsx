import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useContext } from "react";

import { DAppsDrawerCard } from "./DAppsDrawerCard";
import { ErrorLogsDrawerCard } from "./ErrorLogsDrawerCard";
import { NetworkSettingsDrawerCard } from "./network/NetworkSettingsDrawerCard";
import packageInfo from "../../../package.json";
import { DownloadIcon } from "../../assets/icons";
import { ChangePasswordForm } from "../../components/ChangePassword/ChangePasswordForm";
import { ClickableCard, SettingsCardWithDrawerIcon } from "../../components/ClickableCard";
import { DynamicModalContext } from "../../components/DynamicModal";
import { useOffboardingModal } from "../../components/Offboarding/useOffboardingModal";
import { TopBar } from "../../components/TopBar";

export const SettingsView = () => {
  return (
    <Flex flexDirection="column" height="100%">
      <TopBar title="Settings" />
      <Box overflowY="scroll">
        <Box marginTop="16px">
          <GeneralSection />
        </Box>
        <AppUpdatesSection />
        <BackupSection />
        <AdvancedSection />
      </Box>
    </Flex>
  );
};

const GeneralSection = () => {
  return (
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
};

const AppUpdatesSection = () => {
  // TODO: implement this
  return null;
  // return (
  //   <SectionContainer title="App Updates">
  //     <CardWithDivier
  //       upperChild={
  //         <Flex alignItems="center" h="100%">
  //           <Flex justifyContent="space-between" alignItems="center" w="100%">
  //             <Heading size="sm">Auto Update</Heading>
  //             <Switch marginX={3} />
  //           </Flex>
  //         </Flex>
  //       }
  //       lowerChild={
  //         <Flex alignItems="center" h="100%">
  //           <Flex justifyContent="space-between" alignItems="center" w="100%">
  //             <Flex alignItems="center">
  //               <Heading size="sm">Version:</Heading>
  //               <Text>&nbsp;{packageInfo.version}</Text>
  //             </Flex>
  //             <IconAndTextBtn
  //               label="Check for updates"
  //               icon={TfiReload}
  //               iconHeight={4}
  //               iconWidth={4}
  //             />
  //           </Flex>
  //         </Flex>
  //       }
  //     />
  //   </SectionContainer>
  // );
};

const downloadBackup = () => {
  const storage = {
    version: packageInfo.version,
    "persist:accounts": localStorage.getItem("persist:accounts"),
    "persist:root": localStorage.getItem("persist:root"),
  };

  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(storage))}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = "UmamiV2Backup.json";

  link.click();
};

const BackupSection = () => {
  return (
    <SectionContainer title="Backup">
      <ClickableCard isSelected={false} onClick={downloadBackup}>
        <Flex alignItems="center" justifyContent="space-between">
          <Heading size="sm">Download backup file</Heading>
          <Button onClick={downloadBackup} variant="unstyled">
            <DownloadIcon cursor="pointer" />
          </Button>
        </Flex>
      </ClickableCard>
    </SectionContainer>
  );
};

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
}> = ({ title, children }) => {
  return (
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
};

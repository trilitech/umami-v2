import { Grid, GridItem } from "@chakra-ui/layout";
import {
  Box,
  Flex,
  Heading,
  Text,
  Switch,
  Button,
  Divider,
  Input,
} from "@chakra-ui/react";
import { addPeer } from "../../utils/beacon/beacon";
import ClickableCard, {
  SettingsCard,
  SettingsCardWithDrawerIcon,
} from "../../components/ClickableCard";
import NetworkSelector from "../../components/NetworkSelector";
import { TopBar } from "../../components/TopBar";
import { useReset } from "../../utils/hooks/accountHooks";
import BeaconPeers from "../../utils/beacon/BeaconPeers";
import ErrorLogsDrawerCard from "./ErrorLogsDrawerCard";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { TfiReload } from "react-icons/tfi";
import { BsFolder2Open } from "react-icons/bs";

export default function SettingsView() {
  const reset = useReset();
  return (
    <Grid
      h="100%"
      templateAreas={`
                  "header header"
                  "main main"
                  "main main"
                  `}
      gridTemplateRows={"0fr 1fr 1fr"}
      gridTemplateColumns={"1fr 1fr"}
      gap="1"
    >
      <GridItem area={"header"}>
        <TopBar title="Settings" />
      </GridItem>
      <GridItem area={"main"}>
        <Button onClick={reset}>{"Erase secrets"}</Button>
        <GeneralSection />
        <AppUpdatesSection />
        <BackupSection />
        <AdvancedSection />
      </GridItem>
    </Grid>
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

      <SettingsCard left="Paste Beacon Pairing Code">
        <Box>
          <Button
            onClick={async () => {
              navigator.clipboard.readText().then((text) => {
                addPeer(text);
              });
            }}
          >
            Paste
          </Button>
        </Box>
      </SettingsCard>
      <BeaconPeers />
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
                <Heading size="sm">Version</Heading>
                <Text>: v0.8.7</Text>
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
  const reset = useReset();
  return (
    <SectionContainer title="Advanced Settings">
      <ClickableCard>
        <Box>
          <Flex
            mb={3}
            justifyContent="space-between"
            alignItems="center"
            w="100%"
            p={1}
          >
            <Heading size="sm">Number of Confirmation Block</Heading>
          </Flex>
          <Flex alignItems="center" w="100%">
            <Input mr={3} />
            <Button>Save</Button>
          </Flex>
        </Box>
      </ClickableCard>

      <SettingsCardWithDrawerIcon left="dApps" onClick={() => {}} />
      <SettingsCardWithDrawerIcon left="Reset Settings" onClick={() => {}} />
      <SettingsCardWithDrawerIcon left="Off-board Wallet" onClick={reset} />
      <SettingsCardWithDrawerIcon left="Change Password" onClick={() => {}} />
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

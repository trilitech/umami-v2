import { Grid, GridItem } from "@chakra-ui/layout";
import { Box, Flex, Heading, Text, Switch, Button } from "@chakra-ui/react";
import { addPeer } from "../../Beacon";
import { SettingsCard } from "../../components/ClickableCard";
import NetworkSelector from "../../components/NetworkSelector";
import { TopBar } from "../../components/TopBar";
import { useReset } from "../../utils/hooks/accountHooks";
import BeaconPeers from "./BeaconPeers";
import ErrorLogsDrawerCard from "./ErrorLogsDrawerCard";

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
        <SettingsSection title="General">
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
          <SettingsCard left="Paste Beacon Pairing Code">
            <Box>
              <Button
                onClick={async () => {
                  navigator.clipboard.readText().then((text) => {
                    console.log(text);
                    addPeer(text);
                  });
                }}
              >
                Paste
              </Button>
            </Box>
          </SettingsCard>
          <BeaconPeers />
          <ErrorLogsDrawerCard />
          <Button onClick={reset}>{"Erase secrets"}</Button>
        </SettingsSection>
      </GridItem>
    </Grid>
  );
}

const SettingsSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <Box marginY={2}>
      <Flex>
        <Box w="550px">
          <Heading size="lg">{title}</Heading>
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

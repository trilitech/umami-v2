import { TezosNetwork } from "@airgap/tezos";
import { Button } from "@chakra-ui/button";
import { Grid, GridItem } from "@chakra-ui/layout";
import { Box, Flex, Heading, Text, Switch } from "@chakra-ui/react";
import { NetworkSelectorDisplay } from "../../components/NetworkSelector/NetworkSelectorDisplay";
import { SettingsCard } from "../../components/SettingsCard";
import { TopBar } from "../../components/TopBar";
import { useReset } from "../../utils/hooks/accountHooks";
import { useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import assetsSlice from "../../utils/store/assetsSlice";
import { useAppDispatch } from "../../utils/store/hooks";
import ErrorLogsDrawerCard from "./ErrorLogsDrawerCard";

export default function SettingsView() {
  const reset = useReset();
  const network = useSelectedNetwork();
  const dispatch = useAppDispatch();

  const changeNetwork = (network: TezosNetwork) => {
    dispatch(assetsSlice.actions.updateNetwork(network));
  };
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
      ml={5}
    >
      <GridItem area={"header"}>
        <TopBar title="Settings" />
        <Button onClick={reset}>logout</Button>
      </GridItem>
      <GridItem area={"main"}>
        <SettingsSection title="General">
          <SettingsCard about="Theme">
            <Flex alignItems="center" justifyContent="space-between">
              <Text size="sm">Light</Text>
              <Switch marginX={3} isChecked />
              <Heading size="sm">Dark</Heading>
            </Flex>
          </SettingsCard>
          <SettingsCard about="Network">
            <Box>
              <NetworkSelectorDisplay
                value={network}
                onChange={changeNetwork}
              />
            </Box>
          </SettingsCard>
          <ErrorLogsDrawerCard />
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

import { TezosNetwork } from "@airgap/tezos";
import { Button } from "@chakra-ui/button";
import { Grid, GridItem } from "@chakra-ui/layout";
import {
  Card,
  CardBody,
  Box,
  Flex,
  Heading,
  Icon,
  Text,
  Switch,
} from "@chakra-ui/react";
import { AiOutlineRight } from "react-icons/ai";
import { NetworkSelectorDisplay } from "../../components/NetworkSelector/NetworkSelectorDisplay";
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";
import { useReset } from "../../utils/hooks/accountHooks";
import { useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import assetsSlice from "../../utils/store/assetsSlice";
import { useAppDispatch } from "../../utils/store/hooks";

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
          <SettingsCard about="Theme" onClick={() => {}}>
            <Flex alignItems="center" justifyContent="space-between">
              <Text size="sm">Light</Text>
              <Switch marginX={3} isChecked isDisabled />
              <Heading size="sm">Dark</Heading>
            </Flex>
          </SettingsCard>
          <SettingsCard about="Network">
            <Box m={0}>
              <NetworkSelectorDisplay
                value={network}
                onChange={changeNetwork}
              />
            </Box>
          </SettingsCard>
          <SettingsCard about="ErrorLogs" onClick={() => {}}>
            <Icon
              as={AiOutlineRight}
              color={colors.gray[600]}
              _hover={{
                color: colors.gray[300],
              }}
            />
          </SettingsCard>
        </SettingsSection>
      </GridItem>
    </Grid>
  );
}

const SettingsCard: React.FC<{
  about: string;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ about, onClick, children }) => {
  return (
    <Card
      paddingX={1}
      marginY={2}
      bgColor={colors.gray[900]}
      borderRadius="lg"
      justifyContent="center"
      border="1px solid"
      borderColor={colors.gray[700]}
      cursor={onClick ? "pointer" : undefined}
      _hover={{
        borderColor: onClick ? colors.gray[600] : colors.gray[700],
      }}
      h="66px"
    >
      <CardBody alignContent="center" overflow={"hidden"} onClick={onClick}>
        <Flex alignItems="center" h="100%">
          <Flex justifyContent="space-between" alignItems="center" w="100%">
            <Heading size="sm">{about}</Heading>
            {children}
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

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

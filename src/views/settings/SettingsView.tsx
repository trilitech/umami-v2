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
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";
import { useReset } from "../../utils/hooks/accountHooks";

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
              <Switch marginX={3} isChecked isDisabled />
              <Heading size="sm">Dark</Heading>
            </Flex>
          </SettingsCard>
          <SettingsCard about="Network">
            <></>
          </SettingsCard>
          <SettingsCard about="ErrorLogs">
            <></>
          </SettingsCard>
        </SettingsSection>
      </GridItem>
    </Grid>
  );
}

const SettingsCard: React.FC<{
  about: string;
  children: React.ReactNode;
}> = ({ about, children }) => {
  return (
    <Card
      paddingX={1}
      marginY={2}
      bgColor={colors.gray[900]}
      borderRadius="lg"
      justifyContent="center"
      border="1px solid"
      borderColor={colors.gray[700]}
    >
      <CardBody>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="sm">{about}</Heading>
          {children}
        </Flex>
      </CardBody>
    </Card>
  );
};

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> =
  ({ title, children }) => {
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

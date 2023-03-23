import { Box, Tab, TabList, Tabs } from "@chakra-ui/react";
import { OperationTile } from "../../components/OperationTile";
import { useAllOperations } from "../../utils/hooks/assetsHooks";

export const OperationsList = () => {
  const operations = useAllOperations();
  const operationList = Object.values(operations).flatMap((b) => b);

  const operationEls = operationList.slice(0, 20).map((op) => {
    return <OperationTile key={op.hash + op.from[0]} operation={op} />;
  });

  return (
    <Tabs
      height={"100%"}
      display={"flex"}
      flexDirection="column"
      mt={4}
      bg="umami.gray.900"
      borderRadius={4}
      // color scheme not workkig even when put int 50-900 range
      // TODO Fix
      // https://chakra-ui.com/docs/components/tabs
    >
      <TabList>
        <Tab>All</Tab>
        <Tab>Sent</Tab>
        <Tab>Received</Tab>
        <Tab>Delegations</Tab>
      </TabList>

      <Box minHeight={"10px"} overflow={"scroll"}>
        {operationEls}
      </Box>
    </Tabs>
  );
};

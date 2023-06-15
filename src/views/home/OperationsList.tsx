import { Box, Tab, TabList, Tabs } from "@chakra-ui/react";
import { OperationTile } from "../../components/OperationTile";
import { useAllOperationDisplays } from "../../utils/hooks/assetsHooks";
import { getKey, sortOperationsDisplaysBytDate } from "../operations/operationsUtils";

export const OperationsList = () => {
  const operations = useAllOperationDisplays();
  const operationList = sortOperationsDisplaysBytDate(Object.values(operations).flat());

  const operationEls = operationList.slice(0, 20).map(op => {
    return <OperationTile key={getKey(op)} operation={op} />;
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

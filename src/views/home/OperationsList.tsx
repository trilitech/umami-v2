import { Box, Tab, TabList, Tabs } from "@chakra-ui/react";
import { OperationTile } from "../../components/OperationTile";
import { useAllOperationDisplays } from "../../utils/hooks/assetsHooks";
import { getKey, sortOperationsDisplaysBytDate } from "../operations/operationsUtils";
import { Link } from "react-router-dom";
export const OperationsList = () => {
  const operations = useAllOperationDisplays();
  const operationList = sortOperationsDisplaysBytDate(Object.values(operations).flat());

  const operationEls = operationList.slice(0, 20).map(op => {
    return <OperationTile key={getKey(op)} operation={op} />;
  });
  return (
    <Tabs
      height="100%"
      display="flex"
      flexDirection="column"
      mt={0}
      bg="umami.gray.900"
      borderRadius={4}
    >
      <TabList justifyContent="space-between">
        <Tab>Operations</Tab>
        <Link
          to="/operations"
          style={{ marginTop: "8px", display: "inline-block", marginRight: "12px" }}
        >
          View All
        </Link>
      </TabList>

      <Box minHeight="10px" overflowY="auto">
        {operationEls}
      </Box>
    </Tabs>
  );
};

import { Tab, TabList, Tabs } from "@chakra-ui/react";
import { compact } from "lodash";
import { Link } from "react-router-dom";
import { useAllOperationDisplays } from "../../utils/hooks/assetsHooks";
import { sortOperationsDisplaysBytDate } from "../operations/operationsUtils";
import { OperationListDisplay } from "./OpertionList/OperationListDisplay";
export const OperationsListPannel = () => {
  const operations = useAllOperationDisplays();
  const operationDisplays = sortOperationsDisplaysBytDate(
    compact(Object.values(operations).flat())
  );
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
      <OperationListDisplay operations={operationDisplays} />
    </Tabs>
  );
};

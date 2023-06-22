import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useGetAllOperationDisplays } from "../../utils/hooks/assetsHooks";
import { OperationListDisplay } from "./OpertionList/OperationListDisplay";

export const OperationsListPanel = () => {
  const operationDisplays = useGetAllOperationDisplays();
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
      <TabPanels>
        <TabPanel>
          <OperationListDisplay operations={operationDisplays} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

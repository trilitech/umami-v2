import { TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import SmallTab from "../../components/SmallTab";
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
        <SmallTab>Operations</SmallTab>
        <Link
          to="/operations"
          style={{
            marginTop: "8px",
            display: "inline-block",
            marginRight: "12px",
            fontSize: "14px",
          }}
        >
          View All
        </Link>
      </TabList>
      <TabPanels height="100%">
        <TabPanel height="100%">
          <OperationListDisplay operations={operationDisplays} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

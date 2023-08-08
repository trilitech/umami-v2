import { TabList, TabPanel, TabPanels, Tabs, Link } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import SmallTab from "../../components/SmallTab";
import colors from "../../style/colors";
import { useGetAllOperationDisplays } from "../../utils/hooks/assetsHooks";
import { OperationListDisplay } from "./OpertionList/OperationListDisplay";

export const OperationsListPanel = () => {
  const operationDisplays = useGetAllOperationDisplays();
  return (
    <Tabs height="100%" mt={0} borderRadius={4}>
      <TabList justifyContent="space-between">
        <SmallTab>Operations</SmallTab>
        <Link
          as={ReactRouterLink}
          to="/operations"
          marginTop="8px"
          display="inline-block"
          marginRight="12px"
          fontSize="14px"
          color={colors.gray[400]}
          _hover={{ color: colors.gray[300] }}
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

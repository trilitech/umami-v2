import { TabList, TabPanel, TabPanels, Tabs, Link } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import SmallTab from "../../components/SmallTab";
import colors from "../../style/colors";
import { OperationListDisplay } from "./OperationListDisplay";
import { useGetOperations } from "../operations/useGetOperations";
import { useAllAccounts } from "../../utils/hooks/accountHooks";

export const OperationsListPanel = () => {
  const accounts = useAllAccounts();
  const { operations } = useGetOperations(accounts.map(acc => acc.address.pkh));
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
          <OperationListDisplay
            // TODO: replace current component with the underlying one
            operations={operations}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

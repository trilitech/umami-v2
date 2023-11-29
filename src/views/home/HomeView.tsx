import { Box, Flex } from "@chakra-ui/react";

import { AccountListWithDrawer } from "./AccountListWithDrawer";
import { AccountListHeader } from "./AccountsList";
import { TopBar } from "../../components/TopBar";

export const HomeView = () => {
  return (
    <Flex flexDirection="column" height="100%">
      <TopBar title="Accounts" />
      <Flex flex={1} minHeight={1}>
        <Flex flexDirection="column" flex={1} marginRight="12px" paddingBottom="12px">
          <AccountListHeader />
          <Box flex={1} overflow="hidden" borderRadius="8px">
            <AccountListWithDrawer />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

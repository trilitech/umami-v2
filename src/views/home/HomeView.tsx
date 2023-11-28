import { Box, Flex } from "@chakra-ui/react";
import { TopBar } from "../../components/TopBar";
import AccountListWithDrawer from "./AccountListWithDrawer";
import { AccountListHeader } from "./AccountsList";

export default function HomeView() {
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
}

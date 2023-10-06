import { Box, Flex } from "@chakra-ui/react";
import { TopBar } from "../../components/TopBar";
import AccountListWithDrawer from "./AccountListWithDrawer";
import { AccountListHeader } from "./AccountsList";

export default function HomeView() {
  return (
    <Flex direction="column" height="100%">
      <TopBar title="Accounts" />
      <Flex flex={1} minHeight={1}>
        <Flex direction="column" flex={1} mr="12px" pb="12px">
          <AccountListHeader />
          <Box flex={1} overflow="hidden" borderRadius="8px">
            <AccountListWithDrawer />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}

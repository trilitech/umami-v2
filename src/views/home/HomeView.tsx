import { Box, Flex } from "@chakra-ui/react";
import { TopBar } from "../../components/TopBar";
import AccountListWithDrawer from "./AccountListWithDrawer";
import { AccountListHeader } from "./AccountsList";

import { NftList } from "./NftList";
import { OperationsListPanel } from "./OperationsListPanel";

// Reference unit for all the margin and padding ajustements
const BASE = 3;

export default function HomeView() {
  return (
    <Flex direction="column" height="100%">
      <TopBar title="Overview" />
      <Flex flex={1} minHeight={1}>
        {/* Left Column*/}
        <Flex direction="column" flex={1} mr={BASE} pb={BASE}>
          <AccountListHeader />
          <Box flex={1} overflow="hidden" borderRadius={4}>
            <AccountListWithDrawer />
          </Box>
        </Flex>
        {/* Right Column*/}
        <Flex direction="column" flex={1} ml={BASE} pb={BASE}>
          <Box flex={1} overflow="hidden" borderRadius={4} mb={BASE}>
            <OperationsListPanel />
          </Box>
          <Box flex={1} overflow="hidden" borderRadius={4}>
            <NftList />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}

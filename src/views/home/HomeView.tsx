import { Box, Flex } from "@chakra-ui/react";
import { TopBar } from "../../components/TopBar";
import AccountListWithDrawer from "./AccountListWithDrawer";

import { NftList } from "./NftList";
import { OperationsListPannel } from "./OperationsListPannel";

export default function HomeView() {
  return (
    <Flex direction="column" height="100%">
      <TopBar title="Overview" />
      <Flex flex={1} minHeight={1}>
        <Box flex={1} mr={2} overflow="hidden" mb={2} borderRadius={4}>
          <AccountListWithDrawer />
        </Box>
        <Flex direction="column" flex={1} minHeight={1} ml={2}>
          <Box flex={1} overflow="hidden" mb={2} borderRadius={4}>
            <OperationsListPannel />
          </Box>
          <Box flex={1} overflow="hidden" mb={2} borderRadius={4}>
            <NftList />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}

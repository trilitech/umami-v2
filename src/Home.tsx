import { Box, Flex } from "@chakra-ui/react";
import { TopBar } from "./components/TopBar";

import AccountListWithDrawer from "./views/home/AccountsList";

import { NftList } from "./views/home/NftList";
import { OperationsList } from "./views/home/OperationsList";

export default function Home() {
  return (
    <Flex direction="column" height={"100%"}>
      <TopBar title="Overview" />
      <Flex flex={1} minHeight={1}>
        <Box flex={1} mr={2}>
          <AccountListWithDrawer />
        </Box>
        <Flex direction="column" flex={1} minHeight={1} ml={2}>
          <Box flex={1} overflow={"scroll"} mb={2} borderRadius={4}>
            <OperationsList />
          </Box>
          <Box flex={1} overflow={"scroll"} mb={2} borderRadius={4}>
            <NftList />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}

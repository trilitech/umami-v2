import { Box, Flex } from "@chakra-ui/react";

import { SideNavbar } from "../components/SideNavbar";

export const withSideMenu = (body: React.ReactElement) => (
  <Flex height="100vh">
    <SideNavbar />
    <Box
      flex={1}
      overflowX="hidden"
      height="100%"
      background="linear-gradient(180deg, rgba(0, 231, 182, 0.35) -41.53%, rgba(0, 231, 182, 0.00) 34.71%)"
      paddingX="24px"
    >
      {body}
    </Box>
  </Flex>
);

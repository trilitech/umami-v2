import { Box, Flex } from "@chakra-ui/react";
import SideNavbar from "../components/SideNavbar";

export const withSideMenu = (body: React.ReactElement) => {
  return (
    <Flex height="100vh">
      <SideNavbar />
      <Box flex={1} height="100%" overflowX="hidden" px={6}>
        {body}
      </Box>
    </Flex>
  );
};

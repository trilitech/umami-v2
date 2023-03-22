import { Box, Flex } from "@chakra-ui/react";
import SideNavbar from "../components/SideNavbar";

export const withSideMenu = (body: React.ReactElement) => {
  return (
    <Flex>
      <SideNavbar />
      <Box flex={1} height="100vh" pl={4} pr={4}>
        {body}
      </Box>
    </Flex>
  );
};

import { Box, Flex } from "@chakra-ui/react";
import SideNavbar from "../components/SideNavbar";

export const withSideMenu = (body: React.ReactElement) => {
  return (
    <Flex height={"100vh"}>
      <SideNavbar />
      <Box flex={1} pl={4} pr={4} height="100%">
        {body}
      </Box>
    </Flex>
  );
};

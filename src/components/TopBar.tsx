import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import React from "react";

export const TopBar: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Flex justifyContent={"space-between"} alignItems="center" m={4}>
      <Heading>{title}</Heading>
      <Box>
        <Button variant={"outline"}>Buy Tez</Button>
        <Button ml={4} bg="umami.blue">
          Send
        </Button>
      </Box>
    </Flex>
  );
};

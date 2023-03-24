import { Box, Button, Divider, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import SendButton from "../views/home/SendButton";

export const TopBar: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Box>
      <Flex h={24} justifyContent={"space-between"} alignItems="center">
        <Heading>{title}</Heading>
        <Box>
          <Button variant={"outline"}>Buy Tez</Button>
          <SendButton />
        </Box>
      </Flex>
      <Divider />
    </Box>
  );
};

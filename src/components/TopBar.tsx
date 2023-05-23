import { Box, Button, Divider, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import SendButton from "../views/home/SendButton";
import useBuyTezModal from "./BuyTez/useBuyTezModal";

export const TopBar: React.FC<{ title: string }> = ({ title }) => {
  const { modalElement, onOpen } = useBuyTezModal();
  return (
    <Box>
      <Flex h={24} justifyContent={"space-between"} alignItems="center">
        <Heading size="xl">{title}</Heading>
        <Box>
          <Button variant={"outline"} onClick={onOpen}>
            Buy Tez
          </Button>
          <SendButton />
        </Box>
        {modalElement}
      </Flex>
      <Divider />
    </Box>
  );
};

import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import React from "react";

export const OperationTile: React.FC<{
  from: string;
  to: string;
  amount: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}> = ({ from, to, amount, onClick = () => {} }) => {
  return (
    <Flex
      m={2}
      bg="#363636"
      h={16}
      borderRadius={4}
      border={`1px solid "#B5B5B5"}`}
      onClick={onClick}
      cursor="pointer"
    >
      <Flex flex={1}>
        <Box p="4">
          <Text>{amount}</Text>
          <Text>{`Sent to:${to}`}</Text>
        </Box>
        <Spacer />
        <Box p="4">{`from ${from}`}</Box>
      </Flex>
    </Flex>
  );
};

import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import React from "react";
import { Identicon } from "./Identicon";

export const AccountTile: React.FC<{
  label: string;
  address: string;
  balance: number;
}> = ({ address }) => {
  return (
    <Flex m={2} bg="#363636" h={90} borderRadius={4} border="1px solid #B5B5B5">
      <Box p="4">
        <Identicon address={address} />
      </Box>
      <Flex flex={1}>
        <Box p="4">
          <Text>Account n</Text>
          <Text>{address}</Text>
        </Box>
        <Spacer />
        <Box p="4">33 tez</Box>
      </Flex>
    </Flex>
  );
};

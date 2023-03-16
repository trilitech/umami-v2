import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import React from "react";
import { Identicon } from "./Identicon";
import BigNumber from "bignumber.js";
import { format } from "@taquito/utils";

export const AccountTile: React.FC<{
  label: string;
  address: string;
  balance: BigNumber | null;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  selected?: boolean;
}> = ({ address, onClick, balance, selected = false }) => {
  const prettyBalance = balance && `${format("mutez", "tz", balance)} tez`;
  return (
    <Flex
      m={2}
      bg="#363636"
      h={90}
      borderRadius={4}
      border={`1px solid ${selected ? "orange" : "#B5B5B5"}`}
      onClick={onClick}
      cursor="pointer"
    >
      <Box p="4">
        <Identicon address={address} />
      </Box>
      <Flex flex={1}>
        <Box p="4">
          <Text>Account n</Text>
          <Text>{address}</Text>
        </Box>
        <Spacer />
        <Box p="4">{prettyBalance}</Box>
      </Flex>
    </Flex>
  );
};

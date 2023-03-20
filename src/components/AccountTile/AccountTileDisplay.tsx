import { Box, Flex, Text } from "@chakra-ui/layout";
import React from "react";
import colors from "../../style/colors";
import { Identicon } from "../Identicon";

export type Props = {
  label: string;
  address: string;
  balance: string | null;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  selected?: boolean;
};

export const AccountTileDisplay: React.FC<Props> = ({
  selected,
  onClick,
  address,
  balance,
  label,
}) => (
  <Flex
    mb={4}
    p={4}
    bg="umami.gray.900"
    h={90}
    borderRadius={4}
    border={`1px solid ${selected ? colors.orange : colors.gray[800]}`} // string theme colors "umami.orange" don't work for borders
    onClick={onClick}
    cursor="pointer"
    _hover={{
      border: `1px solid ${selected ? colors.orange : colors.gray[700]}`,
    }}
    alignItems="center"
  >
    <Identicon address={address} />
    <Flex flex={1} justifyContent="space-between">
      <Box m={4}>
        <Text>{label}</Text>
        <Text fontSize={14} color="umami.gray.400">
          {address}
        </Text>
      </Box>
      <Text mb={4} alignSelf={"flex-end"} fontSize={14} fontWeight={800}>
        {balance}
      </Text>
    </Flex>
  </Flex>
);
